"use client";
import React from 'react';
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";

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

interface TextBlockWithLinksProps {
    links: { buttonText: string; url: string; }[];
    themeColor?: string;
    text?: PortableTextBlock[];
}

export default function TextBlockWithLinks({ links, themeColor = "#f97316", text }: TextBlockWithLinksProps) {
       
    return (
        <div className="max-w-6xl pt-4 mx-auto px-4 sm:px-6 lg:px-8">
            {text && (
                <div className="prose max-w-none mb-8">
                    <PortableText 
                        value={text}
                        components={components}
                    />
                </div>
            )}
            <div className="my-8 flex flex-wrap justify-start gap-4">
                {links && links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-white font-bold py-2 px-5 rounded-md transition-colors"
                        style={{
                            backgroundColor: themeColor,
                            // Darken the color on hover by using rgba with 80% opacity
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
        </div>
    );
}
