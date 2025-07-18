import Link from "next/link";
import { getWorkingGroup } from "@/sanity/sanity-utils";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 0;

type Props = {
  params: { slug: string };
};

// Function to generate metadata
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const workingGroup = await getWorkingGroup(params.slug);

  if (!workingGroup) {
    return {
      title: "Working Group Not Found",
      description: "This working group could not be found.",
    };
  }

  return {
    title: `${workingGroup.title} - URField Lab Working Group`,
    description: workingGroup.description || `Learn about the ${workingGroup.title} working group at URField Lab.`,
    alternates: {
      canonical: `/blogs/${params.slug}`,
    },
    openGraph: {
      title: `${workingGroup.title} - URField Lab Working Group`,
      description: workingGroup.description || `Learn about the ${workingGroup.title} working group at URField Lab.`,
      images: workingGroup.mainImageURL ? [{ url: workingGroup.mainImageURL }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${workingGroup.title} - URField Lab Working Group`,
      description: workingGroup.description || `Learn about the ${workingGroup.title} working group at URField Lab.`,
      images: workingGroup.mainImageURL ? [workingGroup.mainImageURL] : [],
    },
  };
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getStatusBadge(status: string) {
  const statusClasses = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-red-100 text-red-800 border-red-300',
    'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusClasses[status as keyof typeof statusClasses] || statusClasses.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}

export default async function WorkingGroupPage({ params }: Props) {
  const workingGroup = await getWorkingGroup(params.slug);
  
  // If working group doesn't exist, redirect to 404 page
  if (!workingGroup) {
    notFound();
  }

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          {workingGroup.mainImageURL && (
            <div className="relative w-full h-64 sm:h-80 mb-8 rounded-lg overflow-hidden">
              <Image
                src={workingGroup.mainImageURL}
                fill
                className="object-cover"
                alt={workingGroup.title}
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              {workingGroup.title}
            </h1>
            {getStatusBadge(workingGroup.status)}
          </div>

          {workingGroup.description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {workingGroup.description}
            </p>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Established: {formatDate(workingGroup.establishedDate)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {workingGroup.content && workingGroup.content.length > 0 && (
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">About This Working Group</h2>
                <PortableText value={workingGroup.content} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {workingGroup.members && workingGroup.members.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Members</h3>
                <div className="space-y-4">
                  {workingGroup.members.map((member, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </div>
                      {member.role && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {member.role}
                        </div>
                      )}
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  <span className="capitalize">{workingGroup.status.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="font-medium">Established:</span>{' '}
                  {formatDate(workingGroup.establishedDate)}
                </div>
                {workingGroup.members && (
                  <div>
                    <span className="font-medium">Members:</span>{' '}
                    {workingGroup.members.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
