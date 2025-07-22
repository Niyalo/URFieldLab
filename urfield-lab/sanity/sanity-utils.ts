import { createClient, groq } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableTextBlock } from "sanity";

// This is a placeholder. Remember to replace it with your actual client configuration.
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: "2024-01-01",
    useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// --- TYPES ---

export interface Year {
  _id: string;
  _type: 'year';
  year: number;
  title: string;
  slug: {
    current: string;
  };
  logo: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  email?: string;
  facebook?: string;
  description?: string;
}

export interface Author {
    _id: string;
    _type: 'author';
    name: string;
    email: string;
    picture?: {
        asset: {
            _ref: string;
            url: string;
        };
    };
    pictureURL?: string;
    role?: string;
}

export interface Author {
    _id: string;
    _type: 'author';
    name: string;
    email: string;
    picture?: {
        asset: {
            _ref: string;
            url: string;
        };
    };
    pictureURL?: string;
    role?: string;
    institute?: string;
}


export interface WorkingGroup {
  _id: string;
  _type: 'workingGroup';
  title: string;
  slug: {
    current: string;
  };
  year: Year;
  description?: string;
  content?: PortableTextBlock[];
  mainImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  mainImageURL?: string;
  members?: Author[];
  establishedDate?: string;
  status: 'active' | 'inactive' | 'on-hold';
  articles?: {
    _id: string;
    title: string;
    slug?: { current: string };
    authors?: { name: string }[];
    summary: string;
    mainImage: { asset: { _ref: string; url: string; } };
    authorListPrefix?: string;
    buttonText?: string;
    hasBody?: boolean;
  }[];
}

export interface Article {
  _id: string;
  _type: 'article';
  title: string;
  slug?: {
    current: string;
  };
  mainImage?: string; // The query renames this to a URL string
  authorListPrefix?: string;
  year: Year;
  summary: string;
  hasBody?: boolean;
  buttonText?: string;
  authors?: Author[];
  workingGroups?: WorkingGroup[];
  // The body can be complex, so we'll use 'any' for now on the client side
  body?: any[]; 
}

export interface Page {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: PortableTextBlock[];
}

// --- FETCH FUNCTIONS ---

export async function getYears(): Promise<Year[]> {
  return client.fetch(
    groq`*[_type == "year"] | order(year desc) {
      _id,
      year,
      title,
      slug,
      logo
    }`
  );
}

export const getYearBySlug = async (slug: string): Promise<Year> => {

  return client.fetch(
    groq`*[_type == "year" && slug.current == $slug][0]{
      _id,
      year,
      title,
      slug,
      logo,
      email,
      facebook,
      description
    }`,
    { slug }
  );
};


export async function getAuthorsByYear(yearId?: string): Promise<Author[]> {
    const params: { yearId?: string } = {};
    let query = `*[_type == "author"`;

    if (yearId) {
        query += ` && year._ref == $yearId`;
        params.yearId = yearId;
    }

    query += `] | order(name asc) {
        _id,
        name,
        institute,
        picture { asset-> { _ref, url } },
        "pictureURL": picture.asset->url
    }`;
    
    return client.fetch(groq`${query}`, params);
}

export async function getWorkingGroups(yearId?: string): Promise<WorkingGroup[]> {
    const params: { yearId?: string } = {};
    let query = `*[_type == "workingGroup"`;

    if (yearId) {
        query += ` && year._ref == $yearId`;
        params.yearId = yearId;
    }

    query += `] | order(title asc) {
        _id,
        title,
        slug,
        "year": year->,
        description,
        mainImage { asset-> { _ref, url } },
        "mainImageURL": mainImage.asset->url,
        "members": members[]->{ name, picture { asset->{_ref, url} }, "pictureURL": picture.asset->url, role },
        establishedDate,
        status,
        "articles": *[_type == "article" && ^._id in workingGroups[]._ref] | order(title asc) {
          _id,
          title,
          slug,
          summary,
          mainImage { asset-> { _ref, url } },
          authorListPrefix,
          buttonText,
          hasBody,
          "authors": authors[]->{name}
        }
    }`;
    
    return client.fetch(groq`${query}`, params);
}

export async function getWorkingGroup(slug: string): Promise<WorkingGroup | null> {
    return client.fetch(
      groq`*[_type == "workingGroup" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        "year": year->,
        description,
        content,
        mainImage { asset-> { _ref, url } },
        "mainImageURL": mainImage.asset->url,
        "members": members[]->{ name, email, role, picture { asset->{_ref, url} }, "pictureURL": picture.asset->url },
        establishedDate,
        status
      }`,
      { slug }
    );
}

export async function getArticles(yearId?: string): Promise<Article[]> {
    const params: { yearId?: string } = {};
    let query = `*[_type == "post"`;

    if (yearId) {
        query += ` && year._ref == $yearId`;
        params.yearId = yearId;
    }

    query += `] | order(publishedAt desc) {
        _id,
        title,
        slug,
        "year": year->,
        mainImage { asset-> { _ref, url } },
        "mainImageURL": mainImage.asset->url,
        "authors": authors[]->{ name, picture { asset->{_ref, url} }, "pictureURL": picture.asset->url },
        publishedAt
    }`;

    return client.fetch(groq`${query}`, params);
}

export async function getArticle(slug: string): Promise<Article | null> {
    return client.fetch(
      groq`*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        "year": year->,
        body,
        mainImage { asset-> { _ref, url } },
        "mainImageURL": mainImage.asset->url,
        "authors": authors[]->{ name, email, role, picture { asset->{_ref, url} }, "pictureURL": picture.asset->url },
        "workingGroups": workingGroups[]->{ title, slug },
        publishedAt
      }`,
      { slug }
    );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    return client.fetch(
      groq`*[_type == "article" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        summary,
        authorListPrefix,
        "authors": authors[]->{ name },
        "mainImage": mainImage.asset->url,
        body[]{
          ...,
          _type == "imageObject" => {
            "asset": asset->
          },
          _type == "posterObject" => {
            "asset": asset->
          },
          _type == "pdfFile" => {
            "asset": asset->{url, originalFilename}
          }
        }
      }`,
      { slug }
    );
}