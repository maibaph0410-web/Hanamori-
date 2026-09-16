import React, { useState, useEffect } from 'react';
import { EmotionType, EMOTIONS, TreeGrowthStage } from '../types';
import { SproutIcon } from './SproutIcon';

interface EmotionalTreeProps {
  id: string;
  emotion: EmotionType;
  title: string;
  isNearby: boolean;
  isNewlyPlanted?: boolean;
  growthStage?: TreeGrowthStage;
  hasMedia?: boolean;
  mediaCount?: number;
  hasNote?: boolean;
  onClick: () => void;
}

export const EmotionalTree: React.FC<EmotionalTreeProps> = ({
  emotion,
  title,
  isNearby,
  isNewlyPlanted = false,
  growthStage = 'mature',
  hasMedia = false,
  mediaCount = 0,
  hasNote = false,
  onClick,
}) => {
  const emotionInfo = EMOTIONS[emotion] || EMOTIONS.happy;

  // If newly planted, smoothly animate through stages: sprout -> sapling -> mature
  const [animStage, setAnimStage] = useState<TreeGrowthStage>(
    isNewlyPlanted ? 'sprout' : growthStage
  );
  const [showGrowthBurst, setShowGrowthBurst] = useState(isNewlyPlanted);

  useEffect(() => {
    if (isNewlyPlanted) {
      // Stage 1: sprout (0 - 900ms)
      setAnimStage('sprout');
      setShowGrowthBurst(true);

      // Stage 2: sapling (900ms - 1800ms)
      const t1 = setTimeout(() => {
        setAnimStage('sapling');
      }, 900);

      // Stage 3: mature (1800ms+)
      const t2 = setTimeout(() => {
        setAnimStage('mature');
      }, 1900);

      const t3 = setTimeout(() => {
        setShowGrowthBurst(false);
      }, 3200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setAnimStage(growthStage);
    }
  }, [isNewlyPlanted, growthStage]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group relative cursor-pointer select-none"
      style={{
        width: '120px',
        height: '140px',
      }}
    >
      {/* Newly Planted Growth Particles Burst */}
      {showGrowthBurst && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          {/* Glowing Aura Ring */}
          <div className="absolute w-36 h-36 rounded-full border-2 border-yellow-300/80 animate-ping opacity-60" />
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-300/30 to-pink-300/30 blur-md animate-pulse" />

          {/* Floating Sparkles & Petals */}
          {[
            { x: -30, y: -20, s: '🌸' },
            { x: 28, y: -35, s: '✨' },
            { x: -24, y: 15, s: '🌱' },
            { x: 32, y: 10, s: '✨' },
            { x: 0, y: -45, s: '💛' },
          ].map((pt, i) => (
            <div
              key={i}
              className="absolute text-sm animate-bounce"
              style={{
                transform: `translate(${pt.x}px, ${pt.y}px)`,
                animationDuration: `${1.2 + i * 0.2}s`,
              }}
            >
              {pt.s}
            </div>
          ))}
        </div>
      )}

      {/* Interaction Highlight Ring when Mori is nearby */}
      {isNearby && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-10 rounded-full border-2 border-dashed border-pink-400/80 animate-pulse pointer-events-none bg-pink-300/15" />
      )}

      {/* Floating Memory Tag / Bubble */}
      <div
        className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-300 pointer-events-none flex items-center gap-1.5 shadow-sm ${
          isNearby
            ? 'opacity-100 scale-105 bg-white/95 text-pink-900 border border-pink-300 shadow-md translate-y-[-4px]'
            : 'opacity-80 scale-95 bg-white/80 text-stone-700 border border-white/60 group-hover:opacity-100 group-hover:scale-100'
        }`}
      >
        <span>{emotionInfo.emoji}</span>
        <span className="max-w-[100px] truncate">{title}</span>
        {hasMedia && (
          <span className="text-[10px] px-1 py-0.2 rounded-full bg-pink-100 text-pink-700 flex items-center gap-0.5">
            📷 {mediaCount > 1 ? mediaCount : ''}
          </span>
        )}
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full bg-stone-900/20 blur-[2px] pointer-events-none" />

      {/* Tree SVG Graphic depending on Stage */}
      <div className="w-full h-full transform transition-all duration-500 ease-out group-hover:scale-105">
        {renderStageVisual(emotion, animStage)}
      </div>

      {/* Nearby Action Prompt Pill */}
      {isNearby && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 animate-bounce pointer-events-none flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span>Press E to remember</span>
        </div>
      )}
    </div>
  );
};

function renderStageVisual(emotion: EmotionType, stage: TreeGrowthStage) {
  if (stage === 'sprout') {
    // 🌱 Stage 1: Sprout
    return (
      <div className="w-full h-full flex flex-col items-center justify-end pb-3 animate-in zoom-in-50 duration-500">
        <SproutIcon emotion={emotion} size={54} className="animate-bounce" />
        <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1.5 py-0.5 rounded-full mt-1 shadow-xs">
          🌱 Sprout
        </span>
      </div>
    );
  }

  if (stage === 'sapling') {
    // 🌿 Stage 2: Young Sapling Tree
    return renderSaplingSvg(emotion);
  }

  // 🌳 Stage 3 & 4: Mature / Magical
  return renderTreeSvg(emotion);
}

function renderSaplingSvg(emotion: EmotionType) {
  const info = EMOTIONS[emotion] || EMOTIONS.happy;

  return (
    <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible animate-in zoom-in-75 duration-700">
      {/* Slender trunk */}
      <path d="M 57 85 Q 56 110 50 132 L 70 132 Q 64 110 63 85 Z" fill="#6c584c" />
      {/* Tender young branch */}
      <path d="M 58 100 Q 42 88 38 80" stroke="#6c584c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 62 95 Q 78 84 82 78" stroke="#6c584c" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Young compact foliage puffs */}
      <circle cx="36" cy="78" r="14" fill="#74c69d" />
      <circle cx="84" cy="76" r="14" fill="#74c69d" />
      <circle cx="60" cy="65" r="22" fill={info.secondaryColor} />
      <circle cx="60" cy="58" r="16" fill={info.themeColor} />

      {/* Tiny emotion indicator at crown */}
      <circle cx="60" cy="54" r="5" fill="#ffffff" />
      <text x="60" y="58" fontSize="8" textAnchor="middle">
        {info.emoji}
      </text>
    </svg>
  );
}


function renderTreeSvg(emotion: EmotionType) {
  switch (emotion) {
    case 'happy':
      // 🌸 HAPPY TREE: Pink cherry blossom canopy with layered petals and flower clusters
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="happyTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8d5b4c" />
              <stop offset="50%" stopColor="#734335" />
              <stop offset="100%" stopColor="#572e23" />
            </linearGradient>
            <radialGradient id="happyCanopy1" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffb3cb" />
              <stop offset="70%" stopColor="#ff709b" />
              <stop offset="100%" stopColor="#e84a7d" />
            </radialGradient>
            <radialGradient id="happyCanopy2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffd4e3" />
              <stop offset="60%" stopColor="#ff85ab" />
              <stop offset="100%" stopColor="#fa5289" />
            </radialGradient>
          </defs>
          {/* Trunk */}
          <path d="M 54 75 Q 52 110 44 130 L 76 130 Q 68 108 66 75 Z" fill="url(#happyTrunk)" />
          <path d="M 44 130 Q 32 135 28 136 L 46 130" stroke="#572e23" strokeWidth="3" strokeLinecap="round" />
          <path d="M 76 130 Q 86 134 92 136 L 74 130" stroke="#572e23" strokeWidth="3" strokeLinecap="round" />
          {/* Branches */}
          <path d="M 56 85 Q 35 68 28 55" stroke="#734335" strokeWidth="5" strokeLinecap="round" />
          <path d="M 64 85 Q 85 68 92 55" stroke="#734335" strokeWidth="5" strokeLinecap="round" />

          {/* Lush Pink Foliage Puffs */}
          <circle cx="34" cy="56" r="28" fill="url(#happyCanopy1)" />
          <circle cx="86" cy="56" r="28" fill="url(#happyCanopy1)" />
          <circle cx="60" cy="40" r="34" fill="url(#happyCanopy2)" />
          <circle cx="46" cy="62" r="22" fill="#ff99bc" />
          <circle cx="74" cy="62" r="22" fill="#ff80a8" />

          {/* Cherry Blossoms Details */}
          {[
            { x: 50, y: 35 },
            { x: 70, y: 42 },
            { x: 38, y: 55 },
            { x: 82, y: 58 },
            { x: 60, y: 64 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(0.8)`}>
              <circle cx="0" cy="-4" r="3.2" fill="#ffffff" opacity="0.9" />
              <circle cx="4" cy="-1.5" r="3.2" fill="#ffffff" opacity="0.9" />
              <circle cx="2.5" cy="3.5" r="3.2" fill="#ffffff" opacity="0.9" />
              <circle cx="-2.5" cy="3.5" r="3.2" fill="#ffffff" opacity="0.9" />
              <circle cx="-4" cy="-1.5" r="3.2" fill="#ffffff" opacity="0.9" />
              <circle cx="0" cy="0" r="2" fill="#ffd166" />
            </g>
          ))}
        </svg>
      );

    case 'sad':
      // 🌧️ SAD TREE: Blue-purple weeping willow style, teardrop/dew leaves, soft blue glow
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="sadTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#495057" />
              <stop offset="100%" stopColor="#212529" />
            </linearGradient>
            <linearGradient id="sadLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#748ffc" />
              <stop offset="60%" stopColor="#4c6ef5" />
              <stop offset="100%" stopColor="#3b5bdb" />
            </linearGradient>
          </defs>
          {/* Trunk */}
          <path d="M 55 65 Q 52 100 46 132 L 74 132 Q 68 100 65 65 Z" fill="url(#sadTrunk)" />
          {/* Weeping Canopy Dome */}
          <ellipse cx="60" cy="48" rx="46" ry="32" fill="#4263eb" opacity="0.85" />
          <ellipse cx="60" cy="44" rx="38" ry="26" fill="#5c7cfa" />

          {/* Cascading Weeping Willow Tendrils with Raindrop Leaves */}
          {[
            'M 25 45 Q 16 75 22 105',
            'M 38 48 Q 30 82 36 112',
            'M 52 50 Q 48 85 50 115',
            'M 68 50 Q 72 85 70 115',
            'M 82 48 Q 90 82 84 112',
            'M 95 45 Q 104 75 98 105',
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#3b5bdb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Teardrop Dew Leaf at end */}
              <circle cx={i * 15 + 20} cy={100 + (i % 2) * 10} r="3.5" fill="#a5d8ff" />
              <circle cx={i * 15 + 22} cy={75 + (i % 3) * 6} r="2.8" fill="#d0ebff" />
            </g>
          ))}

          {/* Soft rain glow droplet on center */}
          <path d="M 60 28 C 56 34, 52 40, 60 45 C 68 40, 64 34, 60 28 Z" fill="#e7f5ff" opacity="0.8" />
        </svg>
      );

    case 'peaceful':
      // 🌱 PEACE TREE: Layered zen mint/emerald bonsai crown with delicate white blossoms
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="peaceTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c584c" />
              <stop offset="100%" stopColor="#4a3b32" />
            </linearGradient>
            <radialGradient id="peaceCanopy" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#80ed99" />
              <stop offset="60%" stopColor="#57cc99" />
              <stop offset="100%" stopColor="#2d6a4f" />
            </radialGradient>
          </defs>
          {/* Twisted Bonsai Style Trunk */}
          <path d="M 52 65 Q 45 95 38 132 L 68 132 Q 62 100 66 70 Z" fill="url(#peaceTrunk)" />
          <path d="M 56 80 Q 82 72 90 62" stroke="#4a3b32" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 50 90 Q 28 85 22 76" stroke="#4a3b32" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Tiered Zen Foliage Clouds */}
          <ellipse cx="24" cy="74" rx="20" ry="14" fill="url(#peaceCanopy)" />
          <ellipse cx="92" cy="60" rx="24" ry="16" fill="url(#peaceCanopy)" />
          <ellipse cx="58" cy="40" rx="36" ry="24" fill="url(#peaceCanopy)" />
          <ellipse cx="58" cy="34" rx="26" ry="18" fill="#a7c957" />

          {/* Gentle White Zen Blossoms */}
          {[
            { x: 55, y: 32 },
            { x: 72, y: 38 },
            { x: 42, y: 42 },
            { x: 92, y: 58 },
            { x: 22, y: 72 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <circle cx="0" cy="0" r="1.2" fill="#ffeaa7" />
            </g>
          ))}
        </svg>
      );

    case 'lonely':
      // 🌙 LONELY TREE: Deep twilight indigo canopy with hanging golden stars and crescent moon
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lonelyTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3c096c" />
              <stop offset="100%" stopColor="#240046" />
            </linearGradient>
            <radialGradient id="lonelyCanopy" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#9d4edd" />
              <stop offset="50%" stopColor="#5a189a" />
              <stop offset="100%" stopColor="#10002b" />
            </radialGradient>
          </defs>
          {/* Trunk */}
          <path d="M 54 75 Q 52 105 46 132 L 74 132 Q 68 105 66 75 Z" fill="url(#lonelyTrunk)" />
          {/* Mystic Indigo Canopy */}
          <circle cx="60" cy="50" r="38" fill="url(#lonelyCanopy)" />
          <circle cx="40" cy="62" r="24" fill="#3c096c" />
          <circle cx="80" cy="62" r="24" fill="#3c096c" />
          <circle cx="60" cy="46" r="28" fill="#7b2cbf" />

          {/* Hanging Crescent Moon on Branch */}
          <path
            d="M 58 20 A 10 10 0 0 0 68 34 A 8 8 0 0 1 58 20 Z"
            fill="#ffea00"
            filter="drop-shadow(0 0 4px #ffd60a)"
          />

          {/* Hanging Golden Stars */}
          {[
            { x: 38, y: 78, s: 0.8 },
            { x: 60, y: 84, s: 1 },
            { x: 82, y: 76, s: 0.8 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(${pt.s})`}>
              <line x1="0" y1="-14" x2="0" y2="0" stroke="#c77dff" strokeWidth="1" strokeDasharray="2,2" />
              <polygon
                points="0,-5 1.5,-1.5 5,-1 2.5,1.5 3,5 0,3 -3,5 -2.5,1.5 -5,-1 -1.5,-1.5"
                fill="#ffd60a"
                filter="drop-shadow(0 0 3px #ffea00)"
              />
            </g>
          ))}
        </svg>
      );

    case 'love':
      // 💗 LOVE TREE: Pink-purple heart-shaped foliage with floating heart accents
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="loveTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8e4a49" />
              <stop offset="100%" stopColor="#592b2a" />
            </linearGradient>
            <radialGradient id="loveCanopy" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff758f" />
              <stop offset="60%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#c9184a" />
            </radialGradient>
          </defs>
          {/* Curved Trunk */}
          <path d="M 53 72 Q 48 105 45 132 L 75 132 Q 68 105 67 72 Z" fill="url(#loveTrunk)" />

          {/* Heart Shaped Foliage Canopy */}
          <path
            d="M 60 40 
               C 60 20, 25 15, 25 45 
               C 25 68, 60 85, 60 92 
               C 60 85, 95 68, 95 45 
               C 95 15, 60 20, 60 40 Z"
            fill="url(#loveCanopy)"
          />

          {/* Inner Heart Layer */}
          <path
            d="M 60 46 
               C 60 30, 36 28, 36 50 
               C 36 67, 60 80, 60 85 
               C 60 80, 84 67, 84 50 
               C 84 28, 60 30, 60 46 Z"
            fill="#ff8fa3"
          />

          {/* Mini Cute Hearts on Branches */}
          {[
            { x: 42, y: 46, s: 0.9 },
            { x: 76, y: 48, s: 0.85 },
            { x: 60, y: 62, s: 1.1 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(${pt.s})`}>
              <path
                d="M 0 -3 C 0 -6, -4 -6, -4 -3 C -4 0, 0 4, 0 6 C 0 4, 4 0, 4 -3 C 4 -6, 0 -6, 0 -3 Z"
                fill="#ffffff"
                opacity="0.95"
              />
            </g>
          ))}
        </svg>
      );

    case 'angry':
      // 🔥 ANGRY TREE: Warm red-orange flame maple canopy with ember spark leaves
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="angryTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#49111c" />
              <stop offset="100%" stopColor="#2b090f" />
            </linearGradient>
            <radialGradient id="angryCanopy" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffbe0b" />
              <stop offset="35%" stopColor="#fb5607" />
              <stop offset="75%" stopColor="#ff006e" />
              <stop offset="100%" stopColor="#8338ec" />
            </radialGradient>
          </defs>
          {/* Rugged Trunk */}
          <path d="M 54 75 L 44 132 L 76 132 L 66 75 Z" fill="url(#angryTrunk)" />

          {/* Fiery Crown Spikes */}
          <path
            d="M 60 20 
               L 72 35 L 90 28 L 84 45 L 102 52 L 86 66 L 94 82 L 75 78 L 60 92 
               L 45 78 L 26 82 L 34 66 L 18 52 L 36 45 L 30 28 L 48 35 Z"
            fill="url(#angryCanopy)"
          />

          {/* Inner Flame Core */}
          <path
            d="M 60 32 
               L 68 44 L 80 40 L 75 52 L 85 62 L 68 68 L 60 76 
               L 52 68 L 35 62 L 45 52 L 40 40 L 52 44 Z"
            fill="#ff7b00"
          />

          {/* Glowing Ember Sparkles */}
          <circle cx="50" cy="45" r="3.5" fill="#ffe066" />
          <circle cx="70" cy="48" r="3" fill="#ffd166" />
          <circle cx="60" cy="58" r="4" fill="#ffffff" />
          <circle cx="85" cy="36" r="2.5" fill="#ffbe0b" />
          <circle cx="34" cy="38" r="2.5" fill="#ffbe0b" />
        </svg>
      );

    case 'hope':
      // ☀️ HOPE TREE: Golden-white radiant leaves with sunburst sparkles and gold crown
      return (
        <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="hopeTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f5539" />
              <stop offset="100%" stopColor="#58311e" />
            </linearGradient>
            <radialGradient id="hopeCanopy" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fff3b0" />
              <stop offset="80%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#f77f00" />
            </radialGradient>
          </defs>
          {/* Graceful Trunk */}
          <path d="M 54 75 Q 52 105 46 132 L 74 132 Q 68 105 66 75 Z" fill="url(#hopeTrunk)" />

          {/* Radiant Sunburst Crown */}
          <circle cx="60" cy="50" r="36" fill="url(#hopeCanopy)" />
          <circle cx="38" cy="60" r="22" fill="#ffd166" />
          <circle cx="82" cy="60" r="22" fill="#ffd166" />
          <circle cx="60" cy="46" r="26" fill="#fff9db" />

          {/* Golden Sunburst Sparkles */}
          {[
            { x: 60, y: 22 },
            { x: 34, y: 44 },
            { x: 86, y: 44 },
            { x: 48, y: 56 },
            { x: 72, y: 56 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
              <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#ffffff" />
              <circle cx="0" cy="0" r="1.5" fill="#f59f00" />
            </g>
          ))}
        </svg>
      );
  }
}
