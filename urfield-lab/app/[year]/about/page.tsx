import Link from "next/link";

export default function About() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">About URField Lab</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            URField Lab is a research and development platform designed to facilitate 
            scientific research, data collection, and knowledge management.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Content Management System powered by Sanity</li>
            <li>Modern web interface built with Next.js</li>
            <li>Responsive design with Tailwind CSS</li>
            <li>TypeScript for type safety</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            Use the Content Management link on the homepage to access the Sanity Studio 
            where you can create and manage your content.
          </p>
        </div>
      </main>
    </div>
  );
}
