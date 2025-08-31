"use client";

import React, { useState, useEffect, useMemo, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue, type Variants, type MotionProps } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CloudParallax from './components/CloudParallax';
import PercentageDataViewer from './components/PercentageDataViewer';
import QuotesBlock from './components/QuotesBlock';
import ArticlePreviewViewer from './components/ArticlePreviewViewer';
import { getAuthorByName } from '../sanity/sanity-utils';
import { X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- HELPER HOOKS & FUNCTIONS ---

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  if (inMin === inMax) return outMin;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const useIsMobile = (breakpoint: number = 768, aspectRatioThreshold: number = 1) => {
  const [isMobile, setIsMobileState] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // SIMPLIFIED: Only check width, ignore aspect ratio which is unreliable in dev tools.
      setIsMobileState(currentWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, aspectRatioThreshold]);

  return isMobile;
};

const useParallaxTransform = (
  scrollY: MotionValue<number>,
  parallaxFactor: number | undefined,
  scrollInputRangeEnd: number,
  isMobile: boolean,
  parallaxIntensity: number,
  parallaxMagnitudeConstant: number = 300
) => {
  const yTarget = useTransform(
    scrollY,
    (latestScrollY: number) => {
      if (isMobile || !parallaxFactor || parallaxFactor === 0) return 0;
      const outputTarget = -parallaxFactor * parallaxIntensity * parallaxMagnitudeConstant;
      if (scrollInputRangeEnd === 0) return 0;
      return mapRange(latestScrollY, 0, scrollInputRangeEnd, 0, outputTarget);
    }
  );
  return useSpring(yTarget, { stiffness: 200, damping: 20, restDelta: 0.1 });
};


// ===================================================================================
//
// PAGE CONTENT & CONFIGURATION
//
// This is the new, unified structure for all page content.
// Each object in the `pageSections` array represents a distinct section on the page.
//
// To add new content (like a text block, image group, etc.):
// 1. Define its data here in the `pageSections` array.
// 2. Ensure you have a corresponding component to render it.
// 3. Add a case for its `type` in the main render loop below.
//
// ===================================================================================

// --- DATA FOR IMAGES, TEXT, AND ANIMATIONS ---
// Add optional opacity property to image configs
interface BaseImageConfig {
  id: string;
  src: string;
  top: number;
  zIndex: number;
  refHeight: number;
  parallaxFactor: number;
  opacity?: number;
  leftGapPercent?: number;
  rightGapPercent?: number;
  blendMode?: React.CSSProperties['mixBlendMode']; // NEW
  authorName?: string; // NEW for clickable author images
}

// Use this type for your arrays:
const desktopImages: BaseImageConfig[] = [
  { id: 'Mountain outline', src: 'images/URFieldLabMainPage/Mountain_outline.png', top: 370, zIndex: 1, refHeight: 700, parallaxFactor: 0.1, opacity: 0.3, blendMode: 'multiply' },

  { id: 'nilgiri left', src: '/images/URFieldLabMainPage/nilgiri left.png', top: 200, zIndex: 1, refHeight: 600, parallaxFactor: 0.1 },
  { id: 'nilgiri right', src: '/images/URFieldLabMainPage/nilgiri right.png', top: 200, zIndex: 1, refHeight: 600, parallaxFactor: 0.1 },

  { id: 'Trees left', src: '/images/URFieldLabMainPage/Mountain Left.png', top: 350, zIndex: 3, refHeight: 600, parallaxFactor: 0.2 },
  { id: 'Trees right', src: '/images/URFieldLabMainPage/Mountain_right.png', top: 350, zIndex: 2, refHeight: 600, parallaxFactor: 0.3 },
  { id: 'Hill', src: '/images/URFieldLabMainPage/close hill.png', top: 360, zIndex: 3, refHeight: 600, parallaxFactor: 0.5 },

  { id: 'Boats', src: '/images/URFieldLabMainPage/boats.png', top: 1700, zIndex: 5, refHeight: 600, parallaxFactor: 0.6, leftGapPercent: 5, rightGapPercent: 40 },

  { id: 'scheduling', src: '/images/URFieldLabMainPage/scheduling.gif', top: 1250, zIndex: 5, refHeight: 600, parallaxFactor: 0.6, leftGapPercent: 65, rightGapPercent: 10 },

  { id: 'water 1', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 1500, zIndex: 2, refHeight: 600, parallaxFactor: 0.1, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'water 2', src: '/images/URFieldLabMainPage/Blue stuff cropped.png', top: 1600, zIndex: 2, refHeight: 600, parallaxFactor: 0.2, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 3', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 1700, zIndex: 2, refHeight: 600, parallaxFactor: 0.3, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 4', src: '/images/URFieldLabMainPage/Blue stuff cropped 2.png', top: 1800, zIndex: 2, refHeight: 600, parallaxFactor: 0.4, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'Locations', src: '/images/URFieldLabMainPage/Locations.png', top: 2400, zIndex: 5, refHeight: 600, parallaxFactor: 0.8, leftGapPercent: 30, rightGapPercent: 0 },

  // { id: 'Cloud people', src: '/images/URFieldLabMainPage/People.png', top: 4800+500, zIndex: 13, refHeight: 700, parallaxFactor: 0.8 },
  { id: 'Cloud people 1', src: '/images/URFieldLabMainPage/1.png', top: 4600, zIndex: 13, refHeight: 200, leftGapPercent:0.003, rightGapPercent: 81.8, parallaxFactor: 0.8, authorName: 'Madeeha Merchant' },
  { id: 'Cloud people 2', src: '/images/URFieldLabMainPage/2.png', top: 4600, zIndex: 13, refHeight: 700, leftGapPercent:11.18, rightGapPercent: 73.68, parallaxFactor: 0.8 },
  { id: 'Cloud people 3', src: '/images/URFieldLabMainPage/3.png', top: 4600, zIndex: 13, refHeight: 700, leftGapPercent:19.375, rightGapPercent: 62.778, parallaxFactor: 0.8, authorName: 'Abiral Khatri' },
  { id: 'Cloud people 4', src: '/images/URFieldLabMainPage/leepi.png', top: 4620, zIndex: 13, refHeight: 700, leftGapPercent:32.986, rightGapPercent: 48.764, parallaxFactor: 0.8, authorName: 'Shamsun Nahar' },
  { id: 'Cloud people 5', src: '/images/URFieldLabMainPage/sue.png', top: 4600, zIndex: 13, refHeight: 700, leftGapPercent:45, rightGapPercent: 36.69, parallaxFactor: 0.8, authorName: 'Jungsuh (Sue) Lim' },
  { id: 'Cloud people 6', src: '/images/URFieldLabMainPage/sunayana.png', top: 4630, zIndex: 13, refHeight: 700, leftGapPercent:57.08, rightGapPercent: 26.597, parallaxFactor: 0.8},
  { id: 'Cloud people 7', src: '/images/URFieldLabMainPage/7.png', top: 4600, zIndex: 13, refHeight: 700, leftGapPercent:68.26, rightGapPercent: 13.4722, parallaxFactor: 0.8, authorName: 'Rajee Tamrakar' },
  { id: 'Cloud people 8', src: '/images/URFieldLabMainPage/8.png', top: 4630, zIndex: 12, refHeight: 700, leftGapPercent:75.09, rightGapPercent: 3, parallaxFactor: 0.8, authorName: 'Junu Maharjan' },

  { id: 'Credits banner', src: '/images/URFieldLabMainPage/baner.png', top: 4650, zIndex: 14, refHeight: 403, parallaxFactor: 0.0 },
];

const mobileImages: BaseImageConfig[] = [
  { id: 'Mountain outline', src: 'images/URFieldLabMainPage/Mountain_outline.png', top: -400, zIndex: 1, refHeight: 700, parallaxFactor: 0.1, opacity: 0.3, blendMode: 'multiply' },

  { id: 'Trees left', src: '/images/URFieldLabMainPage/Mountain Left.png', top: 250, zIndex: 3, refHeight: 600, parallaxFactor: 0.2 },
  { id: 'Trees right', src: '/images/URFieldLabMainPage/Mountain_right.png', top: 250, zIndex: 2, refHeight: 600, parallaxFactor: 0.1 },
  { id: 'Hill', src: '/images/URFieldLabMainPage/close hill.png', top: 260, zIndex: 3, refHeight: 600, parallaxFactor: 0.5 },

  { id: 'Boats', src: '/images/URFieldLabMainPage/boats.png', top: 1800, zIndex: 5, refHeight: 600, parallaxFactor: 0.6, leftGapPercent: 10, rightGapPercent: 10 },


  { id: 'water 1', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 2200, zIndex: 2, refHeight: 600, parallaxFactor: 0.1, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'water 2', src: '/images/URFieldLabMainPage/Blue stuff cropped.png', top: 2350, zIndex: 2, refHeight: 600, parallaxFactor: 0.2, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 3', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 2600, zIndex: 2, refHeight: 600, parallaxFactor: 0.3, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 4', src: '/images/URFieldLabMainPage/Blue stuff cropped 2.png', top: 2700, zIndex: 2, refHeight: 600, parallaxFactor: 0.4, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 5', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 2800, zIndex: 2, refHeight: 600, parallaxFactor: 0.3, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 6', src: '/images/URFieldLabMainPage/Blue stuff cropped 2.png', top: 3000, zIndex: 2, refHeight: 600, parallaxFactor: 0.4, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'Locations', src: '/images/URFieldLabMainPage/Locations.png', top: 4200, zIndex: 5, refHeight: 600, parallaxFactor: 0.8, leftGapPercent: 0, rightGapPercent: 0 },

  { id: 'Cloud people', src: '/images/URFieldLabMainPage/People.png', top: 12200, zIndex: 13, refHeight: 700, parallaxFactor: 0.8 },

  { id: 'Credits banner', src: '/images/URFieldLabMainPage/baner.png', top: 12450, zIndex: 14, refHeight: 403, parallaxFactor: 0.0 },
];

const clouds = [
    { id: 'cloud1', src: '/images/clouds/cloud_new_1.png', top: 200, zIndex: 1, speed: 20, width: '35vw', timeOffset: 0 },
    { id: 'cloud2', src: '/images/clouds/cloud_new_2.png', top: 450, zIndex: 1, speed: 15, width: '40vw', timeOffset: 15 },
    { id: 'cloud3', src: '/images/clouds/cloud_new_3.png', top: 300, zIndex: 15, speed: 35, width: '25vw', timeOffset: 5 },
    { id: 'cloud4', src: '/images/clouds/cloud_new_4.png', top: 450, zIndex: 1, speed: 15, width: '40vw', timeOffset: 15 },
    { id: 'cloud5', src: '/images/clouds/cloud_new_5.png', top: 300, zIndex: 15, speed: 35, width: '25vw', timeOffset: 5 },
];

const arrowVariants: Variants = {
  rest: { y: '0vw', opacity: 1 },
  hover: {
    y: ['0vw', '1.5vw', '-1.5vw', '0vw'],
    opacity: [1, 0, 0, 1],
    transition: {
      duration: 0.7,
      delay: 0.3,
      times: [0, 0.3, 0.6, 1],
      ease: "easeInOut"
    }
  }
};

// --- DEDICATED TEXT BLOCK COMPONENT ---
// This component is now more generic and receives its data from the main page loop.


// Extracting config types for cleaner props
type TextBlockConfig = {
  top: number;
  left: string;
  right: string;
  textAlign: CSSProperties['textAlign'];
  parallaxFactor: number;
  textScale: number;
  textColor: string;
  animation: MotionProps;
};

interface AuthorItem {
  name: string;
  pictureURL?: string;
  institute?: string;
  bio?: string;
  articles?: ArticleItem[];
}

interface ArticleItem {
  _id: string;
  title: string;
  year?: {
    slug: {
      current: string;
    };
  };
}

interface StatementItem {
  id: string;
  title: string;
  text: string;
  percentages?: Array<{
    value: number;
    color: string;
  }>;
}

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  avatarSrc: string;
}

type SectionContent = {
  pre?: string;
  h1?: string;
  sub?: string;
  desc?: string;
  cta?: string;
  ctaUrl?: string;
  h2?: string;
  h3?: string;
  p?: string;
  title?: string;
  subtitle?: string;
  statements?: StatementItem[];
  quotes?: QuoteItem[];
  yearSlug?: string;
};

type TextBlockProps = {
    config: TextBlockConfig;
    content: SectionContent;
    isHero: boolean;
    scrollY: MotionValue<number>;
    scrollInputRangeEnd: number;
    isMobile: boolean;
    parallaxIntensity: number;
    currentGlobalTopMarginPx: number;
    referenceWidth: number;
    onCtaClick?: () => void; // NEW
};

const TextBlock: React.FC<TextBlockProps> = ({ config, content, isHero, scrollY, scrollInputRangeEnd, isMobile, parallaxIntensity, currentGlobalTopMarginPx, referenceWidth, onCtaClick }) => {
    const y = useParallaxTransform(scrollY, config.parallaxFactor, scrollInputRangeEnd, isMobile, parallaxIntensity);

    const blockStyle: CSSProperties & { '--text-scale': number } = {
        position: 'absolute',
        top: `${((config.top + currentGlobalTopMarginPx) / referenceWidth) * 100}vw`,
        left: config.left,
        right: config.right,
        textAlign: config.textAlign,
        color: config.textColor,
        '--text-scale': config.textScale,
    };

    return (
        <motion.div
            className={`pointer-events-auto box-border p-[1.2vw] ${isHero ? 'text-center' : ''}`}
            style={{ ...blockStyle, y }}
            {...config.animation}
        >
            {isHero ? (
                <>
                    <p className="text-[1.2vw] uppercase tracking-widest" style={{ fontSize: `calc(1.2vw * var(--text-scale))` }}>{content.pre || ''}</p>
                    <h1 className="text-[4.0vw] font-bold uppercase leading-none my-[1vw]" style={{ fontSize: `calc(4.0vw * var(--text-scale))` }}>{content.h1 || ''}</h1>
                    <p className="text-[1.5vw] uppercase" style={{ fontSize: `calc(1.5vw * var(--text-scale))` }}>{content.sub || ''}</p>
                    <p className="text-[1.1vw] max-w-[20vw] mx-auto mt-[2vw]" style={{ fontSize: `calc(1.1vw * var(--text-scale))` }}>{content.desc || ''}</p>
                    {content.cta && (
                        <div className="inline-block relative mt-[2vw]">
                            <motion.a
                                href={onCtaClick ? undefined : (content.ctaUrl || '#')}
                                onClick={onCtaClick}

                                className="inline-block text-[1vw] tracking-wider group bg-[#FF8C00] text-white px-8 py-3 rounded-full border-2 border-[#FF8C00] transition-colors duration-300 hover:bg-white hover:text-[#FF8C00]"
                                style={{ fontSize: `calc(1vw * var(--text-scale))` }}
                            >
                                <span>{content.cta}</span>
                            </motion.a>
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-4"
                                variants={arrowVariants}
                                initial="rest"
                                whileHover="hover"
                            >
                                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12L0 0L20 0L10 12Z" fill="#FF8C00"/>
                                </svg>
                            </motion.div>
                        </div>
                    )}
                </>
            ) : (
                <div className={`max-w-[60vw] ${config.textAlign === 'center' ? 'mx-auto' : ''}`}>
                    <h2 className="text-[2.5vw] font-bold uppercase leading-tight" style={{ fontSize: `calc(2.5vw * var(--text-scale))` }}>{content.h2 || ''}</h2>
                    <h3 className="text-[1.5vw] uppercase mt-[0.5vw] mb-[1.5vw]" style={{ fontSize: `calc(1.5vw * var(--text-scale))` }}>{content.h3 || ''}</h3>
                    <p className="text-[1.1vw] leading-relaxed" style={{ fontSize: `calc(1.1vw * var(--text-scale))` }}>{content.p || ''}</p>
                    {content.cta && (
                        <motion.a
                            href={onCtaClick ? undefined : (content.ctaUrl || '#')}
                            onClick={onCtaClick}

                            className="inline-block mt-[2vw] text-[1vw] tracking-wider group bg-[#FF8C00] text-white px-8 py-3 rounded-full border-2 border-[#FF8C00] transition-colors duration-300 hover:bg-white hover:text-[#FF8C00]"
                            style={{ fontSize: `calc(1vw * var(--text-scale))` }}
                        >
                            <span>{content.cta}</span>
                        </motion.a>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// --- DEVELOPER NOTE ---
// --- STEP 1: DEFINE NEW SECTION COMPONENTS HERE ---
// When adding a new section type (e.g., 'imageGroup', 'survey'), create its component here.
// It should accept props similar to TextBlock for consistency;
/*
const ImageGroupBlock: React.FC<any> = ({ config, content, ...props }) => {
  // ... component logic to render an image group
  return <div>...</div>;
};
*/
// NOTE: The PercentageDataViewer component is in its own file: app/components/PercentageDataViewer.tsx



// --- IMAGE COMPONENT ---
type ParallaxImageProps = {
    img: BaseImageConfig;
    scrollY: MotionValue<number>;
    scrollInputRangeEnd: number;
    isMobile: boolean;
    parallaxIntensity: number;
    currentGlobalTopMarginPx: number;
    referenceWidth: number;
    onAuthorClick?: (authorName: string) => void; // NEW
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({
    img,
    scrollY,
    scrollInputRangeEnd,
    isMobile,
    parallaxIntensity,
    currentGlobalTopMarginPx,
    referenceWidth,
    onAuthorClick // NEW
}) => {
    const effectiveTopPx = img.top + currentGlobalTopMarginPx;
    const imageY = useParallaxTransform(scrollY, img.parallaxFactor, scrollInputRangeEnd, isMobile, parallaxIntensity, 500);
    const imageOpacity = typeof img.opacity === 'number' ? img.opacity : 1;
    const leftGap = typeof img.leftGapPercent === 'number' ? img.leftGapPercent : 0;
    const rightGap = typeof img.rightGapPercent === 'number' ? img.rightGapPercent : 0;
    const blendMode = img.blendMode ?? 'normal';

    return (
        <motion.img
            className="absolute h-auto object-cover"
            src={img.src}
            alt={img.id}
            onClick={img.authorName ? () => onAuthorClick!(img.authorName!) : undefined}
            whileHover={img.authorName ? { scale: 1.1, transition: { duration: 0.2 } } : undefined}
            style={{
                top: `${(effectiveTopPx / referenceWidth) * 100}vw`,
                left: `calc(${leftGap}%)`,
                width: `calc(100vw - ${leftGap}% - ${rightGap}%)`,
                zIndex: img.zIndex,
                y: imageY,
                opacity: imageOpacity,
                position: 'absolute',
                mixBlendMode: blendMode, // NEW
                cursor: img.authorName ? 'pointer' : 'auto',
            }}
        />
    );
};


// --- MAIN PAGE COMPONENT ---

export default function AnimatedPage() {
  const isMobile = useIsMobile();
  const [headerIsLight, setHeaderIsLight] = useState(false);
  const parallaxIntensity = 1;
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem | null>(null);
  const [isAuthorModalLoading, setIsAuthorModalLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoModalLoading, setIsVideoModalLoading] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentWindowScrollY = window.scrollY;
      const lightThreshold = isMobile ? window.innerHeight * 0.3 : window.innerHeight * 0.5;
      setHeaderIsLight(currentWindowScrollY > lightThreshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Fetch authors for quotes section
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        // Using author list from incoming changes
        const authorNames = ['Jungsuh (Sue) Lim', 'Sneha Anil Malani', 'Alok Bhardwaj', 'Pamela Cajilig', 'Tian Ning Lim', 'Wahaj Habib'];
        const fetchedAuthors = [];

        for (const name of authorNames) {
          const author = await getAuthorByName(name);
          if (author) {
            fetchedAuthors.push(author);
          }
        }

        setAuthors(fetchedAuthors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  const handleQuoteClick = async (authorName: string) => {
    setSelectedAuthor(null); // Clear previous author
    setIsAuthorModalLoading(true);

    try {
      const authorDetails = await getAuthorByName(authorName);
      if (authorDetails) {
        setSelectedAuthor(authorDetails);
      } else {
        alert("Could not find author information.");
      }
    } catch (error) {
      console.error('Error fetching author details:', error);
      alert("Could not load author details.");
    } finally {
      setIsAuthorModalLoading(false);
    }
  };

  const closeAuthorModal = () => {
    setSelectedAuthor(null);
    setIsAuthorModalLoading(false);
  };

  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setIsVideoModalLoading(true);
    // Set loading to false after a short delay to simulate loading
    setTimeout(() => setIsVideoModalLoading(false), 500);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsVideoModalLoading(false);
  };

  useEffect(() => {
    if (selectedAuthor || selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedAuthor, selectedVideo]);

  const referenceWidth = 1280;
  // Global top margin is now device-dependent
  const currentGlobalTopMarginPx = isMobile ? 600 : -250;
  const imagesToDisplay = isMobile ? mobileImages : desktopImages;

  // Create dynamic pageSections with author data
  const dynamicPageSections = useMemo(() => {
    // This function now correctly builds the sections array,
    // dynamically creating the quotes section from the fetched author data.
    const baseSections = [
      {
        id: 'hero',
        type: 'textBlock' as const,
        content: {
          pre: "",
          h1: "UNDERSTANDING RISK FIELD LABS",
          sub: "",
          desc: "The Understanding Risk (UR) Field Labs are collaborative, unstructured, un-conferences that bring together people to produce creative approaches to address today's most pressing climate and disaster risk management issues.",
          cta: "START EXPLORING",
          ctaUrl: "/UR2024"
        },
        desktopConfig: { top: 420, left: '25%', right: '25%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 1.0, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } as MotionProps },
        mobileConfig: { top: -100, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.9, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } as MotionProps }
      },
      {
        id: 'theFieldLabExperience',
        type: 'textBlock' as const,
        content: {
          h2: "The Field Lab experience",
          h3: "",
          p: "Over four weeks, participants from around the world co-design a schedule and form working groups to develop projects, ranging from art to research.",
          cta: "THE SCHEDULE",
          ctaUrl: "/UR2024/event-structure"
        },
        desktopConfig: { top: 1300, left: '10%', right: '65%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 1.2, textColor: '#000000ff', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.0 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps },
        mobileConfig: { top: 1100, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 2.5, textColor: '#000000ff', animation: { initial: { opacity: 0, y: 13 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 1.0 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps }
      },
      {
        id: 'whyTheFieldLab',
        type: 'textBlock' as const,
        content: {
          h2: "Why The Field Lab?",
          h3: "",
          p: "We need to develop new and effective ways of working with climate change data, while also working to create a more equitable and pluralistic data. (change)",
          cta: "HOW TO RUN A FIELD LAB",
          ctaUrl: "/chiangmai2019/outputs#article-nature-based-solutions-factsheets"
        },
        desktopConfig: { top: 1800, left: '65%', right: '5%', textAlign: 'right' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 1.2, textColor: '#ffffffff', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.0 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps },
        mobileConfig: { top: 2600, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 2.5, textColor: '#ffffffff', animation: { initial: { opacity: 0, y: 13 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps }
      },
      {
        id: 'locations',
        type: 'textBlock' as const,
        content: {
          h2: "GLOBAL LOCATIONS",
          h3: "",
          p: "The Field Lab is held in locations around the world that are on the frontlines of climate and disaster risk",
        },
        desktopConfig: { top: 2400, left: '5%', right: '65%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 1.5, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps },
        mobileConfig: { top: 3600, left: '10%', right: '10%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 2.8, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 2.5, ease: "easeOut" } } as MotionProps }
      },
      {
        id: 'exitSurvey2024',
        type: 'percentageDataViewer' as const,
        content: {
          title: "Exit Survey 2024",
          subtitle: "Results of the exit survey from the 2024 Kathmandu Field Lab of the 50 responding participants",
          statements: [
            {
              id: 's1',
              title: "Field Lab Experience",
              text: "86% gave the Field Lab experience 4-5 stars out of 5",
              percentages: [{ value: 86, color: '#c63810ff' }] // Deep red
            },
            {
              id: 's2',
              title: "Impact on Career",
              text: "80% believe the Field Lab has already had a positive impact on their career. Almost 50% say the positive impact on their career has been significant (greater than 8 out of 10).",
              percentages: [
                { value: 80, color: '#FF8C00ff' }, // Using incoming color
                { value: 50, color: '#c63810ff' }
              ]
            },
            {
              id: 's3',
              title: "During Field Lab",
              text: "90% made progress, and 18% completed, an idea or project that they worked on during the Field Lab.",
              percentages: [
                { value: 90, color: '#FF8C00ff' }, // Using incoming color
                { value: 18, color: '#c63810ff' }] 
            },
            {
              id: 's4',
              title: "Continuation of Project",
              text: "64% have kept on working on something they initiated at the Field Lab",
              percentages: [
                { value: 64, color: '#c63810ff' }, 

              ]
            }
          ]
        },
        // Positioned where 'ecosystems' was, with 25% side gaps and black text.
        desktopConfig: { top: 3050, left: '10%', right: '10%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 0.9, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps },
        mobileConfig: { top: 5200, left: '5%', right: '5%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.2, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps }
      },
      {
        id: 'participantFeedback',
        type: 'quotesBlock' as const,
        content: {
          title: "Feedback from the surveys & interviews",
          quotes: authors.length > 0 ? authors.map((author: AuthorItem, index: number) => {
            // This maps the fetched authors to the quotes data structure.
            return {
              id: `q${index + 1}`,
              text: [
                "The UR Field Lab was a transformative experience, fostering collaboration and innovation in a way I've never seen before.",
                "A truly unique 'un-conference' that breaks down barriers and allows for genuine co-creation. Highly recommended.",
                "I left with not just new ideas, but a new network of passionate colleagues from around the world.",
                "The hands-on, project-based approach meant we were creating tangible solutions from day one. Incredible.",
                "It's a powerful reminder of what can be achieved when diverse minds come together with a shared purpose.",
                "It was because of the people that I met at the field lab that I got to know of, and decided to do the Erasmus Mundus Flood Risk Management, MSc."
              ][index] || "Great experience at the UR Field Lab!",
              author: author.name,
              avatarSrc: author.pictureURL || "/images/avatars/avatar1.png"
            };
          }) : [
            // This provides a loading state before authors are fetched.
            { id: 'q1', text: "Loading author feedback...", author: "Loading...", avatarSrc: "/images/avatars/avatar1.png" }
          ]
        },
        desktopConfig: { top: 3800, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.2, textScale: 1.0, textColor: '#333333', animation: {} as MotionProps },
        mobileConfig: { top: 8150, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.0, textColor: '#333333', animation: {} as MotionProps }
      },
      {
        id: 'articlePreviews',
        type: 'articlePreviewViewer' as const,
        content: {
          title: "FEATURED OUTPUTS",
          subtitle: "A selection of featured projects, papers, and videos from across all Field Labs.",
          yearSlug: "UR2024",
          // Adding empty properties to match the structure of other content objects
          pre: "", h1: "", sub: "", desc: "", cta: "", ctaUrl: ""
        },
        // Config is used for positioning the entire block
        desktopConfig: { top: 4600+600, left: '0%', right: '0%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.3, textScale: 1.0, textColor: '#000000', animation: {} as MotionProps },
        mobileConfig: { top: 12800, left: '0%', right: '0%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.0, textColor: '#000000', animation: {} as MotionProps }
      },
      //
      // --- DEVELOPER NOTE ---
      // To add a new section (e.g., an image gallery), add its data object here.
      // Example:
      // {
      //   id: 'myImageGroup',
      //   type: 'imageGroup' as const,
      //   content: { images: [...] },
      //   desktopConfig: { top: 5000, ... },
      //   mobileConfig: { top: 9000, ... }
      // }
      //
    ];

    return baseSections;
  }, [authors]);

  const containerHeightVw = useMemo(() => {
    if (!imagesToDisplay.length && dynamicPageSections.length === 0) return 100;

    const lastImage = imagesToDisplay.length > 0 ? imagesToDisplay[imagesToDisplay.length - 1] : { top: 0, refHeight: 0 };
    const lastSection = dynamicPageSections.length > 0 ? dynamicPageSections[dynamicPageSections.length - 1] : { desktopConfig: { top: 0 }, mobileConfig: { top: 0 }};
    
    const lastSectionConfig = isMobile ? lastSection.mobileConfig : lastSection.desktopConfig;
    const lastSectionTop = lastSectionConfig.top || 0;

    const lastImageAdjustedTop = lastImage.top + currentGlobalTopMarginPx;
    const lastElementTop = Math.max(lastImageAdjustedTop + lastImage.refHeight, lastSectionTop + currentGlobalTopMarginPx + 500);

    return (lastElementTop / referenceWidth) * 100;
  }, [imagesToDisplay, isMobile, referenceWidth, currentGlobalTopMarginPx, dynamicPageSections]);

  const scrollInputRangeEnd = useMemo(() => {
    return (containerHeightVw / 100) * referenceWidth * 1.5;
  }, [containerHeightVw, referenceWidth]);

  // --- DEVELOPER NOTE ---
  // To add a new section (e.g., an image gallery), add its data object here.
  // Example:
  // {
  //   id: 'myImageGroup',
  //   type: 'imageGroup' as const,
  //   content: { images: [...] },
  //   desktopConfig: { top: 5000, ... },
  //   mobileConfig: { top: 9000, ... }
  // }
  //
  return (
    <div key={isMobile ? 'mobile' : 'desktop'} className="relative bg-transparent font-sans overflow-x-hidden">
      <Header isLight={headerIsLight} />

      {/* Background collage of images and clouds */}
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ height: `${containerHeightVw}vw` }}
      >
        {clouds.map(cloud => <CloudParallax key={cloud.id} {...cloud} referenceWidth={referenceWidth} />)}
        
        {imagesToDisplay.map(img => (
            <ParallaxImage
              key={img.id}
              img={img}
              scrollY={scrollY}
              scrollInputRangeEnd={scrollInputRangeEnd}
              isMobile={isMobile}
              parallaxIntensity={parallaxIntensity}
              currentGlobalTopMarginPx={currentGlobalTopMarginPx}
              referenceWidth={referenceWidth}
              onAuthorClick={handleQuoteClick}
            />
        ))}
      </motion.div>

      {/* Absolutely positioned container for all interactive/content sections */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
        {dynamicPageSections.map((section) => {
          const config = isMobile ? section.mobileConfig : section.desktopConfig;
          
          switch (section.type) {
            case 'textBlock':
              return (
                <TextBlock
                  key={section.id}
                  config={config}
                  content={section.content}
                  scrollY={scrollY}
                  scrollInputRangeEnd={scrollInputRangeEnd}
                  isMobile={isMobile}
                  parallaxIntensity={parallaxIntensity}
                  currentGlobalTopMarginPx={currentGlobalTopMarginPx}
                  referenceWidth={referenceWidth}
                  isHero={section.id === 'hero'}
                  onCtaClick={section.id === 'whyTheFieldLab' ? () => handleVideoClick('/images/URFieldLabMainPage/runFieldLab.mp4') : undefined}
                />
              );
            
            case 'percentageDataViewer':
              return (
                <PercentageDataViewer 
                  key={section.id}
                  config={config}
                  content={section.content}
                  isMobile={isMobile}
                  referenceWidth={referenceWidth}
                  currentGlobalTopMarginPx={currentGlobalTopMarginPx}
                  scrollY={scrollY}
                  scrollInputRangeEnd={scrollInputRangeEnd}
                  parallaxIntensity={parallaxIntensity}
                />
              );
            
            case 'quotesBlock':
              return (
                <QuotesBlock
                  key={section.id}
                  config={config}
                  content={section.content}
                  isMobile={isMobile}
                  referenceWidth={referenceWidth}
                  currentGlobalTopMarginPx={currentGlobalTopMarginPx}
                  scrollY={scrollY}
                  scrollInputRangeEnd={scrollInputRangeEnd}
                  parallaxIntensity={parallaxIntensity}
                  onQuoteClick={handleQuoteClick}
                />
              );

            case 'articlePreviewViewer':
              return (
                <div
                  key={section.id}
                  style={{
                    position: 'absolute',
                    top: `${((config.top + currentGlobalTopMarginPx) / referenceWidth) * 100}vw`,
                    left: config.left,
                    width: `calc(100% - ${config.left} - ${config.right})`,
                    pointerEvents: 'auto',
                  }}
                >
                  <ArticlePreviewViewer
                    title={section.content.title!}
                    subtitle={section.content.subtitle}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Author Modal */}
      {selectedAuthor && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
          onClick={closeAuthorModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative transform transition-all duration-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Spinner */}
            {isAuthorModalLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            )}

            {/* Left Side: Bio */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 self-center flex-shrink-0">
                <Image src={selectedAuthor.pictureURL || '/images/avatars/avatar1.png'} alt={selectedAuthor.name} fill className="object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">{selectedAuthor.name}</h2>
              <p className="text-md italic text-center text-gray-500 dark:text-gray-400 mb-6">{selectedAuthor.institute || 'No institute information'}</p>
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>{selectedAuthor.bio || "No biography available."}</p>
              </div>
            </div>

            {/* Right Side: Articles */}
            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900/50 p-8 overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-orange-500 pb-2">Contributions</h3>
              {selectedAuthor.articles && selectedAuthor.articles.length > 0 ? (
                <ul className="space-y-3">
                  {selectedAuthor.articles.map((article: ArticleItem) => (
                    <li key={article._id}>
                      <Link
                        href={`/${article.year?.slug?.current}/outputs#article-${article._id}`}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        onClick={closeAuthorModal}
                      >
                        <span>{article.title}</span>
                        <span className="ml-4 flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                          &gt;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No articles by this author.</p>
              )}
            </div>
            
            {/* Close Button */}
            <button
              onClick={closeAuthorModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
          onClick={closeVideoModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative transform transition-all duration-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Spinner */}
            {isVideoModalLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            )}

            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-contain"
              onLoadedData={() => setIsVideoModalLoading(false)}
            >
              Your browser does not support the video tag.
            </video>

            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}