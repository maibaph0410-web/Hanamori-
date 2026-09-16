import React, { useState, useRef } from 'react';
import { MemoryItem, MemoryMediaItem, EMOTIONS } from '../types';
import { sound } from '../audio';
import { fileToDataUrl, generateHanaMemoryResponse } from '../mediaUtils';
import { MediaViewerModal } from './MediaViewerModal';
import { CompanionAvatar } from './CompanionAvatar';
import {
  X,
  Calendar,
  Sparkles,
  Trash2,
  Heart,
  Image as ImageIcon,
  Video,
  FileText,
  Maximize2,
  Plus,
  MessageCircle,
  Share2,
  Edit3,
} from 'lucide-react';

interface MemoryModalProps {
  memory: MemoryItem | null;
  userName?: string;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onRequestRemove?: (memory: MemoryItem) => void;
  onEdit?: (memory: MemoryItem) => void;
  onUpdateMemory?: (updated: MemoryItem) => void;
  onOpenCompanionChat?: (memory: MemoryItem) => void;
  isProtected?: boolean;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  userName = '',
  onClose,
  onDelete,
  onRequestRemove,
  onEdit,
  onUpdateMemory,
  onOpenCompanionChat,
  isProtected = false,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [isSharingWithCompanion, setIsSharingWithCompanion] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!memory) return null;

  const emotionInfo = EMOTIONS[memory.emotion] || EMOTIONS.happy;
  const mediaList = memory.media || [];
  const photos = mediaList.filter((m) => m.type === 'photo');
  const videos = mediaList.filter((m) => m.type === 'video');

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const handleTriggerRemove = () => {
    sound.playClick();
    if (onRequestRemove) {
      onRequestRemove(memory);
    } else if (onDelete) {
      onDelete(memory.id);
    }
  };

  const handleTriggerEdit = () => {
    sound.playClick();
    if (onEdit) {
      onEdit(memory);
    }
  };

  const handleOpenMedia = (index: number) => {
    sound.playClick();
    setActiveMediaIndex(index);
  };

  // Add more media directly to this specific memory
  const handleAddMediaFiles = async (files: FileList | File[]) => {
    setIsAddingMedia(true);
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
        console.error('Failed to attach media', err);
      }
    }

    if (newItems.length > 0) {
      sound.playChime(659.25, 0.3);
      const updated: MemoryItem = {
        ...memory,
        media: [...mediaList, ...newItems],
      };
      if (onUpdateMemory) {
        onUpdateMemory(updated);
      }
    }
    setIsAddingMedia(false);
  };

  // Save edited note
  const handleSaveNote = () => {
    sound.playClick();
    const updated: MemoryItem = {
      ...memory,
      note: noteDraft.trim() || undefined,
    };
    if (onUpdateMemory) {
      onUpdateMemory(updated);
    }
    setIsEditingNote(false);
  };

  // Share with Companion
  const handleShareWithCompanion = () => {
    sound.playChime(784, 0.4);
    setIsSharingWithCompanion(true);

    const response = generateHanaMemoryResponse(
      userName,
      memory.title,
      memory.text,
      memory.emotion,
      { photos: photos.length, videos: videos.length },
      memory.note
    );

    const updated: MemoryItem = {
      ...memory,
      companionShared: true,
      companionResponse: response,
      companionSharedAt: Date.now(),
    };

    if (onUpdateMemory) {
      onUpdateMemory(updated);
    }
    setIsSharingWithCompanion(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/45 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
        onClick={handleClose}
      >
        <div
          id={`memory-detail-card-${memory.id}`}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl shadow-pink-200/60 text-stone-800 my-auto overflow-hidden transition-all duration-300"
          style={{
            borderTop: `6px solid ${emotionInfo.themeColor}`,
          }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-5 pb-3 border-b border-stone-100 bg-white/70">
            {/* Emotion Badge & Date */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs"
                style={{
                  backgroundColor: emotionInfo.lightBg,
                  color: emotionInfo.themeColor,
                  border: `1px solid ${emotionInfo.borderColor}`,
                }}
              >
                <span className="text-sm">{emotionInfo.emoji}</span>
                <span>{emotionInfo.label} Memory</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{memory.date}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="close-memory-modal-btn"
              onClick={handleClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body: Memory Box */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* Memory Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-['Zen_Maru_Gothic']">
                {memory.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  Rooted as a <strong>{emotionInfo.treeTitle}</strong> in your garden
                </span>
              </div>
            </div>

            {/* Diary Content */}
            <div
              className="relative p-5 sm:p-6 rounded-2xl text-stone-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-['Nunito'] shadow-xs"
              style={{
                backgroundColor: emotionInfo.lightBg,
                borderLeft: `5px solid ${emotionInfo.themeColor}`,
              }}
            >
              <span className="text-stone-400 select-none text-2xl font-serif mr-1">“</span>
              {memory.text}
              <span className="text-stone-400 select-none text-2xl font-serif ml-1">”</span>
            </div>

            {/* Dedicated Photos & Videos Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📷</span>
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Photos & Videos ({mediaList.length})
                  </h3>
                </div>

                {/* Attach More Media Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAddMediaFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAddingMedia}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold border border-pink-200 shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingMedia ? 'Adding...' : 'Add Media'}</span>
                  </button>
                </div>
              </div>

              {mediaList.length === 0 ? (
                /* Empty state for media */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 hover:bg-pink-50/30 hover:border-pink-300 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-2xl mb-1 group-hover:scale-110 transition-transform">
                    <span>📷</span>
                    <span>🎥</span>
                  </div>
                  <p className="text-xs font-bold text-stone-600 mb-0.5">
                    No photos or videos attached yet
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Click here to attach keepsakes to this memory box
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Photo Gallery Grid */}
                  {photos.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                        <span>Photos ({photos.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {photos.map((item) => {
                          const globalIdx = mediaList.findIndex((m) => m.id === item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleOpenMedia(globalIdx)}
                              className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                            >
                              <img
                                src={item.url}
                                alt={item.name || 'Memory photo'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Maximize2 className="w-5 h-5 drop-shadow-md" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Videos Section with Video Players */}
                  {videos.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <span>Videos ({videos.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {videos.map((item) => {
                          const globalIdx = mediaList.findIndex((m) => m.id === item.id);
                          return (
                            <div
                              key={item.id}
                              className="relative rounded-2xl overflow-hidden bg-black border border-stone-200 shadow-sm"
                            >
                              <video
                                src={item.url}
                                controls
                                playsInline
                                className="w-full max-h-52 object-contain bg-black"
                              />
                              <button
                                onClick={() => handleOpenMedia(globalIdx)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                                title="View Fullscreen"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Fullscreen</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dedicated Personal Note Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Personal Note / Reflection</span>
                </div>
                {!isEditingNote && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setNoteDraft(memory.note || '');
                      setIsEditingNote(true);
                    }}
                    className="text-[11px] font-bold text-pink-500 hover:text-pink-600 hover:underline cursor-pointer"
                  >
                    {memory.note ? 'Edit Note' : '+ Add Note'}
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    rows={2}
                    placeholder="Write a short description or explain how you felt during this moment..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs text-stone-800 placeholder-stone-400 font-medium resize-none transition-all"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      className="px-4 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : memory.note ? (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 font-medium leading-relaxed flex items-start gap-2.5">
                  <span className="text-base">📝</span>
                  <p className="flex-1 italic">{memory.note}</p>
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No personal note added.</p>
              )}
            </div>

            {/* Companion Connection: "Share with My Companion" */}
            <div className="pt-2 border-t border-stone-100">
              {memory.companionShared && memory.companionResponse ? (
                /* Companion Shared Response Bubble */
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white shadow-xs overflow-hidden flex items-center justify-center border border-pink-200">
                        <CompanionAvatar mood="happy" className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-pink-900 flex items-center gap-1 font-['Zen_Maru_Gothic']">
                          <span>Hana's Gentle Note</span>
                          <span>🌸</span>
                        </h4>
                        <span className="text-[10px] text-pink-500 font-semibold">
                          Shared with your companion
                        </span>
                      </div>
                    </div>

                    {onOpenCompanionChat && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onClose();
                          onOpenCompanionChat(memory);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-pink-100 text-pink-600 text-[11px] font-bold shadow-xs border border-pink-200 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat with Hana</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-['Nunito'] pl-1">
                    {memory.companionResponse}
                  </p>
                </div>
              ) : (
                /* Unshared: Prominent "Share with My Companion" Action */
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-800">
                        Connect with your Companion
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Share this memory and its keepsakes with Hana for a gentle, supportive
                        reflection.
                      </p>
                    </div>
                  </div>

                  <button
                    id="share-memory-companion-btn"
                    type="button"
                    onClick={handleShareWithCompanion}
                    disabled={isSharingWithCompanion}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white font-black text-xs shadow-md shadow-pink-200 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Share with My Companion</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70">
            <div className="flex items-center gap-2">
              {/* Edit Memory Button */}
              {onEdit && (
                <button
                  id="modal-edit-memory-btn"
                  onClick={handleTriggerEdit}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold transition-colors px-3 py-1.5 rounded-xl border border-indigo-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Memory</span>
                </button>
              )}

              {/* Remove Tree Button (Hidden if isProtected) */}
              {!isProtected && (onRequestRemove || onDelete) ? (
                <button
                  id="modal-remove-tree-btn"
                  onClick={handleTriggerRemove}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-red-700 bg-rose-50 hover:bg-rose-100 font-bold transition-colors px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Tree</span>
                </button>
              ) : isProtected ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  🌳 Ancient Tree Blossom (Protected)
                </span>
              ) : null}
            </div>

            <button
              id="modal-close-action-btn"
              onClick={handleClose}
              className="px-6 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs tracking-wider shadow-sm cursor-pointer transition-all active:scale-95"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo & Video Lightbox */}
      {activeMediaIndex !== null && (
        <MediaViewerModal
          isOpen={activeMediaIndex !== null}
          mediaList={mediaList}
          initialIndex={activeMediaIndex}
          memoryTitle={memory.title}
          onClose={() => setActiveMediaIndex(null)}
        />
      )}
    </>
  );
};
