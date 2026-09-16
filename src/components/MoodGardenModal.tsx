import React from 'react';
import { MemoryItem, EmotionType, EMOTIONS } from '../types';
import { sound } from '../audio';
import { X, Heart, Sparkles } from 'lucide-react';

interface MoodGardenModalProps {
  isOpen: boolean;
  memories: MemoryItem[];
  userName?: string;
  onClose: () => void;
  onOpenWrite: () => void;
}

const allEmotions: EmotionType[] = ['happy', 'sad', 'peaceful', 'lonely', 'love', 'angry', 'hope'];

export const MoodGardenModal: React.FC<MoodGardenModalProps> = ({
  isOpen,
  memories,
  userName,
  onClose,
  onOpenWrite,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const total = memories.length;

  // Calculate actual counts for each emotion
  const emotionCounts: Record<EmotionType, number> = {
    happy: 0,
    sad: 0,
    peaceful: 0,
    lonely: 0,
    love: 0,
    angry: 0,
    hope: 0,
  };

  memories.forEach((m) => {
    if (emotionCounts[m.emotion] !== undefined) {
      emotionCounts[m.emotion]++;
    }
  });

  // Find dominant emotion
  let dominantEmotion: EmotionType = 'happy';
  let maxCount = -1;
  allEmotions.forEach((emo) => {
    if (emotionCounts[emo] > maxCount) {
      maxCount = emotionCounts[emo];
      dominantEmotion = emo;
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="mood-garden-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl shadow-pink-200/50 text-stone-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight font-['Zen_Maru_Gothic']">
                💗 {userName ? `${userName}'s Mood Garden` : 'Mood Garden'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                The emotional ecosystem of your life
              </p>
            </div>
          </div>

          <button
            id="close-mood-garden-btn"
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Banner */}
        <div className="p-5 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-b border-pink-100/70 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-pink-700 block mb-0.5">
              Total Garden Canopy
            </span>
            <div className="text-2xl font-black text-stone-800">
              {total} {total === 1 ? 'Memory Tree' : 'Memory Trees'}
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <span className="text-[11px] font-bold text-stone-500 block mb-0.5">
                Primary Blossom
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-xs border border-pink-200 text-xs font-black text-pink-800">
                <span>{EMOTIONS[dominantEmotion].emoji}</span>
                <span>{EMOTIONS[dominantEmotion].label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Emotion Rows with Live Real Numbers */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {allEmotions.map((emoKey) => {
            const count = emotionCounts[emoKey];
            const info = EMOTIONS[emoKey];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div
                key={emoKey}
                className="p-3.5 rounded-2xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{info.emoji}</span>
                    <span className="text-sm font-bold text-stone-800">{info.label}</span>
                    <span className="text-xs text-stone-400 font-medium">({info.treeTitle})</span>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-extrabold text-stone-900">
                      {count} {count === 1 ? 'memory' : 'memories'}
                    </span>
                    <span className="text-xs font-bold text-stone-400 min-w-[36px] text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-stone-200/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: info.themeColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Garden Ecosystem Footer Insight */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
            <span>Every emotion is natural and nourishes your garden's soil.</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenWrite();
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-200 transition-all cursor-pointer whitespace-nowrap"
          >
            ✏️ Plant New Tree
          </button>
        </div>
      </div>
    </div>
  );
};
