"use client";

import React from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

interface CloudParallaxProps {
  src: string;
  top: number; // px
  zIndex: number;
  speed: number; // px per second
  width?: string; // e.g. '30vw', '400px'
  referenceWidth?: number; // default 1280
  timeOffset?: number; // seconds
}

const CloudParallax: React.FC<CloudParallaxProps> = ({
  src,
  top,
  zIndex,
  speed,
  width = '30vw',
  referenceWidth = 1280,
  timeOffset = 0,
}) => {
  const x = useMotionValue(0);
  const [vwWidth, setVwWidth] = React.useState(referenceWidth);

  React.useEffect(() => {
    // Set initial width and add resize listener
    const handleResize = () => setVwWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cloudPixelWidth = React.useMemo(() => {
    if (width.endsWith('vw')) {
      return (parseFloat(width) / 100) * vwWidth;
    }
    if (width.endsWith('px')) {
      return parseFloat(width);
    }
    return 400; // fallback
  }, [width, vwWidth]);

  useAnimationFrame((t) => {
    const totalDistance = vwWidth + cloudPixelWidth;
    const pxPerMs = speed / 1000;
    const offsetMs = timeOffset * 1000;
    const newX = (((t + offsetMs) * pxPerMs) % totalDistance) - cloudPixelWidth;
    x.set(newX);
  });

  return (
    <motion.img
      src={src}
      alt="Cloud"
      className="select-none pointer-events-none will-change-transform"
      style={{
        position: 'absolute',
        top: `${(top / referenceWidth) * 100}vw`,
        left: 0,
        zIndex,
        width,
        height: 'auto',
        x, // Apply the motion value directly
      }}
      draggable={false}
    />
  );
};

export default CloudParallax;