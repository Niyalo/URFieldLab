"use client";
import React from 'react';

interface ExternalLinksListProps {
    links: { buttonText: string; url: string; }[];
    themeColor?: string;
}

export default function ExternalLinksList({ links, themeColor = "#f97316" }: ExternalLinksListProps) {
    return (
        <div className="my-8 flex flex-wrap justify-center gap-4">
            {links.map((link, index) => (
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
    );
}
