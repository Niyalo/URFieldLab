"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Year } from "@/sanity/sanity-utils";
import { urlFor } from "@/sanity/sanity-utils";

type HeaderProps = {
  year: (Year & { slug: { current: string } }) | null;
};

// Keep original page links (same as homepage navigation)
const navLinks = [
  { href: "/", label: "HOME", match: (path: string) => path === "/" },
  { href: "/event-structure", label: "EVENT STRUCTURE", match: (path: string) => path.startsWith("/event-structure") },
  { href: "/themes", label: "THEMES", match: (path: string) => path.startsWith("/themes") },
  { href: "/people", label: "THE PEOPLE", match: (path: string) => path.startsWith("/people") },
  { href: "/outputs", label: "OUTPUTS", match: (path: string) => path.startsWith("/outputs") },
];

const Header = ({ year }: HeaderProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // isLight = true when at top (white links/logo), false after scrolling (dark links/logo)
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      //scroll one screen height
      setIsLight(window.scrollY < window.innerHeight/2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Helper to build the correct href
  const getHref = (href: string) => {
    if (!year?.slug?.current) return href;
    const slug = year.slug.current;
    if (href === "/") return `/${slug}`;
    return `/${slug}${href}`;
  };

  // helper to determine active state taking into account year slug in the pathname
  const isActive = (match: (path: string) => boolean) => {
    if (!pathname) return false;
    if (match(pathname)) return true;
    if (year?.slug?.current && pathname.startsWith(`/${year.slug.current}`)) {
      const stripped = pathname.replace(`/${year.slug.current}`, '') || '/';
      return match(stripped);
    }
    return false;
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-500 ${isLight ? 'text-white' : 'text-gray-800'}`}>
      {/* Gradient background: white -> transparent */}
      <nav className={`${!isLight? 'before:bg-gradient-to-b before:from-white/80 before:to-white/60':'before:bg-gradient-to-b before:from-black/80 before:to-black/10'} relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[80px] before:z-[-1] before:pointer-events-none before:transition-all before:duration-500`}>
        <div className="container mx-auto flex justify-between items-center py-1 px-1 min-h-[70px]">
          {/* Left links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label, match }) => (
              <Link
                key={href}
                href={getHref(href)}
                className={
                  isActive(match)
                    ? "text-blue-500 font-bold text-sm tracking-wider"
                    : `${isLight ? 'text-white' : 'text-gray-600'} text-sm tracking-wider hover:text-blue-500 drop-shadow-md  drop-shadow-white`
                }
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Centered Logo */}
          <div className="">
            <Link href="/" className="flex items-center">
              {year?.logo ? (
                <div className="h-12 py-0 flex items-center transition-all duration-500">
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
                      maxHeight: "48px",
                      maxWidth: "180px",
                      objectFit: "contain",
                    }}
                    className={`rounded transition-transform duration-500 ${isLight ? 'invert' : 'invert-0'} drop-shadow-md`}
                    priority
                  />
                </div>
              ) : (
                <span className={`${isLight ? 'text-white' : 'text-gray-800'}`}>UR</span>
              )}
            </Link>
          </div>

          {/* Right side: studio/action button for desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={getHref('/dashboard')} className="font-futura-passata text-sm font-bold text-white bg-[#FF8C00] px-4 py-2 rounded-full tracking-wider uppercase shadow-md transition-all hover:bg-white hover:text-[#FF8C00] hover:border-[#FF8C00] border-2 border-transparent hover:shadow-lg hover:-translate-y-px drop-shadow-md">
              DASHBOARD
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(true)} className={`${isLight ? 'text-white' : 'text-gray-600'}`}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black/90 z-50">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={28} color="#fff" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map(({ href, label, match }) => (
                <Link
                  key={href}
                  href={getHref(href)}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl ${isActive(match) ? 'text-blue-500 font-bold drop-shadow-md' : 'text-white drop-shadow-sm'}`}
                >
                  {label}
                </Link>
              ))}
              <Link href={getHref('/studio')} className="mt-4 font-futura-passata text-sm font-bold text-white bg-[#FF8C00] px-5 py-2.5 rounded-full tracking-wider uppercase" onClick={() => setIsMenuOpen(false)}>
                CONTENT MANAGER
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;