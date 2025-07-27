'use client';

import { urlFor } from "@/sanity/sanity-utils";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import PDFViewerClient from "./PDFViewerClient"; // Import the PDF viewer

type Props = {
    body: any[];
    youtubeVideoUrl?: string;
};

const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function ArticleBody({ body, youtubeVideoUrl }: Props) {
    const videoId = youtubeVideoUrl ? getYouTubeVideoId(youtubeVideoUrl) : null;

    const components = {
        block: {
            h2: ({ children }: any) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
            normal: ({ children }: any) => <p className="mb-4">{children}</p>,
        },
        marks: {
            link: ({ children, value }: any) => {
                const rel = value.target === '_blank' ? 'noopener noreferrer' : undefined;
                return (
                    <a href={value.href} target={value.target} rel={rel} className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 underline">
                        {children}
                    </a>
                );
            },
        },
    };

    const renderBlock = (block: any, index: number) => {
        switch (block._type) {
            case 'subheading':
                return <h3 key={index} className="text-2xl font-bold mt-8 mb-4 col-span-full">{block.text}</h3>;
            case 'textBlock':
                return <div key={index} className="prose prose-lg dark:prose-invert max-w-none"><PortableText value={block.content} components={components} /></div>;
            case 'list':
                return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-4">
                        {block.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                );
            case 'imageObject':
                return (
                    <figure key={index} className="mb-4 break-inside-avoid">
                        <Image src={urlFor(block.asset).url()} alt={block.caption || 'Article image'} width={block.asset.metadata.dimensions.width} height={block.asset.metadata.dimensions.height} className="rounded-lg" />
                        {block.caption && <figcaption className="text-sm text-center text-gray-500 mt-2">{block.caption}</figcaption>}
                    </figure>
                );
            // The pdfFile case is no longer needed here as it's handled by the grouping logic below.
            default:
                return null;
        }
    };

    // Group consecutive non-poster/pdf blocks to put them in columns
    const contentGroups = [];
    let currentGroup: any[] = [];

    for (const block of body) {
        if (block._type === 'posterObject' || block._type === 'pdfFile' || block._type === 'sectionTitle' || block._type === 'externalLinksList') {
            if (currentGroup.length > 0) {
                contentGroups.push({ type: 'column', blocks: currentGroup });
                currentGroup = [];
            }
            contentGroups.push({ type: block._type, block });
        } else {
            currentGroup.push(block);
        }
    }
    if (currentGroup.length > 0) {
        contentGroups.push({ type: 'column', blocks: currentGroup });
    }

    return (
        <div>
            {videoId && youtubeVideoUrl && (
                <div className="my-8">
                    <a href={youtubeVideoUrl} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-video block rounded-lg shadow-lg overflow-hidden group">
                        <Image
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={`Video thumbnail for article`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <svg className="h-20 w-20 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </a>
                </div>
            )}
            {contentGroups.map((group, groupIndex) => {
                if (group.type === 'sectionTitle') {
                    return (
                        <div key={groupIndex} className="my-12">
                            <hr className="mb-8 border-gray-300 dark:border-gray-700" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
                                {group.block.text}
                            </h2>
                        </div>
                    );
                }
                if (group.type === 'posterObject' && group.block.asset) {
                    return (
                        <div key={groupIndex} className="my-8">
                            <Image src={urlFor(group.block.asset).url()} alt="Poster image" width={group.block.asset.metadata.dimensions.width} height={group.block.asset.metadata.dimensions.height} className="w-full h-auto rounded-lg shadow-lg" />
                        </div>
                    );
                }
                if (group.type === 'externalLinksList' && group.block.links) {
                    return (
                        <div key={groupIndex} className="my-8 flex flex-wrap justify-center gap-4">
                            {group.block.links.map((link: any, linkIndex: number) => (
                                <a
                                    key={linkIndex}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-cyan-500 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors"
                                >
                                    {link.buttonText}
                                </a>
                            ))}
                        </div>
                    );
                }
                if (group.type === 'pdfFile') {
                    const originalUrl = group.block.asset.url;
                    // Use the original Sanity CDN URL directly instead of the local API
                    return (
                        <div key={groupIndex} className="my-8 border rounded-lg overflow-hidden shadow-lg">
                           <PDFViewerClient pdfUrl={originalUrl} originalUrl={originalUrl} />
                        </div>
                    );
                }
                if (group.type === 'column' && group.blocks) {
                    return (
                        <div key={groupIndex} className="lg:columns-2 lg:gap-12">
                            {group.blocks.map((block: any, blockIndex: number) => renderBlock(block, blockIndex))}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}