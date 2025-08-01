import { Year } from "@/sanity/sanity-utils";
import Link from 'next/link';
import { Facebook } from 'lucide-react';

type FooterProps = {
  year: Year | null;
};

const Footer = ({ year }: FooterProps) => {
  return (
    <footer className="py-8 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-white text-sm">
            Any opinions expressed are solely those of individuals and do not express the views or opinions of the collective Field Lab or its organizers and donors/fund providers. Co-writers opinions are also their own and do not express the views or opinions of the Field Lab. The Field Lab team assumes no responsibility or liability for any errors or omissions in the content of this site. The information contained in this site is provided on an &quot;as is&quot; basis from members with no guarantees of completeness, accuracy, usefulness or timeliness.
          </p><br />
          <div className="flex justify-center items-center space-x-4 mb-4">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} UR Field Lab &apos;{year?.year.toString().slice(-2)}. Understanding Risk. For more information contact{' '}
              <a
                href={`mailto:${year?.email || 'contact@co-risk.org'}`}
                className="text-white hover:text-gray-300 underline"
              >
                {year?.email || 'contact@co-risk.org'}
              </a>
            </p>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;