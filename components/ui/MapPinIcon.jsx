import React from 'react';

const MapPinIcon = ({ number, color = '#df4312', className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 56"
      width="40px"
      height="56px"
      className={className}
      style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }}
      {...props}
    >
      <path
        d="M 18,2 C 9.163,2 2,9.163 2,18 C 2,28 18,50 18,50 C 18,50 34,28 34,18 C 34,9.163 26.837,2 18,2 Z"
        fill={color}
        stroke="white"
        strokeWidth="2.5"
      />
      <circle cx="18" cy="18" r="11" fill="white" />
      <text
        x="18"
        y="23"
        fill={color}
        fontSize="15px"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
      >
        {number}
      </text>
    </svg>
  );
};

export default MapPinIcon;
