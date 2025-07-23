"use client";

import React from 'react';
import Link from 'next/link';

interface KeyValue {
  title: string;
  description: string;
  href: string;
  iconPath: string;
  backgroundColor: 'gray' | 'orange';
  buttonText: string;
}

interface KeyValuesProps {
  themesTitle: string;
  themesDescription: string;
  themesIconPath: string;
  outputsTitle: string;
  outputsDescription: string;
  outputsIconPath: string;
  peopleTitle: string;
  peopleDescription: string;
  peopleIconPath: string;
  eventStructureTitle: string;
  eventStructureDescription: string;
  eventStructureIconPath: string;
  themePrimaryColor?: string;
  themeSecondaryColor?: string;
}

export default function KeyValues({
  themesTitle,
  themesDescription,
  themesIconPath,
  outputsTitle,
  outputsDescription,
  outputsIconPath,
  peopleTitle,
  peopleDescription,
  peopleIconPath,
  eventStructureTitle,
  eventStructureDescription,
  eventStructureIconPath,
  themePrimaryColor = '#f97316', // orange-500 default
  themeSecondaryColor = '#fb923c' // orange-400 default
}: KeyValuesProps) {
  const keyValues: KeyValue[] = [
    {
      title: themesTitle,
      description: themesDescription,
      href: '/themes',
      iconPath: themesIconPath,
      backgroundColor: 'gray',
      buttonText: 'Read more'
    },
    {
      title: outputsTitle,
      description: outputsDescription,
      href: '/outputs',
      iconPath: outputsIconPath,
      backgroundColor: 'orange',
      buttonText: 'Explore more'
    },
    {
      title: peopleTitle,
      description: peopleDescription,
      href: '/people',
      iconPath: peopleIconPath,
      backgroundColor: 'gray',
      buttonText: 'Explore more'
    },
    {
      title: eventStructureTitle,
      description: eventStructureDescription,
      href: '/event-structure',
      iconPath: eventStructureIconPath,
      backgroundColor: 'orange',
      buttonText: 'Read more'
    }
  ];

  return (
    <div className="bg-white py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 shadow-lg bg-white rounded-lg overflow-hidden">
          {keyValues.map((item, index) => (
            <div 
              key={index}
              className={`${
                item.backgroundColor === 'gray' 
                  ? 'bg-gray-900 text-white border-r border-gray-900' 
                  : 'text-white border-r'
              } p-8 flex flex-col h-full ${index === keyValues.length - 1 ? 'border-r-0' : ''}`}
              style={{
                backgroundColor: item.backgroundColor === 'orange' ? themePrimaryColor : undefined,
                borderRightColor: item.backgroundColor === 'orange' ? themePrimaryColor : undefined
              }}
            >
              <div className="flex items-center mb-6">
                <div 
                  className={`w-12 h-12 ${
                    item.backgroundColor === 'gray' ? '' : 'bg-gray-100'
                  } rounded-full flex items-center justify-center mr-4 flex-shrink-0`}
                  style={{
                    backgroundColor: item.backgroundColor === 'gray' ? themePrimaryColor : undefined
                  }}
                >
                  <svg 
                    className={`w-6 h-6 ${
                      item.backgroundColor === 'gray' ? 'text-white' : ''
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{
                      color: item.backgroundColor === 'orange' ? themePrimaryColor : undefined
                    }}
                  >
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <h5 className={`text-sm font-bold ${
                  item.backgroundColor === 'gray' ? 'text-white' : 'text-white'
                } uppercase tracking-wider`}>
                  {item.title}
                </h5>
              </div>
              <div className="flex-grow">
                <p className={`${
                  item.backgroundColor === 'gray' ? 'text-white' : 'text-orange-100'
                } mb-6 text-sm leading-relaxed`}>
                  {item.description}
                </p>
              </div>
              <Link 
                href={item.href} 
                className={`inline-flex items-center px-4 py-2 ${
                  item.backgroundColor === 'gray' 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'text-white'
                } rounded-md transition-colors text-sm font-medium mt-auto`}
                style={{
                  backgroundColor: item.backgroundColor === 'orange' ? themeSecondaryColor : undefined
                }}
                onMouseEnter={(e) => {
                  if (item.backgroundColor === 'orange') {
                    e.currentTarget.style.backgroundColor = '#ea580c'; // darker orange on hover
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.backgroundColor === 'orange') {
                    e.currentTarget.style.backgroundColor = themeSecondaryColor;
                  }
                }}
              >
                {item.buttonText}
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
