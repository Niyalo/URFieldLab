"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getContentGroups, getWorkingGroups, getYearBySlug, urlFor } from "@/sanity/sanity-utils";
import { Author, WorkingGroup, ContentGroup, Year } from "@/sanity/sanity-utils";
import ArticlePreview from "@/components/ArticlePreview";
import CollapsibleSection from '@/components/CollapsibleSection';

// export const revalidate = 0; // "use client" components cannot be dynamically rendered

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

// Metadata generation needs to be moved to a generateMetadata function if this page remains a server component.
// Since we are converting to a client component for state, we can't use generateMetadata directly here.
// For this to work, you might need to fetch data in a parent Server Component and pass it down,
// or handle metadata differently for client components (e.g., in the layout).
// For now, I will comment out the metadata function as it won't work in a "use client" file.

/*
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return {
    title: `Outputs - ${yearData?.title || "URField Lab"}`,
    description: "Explore the outputs and articles from the URField Lab.",
  };
}
*/

export default function OutputsPage({ params }: Props) {
  const [yearSlug, setYearSlug] = useState<string>('');
  const [yearData, setYearData] = useState<Year | null>(null);
  const [workingGroups, setWorkingGroups] = useState<WorkingGroup[]>([]);
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([]);
  const [openContents, setOpenContents] = useState<Record<string, boolean>>({});
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setYearSlug(resolvedParams.year);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!yearSlug) return;
    
    const fetchData = async () => {
      const year = await getYearBySlug(yearSlug);
      setYearData(year);
      if (year) {
        const wg = await getWorkingGroups(year._id);
        const cg = await getContentGroups(year._id);
        setWorkingGroups(wg);
        setContentGroups(cg);

        // Default all details sections to be open
        const allDetails = [...wg, ...cg].reduce((acc, group) => {
          acc[group._id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setOpenDetails(allDetails);
      }
    };
    fetchData();
  }, [yearSlug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleContent = (id: string) => {
    setOpenContents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDetail = (id: string) => {
    setOpenDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          src={yearData?.heroImageURL || (yearData?.heroImage ? urlFor(yearData.heroImage).url() : "/cropped-Week-4-6-copy3-2.jpg")}
          alt="Team collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center">
          <div className="text-left text-white p-8 sm:p-12 md:p-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(0, 0, 0, 0.3), 2px -2px 4px rgba(0, 0, 0, 0.3), -2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>Outputs</h1>
          </div>
        </div>
      </div>

      <main className="w-full max-w-full mx-auto lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Left Panel: Contents (Sticky on large screens) */}
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-16 lg:pr-4">
          <div className="w-full bg-gray-900 text-white py-8 px-4 sm:px-8 lg:hidden">
            <h2 className="text-3xl font-bold text-center uppercase tracking-wider">
              Contents
            </h2>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 lg:p-0 lg:bg-transparent lg:dark:bg-transparent">
            <h2 className="hidden lg:block text-2xl font-bold uppercase tracking-wider mb-6 text-gray-700 dark:text-gray-300 text-center">
              Contents
            </h2>
            {/* Working Groups Contents */}
            {workingGroups.map((group) => (
              <CollapsibleSection
                key={group._id}
                isOpen={!!openContents[group._id]}
                onToggle={() => toggleContent(group._id)}
                titleClassName="py-4 px-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md"
                contentClassName="pt-2 pb-4"
                title={
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-cyan-500 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                      {group.icon?.asset?.url ? (
                        <Image src={group.icon.asset.url} alt={`${group.title} icon`} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-base font-semibold uppercase tracking-wide">
                      {group.title}
                    </h3>
                  </div>
                }
              >
                <div className="space-y-4 pl-14">
                  {group.articles && group.articles.length > 0 ? (
                    group.articles.map((article) => (
                      <div key={article._id}>
                        <Link href={`#article-${article.slug?.current}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 underline decoration-from-font">
                          {article.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400/80 italic mt-1">
                          {formatAuthorsForContents(article.authors)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 pl-14">
                      No articles for this group.
                    </p>
                  )}
                </div>
              </CollapsibleSection>
            ))}

            {/* Content Groups Contents */}
            {contentGroups.map((group) => (
              <CollapsibleSection
                key={group._id}
                isOpen={!!openContents[group._id]}
                onToggle={() => toggleContent(group._id)}
                titleClassName="py-4 px-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md"
                contentClassName="pt-2 pb-4"
                title={
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                      {group.icon?.asset?.url ? (
                        <Image src={group.icon.asset.url} alt={`${group.title} icon`} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-base font-semibold uppercase tracking-wide">
                      {group.title}
                    </h3>
                  </div>
                }
              >
                <div className="space-y-4 pl-14">
                  {(group.doors && group.doors.length > 0) || (group.articles && group.articles.length > 0) ? (
                    <>
                      {group.doors?.map((door) => (
                        <div key={door._id}>
                          <Link href={`#door-${door._id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font">
                            {door.title}
                          </Link>
                        </div>
                      ))}
                      {group.articles?.map((article) => (
                        <div key={article._id}>
                          <Link href={`#article-${article.slug?.current}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font">
                            {article.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400/80 italic mt-1">
                            {formatAuthorsForContents(article.authors)}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 pl-14">
                      No content for this group.
                    </p>
                  )}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </aside>

        {/* Right Panel: Output Details */}
        <div className="lg:col-span-8 xl:col-span-9 py-16">
          {/* Output Details Section - Working Groups */}
          <div className="space-y-8">
            {workingGroups.map((group, groupIndex) => (
              group.articles && group.articles.length > 0 && (
                <section key={group._id} id={`wg-${group.slug.current}`} className="bg-white dark:bg-gray-900/95 rounded-lg shadow-sm overflow-hidden">
                  <CollapsibleSection
                    isOpen={!!openDetails[group._id]}
                    onToggle={() => toggleDetail(group._id)}
                    className="border-b-0"
                    titleClassName="p-6 sm:p-8 bg-gray-50 dark:bg-gray-900/50"
                    contentClassName="px-4 sm:px-6 lg:px-8 pt-8 pb-12"
                    title={
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                        {group.title}
                      </h3>
                    }
                  >
                    <div className="max-w-7xl mx-auto">
                      <div className="space-y-20">
                        {group.articles.map((article) => {
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
                  </CollapsibleSection>
                </section>
              )
            ))}
          </div>

          {/* Output Details Section - Content Groups */}
          <div className="mt-16 space-y-8">
            {contentGroups.map((group) => (
              (group.articles && group.articles.length > 0) || (group.doors && group.doors.length > 0) ? (
                <div key={group._id} id={`cg-${group.slug.current}`} className="bg-white dark:bg-gray-900/95 rounded-lg shadow-sm overflow-hidden">
                  <CollapsibleSection
                    isOpen={!!openDetails[group._id]}
                    onToggle={() => toggleDetail(group._id)}
                    className="border-b-0"
                    titleClassName="p-6 sm:p-8 bg-purple-800 dark:bg-purple-900/80"
                    contentClassName="pt-8 pb-12"
                    title={
                      <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-purple-100 tracking-tight">
                        {group.title}
                      </h2>
                    }
                  >
                    <section>
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
                  </CollapsibleSection>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="lg:hidden fixed bottom-8 right-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 shadow-lg transition-opacity duration-300"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}