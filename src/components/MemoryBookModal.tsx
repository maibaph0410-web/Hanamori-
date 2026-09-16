import React, { useState } from 'react';
import { MemoryItem, EmotionType, EMOTIONS } from '../types';
import { sound } from '../audio';
import { X, BookOpen, Search, Compass, Calendar } from 'lucide-react';

interface MemoryBookModalProps {
  isOpen: boolean;
  memories: MemoryItem[];
  userName?: string;
  onClose: () => void;
  onSelectMemory: (memory: MemoryItem) => void;
  onOpenWrite: () => void;
}

export const MemoryBookModal: React.FC<MemoryBookModalProps> = ({
  isOpen,
  memories,
  userName,
  onClose,
  onSelectMemory,
  onOpenWrite,
}) => {
  const [filterEmotion, setFilterEmotion] = useState<EmotionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const handleSelect = (mem: MemoryItem) => {
    sound.playTreeInteract();
    onSelectMemory(mem);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesEmotion = filterEmotion === 'all' || m.emotion === filterEmotion;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEmotion && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="memory-book-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl shadow-pink-200/50 text-stone-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl shadow-inner">
              <BookOpen className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight font-['Zen_Maru_Gothic']">
                📖 {userName ? `${userName}'s Memories` : 'My Memories'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {memories.length} {memories.length === 1 ? 'tree' : 'trees'} blooming in {userName ? `${userName}'s garden` : 'your garden'}
              </p>
            </div>
          </div>

          <button
            id="close-memory-book-btn"
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="px-6 py-3 bg-stone-50/70 border-b border-stone-100 flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diary thoughts..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
            />
          </div>

          {/* Emotion Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => {
                sound.playClick();
                setFilterEmotion('all');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                filterEmotion === 'all'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/70'
              }`}
            >
              All ({memories.length})
            </button>
            {(['happy', 'sad', 'peaceful', 'lonely', 'love', 'angry', 'hope'] as EmotionType[]).map(
              (emo) => {
                const count = memories.filter((m) => m.emotion === emo).length;
                if (count === 0 && filterEmotion !== emo) return null;
                const info = EMOTIONS[emo];
                return (
                  <button
                    key={emo}
                    onClick={() => {
                      sound.playClick();
                      setFilterEmotion(emo);
                    }}
                    className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterEmotion === emo
                        ? 'text-white shadow-sm'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/70'
                    }`}
                    style={filterEmotion === emo ? { backgroundColor: info.themeColor } : {}}
                  >
                    <span>{info.emoji}</span>
                    <span>{count}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Memory Cards Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-base font-bold text-stone-700 mb-1">No memories found</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto mb-4">
                {searchQuery || filterEmotion !== 'all'
                  ? 'Try clearing your search or emotion filter.'
                  : 'Your garden awaits your first feeling to blossom.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenWrite();
                }}
                className="px-5 py-2 rounded-full bg-pink-500 text-white text-xs font-bold shadow-md hover:bg-pink-600 transition-all cursor-pointer"
              >
                ✏️ Plant First Memory
              </button>
            </div>
          ) : (
            filteredMemories.map((mem) => {
              const info = EMOTIONS[mem.emotion] || EMOTIONS.happy;
              return (
                <div
                  key={mem.id}
                  onClick={() => handleSelect(mem)}
                  className="group relative p-4 rounded-2xl bg-white hover:bg-pink-50/40 border border-stone-200/80 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{
                    borderLeft: `5px solid ${info.themeColor}`,
                  }}
                >
                  <div className="flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: info.lightBg,
                          color: info.themeColor,
                        }}
                      >
                        {info.emoji} {info.label}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-stone-400">
                        <Calendar className="w-3 h-3" />
                        <span>{mem.date}</span>
                      </div>
                      {mem.media && mem.media.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 flex items-center gap-1">
                          <span>📷</span>
                          <span>{mem.media.length} keepsakes</span>
                        </span>
                      )}
                      {mem.note && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          📝 Note
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-pink-600 transition-colors">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {mem.text}
                    </p>
                  </div>

                  {/* Visit Tree Action Pill */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center px-3 py-1.5 rounded-xl bg-pink-50 group-hover:bg-pink-500 text-pink-700 group-hover:text-white transition-all text-xs font-bold whitespace-nowrap shadow-xs">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Visit Tree</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Clicking any memory card travels directly to its tree in the garden.</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
