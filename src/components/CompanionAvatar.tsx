import React from 'react';

interface CompanionAvatarProps {
  size?: number;
  mood?: 'happy' | 'gentle' | 'listening' | 'excited' | 'thoughtful';
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  size = 72,
  mood = 'gentle',
}) => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Gentle Floating Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-300/40 via-amber-200/30 to-purple-300/40 blur-md animate-pulse" />

      {/* Main Celestial Companion SVG (Hana the Garden Spirit) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 animate-[bounce_4s_ease-in-out_infinite]"
      >
        <defs>
          <radialGradient id="spiritGlow" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fff1f5" />
            <stop offset="100%" stopColor="#fecdd3" />
          </radialGradient>
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb3cb" />
            <stop offset="100%" stopColor="#ffe4e9" />
          </linearGradient>
        </defs>

        {/* Soft Celestial Spirit Ears (Flower Petal Ears) */}
        {/* Left Ear */}
        <ellipse
          cx="32"
          cy="28"
          rx="9"
          ry="17"
          transform="rotate(-25 32 28)"
          fill="url(#spiritGlow)"
          stroke="#f472b6"
          strokeWidth="1.5"
        />
        <ellipse
          cx="32"
          cy="28"
          rx="5"
          ry="11"
          transform="rotate(-25 32 28)"
          fill="url(#earGradient)"
        />

        {/* Right Ear */}
        <ellipse
          cx="68"
          cy="28"
          rx="9"
          ry="17"
          transform="rotate(25 68 28)"
          fill="url(#spiritGlow)"
          stroke="#f472b6"
          strokeWidth="1.5"
        />
        <ellipse
          cx="68"
          cy="28"
          rx="5"
          ry="11"
          transform="rotate(25 68 28)"
          fill="url(#earGradient)"
        />

        {/* Head / Body (Plump cozy cloud-like round spirit) */}
        <circle
          cx="50"
          cy="56"
          r="34"
          fill="url(#spiritGlow)"
          stroke="#f472b6"
          strokeWidth="1.8"
        />

        {/* Golden Blossom Star on forehead */}
        <circle cx="50" cy="36" r="3.5" fill="#fde047" stroke="#f59e0b" strokeWidth="1" />
        <path
          d="M 50 30 L 51 34 L 55 35 L 51 36 L 50 40 L 49 36 L 45 35 L 49 34 Z"
          fill="#fbbf24"
        />

        {/* Rosy Pastel Cheeks */}
        <ellipse cx="32" cy="62" rx="5" ry="3.2" fill="#fb7185" opacity="0.6" />
        <ellipse cx="68" cy="62" rx="5" ry="3.2" fill="#fb7185" opacity="0.6" />

        {/* Expressive Sparkly Eyes based on mood */}
        {mood === 'happy' || mood === 'excited' ? (
          // Happy crescent curved eyes
          <g stroke="#831843" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M 35 52 Q 40 47 45 52" />
            <path d="M 55 52 Q 60 47 65 52" />
          </g>
        ) : (
          // Open big shiny curious eyes
          <g>
            <ellipse cx="40" cy="52" rx="3.8" ry="5.2" fill="#831843" />
            <ellipse cx="60" cy="52" rx="3.8" ry="5.2" fill="#831843" />
            {/* Sparkle highlights */}
            <circle cx="38.5" cy="50" r="1.6" fill="#ffffff" />
            <circle cx="58.5" cy="50" r="1.6" fill="#ffffff" />
            <circle cx="41.2" cy="53.5" r="0.8" fill="#ffffff" />
            <circle cx="61.2" cy="53.5" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* Cute Gentle Mouth */}
        {mood === 'excited' || mood === 'happy' ? (
          <path
            d="M 46 60 Q 50 65 54 60"
            stroke="#9d174d"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="#f472b6"
          />
        ) : (
          <path
            d="M 47 60 Q 50 63 53 60"
            stroke="#9d174d"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Tiny floating paws */}
        <ellipse cx="40" cy="74" rx="4.5" ry="3" fill="#ffffff" stroke="#f472b6" strokeWidth="1" />
        <ellipse cx="60" cy="74" rx="4.5" ry="3" fill="#ffffff" stroke="#f472b6" strokeWidth="1" />
      </svg>
    </div>
  );
};
