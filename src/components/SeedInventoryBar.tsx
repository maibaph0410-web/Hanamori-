import React from 'react';
import { EmotionType, EMOTIONS, UnplantedSeed } from '../types';
import { SproutIcon } from './SproutIcon';
import { sound } from '../audio';
import { X, Sparkles, Plus, Feather } from 'lucide-react';

interface SeedInventoryBarProps {
  unplantedSeeds: UnplantedSeed[];
  selectedSproutEmotion: EmotionType | null;
  isPlantingMode: boolean;
  onSelectSprout: (emotion: EmotionType) => void;
  onCancelPlanting: () => void;
  onOpenWrite?: () => void;
}

export const SEEDLING_TRAITS: Record<EmotionType, { label: string; treeTrait: string; viLabel: string }> = {
  happy: { label: 'Happy', treeTrait: 'Bright Flowering Tree', viLabel: 'Vui vẻ' },
  peaceful: { label: 'Peaceful', treeTrait: 'Soft Green Tree', viLabel: 'Bình yên' },
  sad: { label: 'Sad', treeTrait: 'Gentle Drooping Tree', viLabel: 'Buồn' },
  angry: { label: 'Angry', treeTrait: 'Strong-looking Flame Tree', viLabel: 'Tức giận' },
  lonely: { label: 'Anxious', treeTrait: 'Small Delicate Starlight Tree', viLabel: 'Lo lắng' },
  love: { label: 'Loved', treeTrait: 'Special Flowering Heart Tree', viLabel: 'Yêu thương' },
  hope: { label: 'Hope', treeTrait: 'Golden Radiant Tree', viLabel: 'Hy vọng' },
};

export const SeedInventoryBar: React.FC<SeedInventoryBarProps> = ({
  unplantedSeeds,
  selectedSproutEmotion,
  isPlantingMode,
  onSelectSprout,
  onCancelPlanting,
  onOpenWrite,
}) => {
  // Count unplanted seeds by emotion
  const seedCounts: Record<EmotionType, number> = {
    happy: 0,
    sad: 0,
    peaceful: 0,
    lonely: 0,
    love: 0,
    angry: 0,
    hope: 0,
  };

  unplantedSeeds.forEach((seed) => {
    if (seedCounts[seed.emotion] !== undefined) {
      seedCounts[seed.emotion] += 1;
    }
  });

  // Only keep emotions that have at least 1 sprout
  const activeEmotions = (Object.keys(seedCounts) as EmotionType[]).filter(
    (em) => seedCounts[em] > 0
  );

  const totalSprouts = unplantedSeeds.length;

  return (
    <div
      id="seed-inventory-bar"
      className="fixed bottom-3 inset-x-2 sm:inset-x-6 z-40 flex flex-col items-center pointer-events-none select-none animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* 🌿 Active Planting Mode Banner */}
      {isPlantingMode && selectedSproutEmotion && (
        <div className="mb-2.5 pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-stone-900/92 text-white backdrop-blur-md border border-pink-400/40 shadow-2xl animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="text-base animate-bounce">🌱</span>
            <span className="text-xs font-black text-pink-300 uppercase tracking-wider">
              PLANTING MODE:
            </span>
            <span className="text-xs text-stone-200">
              Click any empty ground to plant your{' '}
              <span className="font-extrabold text-yellow-300">
                {EMOTIONS[selectedSproutEmotion].emoji} {SEEDLING_TRAITS[selectedSproutEmotion].label}
              </span>{' '}
              ({SEEDLING_TRAITS[selectedSproutEmotion].treeTrait})
            </span>
          </div>
          <span className="text-stone-400 text-xs hidden md:inline">• Choose any free spot</span>
          <button
            id="cancel-planting-btn"
            onClick={() => {
              sound.playClick();
              onCancelPlanting();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Cancel (ESC)</span>
          </button>
        </div>
      )}

      {/* 🎮 Cozy Game Sprout Hotbar Container */}
      <div className="pointer-events-auto bg-gradient-to-b from-white/98 to-pink-50/90 backdrop-blur-md px-4 py-2.5 rounded-3xl border-2 border-white shadow-2xl shadow-pink-300/35 flex flex-col items-center max-w-2xl">
        {/* Hotbar Header: 🌱 SEEDLING SELECTION BAR */}
        <div className="w-full flex items-center justify-between pb-1.5 px-1 border-b border-pink-100/90 mb-2 text-xs font-bold text-stone-700">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🌱</span>
            <span className="tracking-wider uppercase text-pink-900 font-black font-['Zen_Maru_Gothic']">
              Seedling Selection Bar
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
              {totalSprouts} {totalSprouts === 1 ? 'seedling' : 'seedlings'} ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            {totalSprouts > 0 ? (
              <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
                Click a seedling to select and plant
              </span>
            ) : (
              <span className="text-[11px] text-pink-600 font-medium">
                Bar is empty • Save a memory to cultivate a seedling
              </span>
            )}

            {onOpenWrite && (
              <button
                id="hotbar-write-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenWrite();
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-[11px] font-bold transition-all cursor-pointer"
              >
                <Feather className="w-3 h-3" />
                <span>+ Write Memory</span>
              </button>
            )}
          </div>
        </div>

        {/* 📭 EMPTY STATE: When the user has not created any memories yet, this bar is empty */}
        {totalSprouts === 0 ? (
          <div className="flex items-center gap-2.5 py-1 px-1">
            {[0, 1, 2, 3].map((slotIdx) => (
              <div
                key={slotIdx}
                className="w-16 h-19 sm:w-18 sm:h-21 rounded-2xl border-2 border-dashed border-pink-200/90 bg-white/60 flex flex-col items-center justify-center text-stone-300 transition-all hover:bg-pink-50/40"
              >
                <span className="text-sm opacity-35">🌱</span>
                <span className="text-[9px] font-bold opacity-50 mt-1">Slot #{slotIdx + 1}</span>
              </div>
            ))}

            <div className="ml-2 pl-3 border-l border-pink-200/80 flex flex-col justify-center max-w-[220px]">
              <div className="text-[11px] font-extrabold text-stone-700 leading-tight">
                No Seedlings Yet
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Every memory you write will cultivate a unique seedling matching its emotion.
              </p>
              {onOpenWrite && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenWrite();
                  }}
                  className="mt-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all self-start"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Cultivate First Seedling</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* 🌱 ACTIVE SPROUTS: Sprout Cards Grid */
          <div className="flex items-center gap-2.5 overflow-x-auto max-w-full pb-0.5 pt-1 px-1">
            {activeEmotions.map((emotion, idx) => {
              const info = EMOTIONS[emotion];
              const trait = SEEDLING_TRAITS[emotion];
              const count = seedCounts[emotion];
              const isSelected = selectedSproutEmotion === emotion && isPlantingMode;

              return (
                <button
                  key={emotion}
                  id={`select-sprout-${emotion}`}
                  onClick={() => {
                    sound.playClick();
                    onSelectSprout(emotion);
                  }}
                  title={`${trait.label} (${trait.treeTrait})`}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all duration-200 cursor-pointer w-20 sm:w-22 h-23 sm:h-24 border-2 ${
                    isSelected
                      ? 'bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100 border-pink-500 shadow-lg scale-105 -translate-y-1.5 ring-4 ring-pink-300/80'
                      : 'bg-white hover:bg-pink-50/70 border-pink-200 hover:border-pink-300 shadow-xs hover:scale-102 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Selected Indicator Sparkle */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-1 z-10 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  {/* Hotbar Slot Number */}
                  <span className="absolute top-1 left-1.5 text-[9px] font-extrabold text-stone-400">
                    [{idx + 1}]
                  </span>

                  {/* Sprout Visual with gentle animation */}
                  <div className="flex items-center justify-center h-10 mt-1">
                    <SproutIcon
                      emotion={emotion}
                      size={34}
                      className={
                        isSelected
                          ? 'scale-115 animate-bounce drop-shadow-md'
                          : 'group-hover:scale-110 transition-transform'
                      }
                    />
                  </div>

                  {/* Emotion Label in English & Emoji */}
                  <div className="text-[11px] font-black text-stone-800 flex items-center gap-1 leading-tight text-center">
                    <span>{info.emoji}</span>
                    <span className="truncate max-w-[50px]">{trait.label}</span>
                  </div>

                  {/* Sprout Quantity Badge (e.g. ×1, ×2) */}
                  <div
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full leading-none shadow-xs ${
                      isSelected
                        ? 'bg-pink-600 text-white animate-pulse'
                        : 'bg-pink-500 text-white'
                    }`}
                  >
                    ×{count}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
