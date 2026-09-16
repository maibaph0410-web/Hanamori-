import React from 'react';
import { Sparkles, X, Edit3, ArrowDown } from 'lucide-react';
import { sound } from '../audio';

export type TutorialStep = 'empty_start' | 'has_seeds' | 'planting' | 'completed';

interface TutorialOverlayProps {
  step: TutorialStep;
  onOpenWrite: () => void;
  onDismiss: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  onOpenWrite,
  onDismiss,
}) => {
  if (step === 'completed') return null;

  return (
    <aside
      aria-label="Garden Guide"
      className="fixed top-18 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92vw] sm:w-auto pointer-events-none select-none animate-in fade-in slide-in-from-top-3 duration-300"
    >
      <div className="pointer-events-auto relative bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-pink-200/90 shadow-2xl shadow-pink-300/40 text-stone-800 flex items-start gap-3.5">
        {/* Step Icon */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
          {step === 'empty_start' && '🌸'}
          {step === 'has_seeds' && '🌱'}
          {step === 'planting' && '✨'}
        </div>

        {/* Step Content */}
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-xs font-black text-pink-700 font-['Zen_Maru_Gothic'] tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HANAMORI GUIDE</span>
          </div>

          {step === 'empty_start' && (
            <div className="mt-1">
              <h4 className="text-sm font-extrabold text-stone-900 leading-snug">
                Welcome to Hanamori 🌸
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Your garden is an empty canvas waiting for your thoughts. Every memory you write becomes a unique living tree.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWrite();
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white text-xs font-bold shadow-sm shadow-pink-300 transition-all cursor-pointer active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write Your First Memory</span>
              </button>
            </div>
          )}

          {step === 'has_seeds' && (
            <div className="mt-1">
              <h4 className="text-sm font-extrabold text-stone-900 leading-snug">
                Choose your sprout 🌱
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                You gathered a memory sprout! Select it from the <span className="font-bold text-pink-700">🌱 Memory Seeds</span> bar below to enter planting mode.
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-pink-600 animate-bounce">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Tap a sprout card below</span>
              </div>
            </div>
          )}

          {step === 'planting' && (
            <div className="mt-1">
              <h4 className="text-sm font-extrabold text-stone-900 leading-snug">
                Choose a place in your garden ✨
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Move around and click any empty patch of grass to plant your sprout. Watch your memory grow!
              </p>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            sound.playClick();
            onDismiss();
          }}
          className="absolute top-3 right-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
