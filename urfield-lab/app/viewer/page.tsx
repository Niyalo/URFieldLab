import PDFViewerClient from '@/components/PDFViewerClient';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PDFViewer({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const originalUrl = typeof resolvedSearchParams.url === 'string' ? resolvedSearchParams.url : '/sample.pdf';
  
  // Convert to API route URL for proper PDF serving
  const pdfUrl = `/api/pdf?file=${encodeURIComponent(originalUrl)}`;
  
  return <PDFViewerClient pdfUrl={pdfUrl} originalUrl={originalUrl} />;
}