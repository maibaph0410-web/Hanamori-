import React from 'react';
import { EmotionType, EMOTIONS } from '../types';

interface SproutIconProps {
  emotion: EmotionType;
  className?: string;
  size?: number;
}

export const SproutIcon: React.FC<SproutIconProps> = ({
  emotion,
  className = '',
  size = 32,
}) => {
  const info = EMOTIONS[emotion] || EMOTIONS.happy;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`overflow-visible inline-block ${className}`}
    >
      <defs>
        {/* Soft Soil Mound */}
        <radialGradient id={`soil-${emotion}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#795548" />
          <stop offset="100%" stopColor="#4e342e" />
        </radialGradient>
      </defs>

      {/* Tiny soil mound with pebble */}
      <ellipse cx="20" cy="32" rx="14" ry="5.5" fill={`url(#soil-${emotion})`} />
      <circle cx="14" cy="31" r="1.5" fill="#a1887f" />
      <circle cx="25" cy="33" r="1.2" fill="#8d6e63" />

      {/* Tender green sprout stem */}
      <path
        d="M 20 31 Q 20 22 19 16"
        stroke="#40916c"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Distinctive baby sprout leaves based on emotion */}
      {renderSproutFoliage(emotion, info.themeColor, info.secondaryColor)}
    </svg>
  );
};

function renderSproutFoliage(emotion: EmotionType, themeColor: string, secColor: string) {
  switch (emotion) {
    case 'happy':
      // Cherry Blossom sprout: tender leaves + soft pink flower bud
      return (
        <g>
          {/* Left leaf */}
          <path d="M 19 22 Q 11 20 10 14 C 13 13 18 16 19 20" fill="#74c69d" stroke="#52b788" strokeWidth="0.8" />
          {/* Right leaf */}
          <path d="M 19 21 Q 27 18 28 12 C 25 12 21 16 19 19" fill="#74c69d" stroke="#52b788" strokeWidth="0.8" />
          {/* Pink blossom bud at top */}
          <circle cx="19" cy="14" r="4.2" fill={themeColor} />
          <circle cx="19" cy="14" r="2.2" fill="#fff" opacity="0.9" />
          <circle cx="19" cy="14" r="1" fill="#ffe066" />
        </g>
      );

    case 'sad':
      // Weeping droplet sprout: delicate blue leaf with glistening tear dewdrop
      return (
        <g>
          <path d="M 19 23 Q 12 22 11 16 C 14 15 18 18 19 21" fill="#52b788" />
          {/* Dewdrop bud */}
          <path
            d="M 20 10 C 16 15 16 20 20 20 C 24 20 24 15 20 10 Z"
            fill={themeColor}
            stroke="#91a7ff"
            strokeWidth="0.8"
          />
          <circle cx="19" cy="16" r="1" fill="#ffffff" />
        </g>
      );

    case 'peaceful':
      // Zen mint double leaf shoot
      return (
        <g>
          <path d="M 19 22 Q 10 20 9 13 C 13 12 18 16 19 20" fill="#52b788" />
          <path d="M 19 20 Q 28 17 29 10 C 25 10 20 15 19 18" fill="#74c69d" />
          <circle cx="19" cy="13" r="2.2" fill="#ffffff" stroke="#52b788" strokeWidth="0.8" />
        </g>
      );

    case 'lonely':
      // Indigo twilight shoot with golden star bud
      return (
        <g>
          <path d="M 19 23 Q 12 21 11 15 C 14 14 18 18 19 21" fill="#52b788" />
          <path d="M 19 20 Q 27 18 27 12 C 24 12 20 16 19 18" fill="#74c69d" />
          {/* Tiny golden star at tip */}
          <polygon
            points="19,8 20,11 23,11 20.5,13 21.5,16 19,14 16.5,16 17.5,13 15,11 18,11"
            fill="#ffd166"
          />
        </g>
      );

    case 'love':
      // Heart-shaped twin baby cotyledon leaves
      return (
        <g>
          {/* Cute pink heart baby leaf */}
          <path
            d="M 19 18 C 19 11 11 9 11 15 C 11 20 19 24 19 24 C 19 24 27 20 27 15 C 27 9 19 11 19 18 Z"
            fill={themeColor}
          />
          <path
            d="M 19 19 C 19 14 13 12 13 16 C 13 19 19 22 19 22 C 19 22 25 19 25 16 C 25 12 19 14 19 19 Z"
            fill={secColor}
          />
        </g>
      );

    case 'angry':
      // Fire-leaf sprout with warm flame tip
      return (
        <g>
          <path d="M 19 23 Q 11 22 10 16 C 14 15 18 19 19 21" fill="#52b788" />
          {/* Flame bud */}
          <path
            d="M 19 8 C 22 12 24 15 22 18 C 20 20 17 19 16 17 C 15 14 17 11 19 8 Z"
            fill="#ff5400"
          />
          <path
            d="M 19 12 C 20.5 14 21.5 16 20.5 17.5 C 19.5 18.5 18 18 17.5 17 Z"
            fill="#ffbe0b"
          />
        </g>
      );

    case 'hope':
      // Golden dawn sunbeam leaf sprout
      return (
        <g>
          <path d="M 19 22 Q 10 19 9 12 C 13 12 18 16 19 20" fill="#74c69d" />
          <path d="M 19 20 Q 28 17 29 10 C 25 10 20 15 19 18" fill="#52b788" />
          {/* Sunburst bud */}
          <circle cx="19" cy="12" r="3.5" fill="#ffd166" />
          <circle cx="19" cy="12" r="1.5" fill="#ffffff" />
        </g>
      );
  }
}
