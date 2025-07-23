'use client';

import * as cheerio from 'cheerio';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { createClient } from '@sanity/client';

// --- Sanity Client for Writing ---
// This uses the write token from your .env.local file
const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // `false` is required for write operations
    token: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
});


// The HTML snippet provided by the user.
// I've added more entries to simulate the full list for demonstration.
const html = `
<div data-type="row" class="row spaced-cols"> <div class="col-xs-12 col-sm-6 portfolio-item col-md-3"> <div data-hover-fx="portfolio-1" class="contentswap-effect visible cs-portfolio-1 contentswap-overlay" style="float: none; margin: 0px; width: 100%;"> <div class="initial-image" style="float: none; margin: 0px;"> <img decoding="async" data-size="500x500" src="https://i0.wp.com/urfieldlab.com/wp-content/uploads/2019/07/adityo.jpg?zoom=2&amp;w=3840&amp;ssl=1" scale="2"></div> <div class="overlay" style="display: block; transition: opacity 800ms;-webkit-transition-timing-function:ease;-moz-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;"></div> <div class="swap-inner col-xs-12" style="display: block; transition: 800ms; background-color: rgba(0, 0, 0, 0); margin-top: 0px;"> <div class="row full-height-row bottom-xs"> <div class="col-xs-12 text-center content-holder"> <h4 class="color-white font-500">Adityo Dwijananto</h4> <p class="small color-white" style="font-style: italic;">Humanitarian OpenStreetMap</p></div> </div></div> </div></div>        <div class="col-xs-12 col-sm-6 portfolio-item col-md-3"> <div data-hover-fx="portfolio-1" class="contentswap-effect visible cs-portfolio-1 contentswap-overlay" style="float: none; margin: 0px; width: 100%;"> <div class="initial-image" style="float: none; margin: 0px;"> <img decoding="async" data-size="500x500" src="https://i2.wp.com/urfieldlab.com/wp-content/uploads/2019/06/Akhmad_Kunio-1.png?zoom=2&amp;w=3840&amp;ssl=1" scale="2"></div> <div class="overlay" style="display: block; transition: opacity 800ms;-webkit-transition-timing-function:ease;-moz-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;"></div> <div class="swap-inner col-xs-12" style="display: block; transition: 800ms; background-color: rgba(0, 0, 0, 0); margin-top: 0px;"> <div class="row full-height-row bottom-xs"> <div class="col-xs-12 text-center content-holder"> <h4 class="color-white font-500">Akhmad Kunio Fadlullah Pratopo</h4> <p class="small color-white" style="font-style: italic;">Bandung Institute of Technology</p></div> </div></div> </div></div>
`;

interface ScrapedAuthor {
    name: string;
    institute: string;
    picture: string;
}

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface AuthorStatus extends ScrapedAuthor {
    status: UploadStatus;
    message?: string;
}

const InternalPage = () => {
    // Memoize the expensive parsing operation
    const allAuthors = useMemo(() => {
        const $ = cheerio.load(html);
        const authors: ScrapedAuthor[] = [];
        $('.portfolio-item').each((i, el) => {
            const name = $(el).find('h4.color-white').text().trim();
            const institute = $(el).find('p.small.color-white').text().trim();
            const picture = $(el).find('img').attr('src') || ''; // Get picture, default to empty string if not found
            if (name && institute) { // Only require name and institute
                authors.push({ name, institute, picture });
            }
        });
        return authors;
    }, []);

    const [authorStatuses, setAuthorStatuses] = useState<AuthorStatus[]>(() =>
        allAuthors.map(author => ({ ...author, status: 'pending' }))
    );
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        setIsUploading(true);

        // 1. Get the _id for the 'year' document
        let yearId: string;
        try {
            const year = await writeClient.fetch(`*[_type == "year" && slug.current == "chiangmai2019"][0]{_id}`);
            if (!year?._id) {
                alert("Error: Year 'chiangmai2019' not found in Sanity. Please create it first.");
                setIsUploading(false);
                return;
            }
            yearId = year._id;
        } catch (e) {
            alert(`Error fetching year: ${(e as Error).message}`);
            setIsUploading(false);
            return;
        }

        // 2. Process each author one by one
        for (let i = 0; i < allAuthors.length; i++) {
            const author = allAuthors[i];
            
            // Update status to 'uploading'
            setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'uploading' } : s));

            try {
                let imageAsset;
                // 3. Upload image
                if (author.picture) {
                    const imageResponse = await fetch(author.picture);
                    if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.status}`);
                    const imageBlob = await imageResponse.blob();
                    imageAsset = await writeClient.assets.upload('image', imageBlob, { filename: author.name });
                } else {
                    // Use default image if no picture is scraped
                    const defaultImageResponse = await fetch('/default profile pic.webp');
                    if (!defaultImageResponse.ok) throw new Error('Default image not found in /public');
                    const imageBlob = await defaultImageResponse.blob();
                    imageAsset = await writeClient.assets.upload('image', imageBlob, { filename: 'default-profile-pic' });
                }


                // 4. Generate unique login name
                let loginName = author.name;
                let isUnique = false;
                let counter = 1;
                while (!isUnique) {
                    const existing = await writeClient.fetch(`*[_type == "author" && login_name == $loginName][0]`, { loginName });
                    if (!existing) {
                        isUnique = true;
                    } else {
                        loginName = `${author.name} ${counter++}`;
                    }
                }

                // 5. Create author document
                await writeClient.create({
                    _type: 'author',
                    name: author.name,
                    login_name: loginName,
                    password: '$2b$10$SpjZBm012Rb5dP9/Ti02TOtn2QEgOlTbLUjCFLjIXqqxo5P4N.gn2',
                    institute: author.institute,
                    verified: true,
                    picture: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: imageAsset._id,
                        },
                    },
                    year: {
                        _type: 'reference',
                        _ref: yearId,
                    },
                });

                // Update status to 'success'
                setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success', message: 'Uploaded!' } : s));

            } catch (error) {
                console.error(`Failed to upload ${author.name}:`, error);
                // Update status to 'error'
                setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error', message: (error as Error).message } : s));
            }
        }

        setIsUploading(false);
    };

    const getStatusColor = (status: UploadStatus) => {
        switch (status) {
            case 'uploading': return 'text-yellow-400';
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Scraped Profiles</h1>
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                    {isUploading ? 'Uploading...' : `Upload ${allAuthors.length} Authors to Sanity`}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {authorStatuses.map((author, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="relative w-full h-60">
                           <Image 
                                src={author.picture || '/default profile pic.webp'} 
                                alt={`Picture of ${author.name}`} 
                                layout="fill"
                                objectFit="cover"
                                unoptimized
                           />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{author.name}</h2>
                            <p className="text-gray-400 italic">{author.institute}</p>
                            <div className={`mt-2 text-sm font-semibold ${getStatusColor(author.status)}`}>
                                Status: {author.status}
                                {author.message && <p className="text-xs font-normal">{author.message}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternalPage;