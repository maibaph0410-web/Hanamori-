import React from 'react';

interface HanamoriGrandTreeProps {
  memoryCount: number;
  isNearby: boolean;
  onClick: () => void;
}

export const HanamoriGrandTree: React.FC<HanamoriGrandTreeProps> = ({
  memoryCount,
  isNearby,
  onClick,
}) => {
  // Tree scale grows subtly with more memories (base 1.0, max 1.35)
  const growthScale = Math.min(1.35, 1 + (memoryCount * 0.025));
  // Glow brightness scales with memory count
  const glowIntensity = Math.min(30, 12 + memoryCount * 2);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group relative cursor-pointer select-none"
      style={{
        width: '240px',
        height: '270px',
        transform: `scale(${growthScale})`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Mystical Grand Aura */}
      <div
        className="absolute -inset-6 rounded-full blur-2xl opacity-60 transition-opacity duration-700 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,182,193,0.8) 0%, rgba(216,180,254,0.4) 60%, transparent 80%)',
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255, 150, 200, 0.6))`,
        }}
      />

      {/* Interaction Circle when Mori is nearby */}
      {isNearby && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full border-2 border-dashed border-pink-400 animate-[spin_16s_linear_infinite] pointer-events-none bg-pink-400/10" />
      )}

      {/* Floating Name Badge */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 font-bold transition-all duration-300 pointer-events-none flex items-center gap-2 shadow-lg ${
          isNearby
            ? 'scale-110 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-pink-300/50 -translate-y-1'
            : 'bg-white/90 text-pink-900 border border-pink-200 group-hover:scale-105'
        }`}
      >
        <span className="text-base">🌸</span>
        <span className="tracking-wider text-xs uppercase font-extrabold">HANAMORI TREE</span>
        <span className="text-[10px] bg-pink-100/30 text-white/90 px-1.5 py-0.5 rounded-full">
          Lv. {Math.max(1, memoryCount)}
        </span>
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full bg-stone-900/25 blur-[3px] pointer-events-none" />

      {/* SVG Grand Majestic Tree */}
      <svg viewBox="0 0 240 270" className="w-full h-full overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="grandTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a4437" />
            <stop offset="35%" stopColor="#965a4a" />
            <stop offset="70%" stopColor="#6e392e" />
            <stop offset="100%" stopColor="#52271d" />
          </linearGradient>
          <radialGradient id="grandCanopyCenter" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ffc2d4" />
            <stop offset="65%" stopColor="#ff70a6" />
            <stop offset="100%" stopColor="#c77dff" />
          </radialGradient>
          <radialGradient id="grandCanopyLeft" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffd8e8" />
            <stop offset="70%" stopColor="#ff85a1" />
            <stop offset="100%" stopColor="#b5179e" />
          </radialGradient>
          <radialGradient id="grandCanopyRight" cx="60%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f3c4fb" />
            <stop offset="60%" stopColor="#d884fb" />
            <stop offset="100%" stopColor="#7209b7" />
          </radialGradient>
        </defs>

        {/* Ancient Roots Spreading */}
        <g stroke="#52271d" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M 85 240 Q 55 252 35 258" />
          <path d="M 155 240 Q 185 252 205 258" />
          <path d="M 100 245 Q 85 258 70 262" />
          <path d="M 140 245 Q 155 258 170 262" />
        </g>

        {/* Ancient Giant Trunk */}
        <path
          d="M 92 140 
             Q 96 195 85 245 
             L 155 245 
             Q 144 195 148 140 Z"
          fill="url(#grandTrunkGrad)"
        />

        {/* Bark Spiral Swirls and Sacred Carvings */}
        <path d="M 105 160 Q 120 185 110 220" stroke="#451e16" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 135 155 Q 120 190 132 230" stroke="#451e16" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="120" cy="180" rx="4" ry="7" fill="#3a1610" />

        {/* Massive Sprawling Branches */}
        <path d="M 100 150 Q 50 120 40 85" stroke="#6e392e" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 140 150 Q 190 120 200 85" stroke="#6e392e" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 120 140 Q 120 90 120 70" stroke="#6e392e" strokeWidth="14" strokeLinecap="round" fill="none" />

        {/* Great Blossoming Cloud Foliage */}
        <circle cx="50" cy="95" r="48" fill="url(#grandCanopyLeft)" />
        <circle cx="190" cy="95" r="48" fill="url(#grandCanopyRight)" />
        <circle cx="120" cy="70" r="62" fill="url(#grandCanopyCenter)" />
        <circle cx="85" cy="110" r="38" fill="#ff70a6" opacity="0.9" />
        <circle cx="155" cy="110" r="38" fill="#c77dff" opacity="0.9" />
        <circle cx="120" cy="100" r="42" fill="#ffd6e8" />

        {/* Golden Sacred Spirit Crystals / Hanging Charms */}
        {[
          { x: 50, y: 135, r: 4 },
          { x: 80, y: 145, r: 5 },
          { x: 120, y: 140, r: 6 },
          { x: 160, y: 145, r: 5 },
          { x: 190, y: 135, r: 4 },
        ].map((pt, i) => (
          <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
            <line x1="0" y1="-18" x2="0" y2="0" stroke="#e0aaff" strokeWidth="1.2" strokeDasharray="2,2" />
            <polygon
              points="0,-6 4,-1 3,5 -3,5 -4,-1"
              fill="#ffd166"
              filter="drop-shadow(0 0 5px #ffb703)"
            />
          </g>
        ))}

        {/* Constellation Sparkles */}
        {[
          { x: 100, y: 55 },
          { x: 140, y: 65 },
          { x: 70, y: 80 },
          { x: 170, y: 75 },
          { x: 120, y: 35 },
        ].map((pt, i) => (
          <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
            <circle cx="0" cy="0" r="3" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />
          </g>
        ))}
      </svg>

      {/* Floating Prompt when Mori approaches */}
      {isNearby && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xl border border-white/40 animate-bounce pointer-events-none flex items-center gap-1.5">
          <span>✨</span>
          <span>Your memories make Hanamori grow.</span>
          <span className="text-[10px] opacity-75 font-normal">(Press E)</span>
        </div>
      )}
    </div>
  );
};
