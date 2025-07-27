import Link from "next/link";
import Image from "next/image";
import { getContentGroups, getWorkingGroups, getYearBySlug, urlFor } from "@/sanity/sanity-utils";
import { Metadata } from "next";
import { Author, Door } from "@/sanity/sanity-utils";
import ArticlePreview from "@/components/ArticlePreview";

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
  const contentGroups = await getContentGroups(yearData?._id);

  const doorStyles = [
    { bg: 'bg-white dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200', button: 'border-orange-500 hover:bg-orange-500/10 text-gray-700 dark:text-gray-300 dark:hover:bg-orange-500/20', iconFilter: '' },
    { bg: 'bg-orange-500', text: 'text-white', button: 'border-white hover:bg-white/20 text-white', iconFilter: 'brightness-0 invert' },
    { bg: 'bg-gray-800 dark:bg-gray-900', text: 'text-white', button: 'border-yellow-400 hover:bg-yellow-400/20 text-white', iconFilter: 'invert(92%) sepia(24%) saturate(3137%) hue-rotate(345deg) brightness(105%) contrast(98%)' }, // Approximates gold color for SVG
  ];

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
          {/* Working Groups Contents */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workingGroups.map((group) => (
              <div key={group._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center mb-5">
                  <div className="flex-shrink-0 bg-cyan-500 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                    {group.icon?.asset?.url ? (
                      <Image src={group.icon.asset.url} alt={`${group.title} icon`} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
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

          {/* Content Groups Contents */}
          {contentGroups.length > 0 && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {contentGroups.map((group) => (
                <div key={group._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="flex-shrink-0 bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                      {group.icon?.asset?.url ? (
                        <Image src={group.icon.asset.url} alt={`${group.title} icon`} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 border-b-2 border-purple-500 pb-1">
                      <Link href={`#cg-${group.slug.current}`} className="hover:text-purple-600">
                        {group.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="space-y-5">
                    {(group.doors && group.doors.length > 0) || (group.articles && group.articles.length > 0) ? (
                      <>
                        {group.doors?.map((door) => (
                          <div key={door._id}>
                            <Link href={`#door-${door._id}`} className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font">
                              {door.title}
                            </Link>
                          </div>
                        ))}
                        {group.articles?.map((article) => (
                          <div key={article._id}>
                            <Link href={`#article-${article.slug?.current}`} className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font">
                              {article.title}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                              {formatAuthorsForContents(article.authors)}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No content for this group.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output Details Section - Working Groups */}
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
                  const isEvenGroup = (groupIndex + 1) % 2 === 0;
                  const textOrder = isEvenGroup ? "md:order-2" : "md:order-1";
                  const imageOrder = isEvenGroup ? "md:order-1" : "md:order-2";
                  
                  return (
                    <ArticlePreview
                      key={article._id}
                      article={article}
                      yearSlug={yearSlug}
                      imageOrder={imageOrder}
                      textOrder={textOrder}
                    />
                  );
                })}
              </div>
            </div>
              </section>
            )
          ))}
        </div>

        {/* Output Details Section - Content Groups */}
        {contentGroups.map((group) => (
          (group.articles && group.articles.length > 0) || (group.doors && group.doors.length > 0) ? (
            <div key={group._id} id={`cg-${group.slug.current}`}>
              <div className="w-full bg-gray-900 text-white py-12 px-4 sm:px-8">
                <h2 className="text-4xl font-bold text-center uppercase tracking-wider">
                  {group.title}
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900/95">
                <section className="py-16 sm:py-24">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Doors Section */}
                    {group.doors && group.doors.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {group.doors.map((door, index) => {
                          const style = doorStyles[index % doorStyles.length];
                          return (
                            <div key={door._id} id={`door-${door._id}`} className={`flex flex-col p-8 rounded-lg shadow-lg ${style.bg} ${style.text}`}>
                              {door.icon?.asset?.url && (
                                <div className="h-12 mb-4 flex items-start">
                                  <Image
                                    src={door.icon.asset.url}
                                    alt={`${door.title} icon`}
                                    height={48}
                                    width={0}
                                    style={{ width: 'auto', height: '100%', filter: style.iconFilter }}
                                  />
                                </div>
                              )}
                              <h4 className="text-2xl font-bold mb-3">{door.title}</h4>
                              <p className="flex-grow mb-6">{door.summary}</p>
                              <div className="flex flex-col space-y-3">
                                {door.externalLinks?.map(link => (
                                  <Link key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={`text-center font-semibold py-2 px-4 border-2 rounded-md transition-colors ${style.button}`}>
                                    {link.buttonText}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Articles Section */}
                    <div className="space-y-20">
                      {group.articles && group.articles.map((article, articleIndex) => {
                        const isEvenArticle = (articleIndex + 1) % 2 === 0;
                        const textOrder = isEvenArticle ? "md:order-2" : "md:order-1";
                        const imageOrder = isEvenArticle ? "md:order-1" : "md:order-2";

                        return (
                          <ArticlePreview
                            key={article._id}
                            article={article}
                            yearSlug={yearSlug}
                            imageOrder={imageOrder}
                            textOrder={textOrder}
                          />
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : null
        ))}
      </main>
    </div>
  );
}