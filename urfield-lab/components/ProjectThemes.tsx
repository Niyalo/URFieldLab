"use client";

import Link from 'next/link';
import Image from 'next/image';

interface Theme {
  title: string;
  href: string;
  icon: string; // Can be SVG path or image URL
}

interface ProjectThemesProps {
  title: string;
  description: string;
  titleHref: string;
  themes: Theme[];
  themeColor: string;
}

export default function ProjectThemes({
  title,
  description,
  titleHref,
  themes,
  themeColor
}: ProjectThemesProps) {
  // Generate section background color with transparency (from VideoSection)
  const generateSectionBgColor = (color: string) => {
    // Convert hex to RGB and add transparency
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`; // 20% opacity
  };

  // Helper function to determine if iconPath is a URL or SVG path (from KeyValues)
  const isImageUrl = (path: string) => {
    return path.startsWith('http://') || 
           path.startsWith('https://') || 
           path.startsWith('/') || 
           path.startsWith('./') || 
           path.startsWith('../');
  };

  // Helper function to check if the URL is an SVG
  const isSvg = (path: string) => {
    return path.toLowerCase().includes('.svg') || path.toLowerCase().includes('svg');
  };

  // Generate hover colors
  const generateHoverColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Darken the color for hover
    const darkenFactor = 0.8;
    return `rgb(${Math.round(r * darkenFactor)}, ${Math.round(g * darkenFactor)}, ${Math.round(b * darkenFactor)})`;
  };

  const sectionBgColor = generateSectionBgColor(themeColor);
  const hoverColor = generateHoverColor(themeColor);

  return (
    <div 
      className="py-16"
      style={{
        backgroundColor: sectionBgColor
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <Link 
              href={titleHref} 
              className="text-gray-900 transition-colors"
              style={{
                color: '#1f2937' // gray-900
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1f2937';
              }}
            >
              {title}
            </Link>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  style={{
                    backgroundColor: themeColor
                  }}
                >
                  {theme.icon && isImageUrl(theme.icon) ? (
                    isSvg(theme.icon) ? (
                      // For SVG images, use img tag instead of Next.js Image for better compatibility
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={theme.icon} 
                        alt={theme.title}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                        style={{
                          filter: 'brightness(0) invert(1)' // Make image white
                        }}
                      />
                    ) : (
                      <Image 
                        src={theme.icon} 
                        alt={theme.title}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                        style={{
                          filter: 'brightness(0) invert(1)' // Make image white
                        }}
                      />
                    )
                  ) : theme.icon ? (
                    <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={theme.icon} clipRule="evenodd" />
                    </svg>
                  ) : (
                    // Fallback icon if no icon is provided
                    <div className="w-6 h-6 bg-white rounded" />
                  )}
                </div>
                <h5 
                  className="text-lg font-semibold leading-tight transition-colors"
                  style={{
                    color: themeColor
                  }}
                >
                  <Link 
                    href={theme.href} 
                    className="transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = themeColor;
                    }}
                  >
                    {theme.title}
                  </Link>
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
