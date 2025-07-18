import Link from "next/link";
import Image from "next/image";
import { getWorkingGroups } from "@/sanity/sanity-utils";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Working Groups - URField Lab",
  description: "Explore the themes and working groups of the URField Lab.",
};

export default async function WorkingGroupsPage() {
  const workingGroups = await getWorkingGroups();

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
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="text-left text-white p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold">Themes</h1>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full bg-gray-900 text-white py-8 px-4 sm:px-0 flex justify-center">
        <p className="max-w-2xl text-lg text-center">
          Each week has several guiding themes. Attendees, however, are also encouraged to propose new themes, bring their own projects or, support the work of other participants.
        </p>
      </div>

      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {workingGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No working groups found.</p>
            <p className="text-sm text-gray-400 mt-2">
              Add working groups through the{' '}
              <Link href="/studio" className="text-blue-600 hover:text-blue-800">
                Content Management System
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {workingGroups.map((group) => (
              <div key={group._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {group.mainImageURL && (
                  <div className="relative w-full h-56">
                    <Image
                      src={group.mainImageURL}
                      alt={group.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {group.title}
                  </h2>
                  {group.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                      {group.description}
                    </p>
                  )}
                  <Link
                    href={`/outputs#${group.slug.current}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium self-start"
                  >
                    Check out the projects! »
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}