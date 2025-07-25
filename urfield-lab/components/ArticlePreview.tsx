'use client';

import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/sanity-utils';

// Helper to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Define the Article type based on what's passed from the server component
type Article = {
  _id: string;
  title: string;
  slug?: { current: string };
  summary: string;
  mainImage: any; // Can be a Sanity image object
  youtubeVideoUrl?: string;
  hasBody?: boolean;
  buttonText?: string;
  authorListPrefix?: string;
  authors?: { name: string }[];
  externalLinks?: { buttonText: string; url: string }[];
};

type Props = {
  article: Article;
  yearSlug: string;
  imageOrder: string;
  textOrder: string;
  authorsString: string;
};

export default function ArticlePreview({ article, yearSlug, imageOrder, textOrder, authorsString }: Props) {
  const videoId = article.youtubeVideoUrl ? getYouTubeVideoId(article.youtubeVideoUrl) : null;

  return (
    <>
      <div id={`article-${article.slug?.current}`} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={textOrder}>
          <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h4>
          <p className="text-md text-gray-600 dark:text-gray-400 italic mt-2">
            {article.authorListPrefix || 'By'} {authorsString}
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {article.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            {article.externalLinks?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-cyan-500 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors"
              >
                {link.buttonText}
              </a>
            ))}
            {article.hasBody && article.slug && (
              <Link href={`/${yearSlug}/${article.slug.current}`} className="inline-block bg-cyan-500 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors">
                {article.buttonText || 'Read More'}
              </Link>
            )}
          </div>
        </div>
        <div className={imageOrder}>
          {videoId && article.youtubeVideoUrl ? (
            <a href={article.youtubeVideoUrl} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video block rounded-lg shadow-lg overflow-hidden group">
              <Image
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={`Video thumbnail for ${article.title}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg className="h-16 w-16 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>
          ) : article.mainImage && (
            <Image
              src={urlFor(article.mainImage).width(800).height(600).url()}
              alt={`Cover image for ${article.title}`}
              width={800}
              height={600}
              className="rounded-lg shadow-lg object-cover"
            />
          )}
        </div>
      </div>
    </>
  );
}