import Link from "next/link";
import Image from "next/image";
import { getWorkingGroups, getYearBySlug, urlFor } from "@/sanity/sanity-utils";
import { Metadata } from "next";
import { Author } from "@/sanity/sanity-utils";

export const revalidate = 0;

type Props = {
  params: Promise<{ year: string }>;
};

// Helper for acronyms in Contents section
const formatAuthorsForContents = (authors: Pick<Author, 'name'>[] | undefined) => {
  if (!authors || authors.length === 0) return '';
  return authors.map(author => {
    const parts = author.name.split(' ');
    if (parts.length === 1) return author.name;
    const lastName = parts.pop();
    const initials = parts.map(part => `${part.charAt(0)}.`).join(' ');
    return `${initials} ${lastName}`;
  }).join(', ');
};

// Helper for full names in Details section
const formatAuthorsForDetails = (authors: Pick<Author, 'name'>[] | undefined) => {
  if (!authors || authors.length === 0) return '';
  return authors.map(author => author.name).join(', ');
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return {
    title: `Outputs - ${yearData?.title || "URField Lab"}`,
    description: "Explore the outputs and articles from the URField Lab.",
  };
}

export default async function OutputsPage({ params }: Props) {
  const { year: yearSlug } = await params;
  const yearData = await getYearBySlug(yearSlug);
  const workingGroups = await getWorkingGroups(yearData?._id);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 bg-gray-800">
        <Image
          src="/cropped-Week-4-6-copy3-2.jpg"
          alt="Team collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center">
          <div className="text-left text-white p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold">Outputs</h1>
          </div>
        </div>
      </div>

      <main className="w-full">
        {/* Contents Section */}
        <div className="w-full bg-gray-900 text-white py-12 px-4 sm:px-8">
          <h2 className="text-4xl font-bold text-center uppercase tracking-wider">
            Contents
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workingGroups.map((group) => (
              <div key={group._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center mb-5">
                  <div className="flex-shrink-0 bg-cyan-500 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 border-b-2 border-cyan-500 pb-1">
                    <Link href={`#wg-${group.slug.current}`} className="hover:text-cyan-600">
                      {group.title}
                    </Link>
                  </h3>
                </div>
                <div className="space-y-5">
                  {group.articles && group.articles.length > 0 ? (
                    group.articles.map((article) => (
                      <div key={article._id}>
                        <Link href={`#article-${article.slug?.current}`} className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 underline decoration-from-font">
                          {article.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                          {formatAuthorsForContents(article.authors)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No articles for this group.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output Details Section */}
        <div className="w-full bg-gray-900 text-white py-12 px-4 sm:px-8">
          <h2 className="text-4xl font-bold text-center uppercase tracking-wider">
            Output Details
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900/95">
          {workingGroups.map((group, groupIndex) => (
            group.articles && group.articles.length > 0 && (
              <section key={group._id} id={`wg-${group.slug.current}`} className="py-16 sm:py-24 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
                {group.title}
              </h3>
              <div className="space-y-20">
                {group.articles.map((article, articleIndex) => {
                  // Determine if this group is even (1-based index)
                  const isEvenGroup = (groupIndex + 1) % 2 === 0;
                  // For even groups, reverse the order
                  const textOrder = isEvenGroup ? "md:order-2" : "md:order-1";
                  const imageOrder = isEvenGroup ? "md:order-1" : "md:order-2";
                  return (
                <div key={article._id} id={`article-${article.slug?.current}`} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className={textOrder}>
                    <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {article.title}
                    </h4>
                    <p className="text-md text-gray-600 dark:text-gray-400 italic mt-2">
                      {article.authorListPrefix || 'By'} {formatAuthorsForDetails(article.authors)}
                    </p>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {article.summary}
                    </p>
                    {article.hasBody && article.slug && (
                      <Link href={`/${yearSlug}/${article.slug.current}`} className="mt-6 inline-block bg-cyan-500 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors">
                      {article.buttonText || 'Read More'}
                      </Link>
                    )}
                  </div>
                  <div className={imageOrder}>
                    {article.mainImage && (
                      <Image
                    src={urlFor(article.mainImage).width(800).height(600).url()}
                    alt={`Cover image for ${article.title}`}
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg object-cover"
                      />
                    )}
                  </div>
                </div>
                  );
                })}
              </div>
            </div>
              </section>
            )
          ))}
        </div>
      </main>
    </div>
  );
}