import React, { useState } from 'react';
import { FutureLetter, FutureLetterReply, MemoryMediaItem } from '../types';
import { MOOD_OPTIONS } from '../characterData';
import { sound } from '../audio';
import {
  X,
  Lock,
  Sparkles,
  Calendar,
  Heart,
  Send,
  Image as ImageIcon,
  Trees,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { MediaViewerModal } from './MediaViewerModal';

interface FutureLetterReaderModalProps {
  letter: FutureLetter | null;
  currentTime: number;
  userName: string;
  onClose: () => void;
  onAddReply: (letterId: string, replyText: string) => void;
  onPlantAsMemoryTree: (letter: FutureLetter) => void;
  onTestUnlock?: (letterId: string) => void;
}

export const FutureLetterReaderModal: React.FC<FutureLetterReaderModalProps> = ({
  letter,
  currentTime,
  userName,
  onClose,
  onAddReply,
  onPlantAsMemoryTree,
  onTestUnlock,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [unsealAnimating, setUnsealAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  if (!letter) return null;

  const isUnlocked = currentTime >= letter.unlockDate || letter.isOpened;
  const moodObj = MOOD_OPTIONS.find((m) => m.type === letter.mood) || MOOD_OPTIONS[0];

  const msRemaining = Math.max(0, letter.unlockDate - currentTime);
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  // Handle reply submission
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sound.playChime(659.25, 0.3);
    onAddReply(letter.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div
      id="future-letter-reader-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="future-letter-reader-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${
          isUnlocked
            ? 'bg-[#fffcf9] border-rose-200/90 shadow-rose-900/20'
            : 'bg-[#faf6f0] border-amber-200/80 shadow-stone-900/30'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200/60 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">{isUnlocked ? '💌' : '🔒'}</span>
            <span className="text-xs font-black text-stone-800 font-['Zen_Maru_Gothic'] tracking-wide">
              {isUnlocked ? 'Opened Letter Across Time' : 'Sealed Future Envelope'}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* LOCKED STATE VIEW */}
          {!isUnlocked ? (
            <div className="flex flex-col items-center text-center py-6 px-4 space-y-4">
              {/* 3D Envelope Wax Seal Illustration */}
              <div className="relative w-36 h-28 rounded-2xl bg-gradient-to-b from-[#f3e7d6] to-[#e4d0ba] border-2 border-[#d5bea5] shadow-lg flex items-center justify-center">
                {/* Envelope Flap */}
                <div
                  className="absolute top-0 inset-x-0 h-14 bg-[#dfcaa5] border-b-2 border-[#cbaf8a]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />
                {/* Wax Seal with Lock */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-700 via-rose-700 to-amber-600 border-2 border-amber-200 shadow-md flex items-center justify-center animate-pulse">
                  <Lock className="w-5 h-5 text-amber-100" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-900 font-['Zen_Maru_Gothic']">
                  {letter.title || 'A Sealed Letter'}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border"
                    style={{
                      backgroundColor: moodObj.lightBg,
                      color: moodObj.themeColor,
                      borderColor: `${moodObj.themeColor}33`,
                    }}
                  >
                    <span>{moodObj.emoji}</span>
                    <span>{moodObj.label}</span>
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Written on {letter.writtenDate}
                  </span>
                </div>
              </div>

              {/* Countdown & Lock Message */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 max-w-md text-center space-y-1.5">
                <div className="inline-flex items-center gap-1 text-xs font-black text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Unlocks on {letter.unlockDateString}</span>
                </div>
                <div className="text-sm font-extrabold text-amber-800">
                  ⏳ {daysRemaining === 1 ? '1 day remaining' : `${daysRemaining} days remaining`}
                </div>
                <p className="text-xs text-stone-500 pt-1">
                  This letter is sealed until the chosen opening date.
                </p>
              </div>

              {/* Sandbox Test Unlock Helper */}
              {onTestUnlock && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playLetterOpen();
                      onTestUnlock(letter.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                    title="For evaluation in this sandbox environment"
                  >
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    <span>Time Traveler's Whisper (Open Now for Testing)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* UNLOCKED STATE VIEW */
            <div className="space-y-5 animate-fadeIn">
              {/* Letter Header */}
              <div className="pb-3 border-b border-rose-100">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black border"
                    style={{
                      backgroundColor: moodObj.lightBg,
                      color: moodObj.themeColor,
                      borderColor: `${moodObj.themeColor}44`,
                    }}
                  >
                    <span>{moodObj.emoji}</span>
                    <span>Original Mood: {moodObj.label}</span>
                  </span>

                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>Written: {letter.writtenDate}</span>
                  </span>

                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1 ml-auto">
                    <Sparkles className="w-3 h-3" />
                    <span>Unlocked: {letter.unlockDateString}</span>
                  </span>
                </div>

                <h3 className="text-xl font-black text-stone-900 font-['Zen_Maru_Gothic']">
                  {letter.title || 'A Letter Across Time'}
                </h3>
              </div>

              {/* Letter Body (Parchment Styled Card) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#fffefc] to-[#faf6f0] border border-[#f0e6d6] shadow-inner text-sm sm:text-base text-stone-800 leading-relaxed font-sans whitespace-pre-wrap selection:bg-pink-100">
                {letter.message}
              </div>

              {/* Attached Photos Gallery */}
              {letter.photos && letter.photos.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-stone-700 mb-2">
                    <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>Photos from That Day ({letter.photos.length})</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {letter.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedMediaIndex(index)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-xs cursor-pointer group hover:scale-103 transition-transform"
                      >
                        <img
                          src={photo.url}
                          alt="Letter keepsake"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:brightness-95 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          🔍
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connection to Memory Tree Action */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-pink-900 font-['Zen_Maru_Gothic']">
                    <Trees className="w-4 h-4 text-pink-600" />
                    <span>Root this Letter into the Memory Tree</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Plant this unlocked letter as a permanent emotional tree in your Hanamori garden.
                  </p>
                </div>

                {letter.plantedMemoryId ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Already in Garden</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPlantMemory();
                      onPlantAsMemoryTree(letter);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black shadow-xs shadow-pink-300 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <span>🌱</span>
                    <span>Plant as Memory Tree</span>
                  </button>
                )}
              </div>

              {/* Reply Section */}
              <div className="space-y-3 pt-2 border-t border-stone-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 font-['Zen_Maru_Gothic']">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
                    <span>Conversation Across Time</span>
                  </div>

                  {!isReplying && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsReplying(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-xs shadow-rose-300 transition-all cursor-pointer active:scale-95"
                    >
                      <span>💌</span>
                      <span>Reply to My Past Self</span>
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {isReplying && (
                  <form onSubmit={handleSubmitReply} className="space-y-2 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 animate-fadeIn">
                    <div className="text-xs font-black text-rose-800">
                      Write back to yourself on {letter.writtenDate}:
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      placeholder={`Dear past me,\n\nI am here in the future now. You made it, and here is what happened...`}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 focus:border-rose-400 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 outline-none resize-y"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsReplying(false)}
                        className="px-3 py-1 text-xs font-bold text-stone-500 hover:text-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-xs disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Reply to Past Self</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Replies List */}
                {letter.replies && letter.replies.length > 0 ? (
                  <div className="space-y-2">
                    {letter.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-rose-700">
                          <span className="flex items-center gap-1">
                            <span>💌</span>
                            <span>Reply from Future {userName || 'Self'}</span>
                          </span>
                          <span className="text-stone-400">{reply.dateString}</span>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed font-medium whitespace-pre-wrap">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isReplying && (
                    <p className="text-xs text-stone-400 italic">
                      No replies written yet. You can write a gentle reply to the person you were when this letter was sealed.
                    </p>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for Photos */}
      {selectedMediaIndex !== null && letter.photos && (
        <MediaViewerModal
          mediaList={letter.photos}
          initialIndex={selectedMediaIndex}
          onClose={() => setSelectedMediaIndex(null)}
        />
      )}
    </div>
  );
};
