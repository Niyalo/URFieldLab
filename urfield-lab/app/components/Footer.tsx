import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[60px] px-[30px] z-50 flex items-center bg-gradient-to-t from-black/50 to-transparent">
      <div className="w-full flex justify-between items-center">
        <div className="footer-logo">
          <img src="/images/icons/URFieldLabLogo.png" alt="UR Field Lab Logo" width={100} height={25} />
        </div>
        <nav className="flex items-center gap-5 text-white">
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#FF8C00]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07A4.48 4.48 0 0015.65 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.94.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.51 21 7.75 21c7.65 0 11.78-6.35 11.78-11.78l-.01-.53c.8-.58 1.49-1.3 2.04-2.13z"></path></svg>
          </Link>
          {/* Add other social links here */}
          <Link href="#" className="font-futura-passata text-sm tracking-wider flex items-center group">
            en
            <span className="inline-block w-0 h-0 border-l-4 border-r-4 border-t-5 border-l-transparent border-r-transparent border-t-current ml-1.5 transition-transform group-hover:rotate-180"></span>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;