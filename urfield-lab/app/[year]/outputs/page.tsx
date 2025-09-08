"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getContentGroups, getWorkingGroups, getYearBySlug, urlFor, getAuthorsForFilter } from "@/sanity/sanity-utils";
import { Author, WorkingGroup, ContentGroup, Year } from "@/sanity/sanity-utils";
import ArticlePreview from "@/components/ArticlePreview";
import CollapsibleSection from '@/components/CollapsibleSection';
import Select from 'react-select';
import { StylesConfig } from 'react-select';

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
  const [allAuthors, setAllAuthors] = useState<{ value: string; label: string }[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<{ value: string; label: string }[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const initialHash = useRef<string>('');

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const element = document.querySelector(hash) as HTMLElement;
    if (element) {
      // Find the main header to dynamically get its height for an accurate offset.
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 96; // Fallback to 6rem/96px
      const safetyPadding = 16; // 1rem of extra space for visual comfort

      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementTop - headerHeight - safetyPadding,
        behavior: 'smooth'
      });
      
      // Update URL without triggering a page reload
      window.history.pushState(null, '', hash);
    }
  };

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setYearSlug(resolvedParams.year);
      // Store the hash only on the initial load
      if (typeof window !== 'undefined') {
        initialHash.current = window.location.hash;
      }
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
        const authors = await getAuthorsForFilter(year._id);
        
        setWorkingGroups(wg);
        setContentGroups(cg);
        setAllAuthors(authors.map(a => ({ value: a._id, label: a.name })));

        // Default all details sections to be open
        const allDetails = [...wg, ...cg].reduce((acc, group) => {
          acc[group._id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setOpenDetails(allDetails);
      }
      // Data fetching is complete
      setIsInitialLoading(false);
    };
    fetchData();
  }, [yearSlug]);

  const { filteredWorkingGroups, filteredContentGroups } = useMemo(() => {
    if (selectedAuthors.length === 0) {
      return { filteredWorkingGroups: workingGroups, filteredContentGroups: contentGroups };
    }

    const authorIds = new Set(selectedAuthors.map(a => a.value));

    const filterGroupArticles = <T extends WorkingGroup | ContentGroup>(groups: T[]): T[] => {
      return groups
        .map(group => {
          const filteredArticles = group.articles?.filter(article =>
            article.authors?.some(author => authorIds.has(author._id))
          );
          return { ...group, articles: filteredArticles };
        })
        .filter(group => (group.articles && group.articles.length > 0) || (group.doors && group.doors.length > 0)); // Keep groups if they have doors, even if articles are filtered out
    };

    return {
      filteredWorkingGroups: filterGroupArticles(workingGroups),
      filteredContentGroups: filterGroupArticles(contentGroups),
    };
  }, [selectedAuthors, workingGroups, contentGroups]);

  // Effect to scroll to hash after content is rendered
  useEffect(() => {
    if (isInitialLoading || !initialHash.current) return;

    const hash = initialHash.current;

    // A minimal delay to ensure the initial DOM render is complete before we start checking.
    const timer = setTimeout(() => {
      const element = document.querySelector(hash) as HTMLElement;
      if (!element) {
        initialHash.current = '';
        return;
      }

      // --- Iterative Scroll Correction Loop ---
      
      let stabilityCounter = 0;
      const STABILITY_THRESHOLD = 10; // Frames to be stable before stopping.
      let maxChecks = 120; // Failsafe: stop after ~2 seconds.
      let animationFrameId: number;

      const correctScrollPosition = () => {
        // Stop if we've run out of checks or the element has been removed from the page.
        if (maxChecks-- <= 0 || !document.body.contains(element)) {
          initialHash.current = '';
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          return;
        }

        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 96;
        const safetyPadding = 16;
        const expectedTop = headerHeight + safetyPadding;
        
        const currentTop = element.getBoundingClientRect().top;
        const difference = expectedTop - currentTop;

        // If the element is not in the correct position (with a 1px tolerance).
        if (Math.abs(difference) > 1) {
          // Adjust the scroll position by the difference.
          window.scrollBy(0, -difference);
          // Reset the stability counter because we made an adjustment.
          stabilityCounter = 0;
        } else {
          
          // The position is correct, so we increment the stability counter.
          stabilityCounter++;
        }

        // If the position has been stable for the required number of frames, we're done.
        if (stabilityCounter >= STABILITY_THRESHOLD) {
          initialHash.current = '';
          return; // Exit the loop
        }

        // Request the next frame to continue the loop.
        animationFrameId = requestAnimationFrame(correctScrollPosition);
      };

      // Start the correction loop.
      animationFrameId = requestAnimationFrame(correctScrollPosition);
      
      // Cleanup function to cancel the loop if the component unmounts.
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, 100);

    return () => clearTimeout(timer);

  }, [isInitialLoading, filteredWorkingGroups, filteredContentGroups]); // Rerun when data changes

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

  const selectStyles: StylesConfig = {
    control: (base) => ({ ...base, backgroundColor: 'var(--select-bg)', borderColor: 'var(--select-border)', boxShadow: 'none', '&:hover': { borderColor: 'var(--select-border-hover)' } }),
    menu: (base) => ({ ...base, backgroundColor: 'var(--select-menu-bg)' }),
    option: (base, { isFocused, isSelected }) => ({ ...base, backgroundColor: isSelected ? 'var(--select-option-selected-bg)' : isFocused ? 'var(--select-option-hover-bg)' : 'transparent', color: 'var(--select-option-color)', ':active': { backgroundColor: 'var(--select-option-selected-bg)' } }),
    multiValue: (base) => ({ ...base, backgroundColor: 'var(--select-multi-bg)' }),
    multiValueLabel: (base) => ({ ...base, color: 'var(--select-multi-label-color)' }),
    multiValueRemove: (base) => ({ ...base, color: 'var(--select-multi-remove-color)', ':hover': { backgroundColor: 'var(--select-multi-remove-hover-bg)', color: 'var(--select-multi-remove-hover-color)' } }),
    input: (base) => ({ ...base, color: 'var(--select-input-color)' }),
    placeholder: (base) => ({ ...base, color: 'var(--select-placeholder-color)' }),
  };

  return (
    <div className="font-sans [--select-bg:white] [--select-border:hsl(0,0%,80%)] [--select-border-hover:hsl(0,0%,70%)] [--select-menu-bg:white] [--select-option-hover-bg:#deebff] [--select-option-selected-bg:#2684ff] [--select-option-color:inherit] [--select-multi-bg:#e6e6e6] [--select-multi-label-color:inherit] [--select-multi-remove-color:#8c8c8c] [--select-multi-remove-hover-bg:#ff8f8f] [--select-multi-remove-hover-color:white] [--select-input-color:inherit] [--select-placeholder-color:hsl(0,0%,50%)] dark:[--select-bg:#2d3748] dark:[--select-border:#4a5568] dark:[--select-border-hover:#718096] dark:[--select-menu-bg:#2d3748] dark:[--select-option-hover-bg:#4a5568] dark:[--select-option-selected-bg:#4299e1] dark:[--select-multi-bg:#4a5568] dark:[--select-multi-label-color:white] dark:[--select-multi-remove-color:#a0aec0] dark:[--select-multi-remove-hover-bg:#e53e3e] dark:[--select-multi-remove-hover-color:white] dark:[--select-input-color:white] dark:[--select-placeholder-color:#a0aec0]">
      {/* Loading Overlay */}
      {isInitialLoading && initialHash.current && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading article...</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 bg-gray-800 -top-[80px] -mb-[80px]">
        <Image
          src={yearData?.heroImageURL || (yearData?.heroImage ? urlFor(yearData.heroImage).url() : "/cropped-Week-4-6-copy3-2.jpg")}
          alt="Team collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center w-full">
          <div className="container mx-auto flex text-left text-white p-8 sm:p-12 md:p-16 pl-0 sm:pl-0 md:pl-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(0, 0, 0, 0.3), 2px -2px 4px rgba(0, 0, 0, 0.3), -2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>Outputs</h1>
          </div>
        </div>
      </div>

      <main className="w-full max-w-full mx-auto lg:grid lg:grid-cols-12 lg:gap-12 pt-24">
        {/* Left Panel: Contents (Sticky on large screens) */}
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:py-16 lg:pr-4">
          <div className="w-full bg-gray-900 text-white py-8 px-4 sm:px-8 lg:hidden">
            <h2 className="text-3xl font-bold text-center uppercase tracking-wider">
              Contents
            </h2>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 lg:p-0 lg:bg-transparent lg:dark:bg-transparent">
            <h2 className="hidden lg:block text-2xl font-bold uppercase tracking-wider mb-6 text-gray-700 dark:text-gray-300 text-center">
              Contents
            </h2>
            <div className="mb-6 px-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="author-filter-select">Filter by Author</label>
              <Select
                instanceId="author-filter-select"
                isMulti
                options={allAuthors}
                value={selectedAuthors}
                onChange={(selected) => setSelectedAuthors((selected || []) as { value: string; label: string }[])}
                placeholder="All Authors"
                styles={selectStyles}
                className="text-sm"
              />
            </div>
            {/* Working Groups Contents */}
            {filteredWorkingGroups.map((group) => (
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
                        <a 
                          href={`#article-${article._id}`} 
                          onClick={(e) => handleAnchorClick(e, `#article-${article._id}`)}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 underline decoration-from-font cursor-pointer"
                        >
                          {article.title}
                        </a>
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
            {filteredContentGroups.map((group) => (
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
                          <a 
                            href={`#door-${door._id}`} 
                            onClick={(e) => handleAnchorClick(e, `#door-${door._id}`)}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font cursor-pointer"
                          >
                            {door.title}
                          </a>
                        </div>
                      ))}
                      {group.articles?.map((article) => (
                        <div key={article._id}>
                          <a 
                            href={`#article-${article._id}`} 
                            onClick={(e) => handleAnchorClick(e, `#article-${article._id}`)}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-from-font cursor-pointer"
                          >
                            {article.title}
                          </a>
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
            {filteredWorkingGroups.map((group, groupIndex) => (
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
                            <div key={article._id} id={`article-${article._id}`} className="scroll-mt-24">
                              <ArticlePreview
                                article={article}
                                yearSlug={yearSlug}
                                imageOrder={imageOrder}
                                textOrder={textOrder}
                              />
                            </div>
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
            {filteredContentGroups.map((group) => (
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
                              <div key={article._id} id={`article-${article._id}`} className="scroll-mt-24">
                                <ArticlePreview
                                  article={article}
                                  yearSlug={yearSlug}
                                  imageOrder={imageOrder}
                                  textOrder={textOrder}
                                />
                              </div>
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