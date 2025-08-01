import Link from "next/link";
import Image from "next/image";
import { getWorkingGroups, getYearBySlug, urlFor } from "@/sanity/sanity-utils";
import { Metadata } from "next";

export const revalidate = 0;

type Props = {
  params: Promise<{ year: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return {
    title: `Themes - ${yearData?.title || "URField Lab"}`,
    description: "Explore the themes and working groups of the URField Lab.",
  };
}

export default async function WorkingGroupsPage({ params }: Props) {
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
            <h1 className="text-4xl sm:text-5xl font-bold">Themes</h1>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full bg-gray-900 text-white py-8 px-4 sm:px-0 flex justify-center">
        <p className="max-w-2xl text-lg text-center">
          Each week has several guiding themes. Attendees, however, are also
          encouraged to propose new themes, bring their own projects or,
          support the work of other participants.
        </p>
      </div>

      <main className="w-full bg-gray-50 dark:bg-gray-800/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {workingGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No themes found for this year.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add working groups through the{" "}
                <Link
                  href="/studio"
                  className="text-cyan-600 hover:text-cyan-800"
                >
                  Content Management System
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {workingGroups.map((group) => (
                <div
                  key={group._id}
                  className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {group.mainImage && (
                    <div className="relative w-full h-56">
                      <Image
                        src={urlFor(group.mainImage).width(600).height(400).url()}
                        alt={group.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-cyan-500 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                        {group.icon?.asset?.url ? (
                          <Image src={group.icon.asset.url} alt={`${group.title} icon`} width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
                        ) : (
                          <span className="text-white font-bold text-lg">#</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {group.title}
                      </h2>
                    </div>
                    
                    {group.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        {group.description}
                      </p>
                    )}
                    <Link
                      href={`/${yearSlug}/outputs#wg-${group.slug.current}`}
                      className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 font-medium self-start mt-auto"
                    >
                      View Outputs »
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}