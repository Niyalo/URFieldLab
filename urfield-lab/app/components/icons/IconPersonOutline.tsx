import React from 'react';

const IconPersonOutline: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1" // Reduced stroke width for a cleaner look
    {...props}
  >
    <circle cx="8" cy="6" r="3.25" />
    <path d="m2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5" />
  </svg>
);

export default IconPersonOutline;