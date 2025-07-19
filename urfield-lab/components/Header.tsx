"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Year } from "@/sanity/sanity-utils";
import { urlFor } from "@/sanity/sanity-utils";

type HeaderProps = {
  year: Year | null;
};

const navLinks = [
  { href: "/", label: "HOME", match: (path: string) => path === "/" },
  { href: "/event-structure", label: "EVENT STRUCTURE", match: (path: string) => path.startsWith("/event-structure") },
  { href: "/themes", label: "THEMES", match: (path: string) => path.startsWith("/themes") },
  { href: "/people", label: "THE PEOPLE", match: (path: string) => path.startsWith("/people") },
  { href: "/outputs", label: "OUTPUTS", match: (path: string) => path.startsWith("/outputs") },
  { href: "/urfield-labs", label: "URFIELD LABS", match: (path: string) => path.startsWith("/urfield-labs") },
];

const Header = ({ year }: HeaderProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to build the correct href
  const getHref = (href: string) => {
    if (!year?.slug?.current && !year?.slug) return href;
    const slug = year.slug.current || year.slug;
    if (href === "/") return `/${slug}`;
    return `/${slug}${href}`;
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-1 px-1 min-h-[128px]">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center h-20">
              {year?.logo ? (
                <div className="h-16 py-0 flex items-center">
                  <Image
                    src={urlFor(year.logo).url()}
                    alt={year.title}
                    fill={false}
                    width={0}
                    height={0}
                    sizes="120px"
                    style={{
                      height: "100%",
                      width: "auto",
                      maxHeight: "64px",
                      maxWidth: "220px",
                      objectFit: "contain",
                    }}
                    className="rounded"
                    priority
                  />
                </div>
              ) : (
                <span className="text-blue-600">UR</span>
              )}
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map(({ href, label, match }) => (
              <Link
                key={href}
                href={getHref(href)}
                className={
                  match(pathname)
                    ? "text-blue-500 font-bold"
                    : "text-gray-600 hover:text-blue-500"
                }
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-white z-50">
            <div className="flex justify-end p-4">
                <button onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full -mt-12">
              {navLinks.map(({ href, label, match }) => (
                <Link
                  key={href}
                  href={getHref(href)}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-4 text-2xl ${
                    match(pathname)
                      ? "text-blue-500 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;