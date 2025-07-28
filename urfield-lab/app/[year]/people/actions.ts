'use server';

import { getAuthorDetails } from "@/sanity/sanity-utils";
import { Author } from "@/sanity/sanity-utils";

export async function getAuthorDetailsAction(authorId: string): Promise<Author | null> {
    try {
        const author = await getAuthorDetails(authorId);
        return author;
    } catch (error) {
        console.error("Failed to fetch author details:", error);
        return null;
    }
}