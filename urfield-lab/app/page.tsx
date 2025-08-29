"use client";

import React, { useState, useEffect, useMemo, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue, type Variants } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CloudParallax from './components/CloudParallax';

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


// --- DATA FOR IMAGES, TEXT, AND ANIMATIONS ---

const desktopImages = [
  { id: 'D_Image7', src: '/images/truth/dams/water.jpg', top: 1647, zIndex: 0, refHeight: 800, parallaxFactor: 0.1 },
  { id: 'D_Image1', src: '/images/truth/dirty/mountain.jpg', top: 573, zIndex: 2, refHeight: 700, parallaxFactor: 0.1 },
  { id: 'D_Image4', src: '/images/truth/dirty/trees-right.png', top: 646, zIndex: 3, refHeight: 600, parallaxFactor: 0.2 },
  { id: 'D_Image2', src: '/images/truth/dirty/water.png', top: 984, zIndex: 4, refHeight: 500, parallaxFactor: 0.1 },
  { id: 'D_Image3', src: '/images/truth/dirty/trees-left.png', top: 674, zIndex: 5, refHeight: 600, parallaxFactor: 0.3 },
  { id: 'D_Image6', src: '/images/truth/dirty/trees-front.png', top: 887, zIndex: 6, refHeight: 700, parallaxFactor: 0.5 },
  { id: 'D_Image8', src: '/images/truth/dams/farm.png', top: 1602, zIndex: 7, refHeight: 600, parallaxFactor: 1.0 },
  { id: 'D_Image5', src: '/images/truth/dams/dam.png', top: 933, zIndex: 8, refHeight: 800, parallaxFactor: 0.8 },
  { id: 'D_Image9', src: '/images/truth/myth/rock-right.png', top: 2803, zIndex: 9, refHeight: 700, parallaxFactor: 0.5 },
  { id: 'D_Image10', src: '/images/truth/healthy/river-complex.png', top: 2869, zIndex: 10, refHeight: 900, parallaxFactor: 0.5 },
  { id: 'D_Image11', src: '/images/truth/healthy/woman.png', top: 4000, zIndex: 11, refHeight: 700, parallaxFactor: 0.9 },
  { id: 'D_Image12', src: '/images/truth/action/bridge.png', top: 4300, zIndex: 12, refHeight: 800, parallaxFactor: 1.1 },
  { id: 'D_Image13', src: '/images/truth/action/mountains.png', top: 4553, zIndex: 13, refHeight: 700, parallaxFactor: 0.8 },
  { id: 'D_Image14', src: '/images/truth/action/ladies.png', top: 4800, zIndex: 14, refHeight: 403, parallaxFactor: 0.0 },
];

const mobileImages = [
  { id: 'M_Image_SetDam', src: '/images/truth/mobile/set-dam.png', top: 590, zIndex: 2, refHeight: 2677, parallaxFactor: 0 },
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

const desktopSettings = {
  globalTopMarginPx: -250,
  textBlocks: {
    hero: { top: 320, left: '20%', right: '20%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 1.0, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } },
    damsAndDiversions: { top: 1150, left: '10%', right: '60%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.8, textScale: 0.9, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.0 }, transition: { duration: 1.6, ease: "easeOut" } } },
    ecosystems: { top: 1960, left: '25%', right: '25%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 0.9, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    cleanGreen: { top: 2780, left: '25%', right: '25%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.1, textScale: 0.9, textColor: '#000000', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    healthyRivers: { top: 3330, left: '10%', right: '58%', textAlign: 'left' as CSSProperties['textAlign'], parallaxFactor: 0.0, textScale: 1.0, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    saveBlueHeart: { top: 4530, left: '15%', right: '15%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0.0, textScale: 0.8, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
  }
} as const;

const mobileSettings = {
  globalTopMarginPx: 600,
  textBlocks: {
    hero: { top: -200, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.9, textColor: '#000000', animation: { initial: { opacity: 1 }, animate: { opacity: 1 } } },
    damsAndDiversions: { top: 1550, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.5, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 13 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1.6, ease: "easeOut" } } },
    ecosystems: { top: 3400, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.5, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    cleanGreen: { top: 5000, left: '10%', right: '10%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.7, textColor: '#000000', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    healthyRivers: { top: 6700, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.8, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
    saveBlueHeart: { top: 8550, left: '5%', right: '5%', textAlign: 'center' as CSSProperties['textAlign'], parallaxFactor: 0, textScale: 1.5, textColor: '#FFFFFF', animation: { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: false, amount: 0.3 }, transition: { duration: 1.8, ease: "easeOut" } } },
  }
} as const;

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
type TextBlockConfig = typeof desktopSettings.textBlocks[keyof typeof desktopSettings.textBlocks] | typeof mobileSettings.textBlocks[keyof typeof mobileSettings.textBlocks];

type TextBlockProps = {
    config: TextBlockConfig;
    content: { [key: string]: string | undefined };
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
                    <h1 className="text-[5.5vw] font-bold uppercase leading-none my-[1vw]" style={{ fontSize: `calc(5.5vw * var(--text-scale))` }}>{content.h1 || ''}</h1>
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


// --- IMAGE COMPONENT ---
type ImageConfig = typeof desktopImages[0] | typeof mobileImages[0];

type ParallaxImageProps = {
    img: ImageConfig;
    scrollY: MotionValue<number>;
    scrollInputRangeEnd: number;
    isMobile: boolean;
    parallaxIntensity: number;
    currentGlobalTopMarginPx: number;
    referenceWidth: number;
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({ img, scrollY, scrollInputRangeEnd, isMobile, parallaxIntensity, currentGlobalTopMarginPx, referenceWidth }) => {
    const effectiveTopPx = img.top + currentGlobalTopMarginPx;
    const imageY = useParallaxTransform(scrollY, img.parallaxFactor, scrollInputRangeEnd, isMobile, parallaxIntensity, 500);

    return (
        <motion.img
            className="absolute left-0 w-screen h-auto object-cover"
            src={img.src}
            alt={img.id}
            style={{
                top: `${(effectiveTopPx / referenceWidth) * 100}vw`,
                zIndex: img.zIndex,
                y: imageY,
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
  const currentSettings = isMobile ? mobileSettings : desktopSettings;
  const imagesToDisplay = isMobile ? mobileImages : desktopImages;
  const currentGlobalTopMarginPx = currentSettings.globalTopMarginPx;

  const containerHeightVw = useMemo(() => {
    if (!imagesToDisplay.length) return 50;
    const lastImage = imagesToDisplay[imagesToDisplay.length - 1];
    const lastImageAdjustedTop = lastImage.top + currentGlobalTopMarginPx;
    return ((lastImageAdjustedTop + lastImage.refHeight) / referenceWidth) * 100;
  }, [imagesToDisplay, referenceWidth, currentGlobalTopMarginPx]);

  const scrollInputRangeEnd = useMemo(() => {
    return (containerHeightVw / 100) * referenceWidth * 1.5;
  }, [containerHeightVw, referenceWidth]);

  const { hero, damsAndDiversions, ecosystems, cleanGreen, healthyRivers, saveBlueHeart } = currentSettings.textBlocks;

  const textBlockData = [
    { config: hero, content: { pre: "THE MARTIAN TRUTH", h1: "ALL ALIENS ARE GOOFY", sub: "(AND SO ARE THE SPACESHIPS THEY FLY)", desc: "Goofy aliens are the only 'extraterrestrial' life form sending rovers to sleep, misplacing keys globally, and contributing to cosmic giggles.", cta: "START SCANNING (THE TRUTH)" } },
    { config: damsAndDiversions, content: { h2: "ANTENNAS & XRAY MACHINES", h3: "WHICH IS WORSE?", p: "Antennas and XRAY machines are both startling to unsuspecting humans and the cows who graze among them. On Mars, 91% of the more than 3,000 'first contact' attempts involve small, wiggly antennas...", cta: "GET XRAYED" } },
    { config: ecosystems, content: { h2: "MARTIAN LANDSCAPES AND THEIR ANCIENT SECRETS UNCOVERED", h3: "WHAT LIES BENEATH THE SAND", p: "What really goes on under the crimson dust? We've uncovered evidence of elaborate alien tunnel systems... small enough for a Martian to fit through, as well as their strange exotic pets with mysterious origins. They also seem to really like icy treats, which is a bit concerning...", cta: "UNEARTH ANOMALIES" } },
    { config: cleanGreen, content: { h2: "FRIENDLY VISITORS? OR DEEPER INTENTIONS", h3: "THE MYTH OF THE BENEVOLENT ALIEN", p: "They offer advanced technology, universal peace, and free ice cream. Or do they? Martian history is full of stories about 'friendly' visitors who left behind mysterious gadgets, cryptic messages, and the occasional melted dessert. But are these gifts truly benevolent, or is there a deeper agenda beneath those shiny saucers and generous smiles? The truth may be stranger—and stickier—than we think.", cta: "QUESTION MOTIVES" } },
    { config: healthyRivers, content: { h2: "WE NEED HAPPY MARTIANS", h3: "THE BENEFITS OF REGULAR SNACKS", p: "A well-fed Martian is a non-destructive Martian. Studies show a direct correlation... between snack frequency and overall happiness. So let's keep those cheese puffs coming!", cta: "OFFER A CHEESE PUFF" } },
    { config: saveBlueHeart, content: { h2: "SAVE THE RED PLANET", h3: "A CALL TO THE STARS (AND YOUR LOCAL GROCER)", p: "Mars needs us! And by 'us,' we mean our spare change for their intergalactic vending machines...", cta: "DONATE YOUR SOCKS" } },
  ];

  return (
    <div key={isMobile ? 'mobile' : 'desktop'} className="relative bg-[#f2f1ea] font-sans">
      <Header isLight={headerIsLight} />

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

      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
        {textBlockData.map((data, index) => (
          <TextBlock
            key={index}
            {...data}
            isHero={index === 0}
            scrollY={scrollY}
            scrollInputRangeEnd={scrollInputRangeEnd}
            isMobile={isMobile}
            parallaxIntensity={parallaxIntensity}
            currentGlobalTopMarginPx={currentGlobalTopMarginPx}
            referenceWidth={referenceWidth}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}