import React from 'react';

interface ContentDescriptionProps {
  content: string;
}

export default function ContentDescription({ content }: ContentDescriptionProps) {
  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p 
            className="text-gray-700 leading-relaxed max-w-4xl mx-auto whitespace-pre-wrap"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
