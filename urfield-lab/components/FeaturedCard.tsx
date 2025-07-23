'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FeaturedCardProps {
  imageUrl: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
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
      <div className="h-48 bg-gray-200 bg-cover bg-center">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h4 className="text-xl font-semibold mb-3 text-gray-900 h-14 overflow-hidden relative" title={title}>
          <span className="line-clamp-2">
            {title}
          </span>
        </h4>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
          {description}
        </p>
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
      </div>
    </div>
  );
}
