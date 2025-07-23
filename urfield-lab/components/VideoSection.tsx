"use client";

import Link from 'next/link';

interface VideoSectionProps {
  heading: string;
  title: string;
  linkText: string;
  linkHref: string;
  videoLink: string;
  backgroundImage: string;
  themeColor: string;
  buttonTextColor?: string;
}

export default function VideoSection({
  heading,
  title,
  linkText,
  linkHref,
  videoLink,
  backgroundImage,
  themeColor,
  buttonTextColor = '#1f2937' // dark gray default
}: VideoSectionProps) {
  // Generate section background color with transparency
  const generateSectionBgColor = (color: string) => {
    // Convert hex to RGB and add transparency
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`; // 20% opacity
  };

  // Generate hover color by darkening the theme color
  const generateHoverColor = (color: string) => {
    return {
      backgroundColor: color,
      filter: 'brightness(0.85)' // Darken by 15%
    };
  };

  const sectionBgColor = generateSectionBgColor(themeColor);

  return (
    <div 
      className="relative py-16"
      style={{
        backgroundColor: sectionBgColor
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-white p-12 flex flex-col justify-center">
            <h5 className="text-sm font-bold mb-4 uppercase tracking-wider">{heading}</h5>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">{title}</h2>
            <Link 
              href={linkHref}
              className="inline-flex items-center px-6 py-3 rounded-md transition-colors font-medium text-sm"
              style={{
                backgroundColor: themeColor,
                color: buttonTextColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              {linkText}
            </Link>
          </div>
          <div 
            className="relative bg-cover bg-center min-h-80 lg:min-h-full flex items-center justify-center"
            style={{
              backgroundImage: `url('${backgroundImage}')`
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <Link 
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-20 h-20 rounded-full transition-colors"
                style={{
                  backgroundColor: themeColor,
                  color: buttonTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.85)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
