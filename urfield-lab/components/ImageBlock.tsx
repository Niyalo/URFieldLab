'use client';

import Image from "next/image";
import { urlFor } from "@/sanity/sanity-utils";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface SanityImageMetadata {
    dimensions?: {
        width: number;
        height: number;
    };
    url?: string;
}

interface SanityImageAsset {
    url?: string;
    metadata?: SanityImageMetadata;
}

interface ImageBlockProps {
    asset: SanityImageSource | SanityImageAsset;
    caption?: string;
    isPoster?: boolean;
}

export default function ImageBlock({ asset, caption, isPoster = false }: ImageBlockProps) {
    // Use the URL directly if it's in the asset or metadata, otherwise try urlFor
    const imageUrl = (asset as SanityImageAsset).url || 
                    (asset as SanityImageAsset).metadata?.url || 
                    urlFor(asset).url();
    const dimensions = (asset as SanityImageAsset).metadata?.dimensions;
    
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <figure className={`${isPoster ? 'my-8' : 'mb-4 break-inside-avoid'}`}>
                <Image
                    src={imageUrl}
                    alt={caption || (isPoster ? 'Poster image' : 'Image')}
                    width={dimensions?.width || 1200}
                    height={dimensions?.height || 800}
                    className={`rounded-lg ${isPoster ? 'w-full h-auto shadow-lg' : ''}`}
                />
                {!isPoster && caption && (
                    <figcaption className="text-sm text-center text-gray-500 mt-2">
                        {caption}
                    </figcaption>
                )}
            </figure>
        </div>
    );
}
