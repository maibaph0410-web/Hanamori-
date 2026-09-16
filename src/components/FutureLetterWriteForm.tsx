import React, { useState, useRef } from 'react';
import { MoodType, MemoryMediaItem, FutureLetterDurationPreset, FutureLetter } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { sound } from '../audio';
import {
  Heart,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  X,
  Upload,
  Lock,
  MessageCircle,
  HelpCircle,
  Check,
} from 'lucide-react';

interface FutureLetterWriteFormProps {
  userName: string;
  onSaveAndSeal: (newLetter: Omit<FutureLetter, 'id' | 'createdAt' | 'isSealed' | 'isOpened'>) => void;
  onCancel: () => void;
}

const COMPANION_PROMPTS = [
  {
    icon: '✨',
    prompt: 'What are you hoping for?',
    subtext: 'A wish, a quiet dream, or something you want to see bloom.',
  },
  {
    icon: '🌟',
    prompt: 'What are you proud of today?',
    subtext: 'Even the smallest kindness, effort, or gentle step forward.',
  },
  {
    icon: '🌸',
    prompt: 'What do you want your future self to remember?',
    subtext: 'The weather today, how coffee tasted, or who was near.',
  },
  {
    icon: '💌',
    prompt: 'What would you like to tell yourself?',
    subtext: 'A comforting truth, advice, or warm encouragement.',
  },
  {
    icon: '🌱',
    prompt: 'What was a gentle moment that softened your heart today?',
    subtext: 'A breeze, a pet, a friend, or quiet rest.',
  },
];

export const FutureLetterWriteForm: React.FC<FutureLetterWriteFormProps> = ({
  userName,
  onSaveAndSeal,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<MoodType>('hopeful');
  const [photos, setPhotos] = useState<MemoryMediaItem[]>([]);
  const [durationPreset, setDurationPreset] = useState<FutureLetterDurationPreset>('1_month');
  const [customDate, setCustomDate] = useState('');
  const [showCompanionPrompts, setShowCompanionPrompts] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Today's formatted date
  const now = new Date();
  const writtenDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate unlock date based on selection
  const calculateUnlockDate = () => {
    const target = new Date();
    if (durationPreset === '1_month') {
      target.setDate(target.getDate() + 30);
    } else if (durationPreset === '6_months') {
      target.setDate(target.getDate() + 180);
    } else if (durationPreset === '1_year') {
      target.setDate(target.getDate() + 365);
    } else if (durationPreset === 'custom' && customDate) {
      const parsed = new Date(customDate);
      if (!isNaN(parsed.getTime())) {
        return {
          timestamp: parsed.getTime(),
          dateString: parsed.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        };
      }
    }
    return {
      timestamp: target.getTime(),
      dateString: target.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  const calculatedUnlock = calculateUnlockDate();

  // Handle Photo Compression & Base64 Upload
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);

          const newMedia: MemoryMediaItem = {
            id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'photo',
            url: compressed,
            name: file.name,
            size: file.size,
            uploadedAt: Date.now(),
          };

          setPhotos((prev) => [...prev, newMedia]);
          sound.playChime(659.25, 0.2);
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    sound.playClick();
  };

  // Companion prompt insert handler (does not overwrite user text, adds thoughtful starter)
  const handleSelectPrompt = (promptText: string) => {
    sound.playChime(587.33, 0.3);
    setMessage((prev) => {
      const trimmed = prev.trim();
      const prefix = trimmed.length > 0 ? `${trimmed}\n\n` : '';
      return `${prefix}💭 ${promptText}\n`;
    });
    setShowCompanionPrompts(false);
    // Focus textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, 100);
  };

  // Submit and Wax Seal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !title.trim()) return;

    setIsSealing(true);
    sound.playLetterSeal();

    setTimeout(() => {
      onSaveAndSeal({
        title: title.trim() || 'A Letter Across Time',
        message: message.trim(),
        mood,
        photos,
        writtenDate,
        unlockDate: calculatedUnlock.timestamp,
        unlockDateString: calculatedUnlock.dateString,
        durationPreset,
      });
      setIsSealing(false);
    }, 1100);
  };

  // Minimum date for custom picker (tomorrow)
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      {/* Sealing Wax Stamp Animation Overlay */}
      {isSealing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative flex flex-col items-center animate-bounce">
            {/* Wax Seal Stamp */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 border-4 border-amber-200 shadow-2xl flex items-center justify-center text-white text-3xl font-black shadow-rose-900/50">
              🌸
            </div>
            <p className="mt-4 text-base font-black text-white font-['Zen_Maru_Gothic'] tracking-wide">
              Sealing your letter with warm wax...
            </p>
            <p className="text-xs text-rose-200 mt-1">
              Sending a piece of your heart into the future ✨
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Title / Intro */}
        <div className="text-center pb-1 border-b border-pink-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black mb-1.5">
            <span>✉️</span>
            <span>Private Time Capsule</span>
          </div>
          <h3 className="text-xl font-black text-stone-900 font-['Zen_Maru_Gothic']">
            Write to Your Future Self
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-0.5">
            Choose what you want to whisper across time. Your words remain sealed until the chosen date.
          </p>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-black text-stone-700 mb-1">
            Letter Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your letter"
            maxLength={75}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-sm text-stone-900 font-medium placeholder:text-stone-400 outline-none transition-all shadow-xs"
          />
        </div>

        {/* Current Mood Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black text-stone-700">
              How are you feeling right now?
            </label>
            <span className="text-[11px] text-stone-400">Captured with your letter</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5">
            {MOOD_OPTIONS.map((m) => {
              const isSelected = mood === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMood(m.type);
                  }}
                  className={`flex flex-col items-center p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-400 shadow-xs scale-102'
                      : 'border-stone-200 hover:border-pink-200 bg-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? m.lightBg : undefined,
                    color: isSelected ? m.themeColor : '#44403c',
                  }}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="text-[10px] truncate max-w-full font-extrabold mt-0.5">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Input & Companion Prompts */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black text-stone-700">
              Personal Message to Future You
            </label>

            {/* "Ask My Companion for Help" Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowCompanionPrompts(!showCompanionPrompts);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-rose-700 text-xs font-black border border-rose-200/80 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Ask My Companion for Help</span>
            </button>
          </div>

          {/* Companion Prompts Drawer */}
          {showCompanionPrompts && (
            <div className="mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/70 to-amber-50/60 border border-pink-200 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-400 text-white flex items-center justify-center text-xs font-bold">
                    🌸
                  </div>
                  <span className="text-xs font-black text-stone-800 font-['Zen_Maru_Gothic']">
                    Hana's Gentle Prompts
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompanionPrompts(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-white/60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-stone-600 mb-2.5 leading-relaxed">
                Click any prompt to inspire your letter. Your own feelings stay at the center:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {COMPANION_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPrompt(item.prompt)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white border border-pink-100 hover:border-pink-300 text-left transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="text-xs">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-800 group-hover:text-rose-600 transition-colors">
                          “{item.prompt}”
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                          {item.subtext}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Letter Text Area */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            placeholder="Write your letter to your future self here..."
            className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 text-sm text-stone-800 placeholder:text-stone-400 font-sans leading-relaxed outline-none transition-all resize-y shadow-xs"
          />
        </div>

        {/* Photos Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black text-stone-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>Attach Photos for Your Future Self</span>
            </label>
            <span className="text-[11px] text-stone-400">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} added
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
              dragOver
                ? 'border-rose-400 bg-pink-50/80'
                : 'border-pink-200 hover:border-pink-300 bg-pink-50/40 hover:bg-pink-50/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
              <Upload className="w-4 h-4 text-pink-500" />
              <span>Click or drop photos to send with your letter</span>
            </div>
          </div>

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shadow-xs group"
                >
                  <img
                    src={photo.url}
                    alt="Letter keepsake"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(photo.id);
                    }}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opening Date Selector */}
        <div className="p-3.5 rounded-2xl bg-[#fcf9f6] border border-stone-200">
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <label className="text-xs font-black text-stone-800 font-['Zen_Maru_Gothic']">
              When should this letter unlock?
            </label>
          </div>

          {/* Duration Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5">
            {[
              { id: '1_month', label: '🌸 1 Month', desc: '+30 days' },
              { id: '6_months', label: '🍁 6 Months', desc: '+180 days' },
              { id: '1_year', label: '❄️ 1 Year', desc: '+365 days' },
              { id: 'custom', label: '📅 Custom Date', desc: 'Pick a date' },
            ].map((preset) => {
              const isSelected = durationPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDurationPreset(preset.id as FutureLetterDurationPreset);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-xs font-black">{preset.label}</div>
                  <div
                    className={`text-[9px] mt-0.5 ${
                      isSelected ? 'text-rose-100' : 'text-stone-400'
                    }`}
                  >
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Date Input */}
          {durationPreset === 'custom' && (
            <div className="mb-2">
              <input
                type="date"
                min={tomorrowStr}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-bold focus:border-rose-400 outline-none"
              />
            </div>
          )}

          {/* Unlock Preview Guarantee */}
          <div className="flex items-center gap-2 text-xs text-stone-600 font-bold pt-1 border-t border-stone-200/60">
            <Lock className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>
              Sealed until:{' '}
              <strong className="text-rose-600 font-black">{calculatedUnlock.dateString}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onCancel();
            }}
            className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!message.trim() && !title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-black shadow-md shadow-pink-300/50 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <span>💌</span>
            <span>Seal & Send to Future Me</span>
          </button>
        </div>
      </form>
    </div>
  );
};
