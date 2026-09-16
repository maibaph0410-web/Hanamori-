import React, { useEffect } from 'react';
import { MemoryMediaItem } from '../types';
import { sound } from '../audio';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react';

interface MediaViewerModalProps {
  isOpen: boolean;
  mediaList: MemoryMediaItem[];
  initialIndex: number;
  memoryTitle?: string;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  mediaList,
  initialIndex,
  memoryTitle,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isZoomed, setIsZoomed] = React.useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && mediaList.length > 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, mediaList.length]);

  if (!isOpen || mediaList.length === 0) return null;

  const currentItem = mediaList[currentIndex] || mediaList[0];

  const handleNext = () => {
    sound.playClick();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between py-3 px-4 text-white z-10 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {currentItem.type === 'photo' ? '📷' : '🎥'}
          </span>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-pink-100 font-['Zen_Maru_Gothic']">
              {memoryTitle || 'Memory Media'}
            </h3>
            <p className="text-xs text-white/60">
              {currentItem.name || (currentItem.type === 'photo' ? 'Photograph' : 'Video')} •{' '}
              {currentIndex + 1} of {mediaList.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentItem.type === 'photo' && (
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}

          <a
            href={currentItem.url}
            download={currentItem.name || `memory-${currentItem.type}-${Date.now()}`}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Download"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer ml-2"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-2"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === 'photo' ? (
          <img
            src={currentItem.url}
            alt={currentItem.name || 'Memory photo'}
            className={`max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-200 select-none ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        ) : (
          <div className="w-full max-h-full flex items-center justify-center">
            <video
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl bg-black border border-white/10"
            />
          </div>
        )}

        {/* Previous Button */}
        {mediaList.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous media"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {mediaList.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110 cursor-pointer"
            aria-label="Next media"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip (if multiple) */}
      {mediaList.length > 1 && (
        <div
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl overflow-x-auto max-w-xl z-10 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {mediaList.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setCurrentIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'border-pink-400 scale-105 shadow-md shadow-pink-500/50'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {item.type === 'photo' ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-stone-900 flex items-center justify-center text-xs text-white">
                  🎥
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
