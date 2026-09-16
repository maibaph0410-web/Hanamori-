import React from 'react';
import { FutureLetter } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { Lock, Sparkles, Calendar, Heart, Image as ImageIcon } from 'lucide-react';

interface FutureLetterCardProps {
  letter: FutureLetter;
  currentTime: number;
  onClick: () => void;
}

export const FutureLetterCard: React.FC<FutureLetterCardProps> = ({
  letter,
  currentTime,
  onClick,
}) => {
  const isUnlocked = currentTime >= letter.unlockDate || letter.isOpened;
  const moodObj = MOOD_OPTIONS.find((m) => m.type === letter.mood) || MOOD_OPTIONS[0];

  // Calculate days remaining
  const msRemaining = Math.max(0, letter.unlockDate - currentTime);
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-all duration-500 transform hover:-translate-y-2 text-left ${
        isUnlocked ? 'hover:shadow-rose-300/40' : 'hover:shadow-amber-200/40'
      }`}
    >
      {/* 3D Envelope Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 border ${
          isUnlocked
            ? 'bg-gradient-to-b from-[#fff7f8] via-[#fff0f3] to-[#ffe4e8] border-pink-200/90 shadow-lg shadow-pink-200/50'
            : 'bg-gradient-to-b from-[#fdfbf7] via-[#faf6ed] to-[#f4ebe1] border-amber-200/70 shadow-md shadow-stone-300/40'
        }`}
      >
        {/* Envelope Flap Triangular Cutout Pattern */}
        <div className="relative h-16 w-full overflow-hidden">
          {/* Triangular flap background */}
          <div
            className={`absolute -top-14 inset-x-0 h-28 transform origin-top transition-transform duration-300 ${
              isUnlocked
                ? 'bg-gradient-to-b from-pink-100 to-rose-200 border-b-2 border-rose-300/60'
                : 'bg-gradient-to-b from-[#efe4d4] to-[#dfceb9] border-b-2 border-[#cfbeaa]'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />

          {/* Floating Wax Seal */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 transition-transform duration-300 group-hover:scale-110 ${
                isUnlocked
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-400 border-rose-200 text-white'
                  : 'bg-gradient-to-tr from-amber-600 via-amber-700 to-rose-700 border-amber-300/80 text-amber-100'
              }`}
              style={{
                boxShadow: isUnlocked
                  ? '0 0 14px rgba(244, 63, 94, 0.45)'
                  : '0 0 10px rgba(180, 83, 9, 0.3)',
              }}
            >
              {isUnlocked ? (
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-100" />
              )}
            </div>
          </div>
        </div>

        {/* Envelope Card Body */}
        <div className="p-4 pt-2 flex flex-col justify-between">
          {/* Top Status & Mood Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Mood pill */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border"
              style={{
                backgroundColor: moodObj.lightBg,
                color: moodObj.themeColor,
                borderColor: `${moodObj.themeColor}44`,
              }}
            >
              <span>{moodObj.emoji}</span>
              <span>{moodObj.label}</span>
            </span>

            {/* Glowing Lock or Unlocked Badge */}
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs shadow-pink-300">
                <Sparkles className="w-3 h-3" />
                <span>Ready to Open</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60 shadow-xs">
                <Lock className="w-2.5 h-2.5 text-amber-700" />
                <span>{daysRemaining === 1 ? '1 day left' : `${daysRemaining} days left`}</span>
              </span>
            )}
          </div>

          {/* Letter Title */}
          <h4 className="text-sm font-black text-stone-900 line-clamp-1 mb-1 font-['Zen_Maru_Gothic'] group-hover:text-rose-600 transition-colors">
            {letter.title || 'A Letter Across Time'}
          </h4>

          {/* Message preview snippet if unlocked, or sealed poetic whisper */}
          <p className="text-xs text-stone-500 line-clamp-2 italic mb-3 min-h-[2.5rem]">
            {isUnlocked ? (
              letter.message
            ) : (
              <span className="text-stone-400 not-italic">
                Sealed until {letter.unlockDateString}
              </span>
            )}
          </p>

          {/* Photos and Replies indicator */}
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-stone-500">
            {letter.photos && letter.photos.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                <ImageIcon className="w-3 h-3 text-pink-500" />
                <span>{letter.photos.length} {letter.photos.length === 1 ? 'photo' : 'photos'}</span>
              </span>
            )}
            {letter.replies && letter.replies.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{letter.replies.length} {letter.replies.length === 1 ? 'reply' : 'replies'}</span>
              </span>
            )}
            {letter.plantedMemoryId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                <span>🌱</span>
                <span>Rooted Tree</span>
              </span>
            )}
          </div>

          {/* Dates Footer */}
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
            <div className="flex items-center gap-1" title={`Written on ${letter.writtenDate}`}>
              <span className="text-stone-400">Sent:</span>
              <span className="font-bold text-stone-700">{letter.writtenDate}</span>
            </div>

            <div
              className={`flex items-center gap-1 font-bold ${
                isUnlocked ? 'text-rose-600' : 'text-amber-800'
              }`}
              title={`Unlocks on ${letter.unlockDateString}`}
            >
              <Calendar className="w-3 h-3" />
              <span>{letter.unlockDateString}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
