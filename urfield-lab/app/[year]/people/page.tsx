
import { getAuthorsByYear, getYearBySlug } from "@/sanity/sanity-utils";
import { Metadata } from "next";
import Image from "next/image";
import PeopleClientPage from "./people-client";

type Props = {
  params: { year: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = params;
  const yearData = await getYearBySlug(year);

  return {
    title: `The People - ${yearData?.title || "URField Lab"}`,
    description: `Meet the participants, researchers, and coordinators of ${
      yearData?.title || "the URField Lab"
    }.`,
  };
}

export default async function PeoplePage({ params }: Props) {
  const { year: yearSlug } = params;
  const yearData = await getYearBySlug(yearSlug);
  const authors = yearData ? await getAuthorsByYear(yearData._id) : [];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 bg-gray-800">
        <Image
          src="/cropped-Week-4-6-copy3-2.jpg" // Placeholder image
          alt="Group of participants"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center">
          <div className="text-left text-white p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold">The People</h1>
          </div>
        </div>
      </div>

      <PeopleClientPage authors={authors} />
    </div>
  );
}