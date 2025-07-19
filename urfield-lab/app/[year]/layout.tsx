import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getYearBySlug } from "@/sanity/sanity-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: { year: string };
};

export async function generateMetadata({ params }: { params: { year: string } }): Promise<Metadata> {
  const { year } = params;
  const yearData = await getYearBySlug(year);

  return {
    title: yearData?.title || "URField Lab",
    description: yearData?.description || "URField Lab - Research and Development Platform",
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { year } = params;
  const yearData = await getYearBySlug(year);

  return (

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header year={yearData} />
        {children}
        <Footer year={yearData} />
      </div>

  );
}