'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PortableText, PortableTextProps } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const portableTextComponents: PortableTextProps['components'] = {
  block: {
    normal: ({children}) => <p className="mb-2 last:mb-0">{children}</p>
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>
  }
};

interface FeaturedCardProps {
  imageUrl?: string;
  title: string;
  description: PortableTextBlock | string;
  linkText?: string;
  linkUrl?: string;
  linkTextColor?: string;
}

export default function FeaturedCard({
  imageUrl,
  title,
  description,
  linkText,
  linkUrl,
  linkTextColor = '#ea580c' // orange-600 default
}: FeaturedCardProps) {
  // Generate hover color by darkening the link color
  const generateHoverColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Darken the color for hover
    const darkenFactor = 0.8;
    return `rgb(${Math.round(r * darkenFactor)}, ${Math.round(g * darkenFactor)}, ${Math.round(b * darkenFactor)})`;
  };

  const hoverColor = generateHoverColor(linkTextColor);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {imageUrl ? (
        <div className="h-48 bg-gray-200 bg-cover bg-center">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
      <></>
      )}
      <div className="p-6">
        <h4 className="text-xl font-semibold mb-3 text-gray-900 h-14 overflow-hidden relative" title={title}>
          <span className="line-clamp-2">
            {title}
          </span>
        </h4>
        <div className="text-gray-600 mb-4 text-sm leading-relaxed h-32 overflow-y-auto">
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : (
            <PortableText 
              value={description}
              components={portableTextComponents}
            />
          )}
        </div>
        {linkUrl && linkText && (
          <Link 
            href={linkUrl}
            target={linkUrl.startsWith('http') ? "_blank" : undefined}
            rel={linkUrl.startsWith('http') ? "noopener noreferrer" : undefined}
            className="font-medium transition-colors"
            style={{
              color: linkTextColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = linkTextColor;
            }}
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}
