import Link from "next/link";
import { Mail, Facebook } from "lucide-react";
import { Year } from "@/sanity/sanity-utils";

type FooterProps = {
  year: Year | null;
};

const Footer = ({ year }: FooterProps) => {
  return (
    <footer className="bg-black text-white p-2">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          {year?.email ? (
            <a href={`mailto:${year.email}`}>{year.email}</a>
          ) : (
            <a href="mailto:floodlab2019@co-risk.org">
              floodlab2019@co-risk.org
            </a>
          )}
        </div>
        <div className="flex items-center">
          {year?.facebook ? (
            <Link href={year.facebook} className="text-white">
              <Facebook size={16} />
            </Link>
          ) : (
            <Link href="#" className="text-white">
              <Facebook size={16} />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;