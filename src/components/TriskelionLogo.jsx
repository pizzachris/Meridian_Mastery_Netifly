import React from 'react';

const TriskelionLogo = ({ size = 64, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="48" fill="#7B2D26" stroke="#FFD700" strokeWidth="4" />
    <g stroke="#FFD700" strokeWidth="5" strokeLinecap="round" fill="none">
      <path d="M50 20 Q60 35 50 50 Q40 65 50 80" />
      <path d="M50 20 Q35 30 50 50 Q65 70 50 80" transform="rotate(120 50 50)" />
      <path d="M50 20 Q65 30 50 50 Q35 70 50 80" transform="rotate(240 50 50)" />
    </g>
  </svg>
);

export default TriskelionLogo; 