import React, { useState, useRef } from 'react';
import { EmotionType, EMOTIONS, MemoryMediaItem } from '../types';
import { sound } from '../audio';
import { fileToDataUrl } from '../mediaUtils';
import { X, Sparkles, Sprout, Image as ImageIcon, Video, Calendar, Trash2, FileText, Plus } from 'lucide-react';

interface WriteMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlant: (
    title: string,
    text: string,
    emotion: EmotionType,
    media?: MemoryMediaItem[],
    note?: string,
    date?: string
  ) => void;
  initialEmotion?: EmotionType;
}

const emotionList: EmotionType[] = ['happy', 'sad', 'peaceful', 'lonely', 'love', 'angry', 'hope'];

export const WriteMemoryModal: React.FC<WriteMemoryModalProps> = ({
  isOpen,
  onClose,
  onPlant,
  initialEmotion = 'happy',
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialEmotion);
  const [mediaList, setMediaList] = useState<MemoryMediaItem[]>([]);
  const [memoryDate, setMemoryDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Sync initial emotion when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedEmotion(initialEmotion);
      setErrorMsg('');
      setMemoryDate(new Date().toISOString().slice(0, 10));
    }
  }, [isOpen, initialEmotion]);

  if (!isOpen) return null;

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

      if (!isPhoto && !isVideo) {
        continue;
      }

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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveMedia = (id: string) => {
    sound.playClick();
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Quick preset sample media for convenience
  const handleAddSamplePhoto = () => {
    sound.playClick();
    const samplePhotos = [
      {
        name: 'cherry_blossom_meadow.jpg',
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'sunset_glow.jpg',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'peaceful_garden.jpg',
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
      },
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setMediaList((prev) => [
      ...prev,
      {
        id: `media-sample-${Date.now()}`,
        type: 'photo',
        url: picked.url,
        name: picked.name,
        uploadedAt: Date.now(),
      },
    ]);
  };

  const handlePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your memory a title.');
      return;
    }
    if (!text.trim()) {
      setErrorMsg('Please write a few words about what you are feeling.');
      return;
    }

    // Format display date
    const dateObj = new Date(memoryDate + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    sound.playPlantMemory();
    onPlant(
      title.trim(),
      text.trim(),
      selectedEmotion,
      mediaList.length > 0 ? mediaList : undefined,
      note.trim() ? note.trim() : undefined,
      formattedDate
    );

    // Reset fields
    setTitle('');
    setText('');
    setNote('');
    setMediaList([]);
    setSelectedEmotion('happy');
    setErrorMsg('');
    onClose();
  };

  const currentEmotion = EMOTIONS[selectedEmotion];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="write-memory-modal-box"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl shadow-pink-200/50 text-stone-800 my-auto overflow-hidden transition-all duration-200"
        style={{
          borderTop: `6px solid ${currentEmotion.themeColor}`,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner text-xl">
              ✏️
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight font-['Zen_Maru_Gothic']">
                Plant a Memory
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Save your feelings, thoughts, photos & videos into the soil of Hanamori.
              </p>
            </div>
          </div>

          <button
            id="close-write-modal-btn"
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="write-memory-form" onSubmit={handlePlant} className="space-y-4">
            {/* Title & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Memory Title
                </label>
                <input
                  id="memory-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a title..."
                  maxLength={60}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm text-stone-800 placeholder-stone-400 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Date</span>
                </label>
                <input
                  id="memory-date-input"
                  type="date"
                  value={memoryDate}
                  onChange={(e) => setMemoryDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-xs text-stone-700 font-medium transition-all"
                />
              </div>
            </div>

            {/* Emotion picker */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Emotion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {emotionList.map((emoKey) => {
                  const info = EMOTIONS[emoKey];
                  const isSelected = selectedEmotion === emoKey;
                  return (
                    <button
                      key={emoKey}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedEmotion(emoKey);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'shadow-md scale-102 ring-2 ring-pink-400 ring-offset-1'
                          : 'bg-stone-50 hover:bg-white text-stone-600 border-stone-200/80 hover:border-pink-200'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: info.lightBg,
                              borderColor: info.themeColor,
                              color: info.themeColor,
                            }
                          : {}
                      }
                    >
                      <span className="text-base">{info.emoji}</span>
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  Will grow a <strong className="text-stone-700">{currentEmotion.treeTitle}</strong>: {currentEmotion.description}
                </span>
              </div>
            </div>

            {/* Diary text textarea */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Diary Thoughts
              </label>
              <textarea
                id="memory-text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="What did your heart experience today? Pour your thoughts into the soil..."
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm text-stone-800 placeholder-stone-400 font-medium leading-relaxed resize-none transition-all"
              />
            </div>

            {/* Optional Personal Note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                <span>Personal Note / Feeling Context (Optional)</span>
              </label>
              <input
                id="memory-note-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A quiet whisper, key detail, or why this moment mattered..."
                maxLength={200}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-xs text-stone-800 placeholder-stone-400 font-medium transition-all"
              />
            </div>

            {/* Dedicated Photos & Videos Section */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📷 & 🎥 Photos & Videos</span>
                  <span className="text-[11px] font-normal text-stone-400">
                    ({mediaList.length} attached)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="text-[11px] font-bold text-pink-500 hover:text-pink-600 hover:underline cursor-pointer"
                  >
                    + Sample Photo
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone & Action Buttons */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFiles(e.dataTransfer.files);
                  }
                }}
                className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                  isDragging
                    ? 'border-pink-400 bg-pink-50/60 scale-[1.01]'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-pink-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  {/* Hidden inputs */}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoSelect}
                  />

                  {/* Add Photos Button */}
                  <button
                    id="add-photo-btn"
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      photoInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Add Photos</span>
                  </button>

                  {/* Add Videos Button */}
                  <button
                    id="add-video-btn"
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      videoInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <Video className="w-4 h-4" />
                    <span>Add Videos</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 font-medium">
                  {isProcessingMedia
                    ? 'Processing media...'
                    : 'Drag & drop photos or videos here, or choose above.'}
                </p>
              </div>

              {/* Uploaded Media Thumbnails List */}
              {mediaList.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm"
                    >
                      {item.type === 'photo' ? (
                        <img
                          src={item.url}
                          alt={item.name || 'Photo'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-800 flex flex-col items-center justify-center text-white p-1 text-center">
                          <Video className="w-5 h-5 text-purple-300 mb-1" />
                          <span className="text-[9px] font-bold truncate max-w-full px-1">
                            {item.name || 'Video'}
                          </span>
                        </div>
                      )}

                      {/* Type Badge */}
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase">
                        {item.type}
                      </span>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-full text-stone-500 hover:text-stone-700 hover:bg-stone-200/60 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="plant-memory-submit-btn"
            type="submit"
            form="write-memory-form"
            className="py-3 px-7 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 active:scale-98 text-white font-black text-xs tracking-wider shadow-lg shadow-pink-300/60 border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <Sprout className="w-4 h-4" />
            <span>SAVE MEMORY SPROUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
