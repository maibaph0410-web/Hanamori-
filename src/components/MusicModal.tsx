import React, { useState, useEffect } from 'react';
import { MoodType } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { sound } from '../audio';
import { X, Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

interface MusicModalProps {
  isOpen: boolean;
  currentMood: MoodType;
  musicEnabled: boolean;
  onClose: () => void;
  onSelectMood: (mood: MoodType) => void;
  onToggleMusic: (enabled: boolean) => void;
}

export const MusicModal: React.FC<MusicModalProps> = ({
  isOpen,
  currentMood,
  musicEnabled,
  onClose,
  onSelectMood,
  onToggleMusic,
}) => {
  const [volume, setVolume] = useState<number>(() => {
    return Math.round(sound.getMusicVolume() * 100);
  });

  useEffect(() => {
    setVolume(Math.round(sound.getMusicVolume() * 100));
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMoodObj = MOOD_OPTIONS.find((m) => m.type === currentMood) || MOOD_OPTIONS[0];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    sound.setMusicVolume(val / 100);
  };

  const handleMoodClick = (mood: MoodType) => {
    sound.playClick();
    onSelectMood(mood);
    sound.crossFadeToMood(mood);
  };

  const handleToggle = () => {
    sound.playClick();
    const next = !musicEnabled;
    onToggleMusic(next);
    sound.setMusicEnabled(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100/90 text-stone-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-300/40">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-800 font-['Zen_Maru_Gothic'] flex items-center gap-2">
                <span>🎹 Solo Piano Sanctuary</span>
              </h2>
              <p className="text-xs text-stone-500 font-semibold">
                Pure acoustic piano chords responding softly to your mood
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Mood & Current Piano Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50/60 border border-pink-100/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black tracking-wider uppercase text-pink-700">
              CURRENT MOOD
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 text-xs font-black text-[#9d3862] shadow-2xs border border-pink-200">
              <span>{currentMoodObj.emoji}</span>
              <span>{currentMoodObj.label}</span>
            </span>
          </div>

          <div className="text-xs text-stone-700">
            <span className="font-extrabold text-stone-900">CURRENT PIANO: </span>
            <span className="italic text-pink-900">{currentMoodObj.pianoDescription}</span>
          </div>
        </div>

        {/* Volume & Mute Controls */}
        <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-stone-700">
              {musicEnabled && volume > 0 ? (
                <Volume2 className="w-4 h-4 text-pink-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
              <span>PIANO VOLUME</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-stone-600 w-8 text-right">
                {musicEnabled ? `${volume}%` : 'Off'}
              </span>
              <button
                id="music-toggle-btn"
                onClick={handleToggle}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  musicEnabled
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {musicEnabled ? 'Music ON' : 'Music OFF'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="piano-volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!musicEnabled}
              className="w-full accent-pink-500 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Mood Selection Matrix */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black tracking-wider uppercase text-stone-600">
              CHANGE MOOD ATMOSPHERE
            </span>
            <span className="text-[11px] text-stone-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Smooth cross-fade
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
            {MOOD_OPTIONS.map((m) => {
              const isSelected = currentMood === m.type;
              return (
                <button
                  key={m.type}
                  id={`select-music-mood-${m.type}`}
                  onClick={() => handleMoodClick(m.type)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-300/40 scale-102 font-extrabold'
                      : 'bg-white hover:bg-pink-50 text-stone-700 border-pink-100 hover:border-pink-300 font-bold'
                  }`}
                >
                  <span className="text-xl mb-1">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-stone-100 text-center text-[11px] font-semibold text-stone-400">
          Soft instrumental solo piano • Changes seamlessly without reloading
        </div>
      </div>
    </div>
  );
};
