import Link from "next/link";
import Image from "next/image";
import { getYears, urlFor } from "@/sanity/sanity-utils";

export default async function YearSelectorPage() {
  const years = await getYears();

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="w-full bg-white shadow flex justify-between items-center px-6 py-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">URField Lab DEVELOPMENT page</h1>
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/studio"
        >
          Content Management
        </Link>
      </header>

      {/* Main grid */}
<main className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <div className="w-full max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 justify-items-center">
          {years.map((year) => (
            <Link
              key={year._id}
              href={`/${year.slug.current || year.slug}`}
              className="w-full flex flex-col items-center bg-white rounded-lg shadow-md hover:shadow-lg transition p-10"
              style={{ minWidth: 200 }}
            >
              {year.logo && year.logo.asset && (
                <div className="mb-6 w-full flex justify-center">
                  <Image
                    src={urlFor(year.logo).width(300).height(160).url()}
                    alt={year.title}
                    width={300}
                    height={160}
                    className="object-contain"
                    style={{ background: "transparent" }}
                  />
                </div>
              )}
              <span className="text-2xl font-bold mb-3">{year.title}</span>
              <span className="text-lg text-gray-500">{year.year}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}