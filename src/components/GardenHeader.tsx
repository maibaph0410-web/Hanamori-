import React from 'react';
import { sound } from '../audio';
import { BookOpen, Edit3, Heart, Settings, Music, Sun, Moon, Sparkles } from 'lucide-react';
import { MoodType } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { CompanionPetState } from '../petTypes';

interface GardenHeaderProps {
  userName: string;
  memoryCount: number;
  currentMood: MoodType;
  isNight: boolean;
  unlockedLettersCount?: number;
  companionPet?: CompanionPetState | null;
  onOpenPetInteraction?: () => void;
  onToggleDayNight: () => void;
  onCenterGarden: () => void;
  onOpenWrite: () => void;
  onOpenBook: () => void;
  onOpenCompanion: () => void;
  onOpenMusic: () => void;
  onOpenSettings: () => void;
  onOpenDailyMoodCheckIn: () => void;
  onOpenFutureLetters: () => void;
}

export const GardenHeader: React.FC<GardenHeaderProps> = ({
  userName,
  memoryCount,
  currentMood,
  isNight,
  unlockedLettersCount = 0,
  companionPet,
  onOpenPetInteraction,
  onToggleDayNight,
  onCenterGarden,
  onOpenWrite,
  onOpenBook,
  onOpenCompanion,
  onOpenMusic,
  onOpenSettings,
  onOpenDailyMoodCheckIn,
  onOpenFutureLetters,
}) => {
  const currentMoodObj = MOOD_OPTIONS.find((m) => m.type === currentMood) || MOOD_OPTIONS[0];

  return (
    <header className="fixed top-3 inset-x-2 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none select-none">
      {/* Brand & Personal Garden Info (Left) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md shadow-pink-200/30">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-sm sm:text-base shadow-xs text-white font-bold flex-shrink-0">
            🌸
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black tracking-wide text-[#9d3862] leading-tight font-['Zen_Maru_Gothic']">
              {userName ? `${userName}'s HANAMORI` : 'HANAMORI'}
            </div>
            <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1.5">
              <span>{memoryCount} {memoryCount === 1 ? 'tree' : 'trees'}</span>
              <span>•</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenDailyMoodCheckIn();
                }}
                title="Change piano mood atmosphere"
                className="hover:text-pink-600 flex items-center gap-1 text-[10px] text-pink-700/80 cursor-pointer font-extrabold"
              >
                <span>{currentMoodObj.emoji}</span>
                <span className="hidden xs:inline">{currentMoodObj.label}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI Controls (Section 41: 🌸 Garden, ✏️ Write, 📖 Memories, 💗 Companion, 🎹 Music, ⚙️ Settings) */}
      <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-white/80 shadow-lg shadow-pink-200/30">
        {/* 🌸 Garden */}
        <button
          id="nav-garden-btn"
          onClick={() => {
            sound.playClick();
            onCenterGarden();
          }}
          title="Center view on your character"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-pink-100/70 text-stone-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span>🌸</span>
          <span className="hidden sm:inline">Garden</span>
        </button>

        {/* ✏️ Write */}
        <button
          id="nav-write-btn"
          onClick={() => {
            sound.playClick();
            onOpenWrite();
          }}
          title="Write a new diary memory"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white text-xs font-extrabold shadow-xs shadow-pink-300 transition-all cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Write</span>
        </button>

        {/* 📖 Memories */}
        <button
          id="nav-memories-btn"
          onClick={() => {
            sound.playClick();
            onOpenBook();
          }}
          title="Open your memory diary"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-pink-100/70 text-stone-700 text-xs font-bold transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-pink-500" />
          <span className="hidden sm:inline">Memories</span>
        </button>

        {/* ✉️ Future Letter */}
        <button
          id="nav-future-letter-btn"
          onClick={() => {
            sound.playClick();
            onOpenFutureLetters();
          }}
          title="Letter to Future Me — Private Time Capsule"
          className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-pink-100/70 text-stone-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span className="text-sm">✉️</span>
          <span className="hidden sm:inline">Future Letter</span>
          {unlockedLettersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
          )}
        </button>

        {/* 🐾 Companion Pet Button */}
        {companionPet && (
          <button
            id="nav-pet-btn"
            onClick={() => {
              sound.playClick();
              onOpenPetInteraction?.();
            }}
            title={`Care for ${companionPet.name} (${companionPet.species})`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-50/80 hover:bg-pink-100 text-rose-700 text-xs font-black border border-pink-200/60 shadow-xs transition-all cursor-pointer"
          >
            <span>🐾</span>
            <span className="hidden sm:inline font-['Zen_Maru_Gothic']">{companionPet.name}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800 text-[9px] font-black">
              Lvl {companionPet.level}
            </span>
          </button>
        )}

        {/* 💗 Companion */}
        <button
          id="nav-companion-btn"
          onClick={() => {
            sound.playClick();
            onOpenCompanion();
          }}
          title="Talk to your companion"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-pink-100/70 text-[#9d3862] text-xs font-bold transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
          <span className="hidden md:inline">Companion</span>
        </button>

        {/* 🎹 Music */}
        <button
          id="nav-music-btn"
          onClick={() => {
            sound.playClick();
            onOpenMusic();
          }}
          title="Piano music controls & mood atmosphere"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-pink-100/70 text-stone-700 text-xs font-bold transition-all cursor-pointer"
        >
          <Music className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden md:inline">Music</span>
        </button>

        {/* Quick Day/Night Toggle */}
        <button
          id="day-night-toggle-btn"
          onClick={onToggleDayNight}
          title={isNight ? 'Switch to Day' : 'Switch to Night'}
          className="p-1.5 rounded-xl hover:bg-pink-50 text-stone-600 transition-colors cursor-pointer"
        >
          {isNight ? (
            <Moon className="w-3.5 h-3.5 text-purple-600" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </button>

        {/* ⚙️ Settings */}
        <button
          id="nav-settings-btn"
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          title="Garden Settings"
          className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 transition-all cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
