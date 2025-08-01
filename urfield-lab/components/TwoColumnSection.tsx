"use client";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";
import { urlFor } from "@/sanity/sanity-utils";

// Reuse the same components config from TextBlockWithLinks for consistency
const components: PortableTextComponents = {
  block: {
    h1: ({children}) => <h1 className="text-4xl font-bold mb-6">{children}</h1>,
    h2: ({children}) => <h2 className="text-3xl font-bold mb-5">{children}</h2>,
    h3: ({children}) => <h3 className="text-2xl font-bold mb-4">{children}</h3>,
    h4: ({children}) => <h4 className="text-xl font-bold mb-4">{children}</h4>,
    h5: ({children}) => <h5 className="text-lg font-bold mb-3">{children}</h5>,
    h6: ({children}) => <h6 className="text-base font-bold mb-3">{children}</h6>,
    normal: ({children}) => <p className="mb-4">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>,
    underline: ({children}) => <span className="underline">{children}</span>,
    link: ({children, value}) => (
      <a 
        href={value?.href} 
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="list-disc list-inside mb-4">{children}</ul>,
    number: ({children}) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  },
};

interface ColumnItem {
  _type: 'columnText' | 'columnImage' | 'columnButtons';
  _key: string;
  columnText?: PortableTextBlock[];
  image?: {
    asset: {
      _ref: string;
      url: string;
    };
    caption?: string;
  };
  links?: {
    buttonText: string;
    url: string;
  }[];
}

interface TwoColumnSectionProps {
  title: string;
  leftColumn: ColumnItem[];
  rightColumn: ColumnItem[];
  themeColor?: string;
}

const renderColumnItem = (item: ColumnItem, themeColor: string = "#f97316") => {
  switch (item._type) {
    case 'columnText':
      return item.columnText ? (
        <div key={item._key} className="prose max-w-none mb-8">
          <PortableText 
            value={item.columnText}
            components={components}
          />
        </div>
      ) : null;
    
    case 'columnImage':
      return item.image && item.image.asset && (item.image.asset._ref || item.image.asset.url) ? (
        <div key={item._key} className="mb-8">
          <div className="relative w-full aspect-video">
            <Image
              src={item.image.asset.url || urlFor(item.image.asset).url()}
              alt={item.image.caption || ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg shadow-md"
            />
          </div>
          {item.image.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {item.image.caption}
            </p>
          )}
        </div>
      ) : null;
    
    case 'columnButtons':
      return item.links?.length ? (
        <div key={item._key} className="mb-8 flex flex-wrap justify-center gap-4">
          {item.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-bold py-2 px-5 rounded-md transition-colors"
              style={{
                backgroundColor: themeColor,
                ["--hover-color"]: `${themeColor}cc`,
              } as React.CSSProperties}
              onMouseOver={(e) => {
                (e.target as HTMLAnchorElement).style.backgroundColor = `${themeColor}cc`;
              }}
              onMouseOut={(e) => {
                (e.target as HTMLAnchorElement).style.backgroundColor = themeColor;
              }}
            >
              {link.buttonText}
            </a>
          ))}
        </div>
      ) : null;
    
    default:
      return null;
  }
};

export default function TwoColumnSection({ title, leftColumn, rightColumn, themeColor = "#f97316" }: TwoColumnSectionProps) {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl pt-4">
      <h1 className="text-4xl font-bold text-center mb-12">{title}</h1>
      
      <div className="grid md:grid-cols-2 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {leftColumn.map(item => renderColumnItem(item, themeColor))}
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {rightColumn.map(item => renderColumnItem(item, themeColor))}
        </div>
      </div>
    </div>
  );
}
