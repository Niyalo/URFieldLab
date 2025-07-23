import Link from 'next/link';
import Image from 'next/image';

interface LogoItem {
  imageUrl: string;
  alt: string;
  linkUrl: string;
  width?: number;
  height?: number;
}

interface LogoViewsProps {
  title: string;
  logos: LogoItem[];
}

export default function LogoViews({
  title,
  logos
}: LogoViewsProps) {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <Link href={logo.linkUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={logo.imageUrl}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={logo.height || 60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
