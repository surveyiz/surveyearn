import React from 'react';

const HeroIllustration: React.FC = () => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect x="80" y="40" width="240" height="200" rx="10" fill="#ffffff" />
        <rect x="100" y="60" width="200" height="30" rx="5" fill="#f0f9ff" />
        <rect x="100" y="100" width="200" height="20" rx="5" fill="#e0f2fe" />
        <rect x="100" y="130" width="200" height="20" rx="5" fill="#e0f2fe" />
        <rect x="100" y="160" width="200" height="20" rx="5" fill="#e0f2fe" />
        <rect x="100" y="190" width="80" height="30" rx="5" fill="#0ea5e9" />
        <circle cx="320" cy="100" r="30" fill="#d946ef" opacity="0.6" />
        <circle cx="50" cy="150" r="25" fill="#10b981" opacity="0.6" />
        <circle cx="350" cy="200" r="20" fill="#8b5cf6" opacity="0.6" />
        <path d="M120 105 L130 115 L145 95" stroke="#10b981" strokeWidth="3" fill="none" />
        <path d="M120 135 L130 145 L145 125" stroke="#10b981" strokeWidth="3" fill="none" />
        <path d="M120 165 L130 175 L145 155" stroke="#10b981" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
};

export default HeroIllustration;