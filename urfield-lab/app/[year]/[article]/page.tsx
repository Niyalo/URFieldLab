import Image from "next/image";
import { getArticleBySlug, urlFor } from "@/sanity/sanity-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";

export const revalidate = 0;

type Props = {
  params: Promise<{ year: string; article: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article: articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article) {
    return { title: "Article not found" };
  }
  return {
    title: `${article.title} | URField Lab`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { article: articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);

  if (!article) {
    notFound();
  }

  const authorNames = article.authors?.map((author) => author.name).join(", ") || "";

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-800">
        {article.mainImage && (
          <Image
            src={urlFor(article.mainImage).url()}
            alt={`Cover for ${article.title}`}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
          <div className="text-left text-white p-8 sm:p-12 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">{article.title}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 italic">
            {/* By: {authorNames} */}
            {article.authorListPrefix || "By"}: {authorNames}
          </p>
        </div>

        <ArticleBody body={article.body || []} />
      </main>
    </div>
  );
}