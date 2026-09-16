import React, { useState, useEffect, useRef } from 'react';
import { MemoryItem, EmotionType, EMOTIONS, MemoryMediaItem } from '../types';
import { sound } from '../audio';
import { fileToDataUrl } from '../mediaUtils';
import {
  X,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Video,
  Trash2,
  Save,
  Plus,
} from 'lucide-react';

interface EditMemoryModalProps {
  isOpen: boolean;
  memory: MemoryItem | null;
  onClose: () => void;
  onSave: (updated: MemoryItem) => void;
}

const emotionList: EmotionType[] = [
  'happy',
  'sad',
  'peaceful',
  'lonely',
  'love',
  'angry',
  'hope',
];

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  isOpen,
  memory,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('happy');
  const [mediaList, setMediaList] = useState<MemoryMediaItem[]>([]);
  const [memoryDate, setMemoryDate] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && memory) {
      setTitle(memory.title || '');
      setText(memory.text || '');
      setNote(memory.note || '');
      setSelectedEmotion(memory.emotion || 'happy');
      setMediaList(memory.media ? [...memory.media] : []);
      setMemoryDate(memory.date || '');
      setErrorMsg('');
    }
  }, [isOpen, memory]);

  if (!isOpen || !memory) return null;

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const handleFiles = async (files: FileList | File[]) => {
    setIsProcessingMedia(true);
    setErrorMsg('');
    const newItems: MemoryMediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPhoto = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isPhoto && !isVideo) continue;

      try {
        const url = await fileToDataUrl(file);
        newItems.push({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: isPhoto ? 'photo' : 'video',
          url,
          name: file.name,
          size: file.size,
          uploadedAt: Date.now(),
        });
      } catch (err) {
        console.error('Failed to load media file', err);
      }
    }

    if (newItems.length > 0) {
      sound.playChime(659.25, 0.25);
      setMediaList((prev) => [...prev, ...newItems]);
    }
    setIsProcessingMedia(false);
  };

  const handleRemoveMedia = (mediaId: string) => {
    sound.playClick();
    setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please write a few words for this memory.');
      return;
    }

    sound.playGentlePop();
    const updated: MemoryItem = {
      ...memory,
      title: title.trim() || `${EMOTIONS[selectedEmotion].label} Memory`,
      text: text.trim(),
      emotion: selectedEmotion,
      treeType: selectedEmotion,
      date: memoryDate.trim() || memory.date,
      media: mediaList,
      note: note.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  const emotionInfo = EMOTIONS[selectedEmotion] || EMOTIONS.happy;

  return (
    <div
      id="edit-memory-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="edit-memory-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white/95 backdrop-blur-md border-2 border-pink-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-purple-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <div>
              <h2 className="text-base font-black text-stone-800 font-['Zen_Maru_Gothic']">
                Edit Memory
              </h2>
              <p className="text-[11px] text-stone-500">
                Update your journal entry, mood canopy, and photos
              </p>
            </div>
          </div>
          <button
            id="close-edit-modal-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
              Memory Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a name..."
              maxLength={60}
              className="w-full px-3.5 py-2 rounded-xl bg-pink-50/40 border border-pink-200 focus:border-pink-400 focus:bg-white focus:outline-none text-xs font-medium text-stone-800 transition-colors"
            />
          </div>

          {/* Emotion / Tree Type Picker */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Emotion & Tree Canopy
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {emotionList.map((emo) => {
                const info = EMOTIONS[emo];
                const isSelected = selectedEmotion === emo;
                return (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedEmotion(emo);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-500 bg-pink-100/70 scale-105 shadow-sm'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-pink-50/30'
                    }`}
                  >
                    <span className="text-xl">{info.emoji}</span>
                    <span className="text-[10px] font-bold text-stone-700 mt-1 truncate max-w-full">
                      {info.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 italic">
              {emotionInfo.description}
            </p>
          </div>

          {/* Diary / Memory Story Text */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
              Diary Entry & Reflections *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Pour your heart and thoughts into the soil of Hanamori..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/40 border border-pink-200 focus:border-pink-400 focus:bg-white focus:outline-none text-xs text-stone-800 leading-relaxed transition-colors font-['Zen_Maru_Gothic']"
            />
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={memoryDate}
                  onChange={(e) => setMemoryDate(e.target.value)}
                  placeholder="e.g. September 16, 2026"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-pink-50/40 border border-pink-200 focus:border-pink-400 focus:bg-white focus:outline-none text-xs font-medium text-stone-800"
                />
                <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                Whispered Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A secret whisper..."
                className="w-full px-3.5 py-2 rounded-xl bg-pink-50/40 border border-pink-200 focus:border-pink-400 focus:bg-white focus:outline-none text-xs font-medium text-stone-800"
              />
            </div>
          </div>

          {/* Media Attachments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                Photos & Videos ({mediaList.length})
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>+ Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Video className="w-3 h-3" />
                  <span>+ Video</span>
                </button>
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {mediaList.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="relative aspect-video rounded-xl overflow-hidden border border-pink-200 bg-stone-100 group"
                  >
                    {m.type === 'photo' ? (
                      <img
                        src={m.url}
                        alt={m.name || 'Memory photo'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <video src={m.url} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(m.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-stone-900/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingMedia}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
