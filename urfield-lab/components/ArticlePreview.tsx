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

type Props = {
  article: import('@/sanity/sanity-utils').Article;
  yearSlug: string;
};

export default function ArticlePreview({ article, yearSlug }: Props) {
  const videoId = article.youtubeVideoUrl ? getYouTubeVideoId(article.youtubeVideoUrl) : null;
  const imageUrl = article.mainImage ? (typeof article.mainImage === 'string' ? article.mainImage : urlFor(article.mainImage).width(800).url()) : null;

  return (
    <>
      <article id={`article-${article.slug?.current}`} className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <div className="relative h-48 sm:h-56 md:h-44 lg:h-40 w-full overflow-hidden">
          {videoId ? (
            <a href={article.youtubeVideoUrl} target="_blank" rel="noopener noreferrer" className="block absolute inset-0">
              <Image src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={article.title} fill className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
            </a>
          ) : imageUrl ? (
            <Image src={imageUrl} alt={article.title} fill className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 w-full h-full" />
          )}
        </div>

        <div className="p-4">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{article.title}</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            {article.authors?.map((author, index) => (
              <span key={author.name + index} className="inline-flex items-center gap-2">
                {'pictureURL' in author && author.pictureURL && (
                  <Image src={author.pictureURL} alt={author.name} width={20} height={20} className="rounded-full" />
                )}
                <span className="italic">{author.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white dark:from-gray-900/95 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">{article.summary}</p>
          <div className="mt-3">
            {article.hasBody && article.slug && (
              <Link href={`/${yearSlug}/${article.slug.current}`} className="inline-block bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors">
                {article.buttonText || 'Read More'}
              </Link>
            )}
          </div>
        </div>
      </article>
    </>
  );
}