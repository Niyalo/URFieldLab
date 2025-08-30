import React from 'react';

const IconPersonFilled: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    // Use the same viewBox as the outline for perfect alignment
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* These paths are adjusted to fit within the 16x16 outline's shape */}
    <circle cx="8" cy="6" r="3.25" />
    <path d="M8 9.25C4.75 9.25 2.75 11.75 2.75 14.25H13.25C13.25 11.75 11.25 9.25 8 9.25Z" />
  </svg>
);

export default IconPersonFilled;