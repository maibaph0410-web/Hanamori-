import React from 'react';
import { AppSettings, CharacterCustomization, MoodType } from '../types';
import { sound } from '../audio';
import { X, Volume2, VolumeX, Music, Sparkles, Moon, Sun, User, Heart } from 'lucide-react';
import { MOOD_OPTIONS } from '../characterData';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  characterCustomization?: CharacterCustomization;
  currentMood?: MoodType;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenCharacterCreator?: () => void;
  onOpenDailyMoodCheckIn?: () => void;
  onClose: () => void;
  onResetGarden?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  characterCustomization,
  currentMood,
  onUpdateSettings,
  onOpenCharacterCreator,
  onOpenDailyMoodCheckIn,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const toggleMusic = () => {
    const next = !settings.music;
    sound.setMusicEnabled(next);
    onUpdateSettings({ music: next });
  };

  const toggleSfx = () => {
    const next = !settings.sfx;
    sound.setSfxEnabled(next);
    onUpdateSettings({ sfx: next });
    if (next) sound.playClick();
  };

  const toggleEffects = () => {
    sound.playClick();
    onUpdateSettings({ effects: !settings.effects });
  };

  const toggleDayNight = () => {
    const next = !settings.isNight;
    sound.playDayNightToggle(next);
    onUpdateSettings({ isNight: next });
  };

  const currentMoodObj = MOOD_OPTIONS.find((m) => m.type === currentMood);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="settings-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl shadow-pink-200/50 text-stone-800 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-settings-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center text-xl shadow-inner">
            ⚙️
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight font-['Zen_Maru_Gothic']">
              Garden Settings
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Fine-tune your sanctuary & character
            </p>
          </div>
        </div>

        {/* Character & Mood Profile Shortcuts */}
        <div className="space-y-2 mb-6">
          {onOpenCharacterCreator && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCharacterCreator();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-pink-50/80 hover:bg-pink-100/70 border border-pink-200 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-200/80 text-pink-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-800 block">
                    {characterCustomization?.name ? `${characterCustomization.name}'s Character` : 'Customize Character'}
                  </span>
                  <span className="text-[11px] text-pink-700 font-medium">
                    Change outfit, hair, eyes & style
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-600">Edit 🌸</span>
            </button>
          )}

          {onOpenDailyMoodCheckIn && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenDailyMoodCheckIn();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-700 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-800 block">
                    How are you feeling?
                  </span>
                  <span className="text-[11px] text-amber-800/90 font-medium">
                    Current Piano: {currentMoodObj?.label || 'Calm'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700">Change 🎹</span>
            </button>
          )}
        </div>

        {/* Audio & Environment Settings List */}
        <div className="space-y-3.5 mb-6">
          {/* Day / Night Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                {settings.isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block">Time of Day</span>
                <span className="text-[11px] text-stone-400">
                  {settings.isNight ? '🌙 Night (Twilight & Fireflies)' : '☀️ Day (Sunlight & Warm Sky)'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleDayNight}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                settings.isNight
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {settings.isNight ? 'Switch to Day' : 'Switch to Night'}
            </button>
          </div>

          {/* Music Toggle (Solo Instrumental Piano) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block">🎹 Solo Piano Music</span>
                <span className="text-[11px] text-stone-400">Acoustic piano adapting to your mood</span>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.music ? 'bg-pink-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  settings.music ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                {settings.sfx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block">🔊 Sound Effects</span>
                <span className="text-[11px] text-stone-400">Footsteps & planting harp chimes</span>
              </div>
            </div>
            <button
              onClick={toggleSfx}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.sfx ? 'bg-pink-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  settings.sfx ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Effects / Particles Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block">✨ Visual Effects</span>
                <span className="text-[11px] text-stone-400">Floating petals & fireflies</span>
              </div>
            </div>
            <button
              onClick={toggleEffects}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.effects ? 'bg-pink-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  settings.effects ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer info & Done */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {characterCustomization?.name ? `${characterCustomization.name}'s Hanamori` : 'HANAMORI'}
          </span>
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
