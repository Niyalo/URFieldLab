import { client } from "../lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Types
export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  content: PortableTextBlock[];
  mainImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  mainImageURL?: string;
  categories?: Category[];
  workingGroups?: WorkingGroup[];
  publishedAt: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: PortableTextBlock[];
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface WorkingGroup {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  content?: PortableTextBlock[];
  mainImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  mainImageURL?: string;
  members?: Array<{
    name: string;
    role: string;
    email: string;
  }>;
  establishedDate?: string;
  status: 'active' | 'inactive' | 'on-hold';
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  children?: Array<{
    _type: string;
    text: string;
    marks?: string[];
  }>;
  style?: string;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
}

// Fetch all posts
export async function getPosts(): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      categories[]-> {
        _id,
        title,
        slug,
        description
      },
      workingGroups[]-> {
        _id,
        title,
        slug,
        description
      },
      publishedAt
    }`
  );
}

// Fetch single post by slug
export async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      categories[]-> {
        _id,
        title,
        slug,
        description
      },
      workingGroups[]-> {
        _id,
        title,
        slug,
        description
      },
      publishedAt
    }`,
    { slug }
  );
}

// Fetch all pages
export async function getPages(): Promise<Page[]> {
  return client.fetch(
    groq`*[_type == "page"] | order(title asc) {
      _id,
      title,
      slug,
      content
    }`
  );
}

// Fetch single page by slug
export async function getPage(slug: string): Promise<Page | null> {
  return client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      content
    }`,
    { slug }
  );
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  );
}

// Fetch single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  return client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description
    }`,
    { slug }
  );
}

// Fetch all working groups
export async function getWorkingGroups(): Promise<WorkingGroup[]> {
  return client.fetch(
    groq`*[_type == "workingGroup"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      members,
      establishedDate,
      status
    }`
  );
}

// Fetch single working group by slug
export async function getWorkingGroup(slug: string): Promise<WorkingGroup | null> {
  return client.fetch(
    groq`*[_type == "workingGroup" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      members,
      establishedDate,
      status
    }`,
    { slug }
  );
}

// Fetch posts by category
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      categories[]-> {
        _id,
        title,
        slug,
        description
      },
      workingGroups[]-> {
        _id,
        title,
        slug,
        description
      },
      publishedAt
    }`,
    { categorySlug }
  );
}

// Fetch posts by working group
export async function getPostsByWorkingGroup(workingGroupSlug: string): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "workingGroup" && slug.current == $workingGroupSlug]._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      mainImage {
        asset-> {
          _ref,
          url
        }
      },
      "mainImageURL": mainImage.asset->url,
      categories[]-> {
        _id,
        title,
        slug,
        description
      },
      workingGroups[]-> {
        _id,
        title,
        slug,
        description
      },
      publishedAt
    }`,
    { workingGroupSlug }
  );
}
