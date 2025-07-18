import Link from "next/link";
import { Mail, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-2">
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
    </footer>
  );
};

export default Footer;
