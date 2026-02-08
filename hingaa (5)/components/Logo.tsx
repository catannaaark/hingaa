
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => (
  <div className={className}>
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <circle cx="500" cy="500" r="450" fill="#8f1d17" />
      <circle cx="400" cy="310" r="45" fill="black" />
      <circle cx="600" cy="310" r="45" fill="black" />
      <path d="M400 380 Q300 500 400 710" fill="none" stroke="black" stroke-width="60" stroke-linecap="round" />
      <path d="M600 380 Q700 500 600 710" fill="none" stroke="black" stroke-width="60" stroke-linecap="round" />
      <line x1="400" y1="545" x2="600" y2="545" stroke="black" stroke-width="60" stroke-linecap="round" />
    </svg>
  </div>
);

export default Logo;
