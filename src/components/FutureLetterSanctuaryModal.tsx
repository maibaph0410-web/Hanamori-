import React, { useState } from 'react';
import { FutureLetter } from '../types';
import { sound } from '../audio';
import { FutureLetterCard } from './FutureLetterCard';
import { FutureLetterWriteForm } from './FutureLetterWriteForm';
import { FutureLetterReaderModal } from './FutureLetterReaderModal';
import { X, Plus, Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface FutureLetterSanctuaryModalProps {
  isOpen: boolean;
  userName: string;
  letters: FutureLetter[];
  currentTime: number;
  onClose: () => void;
  onSaveNewLetter: (letterData: Omit<FutureLetter, 'id' | 'createdAt' | 'isSealed' | 'isOpened'>) => void;
  onAddReply: (letterId: string, replyText: string) => void;
  onPlantAsMemoryTree: (letter: FutureLetter) => void;
  onTestUnlock?: (letterId: string) => void;
}

export const FutureLetterSanctuaryModal: React.FC<FutureLetterSanctuaryModalProps> = ({
  isOpen,
  userName,
  letters,
  currentTime,
  onClose,
  onSaveNewLetter,
  onAddReply,
  onPlantAsMemoryTree,
  onTestUnlock,
}) => {
  const [activeTab, setActiveTab] = useState<'garden' | 'write'>('garden');
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter | null>(null);
  const [filter, setFilter] = useState<'all' | 'sealed' | 'unlocked'>('all');

  if (!isOpen) return null;

  // Filter user letters
  const filteredLetters = letters.filter((l) => {
    const isUnlocked = currentTime >= l.unlockDate || l.isOpened;
    if (filter === 'sealed') return !isUnlocked;
    if (filter === 'unlocked') return isUnlocked;
    return true;
  });

  const unlockedCount = letters.filter((l) => currentTime >= l.unlockDate || l.isOpened).length;
  const sealedCount = letters.filter((l) => currentTime < l.unlockDate && !l.isOpened).length;

  const handleSelectLetter = (l: FutureLetter) => {
    const isUnlocked = currentTime >= l.unlockDate || l.isOpened;
    if (isUnlocked) {
      sound.playLetterOpen();
    } else {
      sound.playClick();
    }
    setSelectedLetter(l);
  };

  const isEmpty = letters.length === 0;

  return (
    <div
      id="future-letter-sanctuary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-stone-950/65 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#fffbfc] via-[#fff5f8] to-[#ffeef4] border-2 border-pink-200/90"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-xs z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center text-lg shadow-sm font-bold">
              ✉️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#8b3559] font-['Zen_Maru_Gothic'] tracking-wide">
                Letter to Future Me
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header button when in Write mode */}
            {activeTab === 'write' ? (
              <button
                id="future-letter-back-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('garden');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100/80 hover:bg-pink-200/80 text-rose-700 text-xs font-black transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : !isEmpty ? (
              /* When user has created letters, show write button in header */
              <button
                id="future-letter-write-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('write');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write a Letter</span>
              </button>
            ) : null}

            <button
              id="future-letter-close-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-pink-100/60 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
          {activeTab === 'write' ? (
            /* WRITE MODE */
            <div className="py-2 w-full">
              <FutureLetterWriteForm
                userName={userName}
                onSaveAndSeal={(newLetterData) => {
                  onSaveNewLetter(newLetterData);
                  setActiveTab('garden');
                }}
                onCancel={() => setActiveTab('garden')}
              />
            </div>
          ) : isEmpty ? (
            /* ============================================================
               EMPTY STATE: CLEAN, PEACEFUL 3D GARDEN ATMOSPHERE
               Only subtle decorative elements: soft pastel-pink lighting,
               a few small flowers, gentle sparkles, and the single button:
               “+ Write a Letter to My Future Self”
               ============================================================ */
            <div
              id="future-letter-empty-garden"
              className="relative flex-1 flex flex-col items-center justify-center min-h-[420px] rounded-3xl overflow-hidden select-none p-6"
            >
              {/* Soft Pastel-Pink Ambient Lighting */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 45%, rgba(255, 192, 211, 0.45) 0%, rgba(255, 230, 238, 0.25) 50%, transparent 80%)',
                }}
              />

              {/* Gentle Floating Sparkles */}
              <div className="absolute top-10 left-12 text-sm text-pink-400 opacity-60 animate-pulse pointer-events-none select-none">
                ✨
              </div>
              <div
                className="absolute top-1/4 right-16 text-base text-rose-300 opacity-70 animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '4s' }}
              >
                ✨
              </div>
              <div className="absolute bottom-28 left-20 text-xs text-pink-300 opacity-50 animate-pulse pointer-events-none select-none">
                ✨
              </div>
              <div
                className="absolute top-16 right-1/3 text-xs text-rose-400 opacity-60 animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '5s' }}
              >
                ✨
              </div>

              {/* Quiet Garden Ground with Soft Horizon & A Few Small Flowers */}
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-pink-200/40 via-pink-100/20 to-transparent pointer-events-none" />

              {/* Small Decorative Garden Flowers & Cherry Blossom Petals */}
              {/* Bottom Left Flower Cluster */}
              <div className="absolute bottom-6 left-8 flex items-end gap-1 pointer-events-none opacity-85 select-none">
                <span className="text-xl -rotate-6 transform hover:scale-110 transition-transform">🌸</span>
                <span className="text-sm rotate-12 text-emerald-600/70">🌱</span>
                <span className="text-base rotate-6">🌼</span>
              </div>

              {/* Bottom Right Flower Cluster */}
              <div className="absolute bottom-6 right-8 flex items-end gap-1.5 pointer-events-none opacity-85 select-none">
                <span className="text-base -rotate-12">🌼</span>
                <span className="text-xs text-emerald-600/70">🌿</span>
                <span className="text-2xl rotate-12 transform hover:scale-110 transition-transform">🌸</span>
              </div>

              {/* Subtle Scattered Petals Resting on Ground */}
              <div className="absolute bottom-8 left-1/4 text-xs text-pink-300/80 rotate-45 pointer-events-none select-none">
                🌸
              </div>
              <div className="absolute bottom-10 right-1/4 text-[10px] text-pink-300/70 -rotate-12 pointer-events-none select-none">
                🌸
              </div>

              {/* Centered Simple Button */}
              <div className="relative z-10 flex flex-col items-center">
                <button
                  id="write-first-future-letter-btn"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('write');
                  }}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-b from-[#ff8fa3] via-[#f06292] to-[#e91e63] hover:from-[#ffa1b2] hover:to-[#d81b60] text-white text-base sm:text-lg font-black tracking-wide font-['Zen_Maru_Gothic'] shadow-xl shadow-pink-300/60 border-b-4 border-rose-700/30 hover:shadow-2xl hover:shadow-pink-300/80 hover:-translate-y-0.5 active:translate-y-1 active:border-b-2 transition-all cursor-pointer select-none"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">✉️</span>
                  <span>+ Write a Letter to My Future Self</span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================
               POPULATED STATE: USER'S CREATED LETTERS
               Appears after user creates their first letter as a sealed 3D envelope.
               ============================================================ */
            <div className="space-y-5 w-full">
              {/* Filter Tabs Bar when user has created multiple letters */}
              {letters.length > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setFilter('all');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                        filter === 'all'
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white text-stone-600 hover:bg-pink-100/50 border border-stone-200'
                      }`}
                    >
                      All ({letters.length})
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setFilter('sealed');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        filter === 'sealed'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Sealed ({sealedCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setFilter('unlocked');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        filter === 'unlocked'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ready to Open ({unlockedCount})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3D Sealed Envelopes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLetters.map((letter) => (
                  <FutureLetterCard
                    key={letter.id}
                    letter={letter}
                    currentTime={currentTime}
                    onClick={() => handleSelectLetter(letter)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Letter Reader / Unseal Dialog */}
      {selectedLetter && (
        <FutureLetterReaderModal
          letter={selectedLetter}
          currentTime={currentTime}
          userName={userName}
          onClose={() => setSelectedLetter(null)}
          onAddReply={(id, text) => {
            onAddReply(id, text);
            const updated = letters.find((l) => l.id === id);
            if (updated) {
              const newReply = {
                id: `reply-${Date.now()}`,
                text,
                createdAt: Date.now(),
                dateString: new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
              };
              setSelectedLetter({
                ...updated,
                replies: [...(updated.replies || []), newReply],
              });
            }
          }}
          onPlantAsMemoryTree={(l) => {
            onPlantAsMemoryTree(l);
            setSelectedLetter((prev) => (prev ? { ...prev, plantedMemoryId: `mem-${l.id}` } : null));
          }}
          onTestUnlock={(id) => {
            onTestUnlock?.(id);
            setSelectedLetter((prev) => (prev ? { ...prev, isOpened: true, unlockDate: currentTime - 1000 } : null));
          }}
        />
      )}
    </div>
  );
};
