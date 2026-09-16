import React, { useState } from 'react';
import { MemoryItem, EMOTIONS } from '../types';
import { SEEDLING_TRAITS } from './SeedInventoryBar';
import { sound } from '../audio';
import {
  X,
  BookOpen,
  Edit3,
  Trash2,
  Sparkles,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface TreeOptionsMenuProps {
  tree: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMemory: (tree: MemoryItem) => void;
  onEditMemory: (tree: MemoryItem) => void;
  onConfirmRemove: (tree: MemoryItem) => void;
}

export const TreeOptionsMenu: React.FC<TreeOptionsMenuProps> = ({
  tree,
  isOpen,
  onClose,
  onViewMemory,
  onEditMemory,
  onConfirmRemove,
}) => {
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  if (!isOpen || !tree) return null;

  const emotionInfo = EMOTIONS[tree.emotion] || EMOTIONS.happy;
  const trait = SEEDLING_TRAITS[tree.emotion] || {
    label: emotionInfo.label,
    treeTrait: emotionInfo.treeTitle,
  };

  const handleClose = () => {
    sound.playClick();
    setIsConfirmingRemove(false);
    onClose();
  };

  const handleView = () => {
    sound.playClick();
    setIsConfirmingRemove(false);
    onViewMemory(tree);
  };

  const handleEdit = () => {
    sound.playClick();
    setIsConfirmingRemove(false);
    onEditMemory(tree);
  };

  const handleStartRemove = () => {
    sound.playClick();
    setIsConfirmingRemove(true);
  };

  const handleCancelRemove = () => {
    sound.playClick();
    setIsConfirmingRemove(false);
  };

  const handleExecuteRemove = () => {
    sound.playGentlePop();
    setIsConfirmingRemove(false);
    onConfirmRemove(tree);
  };

  return (
    <div
      id="tree-options-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="tree-options-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-md border-2 border-pink-200/90 shadow-2xl p-5 text-stone-800 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-tree-options-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isConfirmingRemove ? (
          /* Main Tree Options Menu */
          <div className="flex flex-col items-center">
            {/* Tree Avatar & Emotion Tag */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 mb-3"
              style={{
                backgroundColor: emotionInfo.lightBg,
                borderColor: emotionInfo.borderColor,
              }}
            >
              <span className="transform hover:scale-110 transition-transform">
                {emotionInfo.emoji}
              </span>
            </div>

            <h3 className="text-lg font-black text-stone-800 text-center line-clamp-1 font-['Zen_Maru_Gothic']">
              {tree.title}
            </h3>

            <div className="flex items-center gap-2 mt-1 mb-4 text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {tree.date}
              </span>
              <span>•</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: emotionInfo.lightBg,
                  color: emotionInfo.themeColor,
                }}
              >
                {trait.treeTrait}
              </span>
            </div>

            {/* Menu Options */}
            <div className="w-full flex flex-col gap-2.5">
              {/* 1. 🌱 View Memory */}
              <button
                id="tree-opt-view"
                onClick={handleView}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-black text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">🌱 View Memory</span>
                  <span className="text-[11px] font-normal text-pink-100">
                    Read entry, view photos & reflections
                  </span>
                </div>
              </button>

              {/* 2. ✏️ Edit Memory */}
              <button
                id="tree-opt-edit"
                onClick={handleEdit}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 border border-indigo-200 text-indigo-900 font-black text-sm shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">✏️ Edit Memory</span>
                  <span className="text-[11px] font-normal text-indigo-600">
                    Update title, story, mood or media
                  </span>
                </div>
              </button>

              {/* 3. 🗑️ Remove Tree */}
              <button
                id="tree-opt-remove"
                onClick={handleStartRemove}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-700 font-bold text-sm transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">🗑️ Remove Tree</span>
                  <span className="text-[11px] font-normal text-rose-500">
                    Free up location & return seedling
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Dialog: "Are you sure you want to remove this tree?" */
          <div className="flex flex-col items-center text-center animate-in fade-in duration-150">
            {/* Gentle Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-base font-black text-stone-900 font-['Zen_Maru_Gothic']">
              Remove Tree
            </h3>

            <p className="text-sm font-bold text-stone-800 mt-2 px-2">
              Are you sure you want to remove this tree?
            </p>

            <p className="text-xs text-stone-500 mt-2 mb-5 px-3 leading-relaxed">
              The tree will disappear from the garden, and its seedling will return to your{' '}
              <span className="font-bold text-pink-700">Seedling Selection Bar</span> so you can replant it whenever you like.
            </p>

            {/* Confirmation Buttons: Cancel & Remove */}
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                id="cancel-remove-tree-btn"
                onClick={handleCancelRemove}
                className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-remove-tree-btn"
                onClick={handleExecuteRemove}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
