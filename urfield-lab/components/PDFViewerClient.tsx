"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, RotateCw, BookOpen, FileText } from 'lucide-react';
import '../styles/pdf-viewer.css';

// Dynamic import of react-pdf to avoid SSR issues
import dynamic from 'next/dynamic';

const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

interface PDFViewerClientProps {
  pdfUrl: string;
  originalUrl: string;
}

export default function PDFViewerClient({ pdfUrl, originalUrl }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.7);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'book'>('book');
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    
    // Set up PDF.js worker
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError(`Failed to load PDF: ${error.message}`);
  }

  function changePage(delta: number) {
    setPageNumber(prevPageNumber => {
      const step = viewMode === 'book' ? 2 : 1;
      const newPageNumber = prevPageNumber + (delta * step);
      return Math.min(Math.max(newPageNumber, 1), numPages);
    });
  }

  function goToPage(page: number) {
    if (viewMode === 'book') {
      // In book mode, ensure we start on odd pages (1, 3, 5, etc.)
      const adjustedPage = page % 2 === 0 ? page - 1 : page;
      setPageNumber(Math.min(Math.max(adjustedPage, 1), numPages));
    } else {
      setPageNumber(Math.min(Math.max(page, 1), numPages));
    }
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function rotate() {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  }

  function downloadPDF() {
    const link = document.createElement('a');
    link.href = originalUrl; // Use original URL for download
    link.download = originalUrl.split('/').pop() || 'document.pdf';
    link.click();
  }

  function switchViewMode(mode: 'single' | 'book') {
    setViewMode(mode);
    // Adjust scale based on view mode
    if (mode === 'book') {
      setScale(0.7); // Smaller scale for two-page view
      // Ensure we're on an odd page for book view
      if (pageNumber % 2 === 0 && pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      }
    } else {
      setScale(1.0); // Normal scale for single page
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to Home
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">PDF Viewer</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-700">
                  {viewMode === 'book' ? (
                    `Pages ${pageNumber}${pageNumber < numPages ? `-${Math.min(pageNumber + 1, numPages)}` : ''} of ${numPages}`
                  ) : (
                    `Page ${pageNumber} of ${numPages}`
                  )}
                </span>
                <button
                  onClick={() => changePage(1)}
                  disabled={viewMode === 'book' ? pageNumber >= numPages - 1 : pageNumber >= numPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 border-l pl-4">
                <button
                  onClick={() => switchViewMode('single')}
                  className={`p-1 rounded ${viewMode === 'single' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  title="Single page view"
                >
                  <FileText size={20} />
                </button>
                <button
                  onClick={() => switchViewMode('book')}
                  className={`p-1 rounded ${viewMode === 'book' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  title="Book view (two pages)"
                >
                  <BookOpen size={20} />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2 border-l pl-4">
                <button
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut size={20} />
                </button>
                <span className="text-sm text-gray-700 min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 3.0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn size={20} />
                </button>
              </div>

              {/* Rotate */}
              <div className="border-l pl-4">
                <button
                  onClick={rotate}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <RotateCw size={20} />
                </button>
              </div>
            </div>

            {/* Download */}
            <button
              onClick={downloadPDF}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 text-lg mb-2">⚠️</div>
                <p className="text-red-600">{error}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Make sure the PDF file exists and is accessible.
                </p>
              </div>
            </div>
          )}

          <div 
            ref={containerRef}
            className="flex justify-center bg-gray-100 min-h-[500px] p-4 rounded-lg shadow-inner"
          >
            {isClient ? (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
                className="max-w-full"
              >
                {viewMode === 'book' ? (
                  <div className="flex gap-4">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      className="shadow-lg"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                    {pageNumber < numPages && (
                      <Page
                        pageNumber={pageNumber + 1}
                        scale={scale}
                        rotate={rotation}
                        className="shadow-lg"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    )}
                  </div>
                ) : (
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                )}
              </Document>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Initializing PDF viewer...</p>
                </div>
              </div>
            )}
          </div>

          {numPages > 0 && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
                <span className="text-sm text-gray-600">of {numPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
