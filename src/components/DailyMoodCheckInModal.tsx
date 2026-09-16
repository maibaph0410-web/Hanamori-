import React, { useState } from 'react';
import { MoodType, DailyMoodRecord } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { sound } from '../audio';
import { X, Music, Check, Calendar } from 'lucide-react';

interface DailyMoodCheckInModalProps {
  isOpen: boolean;
  userName: string;
  currentMood: MoodType;
  moodHistory: DailyMoodRecord[];
  onSaveMood: (mood: MoodType, customNote?: string) => void;
  onClose: () => void;
}

export const DailyMoodCheckInModal: React.FC<DailyMoodCheckInModalProps> = ({
  isOpen,
  userName,
  currentMood,
  moodHistory,
  onSaveMood,
  onClose,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood);
  const [isCustom, setIsCustom] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    sound.playClick();
    onSaveMood(selectedMood, isCustom ? customNote.trim() : undefined);
    onClose();
  };

  const currentOption = MOOD_OPTIONS.find((m) => m.type === selectedMood) || MOOD_OPTIONS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="daily-mood-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl shadow-pink-200/50 text-stone-800 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-xl shadow-md">
            💗
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#9d3862] font-['Zen_Maru_Gothic'] leading-tight">
              How are you feeling today{userName ? `, ${userName}` : ''}? 🌸
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Updates your garden's live solo piano atmosphere
            </p>
          </div>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.type && !isCustom;
            return (
              <button
                key={mood.type}
                onClick={() => {
                  sound.playClick();
                  setSelectedMood(mood.type);
                  setIsCustom(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 shadow-sm scale-105 ring-2 ring-pink-300 font-bold'
                    : 'border-stone-200 hover:border-pink-300 bg-stone-50/50'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-stone-800">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom feeling note */}
        <div className="mb-4">
          <button
            onClick={() => {
              sound.playClick();
              setIsCustom(true);
            }}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left flex items-center justify-between ${
              isCustom
                ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-300'
                : 'border-stone-200 hover:border-pink-300 bg-stone-50/40 text-stone-600'
            }`}
          >
            <span>💭 Custom feeling / note...</span>
            {isCustom && <Check className="w-4 h-4 text-pink-500" />}
          </button>

          {isCustom && (
            <input
              type="text"
              placeholder="Describe what's on your mind today..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={60}
              className="mt-2 w-full px-3.5 py-2 rounded-xl border border-pink-300 focus:border-pink-500 bg-white text-xs text-stone-800 outline-none"
            />
          )}
        </div>

        {/* Solo Piano Live Atmosphere Card */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 mb-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <span>SOLO PIANO ATMOSPHERE</span>
              <span>•</span>
              <span className="capitalize">{currentOption.label}</span>
            </div>
            <div className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
              {currentOption.pianoDescription}
            </div>
          </div>
        </div>

        {/* Mood History Collapsible */}
        {moodHistory.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-bold text-[#9d3862] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{showHistory ? 'Hide' : 'View'} Past Emotional Atmosphere Log ({moodHistory.length})</span>
            </button>

            {showHistory && (
              <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                {moodHistory.slice(0, 7).map((record, idx) => {
                  const m = MOOD_OPTIONS.find((opt) => opt.type === record.mood);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0"
                    >
                      <span className="text-stone-500 font-medium">{record.displayDate}</span>
                      <span className="font-bold text-stone-800 flex items-center gap-1">
                        <span>{m?.emoji || '🌸'}</span>
                        <span>{m?.label || record.mood}</span>
                        {record.customNote && (
                          <span className="text-stone-400 text-[10px] italic">({record.customNote})</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl hover:bg-stone-100 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-daily-mood-btn"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-pink-300 transition-all cursor-pointer"
          >
            Set Garden Mood 🌸
          </button>
        </div>
      </div>
    </div>
  );
};
