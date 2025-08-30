"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByYearSlug, type Article } from '@/sanity/sanity-utils';
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
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, yearSlug, scale, opacity }) => {
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

// --- Scroller Component ---
type ScrollerProps = {
  articles: Article[];
  yearSlug: string;
};

const Scroller: React.FC<ScrollerProps> = ({ articles, yearSlug }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  // Create individual transforms for each possible article index (up to 20)
  const total = Math.max(articles.length, 1);

  // Article 0
  const scale0 = useTransform(scrollXProgress, [0/total - 0.1, 0/total, 1/total, 1/total + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity0 = useTransform(scrollXProgress, [0/total - 0.1, 0/total, 1/total, 1/total + 0.1], [0.7, 1, 0.7, 0.7]);

  // Article 1
  const scale1 = useTransform(scrollXProgress, [1/total - 0.1, 1/total, 2/total, 2/total + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity1 = useTransform(scrollXProgress, [1/total - 0.1, 1/total, 2/total, 2/total + 0.1], [0.7, 1, 0.7, 0.7]);

  // Article 2
  const scale2 = useTransform(scrollXProgress, [2/total - 0.1, 2/total, 3/total, 3/total + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity2 = useTransform(scrollXProgress, [2/total - 0.1, 2/total, 3/total, 3/total + 0.1], [0.7, 1, 0.7, 0.7]);

  // Article 3
  const scale3 = useTransform(scrollXProgress, [3/total - 0.1, 3/total, 4/total, 4/total + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity3 = useTransform(scrollXProgress, [3/total - 0.1, 3/total, 4/total, 4/total + 0.1], [0.7, 1, 0.7, 0.7]);

  // Article 4
  const scale4 = useTransform(scrollXProgress, [4/total - 0.1, 4/total, 5/total, 5/total + 0.1], [0.8, 1.2, 0.8, 0.8]);
  const opacity4 = useTransform(scrollXProgress, [4/total - 0.1, 4/total, 5/total, 5/total + 0.1], [0.7, 1, 0.7, 0.7]);

  // Create arrays of transforms
  const scales = [scale0, scale1, scale2, scale3, scale4];
  const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article, i) => {
          const scale = scales[i] || scale0; // Fallback to first transform
          const opacity = opacities[i] || opacity0;

          return (
            <div key={article._id} className="w-[300px] h-[400px] flex-shrink-0 snap-center px-4 flex items-center justify-center">
              <ArticleCard article={article} yearSlug={yearSlug} scale={scale} opacity={opacity} />
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Viewer Component ---
type ArticlePreviewViewerProps = {
  yearSlug: string;
  title: string;
};

const ArticlePreviewViewer: React.FC<ArticlePreviewViewerProps> = ({ yearSlug, title }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getArticlesByYearSlug(yearSlug);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [yearSlug]);

  return (
    <div className="relative w-full py-16 z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
      {isLoading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>Loading articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <Scroller articles={articles} yearSlug={yearSlug} />
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>No articles found for this year.</p>
        </div>
      )}
    </div>
  );
};

export default ArticlePreviewViewer;