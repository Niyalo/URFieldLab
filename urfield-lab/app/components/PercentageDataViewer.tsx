"use client";

import React, { useState, useRef, useLayoutEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, type MotionValue } from 'framer-motion';
import IconPersonOutline from './icons/IconPersonOutline';
import IconPersonFilled from './icons/IconPersonFilled';

// --- TYPES ---

type Percentage = {
  value: number;
  color: string;
};

type DataStatement = {
  id: string;
  title?: string; // Optional title for each statement
  text: string;
  percentages: Percentage[];
};

type PercentageDataViewerContent = {
  title: string;
  subtitle?: string; // Optional subtitle for the whole component
  statements: DataStatement[];
};

type BlockConfig = {
  top: number;
  left: string;
  right: string;
  textAlign: CSSProperties['textAlign'];
  textColor: string;
  textScale: number;
  animation: object; // was 'any'
  parallaxFactor?: number; // Add optional parallaxFactor
};

type PercentageDataViewerProps = {
  content: PercentageDataViewerContent;
  config: BlockConfig;
  isMobile: boolean;
  referenceWidth: number;
  currentGlobalTopMarginPx: number;
  // Add parallax-related props
  scrollY: MotionValue<number>;
  scrollInputRangeEnd: number;
  parallaxIntensity: number;
};

// --- HELPERS ---

// Re-usable mapRange function
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  if (inMin === inMax) return outMin;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Re-usable parallax hook
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


// This function determines the color for each icon based on the active statement's percentages
const getIconColor = (index: number, percentages: Percentage[]): string | null => {
  const sortedPercentages = [...percentages].sort((a, b) => a.value - b.value);
  for (const p of sortedPercentages) {
    if (index < p.value) {
      return p.color;
    }
  }
  return null;
};

// --- NEW HELPER to style percentages in text ---
const formatStatementText = (text: string, percentages: Percentage[]) => {
  if (!percentages || percentages.length === 0) {
    return text;
  }

  // Create a map for quick color lookup, e.g., "30%" -> "#34D399"
  const colorMap = new Map<string, string>();
  percentages.forEach(p => {
    colorMap.set(`${p.value}%`, p.color);
  });

  // Create a regex to find all percentage strings, e.g., /(30%|20%|55%)/g
  const regex = new RegExp(`(${[...colorMap.keys()].join('|')})`, 'g');
  
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // If the part is a key in our map, it's a percentage we need to style
    if (colorMap.has(part)) {
      return (
        <strong
          key={index}
          className="font-bold"
          style={{ 
            color: colorMap.get(part),
            fontSize: '1.1em' // Makes the percentage text slightly larger
          }}
        >
          {part}
        </strong>
      );
    }
    // Otherwise, just return the plain text part
    return part;
  });
};


// --- COMPONENT ---

const PercentageDataViewer: React.FC<PercentageDataViewerProps> = ({
  content,
  config,
  isMobile,
  referenceWidth,
  currentGlobalTopMarginPx,
  scrollY,
  scrollInputRangeEnd,
  parallaxIntensity,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const textContentRef = useRef<HTMLDivElement>(null);

  // Apply parallax transformation
  const y = useParallaxTransform(scrollY, config.parallaxFactor, scrollInputRangeEnd, isMobile, parallaxIntensity);

  // Use a layout effect and resize observer to measure the text content height
  useLayoutEffect(() => {
    const element = textContentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setTextHeight(element.offsetHeight);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);


  const blockStyle: CSSProperties & { '--text-scale': number } = {
    position: 'absolute',
    top: `${((config.top + currentGlobalTopMarginPx) / referenceWidth) * 100}vw`,
    left: config.left,
    // By removing 'right' and setting 'width', we create a predictable container
    // for the inner flex items.
    width: `calc(100% - ${config.left} - ${config.right})`,
    color: config.textColor,
    '--text-scale': config.textScale,
    pointerEvents: 'auto',
  };

  const activePercentages = content.statements[activeIndex]?.percentages || [];

  return (
    <motion.div
      className="w-full flex flex-col box-border p-[1.2vw]"
      style={{ ...blockStyle, y }}
      {...config.animation}
    >
      {/* Centered Title and Subtitle */}
      <div className="text-center mb-8 md:mb-12">
        <h2
          className="font-bold uppercase leading-tight"
          style={{
            fontSize: isMobile ? 'clamp(22px, 5.5vw, 30px)' : `calc(2.8vw * var(--text-scale))`
          }}
        >
          {content.title}
        </h2>
        {content.subtitle && (
          <p
            className="relative leading-relaxed mt-2 opacity-80"
            style={{
              fontSize: isMobile ? 'clamp(14px, 3.6vw, 16px)' : `calc(1.2vw * var(--text-scale))`
            }}
          >
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Main content area with statements and grid */}
      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Side: Statements List */}
        <div className="w-full md:w-1/2" ref={textContentRef}>
          <div className="flex flex-col gap-4">
            {content.statements.map((statement, index) => (
              <motion.div
                key={statement.id}
                onMouseEnter={() => setActiveIndex(index)}
                className="relative cursor-pointer p-4 border-l-4"
                initial="rest"
                animate={activeIndex === index ? 'active' : 'rest'}
                variants={{
                  rest: { borderColor: config.textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
                  active: { borderColor: '#FF8C00' },
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#FF8C00]/10"
                  variants={{
                    rest: { width: '0%' },
                    active: { width: '100%' },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                {/* Render statement title if it exists */}
                {statement.title && (
                  <h3
                    className="relative font-bold uppercase text-sm mb-2 tracking-wider"
                    style={{
                      fontSize: isMobile ? 'clamp(12px, 3vw, 14px)' : `calc(0.9vw * var(--text-scale))`
                    }}
                  >
                    {statement.title}
                  </h3>
                )}
                <p
                  className="relative leading-relaxed"
                  style={{
                    fontSize: isMobile ? 'clamp(14px, 3.6vw, 16px)' : `calc(1.1vw * var(--text-scale))`
                  }}
                >
                  {formatStatementText(statement.text, statement.percentages)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Icon Grid (wrapped for centering and sizing) */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div
            // On mobile, this wrapper div is now 50% width, constraining the grid inside.
            // On desktop, it's full-width within its half of the flex container.
            className="w-1/2 md:w-full"
          >
            <div
              // Always a 10x10 grid. On mobile, the container size is reduced, scaling the grid down.
              // On desktop, it's a square that fills the available width of its new, smaller parent.
              className="grid grid-cols-10 grid-rows-10 gap-1"
              style={{
                // On desktop, the grid's size is linked to the text block's height.
                // On mobile, it's a square that fills the available width of its new, smaller parent.
                width: isMobile ? '100%' : `min(${textHeight}px, 100%)`,
                height: isMobile ? 'auto' : `min(${textHeight}px, 100%)`,
                aspectRatio: '1 / 1', // Ensures the grid is always a perfect square
                gridAutoRows: '1fr'
              }}
            >
              {Array.from({ length: 100 }).map((_, i) => {
                const color = getIconColor(i, activePercentages);
                return (
                  <div key={i} className="relative w-full h-full p-0.5">
                    <IconPersonOutline className="absolute inset-0 w-full h-full text-black/20" />
                    <AnimatePresence>
                      {color && (
                        <motion.div
                          className="absolute inset-0 w-full h-full"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.3 },
                          }}
                          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        >
                          <IconPersonFilled style={{ color }} className="w-full h-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PercentageDataViewer;