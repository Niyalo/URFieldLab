
"use client";
import Link from "next/link";
import { Mail, Facebook } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "HOME", match: (path: string) => path === "/" },
  { href: "/event-structure", label: "EVENT STRUCTURE", match: (path: string) => path.startsWith("/event-structure") },
  { href: "/themes", label: "THEMES", match: (path: string) => path.startsWith("/themes") },
  { href: "/people", label: "THE PEOPLE", match: (path: string) => path.startsWith("/people") },
  { href: "/outputs", label: "OUTPUTS", match: (path: string) => path.startsWith("/outputs") },
  { href: "/urfield-labs", label: "URFIELD LABS", match: (path: string) => path.startsWith("/urfield-labs") },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-black text-white p-2">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a href="mailto:floodlab2019@co-risk.org">
              floodlab2019@co-risk.org
            </a>
          </div>
          <div className="flex items-center">
            <Link href="#" className="text-white">
              <Facebook size={16} />
            </Link>
          </div>
        </div>
      </div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-blue-600">UR</span>FieldLab'19
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label, match }) => (
              <Link
                key={href}
                href={href}
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
