"use client";

import React, { useState, useEffect, useMemo, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue, type Variants, type MotionProps } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CloudParallax from './components/CloudParallax';
import PercentageDataViewer from './components/PercentageDataViewer';

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
      const currentHeight = window.innerHeight;
      setIsMobileState(
        currentWidth < breakpoint ||
        (currentHeight > 0 && currentWidth / currentHeight <= aspectRatioThreshold)
      );
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

const pageSections = [
  {
    id: 'hero',
    type: 'textBlock' as const, // Use 'as const' for type safety
    content: {
      pre: "",
      h1: "UNDERSTANDING RISK FIELD LABS",
      sub: "",
      desc: "The Understanding Risk (UR) Field Labs are collaborative, unstructured, un-conferences that bring together people to produce creative approaches to address today's most pressing climate and disaster risk management issues.",
      cta: "START EXPLORING"
    },
    desktopConfig: { top: 420, left: '25%', right: '25%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 1.0, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } as MotionProps },
    mobileConfig: { top: -200, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.9, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } as MotionProps }
  },
  {
    id: 'theFieldLabExperience',
    type: 'textBlock' as const,
    content: {
      h2: "The Field Lab experience",
      h3: "",
      p: "Over four weeks, participants from around the world co-design a schedule and form working groups to develop projects, ranging from art to research.",
      cta: "THE SCHEDULE"
    },
    desktopConfig: { top: 1300, left: '10%', right: '65%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 1.2, textColor: '#000000ff', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.0 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps },
    mobileConfig: { top: 1550, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.5, textColor: '#000000ff', animation: { initial: { opacity: 0, y: 13 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps }
  },
  {
    id: 'whyTheFieldLab',
    type: 'textBlock' as const,
    content: {
      h2: "The Field Lab experience",
      h3: "",
      p: "We need to develop new and effective ways of working with climate change data, while also working to create a more equitable and pluralistic data. (change)",
      cta: "HOW TO RUN A FIELD LAB"
    },
    desktopConfig: { top: 1800, left: '65%', right: '5%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 1.2, textColor: '#ffffffff', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.0 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps },
    mobileConfig: { top: 1550, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.5, textColor: '#ffffffff', animation: { initial: { opacity: 0, y: 13 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1.6, ease: "easeOut" } } as MotionProps }
  },
  {
    id: 'locations',
    type: 'textBlock' as const,
    content: {
      h2: "GLOBAL LOCATIONS",
      h3: "THE MYTH OF THE BENEVOLENT ALIEN",
      p: "The Field Lab is held in locations around the world that are on the frontlines of climate and disaster risk",
      cta: "EXPLORE LOCATIONS"
    },
    desktopConfig: { top: 2200, left: '5%', right: '65%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 0.9, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps },
    mobileConfig: { top: 5000, left: '10%', right: '10%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.7, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps }
  },
  // --- NEW PERCENTAGE DATA VIEWER SECTION ---
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
            { value: 80, color: '#4caeecff' }, // Blue
            { value: 50, color: '#4451c5ff' }  // Indigo
          ]
        },
        {
          id: 's3',
          title: "During Field Lab",
          text: "90% made progress, and 18% completed, an idea or project that they worked on during the Field Lab.",
          percentages: [
            { value: 90, color: '#a2d330ff' }, 
            { value: 18, color: '#107213ff' }] 
        },
        {
          id: 's4',
          title: "Continuation of Project",
          text: "64% have kept on working on something they initiated at the Field Lab",
          percentages: [
            { value: 64, color: '#e68027ff' }, 

          ]
        }
      ]
    },
    // Positioned where 'ecosystems' was, with 25% side gaps and black text.
    desktopConfig: { top: 2900, left: '25%', right: '25%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 0.9, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps },
    mobileConfig: { top: 3400, left: '5%', right: '5%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.2, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } as MotionProps }
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
}

// Use this type for your arrays:
const desktopImages: BaseImageConfig[] = [
  { id: 'Mountain outline', src: 'images/URFieldLabMainPage/Mountain_outline.png', top: 370, zIndex: 1, refHeight: 700, parallaxFactor: 0.1, opacity: 0.3, blendMode: 'multiply' },

  { id: 'Trees left', src: '/images/URFieldLabMainPage/trees-left.png', top: 624, zIndex: 2, refHeight: 600, parallaxFactor: 0.2 },
  { id: 'Trees right', src: '/images/URFieldLabMainPage/trees-right.png', top: 646, zIndex: 3, refHeight: 600, parallaxFactor: 0.3 },

  { id: 'Boats', src: '/images/URFieldLabMainPage/boats.png', top: 1300, zIndex: 5, refHeight: 600, parallaxFactor: 0.6, leftGapPercent: 40, rightGapPercent: 5 },

  { id: 'water 1', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 1500, zIndex: 2, refHeight: 600, parallaxFactor: 0.1, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'water 2', src: '/images/URFieldLabMainPage/Blue stuff cropped.png', top: 1600, zIndex: 2, refHeight: 600, parallaxFactor: 0.2, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 3', src: '/images/URFieldLabMainPage/Blue stuff.png', top: 1700, zIndex: 2, refHeight: 600, parallaxFactor: 0.3, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},
  { id: 'water 4', src: '/images/URFieldLabMainPage/Blue stuff cropped 2.png', top: 1800, zIndex: 2, refHeight: 600, parallaxFactor: 0.4, leftGapPercent: 0, rightGapPercent: 0, blendMode: 'multiply'},

  { id: 'Locations', src: '/images/URFieldLabMainPage/Locations.png', top: 2200, zIndex: 5, refHeight: 600, parallaxFactor: 0.6, leftGapPercent: 40, rightGapPercent: 5 },

  /*{ id: 'D_Image8', src: '/images/truth/dams/farm.png', top: 1602, zIndex: 7, refHeight: 600, parallaxFactor: 1.0 },
  { id: 'D_Image5', src: '/images/truth/dams/dam.png', top: 933, zIndex: 8, refHeight: 800, parallaxFactor: 0.8 },
  { id: 'D_Image9', src: '/images/truth/my`th/rock-right.png', top: 2803, zIndex: 9, refHeight: 700, parallaxFactor: 0.5 },
  { id: 'D_Image10', src: '/images/truth/healthy/river-complex.png', top: 2869, zIndex: 10, refHeight: 900, parallaxFactor: 0.5 },
  { id: 'D_Image11', src: '/images/truth/healthy/woman.png', top: 4000, zIndex: 11, refHeight: 700, parallaxFactor: 0.9 },
  { id: 'D_Image12', src: '/images/truth/action/bridge.png', top: 4300, zIndex: 12, refHeight: 800, parallaxFactor: 1.1 },
  { id: 'D_Image13', src: '/images/truth/action/mountains.png', top: 4553, zIndex: 13, refHeight: 700, parallaxFactor: 0.8 },
  { id: 'D_Image14', src: '/images/truth/action/ladies.png', top: 4800, zIndex: 14, refHeight: 403, parallaxFactor: 0.0 },*/
];

const mobileImages: BaseImageConfig[] = [
  { id: 'M_Image_SetDam', src: '/images/truth/mobile/set-dam.png', top: 590, zIndex: 2, refHeight: 2677, parallaxFactor: 0, opacity: 0.8 },
  { id: 'M_Image_WaterLong', src: '/images/truth/mobile/water-long.jpg', top: 2883, zIndex: 0, refHeight: 4449, parallaxFactor: 0 },
  { id: 'M_Image_Houses', src: '/images/truth/mobile/houses.png', top: 4169, zIndex: 3, refHeight: 1116, parallaxFactor: 0 },
  { id: 'M_Image_HealthySet', src: '/images/truth/mobile/healthy-set.png', top: 6073, zIndex: 4, refHeight: 3104, parallaxFactor: 0 },
  { id: 'M_Image_Woman', src: '/images/truth/mobile/woman.png', top: 7638, zIndex: 5, refHeight: 959, parallaxFactor: 0 },
  { id: 'M_Image_ActionSet', src: '/images/truth/mobile/action-set.png', top: 8330, zIndex: 6, refHeight: 1291, parallaxFactor: 0 },
  { id: 'M_Image_Ladies', src: '/images/truth/mobile/ladies.png', top: 9179, zIndex: 7, refHeight: 463, parallaxFactor: 0 },
];

const clouds = [
    { id: 'cloud1', src: '/images/clouds/cloud_new_1.png', top: 200, zIndex: 1, speed: 20, width: '35vw', timeOffset: 0 },
    { id: 'cloud2', src: '/images/clouds/cloud_new_2.png', top: 450, zIndex: 1, speed: 15, width: '40vw', timeOffset: 15 },
    { id: 'cloud3', src: '/images/clouds/cloud_new_3.png', top: 300, zIndex: 15, speed: 35, width: '25vw', timeOffset: 5 },
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

const plusVariants: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: 90, transition: { duration: 0.3, ease: "easeOut" } }
} as const;

// --- DEDICATED TEXT BLOCK COMPONENT ---
// This component is now more generic and receives its data from the main page loop.

// Extracting config types for cleaner props
type TextBlockConfig = typeof pageSections[0]['desktopConfig'] | typeof pageSections[0]['mobileConfig'];
type TextBlockContent = typeof pageSections[0]['content'];

type TextBlockProps = {
    config: TextBlockConfig;
    content: TextBlockContent;
    isHero: boolean;
    scrollY: MotionValue<number>;
    scrollInputRangeEnd: number;
    isMobile: boolean;
    parallaxIntensity: number;
    currentGlobalTopMarginPx: number;
    referenceWidth: number;
};

const TextBlock: React.FC<TextBlockProps> = ({ config, content, isHero, scrollY, scrollInputRangeEnd, isMobile, parallaxIntensity, currentGlobalTopMarginPx, referenceWidth }) => {
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
                    <p className="text-[1.1vw] max-w-[40vw] mx-auto mt-[2vw]" style={{ fontSize: `calc(1.1vw * var(--text-scale))` }}>{content.desc || ''}</p>
                    <motion.a href="#explore" className="inline-block mt-[2vw] text-[1vw] tracking-wider relative group" whileHover="hover" initial="rest" style={{ fontSize: `calc(1vw * var(--text-scale))` }}>
                        <span className="relative inline-block after:content-[''] after:absolute after:w-full after:h-px after:bg-current after:bottom-[-2px] after:left-0 after:origin-right after:scale-x-100 group-hover:after:origin-left group-hover:after:animate-[strike-and-disappear_0.6s_forwards]">{content.cta || ''}</span>
                        <motion.span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-lg" variants={arrowVariants}>↓</motion.span>
                    </motion.a>
                </>
            ) : (
                <div className={`max-w-[35vw] ${config.textAlign === 'center' ? 'mx-auto' : ''}`}>
                    <h2 className="text-[2.5vw] font-bold uppercase leading-tight" style={{ fontSize: `calc(2.5vw * var(--text-scale))` }}>{content.h2 || ''}</h2>
                    <h3 className="text-[1.5vw] uppercase mt-[0.5vw] mb-[1.5vw]" style={{ fontSize: `calc(1.5vw * var(--text-scale))` }}>{content.h3 || ''}</h3>
                    <p className="text-[1.1vw] leading-relaxed" style={{ fontSize: `calc(1.1vw * var(--text-scale))` }}>{content.p || ''}</p>
                    <motion.a
                        href="#"
                        className="inline-flex items-center gap-3 mt-[2vw] text-[1vw] tracking-wider group bg-[#FF8C00] text-white px-5 py-2.5 rounded-full border-2 border-[#FF8C00] transition-colors duration-300 hover:bg-white hover:text-[#FF8C00]"
                        whileHover="hover"
                        initial="rest"
                        style={{ fontSize: `calc(1vw * var(--text-scale))` }}
                    >
                        <span className="flex items-center justify-center w-8 h-8 border border-current rounded-full">
                            <motion.span variants={plusVariants}>+</motion.span>
                        </span>
                        <span>{content.cta || ''}</span>
                    </motion.a>
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
type ImageConfig = BaseImageConfig;

// --- IMAGE COMPONENT ---
type ParallaxImageProps = {
    img: ImageConfig;
    scrollY: MotionValue<number>;
    scrollInputRangeEnd: number;
    isMobile: boolean;
    parallaxIntensity: number;
    currentGlobalTopMarginPx: number;
    referenceWidth: number;
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({
    img,
    scrollY,
    scrollInputRangeEnd,
    isMobile,
    parallaxIntensity,
    currentGlobalTopMarginPx,
    referenceWidth
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
            style={{
                top: `${(effectiveTopPx / referenceWidth) * 100}vw`,
                left: `calc(${leftGap}%)`,
                width: `calc(100vw - ${leftGap}% - ${rightGap}%)`,
                zIndex: img.zIndex,
                y: imageY,
                opacity: imageOpacity,
                position: 'absolute',
                mixBlendMode: blendMode, // NEW
            }}
        />
    );
};


// --- MAIN PAGE COMPONENT ---

export default function AnimatedPage() {
  const isMobile = useIsMobile();
  const [headerIsLight, setHeaderIsLight] = useState(false);
  const parallaxIntensity = 1;

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

  const referenceWidth = 1280;
  // Global top margin is now device-dependent
  const currentGlobalTopMarginPx = isMobile ? 600 : -250;
  const imagesToDisplay = isMobile ? mobileImages : desktopImages;

  const containerHeightVw = useMemo(() => {
    if (!imagesToDisplay.length) return 50;
    const lastImage = imagesToDisplay[imagesToDisplay.length - 1];
    const lastImageAdjustedTop = lastImage.top + currentGlobalTopMarginPx;
    return ((lastImageAdjustedTop + lastImage.refHeight) / referenceWidth) * 100;
  }, [imagesToDisplay, referenceWidth, currentGlobalTopMarginPx]);

  const scrollInputRangeEnd = useMemo(() => {
    return (containerHeightVw / 100) * referenceWidth * 1.5;
  }, [containerHeightVw, referenceWidth]);

  return (
    <div key={isMobile ? 'mobile' : 'desktop'} className="relative bg-transparent font-sans">
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
            />
        ))}
      </motion.div>

      {/* Absolutely positioned container for all interactive/content sections */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
        {/* --- DEVELOPER NOTE --- */}
        {/* --- STEP 2: RENDER SECTIONS DYNAMICALLY --- */}
        {/* This loop renders each section from the `pageSections` array. */}
        {pageSections.map((section) => {
          // Determine the correct config based on the device
          const config = isMobile ? section.mobileConfig : section.desktopConfig;
          
          // We no longer create a single `commonProps` object here.
          // Instead, we'll pass props inside the switch case where types are narrowed.

          // --- DEVELOPER NOTE ---
          // --- STEP 3: ADD A CASE FOR YOUR NEW SECTION TYPE ---
          // Add a new `case` here to render your new component.
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
                />
              );

            // case 'imageGroup':
            //   return <ImageGroupBlock key={section.id} {...commonProps} />;
            
            // case 'survey':
            //   return <SurveyBlock key={section.id} {...commonProps} />;

            default:
              // Render nothing if the type is unknown
              return null;
          }
        })}
      </div>

      <Footer />
    </div>
  );
}