"use client";

import React, { type CSSProperties } from 'react';
import { motion, type MotionProps, type MotionValue, type Variants } from 'framer-motion';
import Image from 'next/image';

// --- TYPES ---

type Quote = {
  id: string;
  text: string;
  author: string;
  avatarSrc: string;
};

type QuotesBlockContent = {
  title: string;
  quotes: Quote[];
};

type BlockConfig = {
  top: number;
  left: string;
  right: string;
  textAlign: CSSProperties['textAlign'];
  textColor: string;
  textScale: number;
  animation: MotionProps;
};

type QuotesBlockProps = {
  content: QuotesBlockContent;
  config: BlockConfig;
  isMobile: boolean;
  referenceWidth: number;
  currentGlobalTopMarginPx: number;
  // Parallax props are passed but not used here to keep the component simple.
  // Could be used in the future to parallax the whole block.
  scrollY: MotionValue<number>;
  scrollInputRangeEnd: number;
  parallaxIntensity: number;
};

// --- COMPONENT ---

const QuotesBlock: React.FC<QuotesBlockProps> = ({
  content,
  config,
  isMobile,
  referenceWidth,
  currentGlobalTopMarginPx,
}) => {
  const blockStyle: CSSProperties & { '--text-scale': number } = {
    position: 'absolute',
    top: `${((config.top + currentGlobalTopMarginPx) / referenceWidth) * 100}vw`,
    left: config.left,
    width: `calc(100% - ${config.left} - ${config.right})`,
    color: config.textColor,
    '--text-scale': config.textScale,
    pointerEvents: 'auto',
    zIndex: 25, // Ensure it's on top of other elements
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const quoteVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: isMobile ? 0 : (i % 2) * 25, // Stagger every other quote by 25px on desktop
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2 + i * 0.15,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center box-border p-[1.2vw]"
      style={blockStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...config.animation}
    >
      {/* Title */}
      <motion.h2
        className="font-script text-center mb-8 md:mb-16"
        style={{
          fontSize: isMobile ? 'clamp(32px, 8vw, 48px)' : `calc(4vw * var(--text-scale))`,
          color: config.textColor,
        }}
        variants={titleVariants}
      >
        {content.title}
      </motion.h2>

      {/* Quotes Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {content.quotes.map((quote, index) => {
          // For mobile, alternate margin left/right
          const mobileStaggerStyle: CSSProperties = isMobile
            ? (index % 2 === 0
                ? { marginRight: '12vw' }
                : { marginLeft: '12vw' })
            : {};

          return (
            <motion.div
              key={quote.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white/30 backdrop-blur-sm shadow-lg"
              custom={index}
              variants={quoteVariants}
              style={mobileStaggerStyle}
            >
              <p
                className="text-left mb-4"
                style={{
                  fontSize: isMobile ? 'clamp(14px, 3.5vw, 16px)' : `calc(0.9vw * var(--text-scale))`,
                }}
              >
                “{quote.text}”
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <Image
                  src={quote.avatarSrc}
                  alt={quote.author}
                  width={isMobile ? 32 : 40}
                  height={isMobile ? 32 : 40}
                  className="rounded-full"
                />
                <span
                  className="font-script"
                  style={{
                    fontSize: isMobile ? 'clamp(16px, 4vw, 20px)' : `calc(1.5vw * var(--text-scale))`,
                  }}
                >
                  {quote.author}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuotesBlock;