"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedArticles, type Article } from '@/sanity/sanity-utils';
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
  isCenter: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isCenter, onClick }) => {
  const videoId = article.youtubeVideoUrl ? getYouTubeVideoId(article.youtubeVideoUrl) : null;
  const imageUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : article.mainImage ? urlFor(article.mainImage).width(500).height(300).url() : '/images/placeholder.png';

  const yearSlug = article.year?.slug;
  const linkHref = yearSlug ? `/${yearSlug}/outputs#article-${article._id}` : '#';

  return (
    <Link
      href={linkHref}
      onClick={onClick}
      className="block w-full h-full cursor-pointer"
      aria-label={`View details for ${article.title}`}
    >
      <div
        className={`relative w-full h-full bg-white/80 dark:bg-black/80 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-500 text-left ${isCenter ? 'scale-100' : 'scale-90'}`}
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
            {article.year?.title || 'Featured'}
          </p>
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
      </div>
    </Link>
  );
};

// --- Main Viewer Component ---
type ArticlePreviewViewerProps = {
  title: string;
  subtitle?: string;
};

const ArticlePreviewViewer: React.FC<ArticlePreviewViewerProps> = ({ title, subtitle }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const OPTIONS: EmblaOptionsType = { loop: true, align: 'center', containScroll: 'trimSnaps' };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getFeaturedArticles();
        // --- DEBUGGING STEP ---
        // Log the fetched articles to the browser console to inspect their structure.
        console.log("Fetched Featured Articles:", fetchedArticles);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch featured articles:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedArticles();
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi, onSelect]);

  const handleCardClick = useCallback((index: number, isCenter: boolean, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isCenter) {
      e.preventDefault(); // Prevent navigation if not center
      emblaApi?.scrollTo(index);
    }
    // If it is the center card, the default Link behavior proceeds
  }, [emblaApi]);

  return (
    <div className="relative w-full py-16 z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold"
        >
          {title}
          </h2>
        {subtitle && <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      
      {isLoading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>Loading featured articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="embla w-full overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex items-center h-[500px] -ml-4">
            {articles.map((article, i) => (
              <div key={article._id} className="embla__slide flex-[0_0_60%] md:flex-[0_0_30%] min-w-0 pl-4">
                <div className="h-[400px]">
                  <ArticleCard
                    article={article}
                    isCenter={i === selectedIndex}
                    onClick={(e) => handleCardClick(i, i === selectedIndex, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>No featured articles found.</p>
        </div>
      )}
    </div>
  );
};

export default ArticlePreviewViewer;