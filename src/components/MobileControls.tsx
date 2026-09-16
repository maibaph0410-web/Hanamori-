import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Sparkles, Edit3 } from 'lucide-react';
import { sound } from '../audio';

interface MobileControlsProps {
  onMoveVector: (vx: number, vy: number) => void;
  onInteract: () => void;
  onOpenWrite: () => void;
  isNearInteractable: boolean;
  interactLabel?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveVector,
  onInteract,
  onOpenWrite,
  isNearInteractable,
  interactLabel = 'INTERACT',
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [touchActive, setTouchActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  const radius = 45; // Max joystick pull distance

  const updateJoystick = useCallback(
    (clientX: number, clientY: number) => {
      if (!joystickBaseRef.current) return;
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) {
        setKnobPos({ x: 0, y: 0 });
        onMoveVector(0, 0);
        return;
      }

      const clampedDist = Math.min(dist, radius);
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;

      setKnobPos({ x: kx, y: ky });

      // Normalized vector (-1 to 1)
      const normVx = kx / radius;
      const normVy = ky / radius;
      onMoveVector(normVx, normVy);
    },
    [onMoveVector, radius]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setTouchActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMoveVector(0, 0);
        break;
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Virtual Joystick (Bottom Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-32 h-32 rounded-full bg-white/40 backdrop-blur-md border-2 border-white/70 shadow-lg flex items-center justify-center relative active:bg-white/50"
        >
          {/* Inner ring */}
          <div className="w-16 h-16 rounded-full border border-pink-400/40 pointer-events-none" />

          {/* Draggable Knob */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 border-2 border-white shadow-md pointer-events-none absolute flex items-center justify-center text-white text-xs font-bold transition-transform duration-75"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            🌸
          </div>
        </div>
        <div className="text-[10px] font-bold text-center text-pink-900/70 mt-1 uppercase tracking-wider">
          Drag to Move
        </div>
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end gap-3">
        {/* Quick Write Memory FAB */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenWrite();
          }}
          className="w-13 h-13 rounded-full bg-white/90 backdrop-blur-md text-pink-600 border-2 border-pink-300 shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Write Memory"
        >
          <Edit3 className="w-6 h-6" />
        </button>

        {/* Big INTERACT Button */}
        <button
          id="mobile-interact-btn"
          onClick={() => {
            sound.playClick();
            onInteract();
          }}
          className={`px-6 py-4 rounded-3xl font-extrabold text-sm tracking-wide shadow-xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
            isNearInteractable
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-white animate-pulse scale-105 shadow-pink-400/60'
              : 'bg-white/80 backdrop-blur-md text-stone-700 border-white/90 shadow-stone-300/40 active:scale-95'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isNearInteractable ? 'text-yellow-300 animate-spin' : 'text-stone-400'}`} />
          <span>{interactLabel}</span>
        </button>
      </div>
    </div>
  );
};
