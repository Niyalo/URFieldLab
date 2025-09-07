"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getYears, Year } from '@/sanity/sanity-utils'; // Adjust path if needed

interface HeaderProps {
  isLight: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLight }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [isYearSelectorOpen, setIsYearSelectorOpen] = useState(false);

  useEffect(() => {
    async function fetchYears() {
      const fetchedYears = await getYears();
      setYears(fetchedYears);
    }
    fetchYears();
  }, []);

  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-colors duration-500 ease-in-out ${
    isLight ? 'text-white' : 'text-gray-800'
  }`;

  const gradientClass = `before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[100px] before:z-[-1] before:pointer-events-none before:transition-all before:duration-500 ${
    isLight
      ? 'before:bg-gradient-to-b before:from-black/60 before:to-transparent'
      : 'before:bg-gradient-to-b before:from-[#F2F1EA]/85 before:to-transparent'
  }`;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLink1Text = "URFIELD LAB 2019";
  const navLink2Text = "URFIELD LAB 2024";
  const actionButtonText = "CONTENT MANAGER";

  return (
    <>
      <header className={`${headerClasses} ${gradientClass}`}>
        <div className="flex justify-between items-center h-[70px] max-w-full mx-auto px-[30px]">
          {/* Desktop Navigation */}
          {/* Page Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/chiangmai2019" className="text-sm tracking-wider font-futura-passata link-animated is-active">
              {navLink1Text}
            </Link>
            <Link href="/UR2024" className="text-sm tracking-wider font-futura-passata link-animated">
              {navLink2Text}
            </Link>
          </nav>

          {/* Site Logo */} 
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src="/images/icons/logo-patagonia.svg"
                alt="Site Logo"
                width={240}
                height={48}
                className={`transition-all duration-500 ${isLight ? 'invert pt-2 w-[120px] h-[48px]' : 'invert-0 w-[240px] h-[48px]'}`}
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4">
             {/* --- Year Selector --- */}
            <div className="relative">
              <button 
                onClick={() => setIsYearSelectorOpen(!isYearSelectorOpen)}
                className="font-futura-passata text-sm tracking-wider flex items-center group"
              >
                SELECT YEAR
                <span className={`ml-1.5 transition-transform duration-200 ${isYearSelectorOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isYearSelectorOpen && years.length > 0 && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseLeave={() => setIsYearSelectorOpen(false)}
                >
                  {years.map((year) => (
                    <Link
                      key={year._id}
                      href={`/${year.slug.current}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsYearSelectorOpen(false)}
                    >
                      {year.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
             <Link href="/studio" className="font-futura-passata text-sm font-bold text-white bg-[#FF8C00] px-5 py-2.5 rounded-full tracking-wider uppercase shadow-md transition-all hover:bg-white hover:text-[#FF8C00] hover:border-[#FF8C00] border-2 border-transparent hover:shadow-lg hover:-translate-y-px">
                {actionButtonText}
             </Link>
          </nav>

          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center w-full">
            {/* Site Logo */}
            <Link href="/" className="z-10">
               <Image
                 src="/images/icons/logo-patagonia.svg"
                 alt="Site Logo"
                 width={240}
                 height={48}
                 className={`transition-all duration-500 ${isLight ? 'invert pt-2 w-[120px] h-[48px]' : 'invert-0 w-[240px] h-[48px]'}`}
               />
            </Link>
            <button onClick={toggleMobileMenu} className="hamburger-button z-10" aria-label="Open menu">
              <span className={isLight ? 'bg-white' : 'bg-black'}></span>
              <span className={isLight ? 'bg-white' : 'bg-black'}></span>
              <span className={isLight ? 'bg-white' : 'bg-black'}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center md:hidden">
          <button onClick={toggleMobileMenu} className="absolute top-5 right-5 text-white text-4xl" aria-label="Close menu">&times;</button>
          <nav className="flex flex-col items-center gap-8">
            {/* Mobile Page Links */}
            <Link href="/chiangmai2019" className="text-white text-xl" onClick={toggleMobileMenu}>{navLink1Text}</Link>
            <Link href="/UR2024" className="text-white text-xl" onClick={toggleMobileMenu}>{navLink2Text}</Link>
            {/* Mobile Year Selector */}
            <div className="text-center">
              <h3 className="text-gray-400 text-lg mb-2">Select Year</h3>
              <div className="flex flex-col gap-4">
                {years.map((year) => (
                  <Link
                    key={year._id}
                    href={`/${year.slug.current}`}
                    className="text-white text-xl"
                    onClick={toggleMobileMenu}
                  >
                    {year.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/studio" className="mt-4 font-futura-passata text-sm font-bold text-white bg-[#FF8C00] px-5 py-2.5 rounded-full tracking-wider uppercase" onClick={toggleMobileMenu}>
              {actionButtonText}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;