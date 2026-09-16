import React from 'react';
import { Mail, Sparkles } from 'lucide-react';

interface Mailbox3DProps {
  isNearby: boolean;
  unlockedCount: number;
  totalLetters: number;
  onClick: () => void;
}

export const Mailbox3D: React.FC<Mailbox3DProps> = ({
  isNearby,
  unlockedCount,
  totalLetters,
  onClick,
}) => {
  return (
    <div
      id="mailbox-3d-landmark"
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-transform duration-300 ${
        isNearby ? 'scale-105' : 'hover:scale-102'
      }`}
      title="Mailbox of the Future — Letters to Future Me"
    >
      {/* Floating Indicator / Proximity Badge */}
      <div
        className={`absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 z-30 ${
          isNearby
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-lg shadow-pink-300/40 border border-pink-200 text-[11px] font-extrabold text-stone-800 whitespace-nowrap">
          <span className="text-pink-500">✉️</span>
          <span>Mailbox to Future</span>
          {unlockedCount > 0 ? (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] animate-pulse font-black">
              {unlockedCount} ready!
            </span>
          ) : totalLetters > 0 ? (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 text-[9px]">
              {totalLetters}
            </span>
          ) : null}
          {isNearby && (
            <span className="ml-1 px-1 py-0.2 rounded bg-pink-100 text-pink-700 font-mono text-[9px] border border-pink-200">
              E
            </span>
          )}
        </div>
        {/* Downward triangle arrow */}
        <div className="w-2 h-2 rotate-45 bg-white border-r border-b border-pink-200 -mt-1 shadow-xs" />
      </div>

      {/* Floating Letters Animation above Mailbox */}
      {unlockedCount > 0 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 animate-bounce">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white text-[10px] font-black shadow-md border border-white/60">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Letter Unlocked!</span>
          </div>
        </div>
      )}

      {/* Ground Soft Shadow */}
      <div
        className="w-20 h-8 rounded-full bg-stone-900/20 blur-[2px] mx-auto translate-y-12 scale-y-75 pointer-events-none"
      />

      {/* 3D Mailbox Construction */}
      <div className="relative w-20 h-28 flex flex-col items-center justify-end">
        {/* Little wildflowers at the post base */}
        <div className="absolute bottom-0 z-0 flex items-center gap-1 text-[11px] pointer-events-none opacity-90">
          <span>🌸</span>
          <span className="translate-y-1">🌼</span>
          <span>🌸</span>
        </div>

        {/* Wooden Post Stand */}
        <div className="w-4 h-14 bg-gradient-to-b from-[#8d6e63] to-[#5d4037] rounded-sm shadow-inner relative z-10 border-x border-[#4e342e]">
          {/* Wood grain highlight */}
          <div className="absolute inset-y-0 left-0.5 w-1 bg-white/15" />
        </div>

        {/* Mailbox Body (Cute Japanese Postal Red / Pastel Rose) */}
        <div className="absolute top-1 z-20 w-16 h-13 rounded-t-2xl rounded-b-md bg-gradient-to-b from-rose-400 via-pink-500 to-rose-600 shadow-md shadow-pink-900/30 border border-pink-300/60 flex flex-col items-center justify-between p-1.5 overflow-hidden">
          {/* Subtle 3D Top Highlight */}
          <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl pointer-events-none" />

          {/* Mailbox Letter Slot (Glowing) */}
          <div className="w-11 h-2 bg-stone-900/80 rounded-full mt-1.5 shadow-inner border border-stone-800/40 relative overflow-hidden flex items-center justify-center">
            {/* Soft inner glow */}
            <div className="w-6 h-1 bg-amber-300/70 rounded-full blur-[1px] animate-pulse" />
          </div>

          {/* Front Emblem: Cherry Blossom / Post Horn */}
          <div className="flex items-center justify-center text-xs text-white/95 font-black drop-shadow-sm">
            🌸
          </div>

          {/* Little Front Catch Latch */}
          <div className="w-3.5 h-1.5 bg-amber-300 rounded-sm shadow-xs border border-amber-500/50" />
        </div>

        {/* Mailbox Flag (Side) */}
        <div
          className={`absolute top-5 right-0.5 z-25 w-2 h-7 origin-bottom transition-transform duration-500 ${
            unlockedCount > 0 ? 'rotate-0' : '-rotate-45'
          }`}
        >
          {/* Flag arm */}
          <div className="w-1 h-5 bg-amber-400 rounded-full mx-auto" />
          {/* Flag pennant */}
          <div className="w-4 h-2.5 bg-rose-500 rounded-sm shadow-xs -mt-1 flex items-center justify-center text-[7px] text-white font-black">
            ✉
          </div>
        </div>

        {/* Cherry blossom petals resting on the curved roof */}
        <div className="absolute top-0 left-2 z-30 pointer-events-none text-[10px] transform -rotate-12">
          🌸
        </div>
      </div>
    </div>
  );
};
