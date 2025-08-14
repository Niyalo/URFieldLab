import type { Metadata } from "next";
import "../globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getYearBySlug } from "@/sanity/sanity-utils";

// Use CSS variables for font families instead of Google Fonts
// These are defined in globals.css

type Props = {
  children: React.ReactNode;
  params: Promise<{ year: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return {
    title: yearData?.title || "URField Lab",
    description: yearData?.description || "URField Lab - Research and Development Platform",
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { year } = await params;
  const yearData = await getYearBySlug(year);

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col">
      <HeaderWrapper year={yearData} />
      <main className="flex-1">
        {children}
      </main>
      <Footer year={yearData} />
    </div>
  );
}