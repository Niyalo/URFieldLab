import { getAuthorsByYear, getYearBySlug } from "@/sanity/sanity-utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

type Props = {
  params: Promise<{ year: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return {
    title: `The People - ${yearData?.title || "URField Lab"}`,
    description: `Meet the participants, researchers, and coordinators of ${
      yearData?.title || "the URField Lab"
    }.`,
  };
}

export default async function PeoplePage({ params }: Props) {
  const { year: yearSlug } = await params;
  const yearData = await getYearBySlug(yearSlug);
  const authors = await getAuthorsByYear(yearData?._id);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 bg-gray-800">
        <Image
          src="/cropped-Week-4-6-copy3-2.jpg" // Placeholder image
          alt="Group of participants"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center">
          <div className="text-left text-white p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold">The People</h1>
  
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {authors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No people found for this year.</p>
            <p className="text-sm text-gray-400 mt-2">
              Add participants through the{" "}
              <Link
                href="/studio"
                className="text-blue-600 hover:text-blue-800"
              >
                Content Management System
              </Link>
            </p>
          </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {authors.map((author) => (
              <div
                key={author._id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-center"
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
                      {/* Gradient overlay and text */}
                      <div className="absolute bottom-0 left-0 w-full px-4 pb-3 pt-6 flex flex-col items-center justify-end"
                        style={{
                          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)"
                        }}
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}