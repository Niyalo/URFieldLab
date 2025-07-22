'use client';

import { urlFor } from "@/sanity/sanity-utils";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import PDFViewerClient from "./PDFViewerClient"; // Import the PDF viewer

type Props = {
    body: any[];
};

export default function ArticleBody({ body }: Props) {
    if (!body) return null;

    const components = {
        block: {
            h2: ({ children }: any) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
            normal: ({ children }: any) => <p className="mb-4">{children}</p>,
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
        if (block._type === 'posterObject' || block._type === 'pdfFile') {
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
            {contentGroups.map((group, groupIndex) => {
                if (group.type === 'posterObject') {
                    return (
                        <div key={groupIndex} className="my-8">
                            <Image src={urlFor(group.block.asset).url()} alt="Poster image" width={group.block.asset.metadata.dimensions.width} height={group.block.asset.metadata.dimensions.height} className="w-full h-auto rounded-lg shadow-lg" />
                        </div>
                    );
                }
                if (group.type === 'pdfFile') {
                    const originalUrl = group.block.asset.url;
                    const pdfUrl = `/api/pdf?file=${encodeURIComponent(originalUrl)}`;
                    return (
                        <div key={groupIndex} className="my-8 border rounded-lg overflow-hidden shadow-lg">
                           <PDFViewerClient pdfUrl={pdfUrl} originalUrl={originalUrl} />
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