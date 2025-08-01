'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createClient } from '@sanity/client';
import Papa from 'papaparse';
import { scrapeBio, uploadAuthor } from './actions';

// --- Sanity Client for Reading ---
// The write client is now in actions.ts
const readClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
});


interface ScrapedAuthor {
    name: string;
    institute: string;
    picture: string;
    authorPageUrl: string;
    bio?: string;
}

type UploadStatus = 'pending' | 'scraping' | 'scraped' | 'uploading' | 'success' | 'error';

interface AuthorStatus extends ScrapedAuthor {
    status: UploadStatus;
    message?: string;
}

const InternalPage = () => {
    const [csvData, setCsvData] = useState("Paste your csv here");
    const [authorStatuses, setAuthorStatuses] = useState<AuthorStatus[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isScraping, setIsScraping] = useState(false);

    const handleParseCsv = () => {
        if (!csvData.trim() || csvData === "Paste your csv here") {
            alert("Please paste CSV data into the text area.");
            return;
        }
        Papa.parse<any>(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.error("CSV Parsing Errors:", results.errors);
                    alert(`Error parsing CSV: ${results.errors[0].message}. Check console for details.`);
                    setAuthorStatuses([]);
                    return;
                }
                const authors = results.data.map((row: any) => ({
                    name: (row.name || '').replace(/\s+/g, ' ').trim(),
                    institute: row.institute || '',
                    picture: row.profile_picture_url || '',
                    authorPageUrl: row.author_page_url || '',
                    status: 'pending' as UploadStatus,
                }));
                setAuthorStatuses(authors);
            },
        });
    };

    const handleScrapeBios = async () => {
        setIsScraping(true);
        const updatedStatuses = [...authorStatuses];

        for (let i = 0; i < updatedStatuses.length; i++) {
            const author = updatedStatuses[i];
            if (author.authorPageUrl && author.authorPageUrl !== 'Author page link not found') {
                setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'scraping' } : s));
                const bio = await scrapeBio(author.authorPageUrl);
                updatedStatuses[i] = { ...author, bio, status: 'scraped', message: bio ? 'Bio scraped' : 'No bio found' };
                setAuthorStatuses([...updatedStatuses]);
            } else {
                 updatedStatuses[i] = { ...author, bio: '', status: 'scraped', message: 'No author page URL' };
                 setAuthorStatuses([...updatedStatuses]);
            }
        }
        setIsScraping(false);
    };

    const handleUpload = async () => {
        setIsUploading(true);

        let yearId: string;
        try {
            // Assuming the year for this data is 2024
            const year = await readClient.fetch(`*[_type == "year" && year == 2024][0]{_id}`);
            if (!year?._id) {
                alert("Error: Year '2024' not found in Sanity. Please create it first.");
                setIsUploading(false);
                return;
            }
            yearId = year._id;
        } catch (e) {
            alert(`Error fetching year: ${(e as Error).message}`);
            setIsUploading(false);
            return;
        }

        for (let i = 0; i < authorStatuses.length; i++) {
            const author = authorStatuses[i];
            
            // Skip if already uploaded successfully
            if (author.status === 'success') continue;

            setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'uploading' } : s));

            const result = await uploadAuthor(author, yearId);

            if (result.success) {
                setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success', message: result.message } : s));
            } else {
                setAuthorStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error', message: result.message } : s));
            }
        }

        setIsUploading(false);
    };

    const getStatusColor = (status: UploadStatus) => {
        switch (status) {
            case 'scraping': return 'text-cyan-400';
            case 'scraped': return 'text-blue-400';
            case 'uploading': return 'text-yellow-400';
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-500';
        }
    };

    const allScraped = authorStatuses.length > 0 && authorStatuses.every(a => a.status === 'scraped' || a.status === 'success' || a.status === 'error' || (!a.authorPageUrl || a.authorPageUrl === 'Author page link not found'));

    return (
        <div className="container mx-auto p-8 bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">CSV Profiles Uploader</h1>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mb-8">
                <label htmlFor="csv-input" className="block mb-2 text-sm font-medium text-gray-300">Paste CSV Content Here</label>
                <textarea
                    id="csv-input"
                    className="w-full h-48 p-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="name,institute,profile_picture_url,author_page_url..."
                />
                <div className="mt-4 flex gap-4">
                     <button
                        onClick={handleParseCsv}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        1. Parse CSV
                    </button>
                    <button
                        onClick={handleScrapeBios}
                        disabled={isScraping || authorStatuses.length === 0}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {isScraping ? 'Scraping Bios...' : '2. Scrape All Bios'}
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || isScraping || !allScraped}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {isUploading ? 'Uploading...' : `3. Upload ${authorStatuses.length} Authors`}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {authorStatuses.map((author, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div className="relative w-full h-60">
                           <Image 
                                src={author.picture || '/default profile pic.webp'} 
                                alt={`Picture of ${author.name}`} 
                                layout="fill"
                                objectFit="cover"
                                unoptimized
                           />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h2 className="text-xl font-semibold">{author.name}</h2>
                            <p className="text-gray-400 italic text-sm">{author.institute}</p>
                            {author.bio && (
                                <p className="text-gray-300 text-xs mt-2 flex-grow overflow-auto max-h-24">
                                    {author.bio.substring(0, 150)}{author.bio.length > 150 ? '...' : ''}
                                </p>
                            )}
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