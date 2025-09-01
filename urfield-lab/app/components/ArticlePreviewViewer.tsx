"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Dynamically set carousel options based on the number of slides
  const [options, setOptions] = useState<EmblaOptionsType>({ loop: true, align: 'center', containScroll: 'trimSnaps' });

  useEffect(() => {
    // A reasonable threshold might be 3 slides for the loop to look good.
    const canLoop = filteredArticles.length > 3;
    setOptions({
      loop: canLoop,
      align: 'center',
      containScroll: 'trimSnaps'
    });
  }, [filteredArticles.length]);

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // For custom scrollbar
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const scrollbarThumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getFeaturedArticles();
        setAllArticles(fetchedArticles);

        // Extract unique years and sort them
        const years = [...new Set(fetchedArticles.map(a => a.year?.title).filter(Boolean) as string[])];
        years.sort((a, b) => parseInt(b) - parseInt(a)); // Sort years descending
        setAvailableYears(['All', ...years]);

      } catch (error) {
        console.error("Failed to fetch featured articles:", error);
        setAllArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedArticles();
  }, []);

  // Effect to filter articles when selectedYear or allArticles changes
  useEffect(() => {
    const articlesToFilter = allArticles;
    if (selectedYear === 'All') {
      setFilteredArticles(articlesToFilter);
    } else {
      setFilteredArticles(articlesToFilter.filter(a => a.year?.title === selectedYear));
    }
  }, [selectedYear, allArticles]);

  // Effect to re-initialize and reset the carousel when the number of slides changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0, false); // Reset to the first slide without animation
      setSelectedIndex(0); // Manually reset the selected index state
    }
  }, [filteredArticles, emblaApi, options]); // Add options as a dependency


  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onDotButtonClick = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Effect for carousel events and custom scrollbar
  useEffect(() => {
    if (!emblaApi || !scrollbarRef.current || !scrollbarThumbRef.current) return;

    const scrollbar = scrollbarRef.current;
    const thumb = scrollbarThumbRef.current;
    let isDragging = false;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    const onScroll = () => {
      const scrollProgress = emblaApi.scrollProgress();
      const thumbPosition = scrollProgress * (scrollbar.offsetWidth - thumb.offsetWidth);
      thumb.style.transform = `translateX(${thumbPosition}px)`;
    };

    const handleWheelScroll = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    };

    const handleThumbMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      isDragging = true;
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    };

    const handleDocumentMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const scrollbarRect = scrollbar.getBoundingClientRect();
      const clickPosition = event.clientX - scrollbarRect.left;
      const progress = clickPosition / scrollbarRect.width;
      const targetIndex = Math.floor(progress * emblaApi.scrollSnapList().length);
      emblaApi.scrollTo(targetIndex);
    };

    const handleDocumentMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onScroll);
    emblaApi.on('scroll', onScroll);

    scrollbar.addEventListener('wheel', handleWheelScroll);
    thumb.addEventListener('mousedown', handleThumbMouseDown);

    onInit();
    onScroll();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
      emblaApi.off('reInit', onScroll);
      emblaApi.off('scroll', onScroll);
      scrollbar.removeEventListener('wheel', handleWheelScroll);
      thumb.removeEventListener('mousedown', handleThumbMouseDown);
      // Clean up global listeners just in case
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [emblaApi, onSelect]);

  const handleCardClick = useCallback((index: number, isCenter: boolean, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isCenter) {
      e.preventDefault(); // Prevent navigation if not center
      emblaApi?.scrollTo(index);
    }
    // If it is the center card, the default Link behavior proceeds
  }, [emblaApi]);

  return (
    <div 
      className="relative w-full py-16 z-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          {title}
        </h2>
        {subtitle && <>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">{subtitle}</p>
          <br></br>
        </>
        }
        {subtitle && <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">For a full list of outputs from past field labs click here:</p>}
        {subtitle && <div className="flex flex-wrap justify-center gap-2">
          <Link href="/chiangmai2019/outputs" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">Chiang mai 2019 - Outputs</Link>
          <p> and </p>
          <Link href="/UR2024/outputs" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">Kathmandu 2024 - Outputs</Link>
        </div>
        } 
      </div>

      {/* Year Filter Buttons */}
      {availableYears.length > 1 && (
        <div className="flex justify-center items-center gap-2 md:gap-4 mb-12 flex-wrap px-4">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              disabled={selectedYear === year}
              className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-300 border-2 ${
                selectedYear === year
                  ? 'bg-orange-500 text-white border-orange-500 cursor-not-allowed'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:border-orange-200 dark:hover:border-orange-800'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
      
      {isLoading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <p>Loading featured articles...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <>
          <div className="embla w-full overflow-hidden" ref={emblaRef}>
            <div className={`embla__container flex items-center h-[500px] -ml-4 ${!options.loop ? 'justify-center' : ''}`}>
              {filteredArticles.map((article, i) => (
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

          {/* Dots Navigation */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'bg-orange-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Custom Scrollbar */}
          <div 
            className={`relative w-1/2 mx-auto mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-opacity duration-300 ${isHovering && scrollSnaps.length > 3 ? 'opacity-100' : 'opacity-0'}`}
            ref={scrollbarRef}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-orange-500 rounded-full cursor-grab"
              ref={scrollbarThumbRef}
              style={{ width: `${100 / scrollSnaps.length}%` }}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-[200px] flex items-center justify-center text-center px-4">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedYear === 'All' 
              ? 'No featured articles found.' 
              : `No featured articles found for ${selectedYear}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticlePreviewViewer;