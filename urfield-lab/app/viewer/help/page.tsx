import Link from "next/link";

export default function PDFViewerHelp() {
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
        
        <h1 className="text-4xl font-bold mb-6">PDF Viewer Usage Guide</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-4">How to Use the PDF Viewer</h2>
          
          <h3 className="text-xl font-semibold mb-3">Option 1: Local PDF Files (Recommended)</h3>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>
              <strong>Upload your PDF:</strong> Place your PDF file in the <code className="bg-gray-100 px-2 py-1 rounded">public/</code> folder
              <div className="mt-2 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">Example: <code>public/my-document.pdf</code></p>
              </div>
            </li>
            <li>
              <strong>Access the viewer:</strong> Use the URL parameter to specify the PDF path
              <div className="mt-2 bg-gray-50 p-3 rounded border-l-4 border-green-500">
                <p className="text-sm text-gray-700">
                  <Link href="/viewer?url=/sample.pdf" className="text-blue-600 hover:underline">
                    /viewer?url=/my-document.pdf
                  </Link>
                </p>
              </div>
            </li>
          </ol>

          <h3 className="text-xl font-semibold mb-3">Option 2: External PDF URLs</h3>
          <p className="mb-4">You can also view PDFs from external URLs (must support CORS):</p>
          <div className="bg-gray-50 p-3 rounded border-l-4 border-yellow-500 mb-6">
            <p className="text-sm text-gray-700">
              <code>/viewer?url=https://example.com/document.pdf</code>
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3">PDF Viewer Features</h3>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Navigate between pages with arrow buttons or page input</li>
            <li>Zoom in/out (50% to 300%)</li>
            <li>Rotate pages (90° increments)</li>
            <li>Download the original PDF file</li>
            <li>Responsive design for mobile and desktop</li>
            <li>Loading states and error handling</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Example URLs</h3>
          <div className="space-y-2">
            <p>
              <Link href="/viewer" className="text-blue-600 hover:underline">
                /viewer
              </Link> - Default (looks for /sample.pdf)
            </p>
            <p>
              <Link href="/viewer?url=/my-report.pdf" className="text-blue-600 hover:underline">
                /viewer?url=/my-report.pdf
              </Link> - Local file in public folder
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
            <p className="text-blue-800 text-sm">
              For the best experience, place your PDF files in organized folders within the public directory:
              <br />
              <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">public/documents/reports/annual-2024.pdf</code>
              <br />
              Then access via: <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">/viewer?url=/documents/reports/annual-2024.pdf</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
