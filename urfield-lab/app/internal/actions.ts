'use server';

import * as cheerio from 'cheerio';
import { createClient, SanityClient } from '@sanity/client';
import type { SanityDocument, Slug } from '@sanity/types';
import fs from 'fs/promises';
import path from 'path';

// --- Sanity Client for Writing ---
const writeClient: SanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
});


export async function scrapeBio(url: string): Promise<string> {
    if (!url || url === 'Author page link not found') {
        return '';
    }
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate cache every hour
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        return $('.author-profile-bio p').first().text().trim() || '';
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return `Error scraping bio: ${(error as Error).message}`;
    }
}

interface AuthorData {
    name: string;
    institute: string;
    picture: string;
    bio?: string;
}

export async function uploadAuthor(author: AuthorData, yearId: string): Promise<{ success: boolean; message: string }> {
    try {
        let imageAsset;
        try {
            // Fetch external image
            const imageResponse = await fetch(author.picture);
            if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.statusText}`);
            const imageBlob = await imageResponse.blob();
            imageAsset = await writeClient.assets.upload('image', imageBlob, { filename: author.name });
        } catch (e) {
            console.warn(`Could not fetch remote image for ${author.name}. Trying default. Error: ${(e as Error).message}`);
            // Fallback to local default image
            const defaultImagePath = path.join(process.cwd(), 'public', 'default profile pic.webp');
            const imageBuffer = await fs.readFile(defaultImagePath);
            imageAsset = await writeClient.assets.upload('image', imageBuffer, { filename: 'default-profile-pic.webp' });
        }

        // Ensure login_name is unique
        let baseLoginName = author.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
        let loginName = baseLoginName;
        let isUnique = false;
        let counter = 1;
        while (!isUnique) {
            const existing = await writeClient.fetch(`*[_type == "author" && login_name == $loginName][0]`, { loginName });
            if (!existing) {
                isUnique = true;
            } else {
                loginName = `${baseLoginName}${counter++}`;
            }
        }

        await writeClient.create({
            _type: 'author',
            name: author.name,
            login_name: loginName,
            password: '$2b$10$SpjZBm012Rb5dP9/Ti02TOtn2QEgOlTbLUjCFLjIXqqxo5P4N.gn2', // Default hashed password
            institute: author.institute,
            bio: author.bio,
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

        return { success: true, message: 'Uploaded!' };

    } catch (error) {
        console.error(`Failed to upload ${author.name}:`, error);
        return { success: false, message: (error as Error).message };
    }
}