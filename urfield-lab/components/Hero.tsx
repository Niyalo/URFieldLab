import React from 'react';

interface HeroProps {
  title: string;
  backgroundImage: string;
  backgroundColor?: string;
  paddingTop?: string;
}

export default function Hero({ 
  title, 
  backgroundImage, 
  backgroundColor = 'rgb(51, 51, 51)',
  paddingTop = '171.984px'
}: HeroProps) {
  return (
    <div 
      className="relative min-h-[50vh] bg-cover bg-center bg-no-repeat -top-[80px]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundColor: backgroundColor,
        paddingTop: paddingTop
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 
            className="text-white font-light leading-tight mb-0"
            style={{
              fontFamily: 'Muli, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.3rem)',
              lineHeight: '1.14',
              letterSpacing: '0.9px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(0, 0, 0, 0.3), 2px -2px 4px rgba(0, 0, 0, 0.3), -2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
