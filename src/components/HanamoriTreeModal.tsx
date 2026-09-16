import React from 'react';
import { MemoryItem } from '../types';
import { sound } from '../audio';
import { X, Sparkles, Sprout, Heart, Compass } from 'lucide-react';

interface HanamoriTreeModalProps {
  isOpen: boolean;
  memories: MemoryItem[];
  userName?: string;
  onClose: () => void;
  onOpenWrite: () => void;
}

export const HanamoriTreeModal: React.FC<HanamoriTreeModalProps> = ({
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

  const count = memories.length;

  let stageTitle = 'Young Blossom Tree';
  let stageDescription = 'Your roots are taking hold in the soft soil of Hanamori.';
  if (count >= 15) {
    stageTitle = 'Cosmic World Tree';
    stageDescription = 'Your memories shine like a canopy of stars across the twilight garden.';
  } else if (count >= 8) {
    stageTitle = 'Grand Sanctuary Tree';
    stageDescription = 'Your boughs spread wide, sheltering every joy, sorrow, and gentle hope.';
  } else if (count >= 3) {
    stageTitle = 'Flourishing Spirit Tree';
    stageDescription = 'Rich foliage sways in the wind as your feelings grow deeper.';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="hanamori-tree-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-gradient-to-b from-white via-pink-50/40 to-purple-50/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl shadow-purple-300/40 text-stone-800 text-center"
      >
        {/* Close Button */}
        <button
          id="close-hanamori-tree-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Glowing Sacred Icon */}
        <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-pink-300/40 animate-ping opacity-60" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-rose-400 flex items-center justify-center shadow-lg border-2 border-white text-2xl text-white">
            🌸
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
          The Heart of the Garden
        </span>

        <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-1 font-['Zen_Maru_Gothic']">
          HANAMORI TREE
        </h2>

        <p className="text-sm font-semibold text-pink-600 mb-6 italic">
          “Your memories make Hanamori grow.”
        </p>

        {/* Growth Level Card */}
        <div className="p-5 rounded-2xl bg-white/80 border border-pink-200/80 shadow-xs mb-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span className="font-extrabold text-stone-800 text-sm">{stageTitle}</span>
            </div>
            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Level {Math.max(1, count)}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed mb-4">
            {stageDescription}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
            <div className="p-3 rounded-xl bg-pink-50/70">
              <span className="text-[10px] uppercase font-bold text-pink-700 block">
                Memories Rooted
              </span>
              <span className="text-xl font-black text-stone-800">{count}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/70">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">
                Tree Radiance
              </span>
              <span className="text-xl font-black text-stone-800">{Math.min(100, 20 + count * 10)}%</span>
            </div>
          </div>
        </div>

        {/* Poetic Message */}
        <p className="text-xs text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto font-['Nunito']">
          Whenever you write down a feeling, its energy flows into this ancient trunk, expanding its glowing branches and brightening the twilight sky.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenWrite();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-pink-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nourish with Memory</span>
          </button>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
