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
  themeColor?: {
    hex: string;
  };
  pageTitle?: string;
  heroImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  heroImageURL?: string;
  contentDescription?: string;
  keyValues?: {
    themes?: {
      title: string;
      description: string;
      icon?: {
        asset: {
          _ref: string;
          url: string;
        };
      };
      iconURL?: string;
    };
    outputs?: {
      title: string;
      description: string;
      icon?: {
        asset: {
          _ref: string;
          url: string;
        };
      };
      iconURL?: string;
    };
    people?: {
      title: string;
      description: string;
      icon?: {
        asset: {
          _ref: string;
          url: string;
        };
      };
      iconURL?: string;
    };
    eventStructure?: {
      title: string;
      description: string;
      icon?: {
        asset: {
          _ref: string;
          url: string;
        };
      };
      iconURL?: string;
    };
  };
  pageContent?: PageContentSection[];
}

export type PageContentSection = 
  | VideoSection
  | QuoteSection  
  | ProjectThemesSection
  | CategoriesSection
  | FeaturedOutputsSection
  | LogoViewsSection;

export interface VideoSection {
  _type: 'videoSection';
  _key: string;
  heading: string;
  title: string;
  linkText: string;
  linkHref: string;
  videoLink: string;
  backgroundImage: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  backgroundImageURL?: string;
  buttonTextColor?: {
    hex: string;
  };
}

export interface QuoteSection {
  _type: 'quoteSection';
  _key: string;
  quote: string;
  backgroundImage: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  backgroundImageURL?: string;
}

export interface ProjectThemesSection {
  _type: 'projectThemes';
  _key: string;
  title: string;
  description: string;
  titleHref?: string;
}

export interface CategoriesSection {
  _type: 'categories';
  _key: string;
  title: string;
  description: string;
  titleHref?: string;
  themes: ThemeItem[];
}

export interface ThemeItem {
  title: string;
  href: string;
  icon?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  iconURL?: string;
}

export interface FeaturedOutputsSection {
  _type: 'featuredOutputs';
  _key: string;
  title: string;
  outputs: OutputItem[];
}

export interface OutputItem {
  imageUrl: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  imageURL?: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface LogoViewsSection {
  _type: 'logoViews';
  _key: string;
  title: string;
  logos: LogoItem[];
}

export interface LogoItem {
  imageUrl: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  imageURL?: string;
  alt: string;
  linkUrl: string;
  width?: number;
  height?: number;
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
  icon?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  iconURL?: string;
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
  // The body can contain various content blocks
  body?: ContentBlock[]; 
}

export type ContentBlock = 
  | { _type: 'textBlock'; content: PortableTextBlock[] }
  | { _type: 'subheading'; text: string }
  | { _type: 'list'; items: string[] }
  | { _type: 'imageObject'; asset: SanityImageSource; caption?: string }
  | { _type: 'posterObject'; asset: SanityImageSource }
  | { _type: 'pdfFile'; asset: { url: string; originalFilename?: string } };

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
      description,
      themeColor,
      pageTitle,
      heroImage { asset-> { _ref, url } },
      "heroImageURL": heroImage.asset->url,
      contentDescription,
      keyValues {
        themes {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        outputs {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        people {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        eventStructure {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        }
      },
      pageContent[] {
        _type,
        _key,
        _type == "videoSection" => {
          heading,
          title,
          linkText,
          linkHref,
          videoLink,
          backgroundImage { asset-> { _ref, url } },
          "backgroundImageURL": backgroundImage.asset->url,
          buttonTextColor
        },
        _type == "quoteSection" => {
          quote,
          backgroundImage { asset-> { _ref, url } },
          "backgroundImageURL": backgroundImage.asset->url
        },
        _type == "projectThemes" => {
          title,
          description,
          titleHref
        },
        _type == "categories" => {
          title,
          description,
          titleHref,
          themes[] {
            title,
            href,
            icon { asset-> { _ref, url } },
            "iconURL": icon.asset->url
          }
        },
        _type == "featuredOutputs" => {
          title,
          outputs[] {
            imageUrl { asset-> { _ref, url } },
            "imageURL": imageUrl.asset->url,
            title,
            description,
            linkText,
            linkUrl
          }
        },
        _type == "logoViews" => {
          title,
          logos[] {
            imageUrl { asset-> { _ref, url } },
            "imageURL": imageUrl.asset->url,
            alt,
            linkUrl,
            width,
            height
          }
        }
      }
    }`,
    { slug }
  );
};

export const getYearPageData = async (slug: string): Promise<Year | null> => {
  return client.fetch(
    groq`*[_type == "year" && slug.current == $slug][0]{
      _id,
      year,
      title,
      slug,
      logo,
      email,
      facebook,
      description,
      themeColor,
      pageTitle,
      heroImage { asset-> { _ref, url } },
      "heroImageURL": heroImage.asset->url,
      contentDescription,
      keyValues {
        themes {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        outputs {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        people {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        },
        eventStructure {
          title,
          description,
          icon { asset-> { _ref, url } },
          "iconURL": icon.asset->url
        }
      },
      pageContent[] {
        _type,
        _key,
        _type == "videoSection" => {
          heading,
          title,
          linkText,
          linkHref,
          videoLink,
          backgroundImage { asset-> { _ref, url } },
          "backgroundImageURL": backgroundImage.asset->url,
          buttonTextColor
        },
        _type == "quoteSection" => {
          quote,
          backgroundImage { asset-> { _ref, url } },
          "backgroundImageURL": backgroundImage.asset->url
        },
        _type == "projectThemes" => {
          title,
          description,
          titleHref
        },
        _type == "categories" => {
          title,
          description,
          titleHref,
          themes[] {
            title,
            href,
            icon { asset-> { _ref, url } },
            "iconURL": icon.asset->url
          }
        },
        _type == "featuredOutputs" => {
          title,
          outputs[] {
            imageUrl { asset-> { _ref, url } },
            "imageURL": imageUrl.asset->url,
            title,
            description,
            linkText,
            linkUrl
          }
        },
        _type == "logoViews" => {
          title,
          logos[] {
            imageUrl { asset-> { _ref, url } },
            "imageURL": imageUrl.asset->url,
            alt,
            linkUrl,
            width,
            height
          }
        }
      }
    }`,
    { slug }
  );
};

export async function getAuthorById(authorId: string): Promise<Author | null> {
    return client.fetch(
      groq`*[_type == "author" && _id == $authorId][0]{
        _id,
        name,
        email,
        role,
        institute,
        "pictureURL": picture.asset->url
      }`,
      { authorId }
    );
}


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
        email,
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
        icon { asset-> { _ref, url } },
        "iconURL": icon.asset->url,
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
        icon { asset-> { _ref, url } },
        "iconURL": icon.asset->url,
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

export async function getArticlesByAuthor(authorId: string): Promise<Article[]> {
    return client.fetch(
      groq`*[_type == "article" && $authorId in authors[]._ref] | order(title asc) {
        _id,
        title,
        slug,
        "mainImage": mainImage.asset->{_id, url},
        "year": year->{_id, slug},
        "authors": authors[]->{_id, name},
        "workingGroups": workingGroups[]->{_id, title},
        summary,
        hasBody,
        buttonText,
        authorListPrefix,
        body[]{
          ...,
          _type == "imageObject" || _type == "posterObject" || _type == "pdfFile" => {
            "asset": asset->{_id, url, originalFilename}
          }
        }
      }`,
      { authorId }
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