import Link from "next/link";
import { getWorkingGroups, getYears } from "@/sanity/sanity-utils";
import Image from "next/image";
import YearSelector from "./YearSelector";

export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getStatusBadge(status: string) {
  const statusClasses = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-red-100 text-red-800 border-red-300',
    'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses] || statusClasses.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}

export default async function WorkingGroupsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const selectedYearId = typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined;
  
  const years = await getYears();
  const workingGroups = await getWorkingGroups(selectedYearId);

  const selectedYear = years.find(y => y._id === selectedYearId);

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold">
                Working Groups {selectedYear ? `(${selectedYear.year})` : ''}
            </h1>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Explore our research working groups and their ongoing projects.
        </p>

        <YearSelector years={years} selectedYear={selectedYearId || ''} />
        
        {workingGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No working groups found for the selected year.</p>
            <p className="text-sm text-gray-400 mt-2">
              Try selecting a different year or add working groups through the{' '}
              <Link href="/studio" className="text-blue-600 hover:text-blue-800">
                Content Management System
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workingGroups.map((group) => (
              <Link 
                key={group._id}
                href={`/blogs/${group.slug.current}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  {group.mainImageURL && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={group.mainImageURL}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        alt={group.title}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {group.title}
                    </h2>
                    {getStatusBadge(group.status)}
                  </div>
                  
                  {group.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {group.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {group.members ? `${group.members.length} members` : 'No members listed'}
                    </span>
                    {group.year && (
                      <span>
                        {group.year.year}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}