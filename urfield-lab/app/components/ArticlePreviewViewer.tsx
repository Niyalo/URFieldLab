"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByYearSlug, getYearsWithArticles, type Article } from '@/sanity/sanity-utils';
import { urlFor } from '@/sanity/sanity-utils';

// Helper to get YouTube thumbnail
const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- Article Card Sub-component ---
type ArticleCardProps = {
  article: Article;
  yearSlug: string;
  scrollXProgress: MotionValue<number>;
  index: number;
  total: number;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, yearSlug, scrollXProgress, index, total }) => {
  // This is now the correct place for the hooks
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(scrollXProgress, [start - 0.1, start, end, end + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity = useTransform(scrollXProgress, [start - 0.1, start, end, end + 0.1], [0.7, 1, 0.7, 0.7]);

  // Determine image source
  const videoId = article.youtubeVideoUrl ? getYouTubeVideoId(article.youtubeVideoUrl) : null;
  const imageUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : article.mainImage ? urlFor(article.mainImage).width(500).height(300).url() : '/images/placeholder.png';

  return (
    <Link href={`/${yearSlug}/outputs#article-${article.slug?.current}`} className="block w-full h-full">
      <motion.div
        style={{ scale, opacity }}
        className="relative w-full h-full bg-white/50 dark:bg-black/50 rounded-lg shadow-md overflow-hidden flex flex-col"
        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Image container */}
        <div className="relative w-full h-1/2 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {videoId && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <svg className="h-12 w-12 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
            {article.summary}
          </p>
          {article.authors && (
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              By {article.authors.map(a => a.name).join(', ')}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

// --- NEW: Internal Scroller Component ---
type ScrollerProps = {
  articles: Article[];
  yearSlug: string;
};

const Scroller: React.FC<ScrollerProps> = ({ articles, yearSlug }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  return (
    <div
      ref={scrollRef}
      className="w-full h-[500px] flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-10" // Added py-10 for vertical space for scaling
      style={{ perspective: '1000px' }}
    >
      {/* Spacer to center first item */}
      <div className="flex-shrink-0 w-[calc(50%-150px)]" />

      {articles.map((article, i) => (
        <div key={article._id} className="w-[300px] h-[400px] flex-shrink-0 snap-center px-4 flex items-center justify-center">
          <ArticleCard
            article={article}
            yearSlug={yearSlug}
            scrollXProgress={scrollXProgress}
            index={i}
            total={articles.length}
          />
        </div>
      ))}

      {/* Spacer to center last item */}
      <div className="flex-shrink-0 w-[calc(50%-150px)]" />
    </div>
  );
};


// --- Main Viewer Component ---
type ArticlePreviewViewerProps = {
  yearSlug: string; // This will be the initial year
  title: string;
};

const ArticlePreviewViewer: React.FC<ArticlePreviewViewerProps> = ({ yearSlug, title }) => {
  // State for the list of years with articles
  const [availableYears, setAvailableYears] = useState<{ _id: string; year: number; title: string; slug: string; }[]>([]);
  // State for the currently selected year slug
  const [selectedYearSlug, setSelectedYearSlug] = useState(yearSlug);
  // State for the articles of the selected year
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch the list of available years ONCE on mount
  useEffect(() => {
    const fetchYears = async () => {
      const years = await getYearsWithArticles();
      setAvailableYears(years);
    };
    fetchYears();
  }, []);

  // Effect to fetch articles whenever the selectedYearSlug changes
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getArticlesByYearSlug(selectedYearSlug);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]); // Clear articles on error
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedYearSlug) {
        fetchArticles();
    }
  }, [selectedYearSlug]);

  const handleYearSelect = (slug: string) => {
    setSelectedYearSlug(slug);
  };

  return (
    <div className="relative w-full py-16 z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{title}</h2>
      
      {/* Year Selector Buttons */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {availableYears.map((year) => (
          <button
            key={year._id}
            onClick={() => handleYearSelect(year.slug)}
            disabled={selectedYearSlug === year.slug}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300
              ${selectedYearSlug === year.slug
                ? 'bg-orange-700 text-white cursor-not-allowed' // Active/disabled style
                : 'bg-[#FF8C00] text-white hover:bg-orange-600' // Default style
              }
            `}
          >
            {year.year}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>Loading articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <Scroller articles={articles} yearSlug={selectedYearSlug} />
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>No articles found for this year.</p>
        </div>
      )}
    </div>
  );
};

export default ArticlePreviewViewer;