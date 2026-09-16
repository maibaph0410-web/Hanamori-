import React from 'react';
import { sound } from '../audio';
import { CharacterCustomization } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Sparkles, Edit3 } from 'lucide-react';

interface StartScreenProps {
  userName?: string;
  customization?: CharacterCustomization;
  onEnter: () => void;
  onEditCharacter?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  userName,
  customization,
  onEnter,
  onEditCharacter,
}) => {
  const handleEnterClick = () => {
    sound.playClick();
    onEnter();
  };

  const isReturningUser = Boolean(userName && userName.trim());

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#ffedf4] via-[#ffd6e4] to-[#fbcfe8] select-none overflow-hidden">
      {/* Floating background petals / sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        {[
          { top: '15%', left: '12%', delay: '0s', size: '20px' },
          { top: '25%', left: '80%', delay: '1.2s', size: '16px' },
          { top: '65%', left: '18%', delay: '2.4s', size: '24px' },
          { top: '75%', left: '75%', delay: '0.8s', size: '18px' },
          { top: '40%', left: '88%', delay: '1.8s', size: '22px' },
          { top: '10%', left: '50%', delay: '3.1s', size: '14px' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-300/50 blur-[1px] animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: '3.5s',
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Center Hero Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/80 shadow-2xl shadow-pink-300/40">
        {/* Character Avatar or Mascot Flower Icon */}
        {isReturningUser && customization ? (
          <div className="mb-4 relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-pink-100/80 border-2 border-white shadow-md flex items-center justify-center overflow-visible relative pt-2">
              <CharacterAvatar
                customization={customization}
                direction="down"
                size={65}
                enableIdleAnim={true}
              />
            </div>
            {onEditCharacter && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onEditCharacter();
                }}
                className="mt-2 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-[11px] font-extrabold text-[#9d3862] border border-pink-200 shadow-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Character</span>
              </button>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-pink-200/50 animate-ping opacity-40" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center shadow-lg border-2 border-white text-3xl">
              🌸
            </div>
          </div>
        )}

        {/* Title */}
        <h1
          id="hanamori-title"
          className="text-4xl sm:text-5xl font-black tracking-wider text-[#9d3862] mb-2 drop-shadow-sm font-['Zen_Maru_Gothic']"
        >
          HANAMORI
        </h1>

        {/* Greeting / Subtitle */}
        <p className="text-base sm:text-lg font-semibold text-[#8b4363] mb-8 font-['Nunito']">
          {isReturningUser ? (
            <span className="flex items-center justify-center gap-1.5">
              <span>Welcome back, {userName}</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </span>
          ) : (
            'Every feeling leaves a little tree.'
          )}
        </p>

        {/* Enter Hanamori Button */}
        <button
          id="enter-hanamori-btn"
          onClick={handleEnterClick}
          className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-pink-400/50 border border-white/40 cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 group"
        >
          <span>{isReturningUser ? `ENTER ${userName.toUpperCase()}'S HANAMORI` : 'ENTER HANAMORI'}</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform">🌸</span>
        </button>

        {/* Features hint */}
        <div className="mt-8 pt-6 border-t border-pink-200/60 w-full flex items-center justify-center gap-4 text-xs font-bold text-pink-700/80">
          <span>🌿 Cozy Garden</span>
          <span>•</span>
          <span>📖 Memory Diary</span>
          <span>•</span>
          <span>🎹 Solo Piano</span>
        </div>
      </div>
    </div>
  );
};
