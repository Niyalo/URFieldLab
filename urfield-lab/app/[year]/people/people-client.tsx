'use client';

import { Author } from "@/sanity/sanity-utils";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthorDetailsAction } from "./actions";

interface PeopleClientPageProps {
  authors: Author[];
}

export default function PeopleClientPage({ authors }: PeopleClientPageProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const handleAuthorClick = async (authorId: string) => {
    // Set a temporary author object to open the modal immediately
    const tempAuthor = authors.find(a => a._id === authorId);
    setSelectedAuthor(tempAuthor || null);
    setIsModalLoading(true);
    
    const details = await getAuthorDetailsAction(authorId);
    if (details) {
      setSelectedAuthor(details);
    } else {
      // Handle error case, e.g., show a message or close the modal
      setSelectedAuthor(null);
      alert("Could not load author details.");
    }
    setIsModalLoading(false);
  };

  const closeModal = () => {
    setSelectedAuthor(null);
  };

  useEffect(() => {
    // Lock scrolling when modal is open
    if (selectedAuthor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedAuthor]);

  return (
    <>
      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {authors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No people found for this year.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {authors.map((author) => (
              <button
                key={author._id}
                onClick={() => handleAuthorClick(author._id)}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-center block w-full text-left"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  {author.pictureURL ? (
                    <>
                      <Image
                        src={author.pictureURL}
                        alt={`Picture of ${author.name}`}
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 w-full px-4 pb-3 pt-6 flex flex-col items-center justify-end"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)" }}
                      >
                        <h2 className="text-lg font-semibold text-white drop-shadow">
                          {author.name}
                        </h2>
                        {author.institute && (
                          <p className="text-sm italic text-gray-200 drop-shadow mt-0.5">
                            {author.institute}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Author Modal */}
      {selectedAuthor && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative transform transition-all duration-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Spinner */}
            {isModalLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            )}

            {/* Left Side: Bio */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 self-center flex-shrink-0">
                <Image src={selectedAuthor.pictureURL!} alt={selectedAuthor.name} fill className="object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">{selectedAuthor.name}</h2>
              <p className="text-md italic text-center text-gray-500 dark:text-gray-400 mb-6">{selectedAuthor.institute}</p>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>{selectedAuthor.bio || "No biography available."}</p>
              </div>
            </div>

            {/* Right Side: Articles */}
            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900/50 p-8 overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-orange-500 pb-2">Contributions</h3>
              {selectedAuthor.articles && selectedAuthor.articles.length > 0 ? (
                <ul className="space-y-3">
                  {selectedAuthor.articles.map(article => (
                    <li key={article._id}>
                      <Link
                        href={`/${article.year.slug.current}/outputs#article-${article.slug?.current}`}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        onClick={closeModal}
                      >
                        <span>{article.title}</span>
                        <span className="ml-4 flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                          &gt;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No articles by this author.</p>
              )}
            </div>
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}