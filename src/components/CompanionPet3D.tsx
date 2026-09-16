import React, { useState, useEffect } from 'react';
import { PetSpeciesId, PetAnimState, PetExpression, PetAccessories } from '../petTypes';
import { PET_SPECIES_LIST } from '../petData';

interface CompanionPet3DProps {
  species: PetSpeciesId;
  animState?: PetAnimState;
  expression?: PetExpression;
  rotation?: number; // 0 = front-facing, 90 = facing right, 180 = facing back, 270 = facing left
  size?: number;
  accessories?: PetAccessories;
  interactiveRotate?: boolean;
  onRotateChange?: (deg: number) => void;
  showShadow?: boolean;
  scale?: number;
}

export const CompanionPet3D: React.FC<CompanionPet3DProps> = ({
  species,
  animState = 'idle',
  expression = 'happy',
  rotation = 0,
  size = 140,
  accessories = { hat: 'none', bow: 'none', scarf: 'none', heldToy: 'none' },
  interactiveRotate = false,
  onRotateChange,
  showShadow = true,
  scale = 1,
}) => {
  const [internalRotation, setInternalRotation] = useState(rotation);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRot, setDragStartRot] = useState(0);

  const def = PET_SPECIES_LIST.find((p) => p.id === species) || PET_SPECIES_LIST[0];

  useEffect(() => {
    setInternalRotation(rotation);
  }, [rotation]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactiveRotate) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartRot(internalRotation);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !interactiveRotate) return;
    const deltaX = e.clientX - dragStartX;
    const newRot = (dragStartRot + deltaX * 1.2) % 360;
    const normalized = newRot < 0 ? newRot + 360 : newRot;
    setInternalRotation(normalized);
    onRotateChange?.(normalized);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Normalization for visual perspective (0 = front, 90 = right profile, 180 = back, 270 = left profile)
  const normRot = ((internalRotation % 360) + 360) % 360;
  const isFacingBack = normRot > 110 && normRot < 250;
  const isFacingLeft = normRot > 180 && normRot < 360;
  const horizontalFactor = Math.sin((normRot * Math.PI) / 180); // -1 (left) to 1 (right)

  // Animation timing class/styles
  let animClass = '';
  let shadowAnimClass = '';
  if (animState === 'idle') {
    animClass = 'animate-[bounce_3.2s_ease-in-out_infinite]';
    shadowAnimClass = 'animate-[pulse_3.2s_ease-in-out_infinite]';
  } else if (animState === 'walk') {
    animClass = 'animate-[bounce_0.6s_ease-in-out_infinite]';
    shadowAnimClass = 'animate-[pulse_0.6s_ease-in-out_infinite]';
  } else if (animState === 'run') {
    animClass = 'animate-[bounce_0.35s_ease-in-out_infinite]';
    shadowAnimClass = 'animate-[pulse_0.35s_ease-in-out_infinite]';
  } else if (animState === 'sleep') {
    animClass = 'opacity-95 scale-y-90 translate-y-3';
    shadowAnimClass = 'scale-110 opacity-70';
  } else if (animState === 'play') {
    animClass = 'animate-[spin_4s_linear_infinite]';
  }

  // Render Facial Eyes & Mouth
  const renderFace = () => {
    if (isFacingBack) return null;

    const eyeOffset = horizontalFactor * 4;
    const leftEyeX = 38 + eyeOffset;
    const rightEyeX = 62 + eyeOffset;
    const eyeY = 46;

    if (animState === 'sleep' || expression === 'sleepy') {
      return (
        <g className="pet-face">
          {/* Sleeping curved closed eye lines */}
          <path
            d={`M ${leftEyeX - 5} ${eyeY} Q ${leftEyeX} ${eyeY + 4} ${leftEyeX + 5} ${eyeY}`}
            stroke={def.eyeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${rightEyeX - 5} ${eyeY} Q ${rightEyeX} ${eyeY + 4} ${rightEyeX + 5} ${eyeY}`}
            stroke={def.eyeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Soft blush */}
          <ellipse cx={leftEyeX - 2} cy={eyeY + 8} rx="5" ry="3" fill={def.blushColor} opacity="0.6" />
          <ellipse cx={rightEyeX + 2} cy={eyeY + 8} rx="5" ry="3" fill={def.blushColor} opacity="0.6" />
          {/* Floating Zzz */}
          <text x="68" y="24" fontSize="11" fill="#ec4899" fontWeight="bold" opacity="0.8" className="animate-pulse">
            z
          </text>
          <text x="76" y="15" fontSize="8" fill="#f472b6" fontWeight="bold" opacity="0.6" className="animate-pulse">
            z
          </text>
        </g>
      );
    }

    if (expression === 'loving') {
      return (
        <g className="pet-face">
          {/* Heart shaped eyes */}
          <path
            d={`M ${leftEyeX} ${eyeY - 2} A 3.5 3.5 0 0 0 ${leftEyeX - 5} ${eyeY - 2} Q ${leftEyeX} ${eyeY + 5} ${leftEyeX} ${eyeY + 5} Q ${leftEyeX} ${eyeY + 5} ${leftEyeX + 5} ${eyeY - 2} A 3.5 3.5 0 0 0 ${leftEyeX} ${eyeY - 2}`}
            fill="#e11d48"
          />
          <path
            d={`M ${rightEyeX} ${eyeY - 2} A 3.5 3.5 0 0 0 ${rightEyeX - 5} ${eyeY - 2} Q ${rightEyeX} ${eyeY + 5} ${rightEyeX} ${eyeY + 5} Q ${rightEyeX} ${eyeY + 5} ${rightEyeX + 5} ${eyeY - 2} A 3.5 3.5 0 0 0 ${rightEyeX} ${eyeY - 2}`}
            fill="#e11d48"
          />
          {/* Blush */}
          <ellipse cx={leftEyeX - 3} cy={eyeY + 7} rx="6" ry="3" fill={def.blushColor} opacity="0.8" />
          <ellipse cx={rightEyeX + 3} cy={eyeY + 7} rx="6" ry="3" fill={def.blushColor} opacity="0.8" />
          {/* Happy cat mouth */}
          <path
            d={`M ${50 + eyeOffset - 4} ${eyeY + 7} Q ${50 + eyeOffset - 2} ${eyeY + 10} ${50 + eyeOffset} ${eyeY + 8} Q ${50 + eyeOffset + 2} ${eyeY + 10} ${50 + eyeOffset + 4} ${eyeY + 7}`}
            stroke={def.eyeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    }

    // Default Happy / Curious / Excited
    return (
      <g className="pet-face">
        {/* Left Eye */}
        <ellipse cx={leftEyeX} cy={eyeY} rx="4.5" ry="6" fill={def.eyeColor} />
        <circle cx={leftEyeX - 1.2} cy={eyeY - 2} r="2" fill="#ffffff" />
        <circle cx={leftEyeX + 1.5} cy={eyeY + 2} r="1" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx={rightEyeX} cy={eyeY} rx="4.5" ry="6" fill={def.eyeColor} />
        <circle cx={rightEyeX - 1.2} cy={eyeY - 2} r="2" fill="#ffffff" />
        <circle cx={rightEyeX + 1.5} cy={eyeY + 2} r="1" fill="#ffffff" />

        {/* Soft Blush */}
        <ellipse cx={leftEyeX - 4} cy={eyeY + 7} rx="5" ry="3" fill={def.blushColor} opacity="0.65" />
        <ellipse cx={rightEyeX + 4} cy={eyeY + 7} rx="5" ry="3" fill={def.blushColor} opacity="0.65" />

        {/* Cute Mouth */}
        {expression === 'excited' ? (
          <path
            d={`M ${50 + eyeOffset - 4} ${eyeY + 6} Q ${50 + eyeOffset} ${eyeY + 12} ${50 + eyeOffset + 4} ${eyeY + 6} Z`}
            fill="#f43f5e"
          />
        ) : (
          <path
            d={`M ${50 + eyeOffset - 4} ${eyeY + 6} Q ${50 + eyeOffset - 2} ${eyeY + 9} ${50 + eyeOffset} ${eyeY + 7} Q ${50 + eyeOffset + 2} ${eyeY + 9} ${50 + eyeOffset + 4} ${eyeY + 6}`}
            stroke={def.eyeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    );
  };

  // Render Hat Accessory
  const renderHat = () => {
    if (accessories.hat === 'none') return null;
    const hatOffset = horizontalFactor * 3;

    if (accessories.hat === 'mini_tophat') {
      return (
        <g transform={`translate(${hatOffset - 2}, -18)`}>
          <ellipse cx="50" cy="22" rx="14" ry="4" fill="#1e1b4b" />
          <rect x="42" y="7" width="16" height="15" rx="2" fill="#312e81" />
          <rect x="42" y="17" width="16" height="3" fill="#f43f5e" />
          <ellipse cx="50" cy="8" rx="8" ry="2.5" fill="#4338ca" />
        </g>
      );
    }
    if (accessories.hat === 'blossom_crown') {
      return (
        <g transform={`translate(${hatOffset}, -12)`}>
          <ellipse cx="50" cy="24" rx="18" ry="4" fill="none" stroke="#10b981" strokeWidth="2" />
          <circle cx="38" cy="22" r="4.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
          <circle cx="50" cy="20" r="5.5" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
          <circle cx="62" cy="22" r="4.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
          <circle cx="50" cy="20" r="2" fill="#fef08a" />
        </g>
      );
    }
    if (accessories.hat === 'straw_hat') {
      return (
        <g transform={`translate(${hatOffset}, -16)`}>
          <ellipse cx="50" cy="22" rx="22" ry="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="50" cy="18" rx="13" ry="8" fill="#facc15" />
          <ellipse cx="50" cy="19" rx="13" ry="2" fill="#ef4444" />
        </g>
      );
    }
    if (accessories.hat === 'star_beret') {
      return (
        <g transform={`translate(${hatOffset}, -16)`}>
          <ellipse cx="50" cy="21" rx="19" ry="8" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1" />
          <circle cx="50" cy="15" r="3.5" fill="#fde047" />
          <polygon points="50,11 51,14 54,15 51,16 50,19 49,16 46,15 49,14" fill="#fef08a" />
        </g>
      );
    }
    if (accessories.hat === 'froggy_hood') {
      return (
        <g transform={`translate(${hatOffset}, -14)`}>
          <circle cx="37" cy="16" r="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
          <circle cx="37" cy="16" r="3.5" fill="#ffffff" />
          <circle cx="37" cy="16" r="1.5" fill="#0f172a" />
          <circle cx="63" cy="16" r="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
          <circle cx="63" cy="16" r="3.5" fill="#ffffff" />
          <circle cx="63" cy="16" r="1.5" fill="#0f172a" />
        </g>
      );
    }
    return null;
  };

  // Render Bow & Scarf
  const renderNeckwear = () => {
    const neckOffset = horizontalFactor * 2;
    return (
      <g>
        {accessories.scarf === 'knit_scarf' && (
          <g transform={`translate(${neckOffset}, 4)`}>
            <ellipse cx="50" cy="67" rx="20" ry="7" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
            <path d="M 58 68 L 62 84 L 54 84 Z" fill="#e11d48" />
            <line x1="55" y1="84" x2="61" y2="84" stroke="#fecdd3" strokeWidth="2" />
          </g>
        )}
        {accessories.scarf === 'sakura_scarf' && (
          <g transform={`translate(${neckOffset}, 4)`}>
            <ellipse cx="50" cy="67" rx="19" ry="6" fill="#fce7f3" stroke="#f472b6" strokeWidth="1" />
            <circle cx="48" cy="67" r="2" fill="#f43f5e" />
            <circle cx="53" cy="68" r="2" fill="#f43f5e" />
          </g>
        )}
        {accessories.bow === 'pink_satin_bow' && (
          <g transform={`translate(${50 + neckOffset}, 67)`}>
            <path d="M 0 0 L -8 -5 L -8 5 Z" fill="#ec4899" stroke="#be185d" strokeWidth="0.8" />
            <path d="M 0 0 L 8 -5 L 8 5 Z" fill="#ec4899" stroke="#be185d" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3" fill="#f472b6" />
          </g>
        )}
        {accessories.bow === 'bell_collar' && (
          <g transform={`translate(${50 + neckOffset}, 67)`}>
            <ellipse cx="0" cy="0" rx="14" ry="4" fill="#dc2626" />
            <circle cx="0" cy="4" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="0" cy="4" r="1.2" fill="#713f12" />
          </g>
        )}
        {accessories.bow === 'emerald_ribbon' && (
          <g transform={`translate(${50 + neckOffset}, 67)`}>
            <path d="M 0 0 L -7 -4 L -7 4 Z" fill="#10b981" />
            <path d="M 0 0 L 7 -4 L 7 4 Z" fill="#10b981" />
            <circle cx="0" cy="0" r="2.5" fill="#34d399" />
          </g>
        )}
      </g>
    );
  };

  // Render Held Toy
  const renderToy = () => {
    if (accessories.heldToy === 'none') return null;
    const toyX = isFacingLeft ? 26 : 74;
    const toyY = 70;

    if (accessories.heldToy === 'yarn_ball') {
      return (
        <g transform={`translate(${toyX}, ${toyY})`} className="animate-pulse">
          <circle cx="0" cy="0" r="8" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
          <path d="M -6 -3 Q 0 4 6 -2" stroke="#fdf2f8" strokeWidth="1.5" fill="none" />
          <path d="M -4 5 Q 2 -2 5 3" stroke="#fdf2f8" strokeWidth="1.5" fill="none" />
        </g>
      );
    }
    if (accessories.heldToy === 'star_squeaker') {
      return (
        <g transform={`translate(${toyX}, ${toyY})`} className="animate-bounce">
          <polygon
            points="0,-8 2.5,-2.5 8,-2.5 3.5,1.5 5,7 0,3.5 -5,7 -3.5,1.5 -8,-2.5 -2.5,-2.5"
            fill="#facc15"
            stroke="#eab308"
            strokeWidth="0.8"
          />
        </g>
      );
    }
    if (accessories.heldToy === 'bell_wand') {
      return (
        <g transform={`translate(${toyX}, ${toyY}) rotate(15)`}>
          <line x1="0" y1="12" x2="0" y2="-8" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <circle cx="0" cy="-8" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <path d="M 0 -8 Q 6 -14 10 -10" stroke="#f472b6" strokeWidth="1.5" fill="none" />
        </g>
      );
    }
    return null;
  };

  // Render Species-Specific 3D Geometry
  const renderSpeciesBody = () => {
    const hShift = horizontalFactor * 5;

    switch (species) {
      case 'unicorn':
        return (
          <g>
            {/* Hooves / Feet */}
            <ellipse cx={38} cy={82} rx="6" ry="4" fill="#fbcfe8" />
            <ellipse cx={62} cy={82} rx="6" ry="4" fill="#fbcfe8" />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="24" ry="20" fill={def.baseColor} stroke="#fbcfe8" strokeWidth="1.5" />
            {/* Fluffy tail */}
            <path
              d={`M ${isFacingLeft ? 70 : 30} 65 Q ${isFacingLeft ? 86 : 14} 70 ${isFacingLeft ? 80 : 20} 85`}
              stroke="#f472b6"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M ${isFacingLeft ? 70 : 30} 65 Q ${isFacingLeft ? 84 : 16} 66 ${isFacingLeft ? 76 : 24} 80`}
              stroke="#a78bfa"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="23" ry="21" fill={def.baseColor} stroke="#fbcfe8" strokeWidth="1.5" />
            {/* Ears */}
            <path d={`M ${32 + hShift} 32 L ${26 + hShift} 16 L ${39 + hShift} 28 Z`} fill={def.baseColor} stroke="#fbcfe8" strokeWidth="1" />
            <path d={`M ${68 + hShift} 32 L ${74 + hShift} 16 L ${61 + hShift} 28 Z`} fill={def.baseColor} stroke="#fbcfe8" strokeWidth="1" />
            {/* Mane */}
            <path d={`M ${46 + hShift} 24 Q ${40 + hShift} 36 ${44 + hShift} 48`} stroke="#f472b6" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${52 + hShift} 24 Q ${58 + hShift} 36 ${54 + hShift} 48`} stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Golden Spiral Horn */}
            <polygon points={`${50 + hShift},12 ${46 + hShift},27 ${54 + hShift},27`} fill="#fde047" stroke="#eab308" strokeWidth="1" />
            <line x1={48 + hShift} y1="23" x2={52 + hShift} y2="21" stroke="#ca8a04" strokeWidth="1" />
            <line x1={49 + hShift} y1="18" x2={51 + hShift} y2="16" stroke="#ca8a04" strokeWidth="1" />
          </g>
        );

      case 'penguin':
        return (
          <g>
            {/* Orange Feet */}
            <ellipse cx={38} cy={84} rx="8" ry="4" fill="#fb923c" />
            <ellipse cx={62} cy={84} rx="8" ry="4" fill="#fb923c" />
            {/* Navy Back Body */}
            <ellipse cx={50 + hShift * 0.3} cy={55} rx="27" ry="29" fill="#1e293b" />
            {/* Flippers */}
            <ellipse cx={22 + hShift * 0.2} cy={58} rx="6" ry="16" transform="rotate(20 22 58)" fill="#0f172a" />
            <ellipse cx={78 + hShift * 0.2} cy={58} rx="6" ry="16" transform="rotate(-20 78 58)" fill="#0f172a" />
            {/* White Front Belly */}
            {!isFacingBack && (
              <ellipse cx={50 + hShift} cy={58} rx="19" ry="23" fill="#ffffff" />
            )}
            {/* Beak */}
            {!isFacingBack && (
              <polygon points={`${46 + hShift},48 ${54 + hShift},48 ${50 + hShift},55`} fill="#f97316" />
            )}
          </g>
        );

      case 'dog':
        return (
          <g>
            {/* Paws */}
            <ellipse cx={37} cy={82} rx="6" ry="4" fill="#fef3c7" />
            <ellipse cx={63} cy={82} rx="6" ry="4" fill="#fef3c7" />
            {/* Curly Tail */}
            <path
              d={`M ${isFacingLeft ? 72 : 28} 68 Q ${isFacingLeft ? 88 : 12} 55 ${isFacingLeft ? 78 : 22} 50`}
              stroke="#f59e0b"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="24" ry="20" fill="#f59e0b" />
            {/* Cream Chest */}
            {!isFacingBack && <ellipse cx={50 + hShift * 0.5} cy={68} rx="14" ry="14" fill="#fef3c7" />}
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="24" ry="21" fill="#f59e0b" />
            {/* White Cheek patches */}
            {!isFacingBack && (
              <>
                <ellipse cx={36 + hShift} cy={49} rx="9" ry="8" fill="#fef3c7" />
                <ellipse cx={64 + hShift} cy={49} rx="9" ry="8" fill="#fef3c7" />
              </>
            )}
            {/* Triangular Ears */}
            <polygon points={`${30 + hShift},28 ${24 + hShift},12 ${40 + hShift},22`} fill="#d97706" />
            <polygon points={`${70 + hShift},28 ${76 + hShift},12 ${60 + hShift},22`} fill="#d97706" />
            {/* Snout & Nose */}
            {!isFacingBack && (
              <ellipse cx={50 + hShift} cy={49} rx="3" ry="2.2" fill="#1c1917" />
            )}
          </g>
        );

      case 'cat':
        return (
          <g>
            {/* Paws */}
            <ellipse cx={38} cy={82} rx="6" ry="4" fill="#ffffff" />
            <ellipse cx={62} cy={82} rx="6" ry="4" fill="#ffffff" />
            {/* Sleek Tail */}
            <path
              d={`M ${isFacingLeft ? 70 : 30} 70 Q ${isFacingLeft ? 86 : 14} 60 ${isFacingLeft ? 80 : 20} 46`}
              stroke="#fb7185"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="23" ry="20" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
            {/* Calico Patch on body */}
            <path d={`M ${42 + hShift} 58 Q ${58 + hShift} 62 ${52 + hShift} 74 Z`} fill="#fb7185" opacity="0.8" />
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="23" ry="20" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
            {/* Calico Head Patch */}
            <ellipse cx={62 + hShift} cy={38} rx="9" ry="8" fill="#f59e0b" opacity="0.8" />
            {/* Cat Ears */}
            <polygon points={`${30 + hShift},30 ${24 + hShift},12 ${40 + hShift},24`} fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
            <polygon points={`${30 + hShift},28 ${26 + hShift},16 ${38 + hShift},24`} fill="#f472b6" />
            <polygon points={`${70 + hShift},30 ${76 + hShift},12 ${60 + hShift},24`} fill="#fb7185" stroke="#f43f5e" strokeWidth="1" />
            <polygon points={`${70 + hShift},28 ${74 + hShift},16 ${62 + hShift},24`} fill="#fecdd3" />
            {/* Whiskers */}
            {!isFacingBack && (
              <>
                <line x1={22 + hShift} y1="48" x2={34 + hShift} y2="49" stroke="#94a3b8" strokeWidth="1.2" />
                <line x1={22 + hShift} y1="52" x2={34 + hShift} y2="51" stroke="#94a3b8" strokeWidth="1.2" />
                <line x1={66 + hShift} y1="49" x2={78 + hShift} y2="48" stroke="#94a3b8" strokeWidth="1.2" />
                <line x1={66 + hShift} y1="51" x2={78 + hShift} y2="52" stroke="#94a3b8" strokeWidth="1.2" />
                {/* Tiny pink nose */}
                <polygon points={`${48 + hShift},48 ${52 + hShift},48 ${50 + hShift},50`} fill="#f43f5e" />
              </>
            )}
          </g>
        );

      case 'alpaca':
        return (
          <g>
            {/* Hooves */}
            <ellipse cx={38} cy={83} rx="5" ry="3.5" fill="#e2e8f0" />
            <ellipse cx={62} cy={83} rx="5" ry="3.5" fill="#e2e8f0" />
            {/* Cloud Puffy Body */}
            <circle cx={42} cy={66} r="14" fill="#fdf2f8" stroke="#fce7f3" strokeWidth="1" />
            <circle cx={58} cy={66} r="14" fill="#fdf2f8" stroke="#fce7f3" strokeWidth="1" />
            <circle cx={50} cy={72} r="14" fill="#fdf2f8" stroke="#fce7f3" strokeWidth="1" />
            {/* Long Fluffy Neck */}
            <rect x={44 + hShift * 0.5} y="38" width="12" height="24" rx="6" fill="#fdf2f8" />
            {/* Head Puff */}
            <ellipse cx={50 + hShift} cy={35} rx="18" ry="16" fill="#fdf2f8" stroke="#fce7f3" strokeWidth="1" />
            <circle cx={50 + hShift} cy={22} r="8" fill="#fdf2f8" />
            {/* Tiny Ears */}
            <ellipse cx={34 + hShift} cy={24} rx="4" ry="7" transform="rotate(-30 34 24)" fill="#fce7f3" />
            <ellipse cx={66 + hShift} cy={24} rx="4" ry="7" transform="rotate(30 66 24)" fill="#fce7f3" />
            {/* Alpaca Muzzle */}
            {!isFacingBack && (
              <ellipse cx={50 + hShift} cy={39} rx="7" ry="5" fill="#ffffff" />
            )}
          </g>
        );

      case 'bunny':
        return (
          <g>
            {/* Feet */}
            <ellipse cx={36} cy={82} rx="8" ry="5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            <ellipse cx={64} cy={82} rx="8" ry="5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            {/* Fluffy Round Cotton Tail */}
            <circle cx={isFacingLeft ? 74 : 26} cy={68} r="7" fill="#ffffff" />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="22" ry="19" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="22" ry="19" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            {/* Long Bunny Ears */}
            <ellipse cx={36 + hShift} cy={16} rx="6" ry="18" transform="rotate(-10 36 16)" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            <ellipse cx={36 + hShift} cy={16} rx="3" ry="13" transform="rotate(-10 36 16)" fill="#fbcfe8" />
            <ellipse cx={64 + hShift} cy={16} rx="6" ry="18" transform="rotate(10 64 16)" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
            <ellipse cx={64 + hShift} cy={16} rx="3" ry="13" transform="rotate(10 64 16)" fill="#fbcfe8" />
            {/* Nose */}
            {!isFacingBack && (
              <polygon points={`${48 + hShift},47 ${52 + hShift},47 ${50 + hShift},49`} fill="#f43f5e" />
            )}
          </g>
        );

      case 'fox':
        return (
          <g>
            {/* Paws */}
            <ellipse cx={38} cy={82} rx="6" ry="4" fill="#1c1917" />
            <ellipse cx={62} cy={82} rx="6" ry="4" fill="#1c1917" />
            {/* Giant Fluffy Bushy Tail */}
            <ellipse
              cx={isFacingLeft ? 76 : 24}
              cy={62}
              rx="13"
              ry="22"
              transform={`rotate(${isFacingLeft ? 35 : -35} ${isFacingLeft ? 76 : 24} 62)`}
              fill="#ea580c"
            />
            <ellipse
              cx={isFacingLeft ? 82 : 18}
              cy={52}
              rx="8"
              ry="11"
              transform={`rotate(${isFacingLeft ? 35 : -35} ${isFacingLeft ? 82 : 18} 52)`}
              fill="#fff7ed"
            />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="23" ry="19" fill="#ea580c" />
            {/* White Chest Ruff */}
            {!isFacingBack && <path d={`M ${42 + hShift} 56 Q ${50 + hShift} 72 ${58 + hShift} 56 Z`} fill="#fff7ed" />}
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="23" ry="20" fill="#ea580c" />
            {/* White Cheeks */}
            {!isFacingBack && (
              <>
                <polygon points={`${28 + hShift},44 ${42 + hShift},52 ${34 + hShift},56`} fill="#fff7ed" />
                <polygon points={`${72 + hShift},44 ${58 + hShift},52 ${66 + hShift},56`} fill="#fff7ed" />
              </>
            )}
            {/* Tall Pointy Ears */}
            <polygon points={`${28 + hShift},30 ${20 + hShift},10 ${42 + hShift},22`} fill="#ea580c" />
            <polygon points={`${29 + hShift},28 ${23 + hShift},14 ${38 + hShift},22`} fill="#1c1917" />
            <polygon points={`${72 + hShift},30 ${80 + hShift},10 ${58 + hShift},22`} fill="#ea580c" />
            <polygon points={`${71 + hShift},28 ${77 + hShift},14 ${62 + hShift},22`} fill="#1c1917" />
            {/* Nose */}
            {!isFacingBack && (
              <circle cx={50 + hShift} cy={48} r="2.5" fill="#1c1917" />
            )}
          </g>
        );

      case 'bear':
        return (
          <g>
            {/* Big Rounded Paws */}
            <ellipse cx={37} cy={83} rx="8" ry="5" fill="#78350f" />
            <ellipse cx={63} cy={83} rx="8" ry="5" fill="#78350f" />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="26" ry="22" fill="#78350f" />
            {/* Snug Tummy */}
            {!isFacingBack && <ellipse cx={50 + hShift * 0.5} cy={68} rx="16" ry="14" fill="#9a3412" opacity="0.6" />}
            {/* Head */}
            <circle cx={50 + hShift} cy={44} r="23" fill="#78350f" />
            {/* Round Teddy Ears */}
            <circle cx={30 + hShift} cy={26} r="9" fill="#78350f" />
            <circle cx={30 + hShift} cy={26} r="5" fill="#d97706" />
            <circle cx={70 + hShift} cy={26} r="9" fill="#78350f" />
            <circle cx={70 + hShift} cy={26} r="5" fill="#d97706" />
            {/* Light Snout */}
            {!isFacingBack && (
              <>
                <ellipse cx={50 + hShift} cy={49} rx="10" ry="7" fill="#fef3c7" />
                <ellipse cx={50 + hShift} cy={46} rx="3.5" ry="2.5" fill="#292524" />
              </>
            )}
          </g>
        );

      case 'deer':
        return (
          <g>
            {/* Hooves */}
            <ellipse cx={38} cy={83} rx="5" ry="3.5" fill="#451a03" />
            <ellipse cx={62} cy={83} rx="5" ry="3.5" fill="#451a03" />
            {/* Body with Dappled Spots */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="23" ry="19" fill="#b45309" />
            {/* Spots */}
            <circle cx={42} cy={63} r="2" fill="#ffffff" opacity="0.8" />
            <circle cx={58} cy={63} r="2" fill="#ffffff" opacity="0.8" />
            <circle cx={50} cy={70} r="2.2" fill="#ffffff" opacity="0.8" />
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="21" ry="19" fill="#b45309" />
            {/* Deer Ears */}
            <ellipse cx={30 + hShift} cy={30} rx="5" ry="12" transform="rotate(-40 30 30)" fill="#b45309" />
            <ellipse cx={30 + hShift} cy={30} rx="2.5" ry="8" transform="rotate(-40 30 30)" fill="#fef3c7" />
            <ellipse cx={70 + hShift} cy={30} rx="5" ry="12" transform="rotate(40 70 30)" fill="#b45309" />
            <ellipse cx={70 + hShift} cy={30} rx="2.5" ry="8" transform="rotate(40 70 30)" fill="#fef3c7" />
            {/* Tiny Antlers with Blossom */}
            <path d={`M ${39 + hShift} 27 L ${35 + hShift} 14 M ${37 + hShift} 18 L ${32 + hShift} 16`} stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${61 + hShift} 27 L ${65 + hShift} 14 M ${63 + hShift} 18 L ${68 + hShift} 16`} stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <circle cx={35 + hShift} cy={13} r="3" fill="#fbcfe8" />
            <circle cx={65 + hShift} cy={13} r="3" fill="#fbcfe8" />
            {/* Muzzle */}
            {!isFacingBack && (
              <>
                <ellipse cx={50 + hShift} cy={49} rx="7" ry="5" fill="#fef3c7" />
                <ellipse cx={50 + hShift} cy={46} rx="2.5" ry="1.8" fill="#451a03" />
              </>
            )}
          </g>
        );

      case 'panda':
        return (
          <g>
            {/* Black Paws */}
            <ellipse cx={37} cy={83} rx="8" ry="5" fill="#1e293b" />
            <ellipse cx={63} cy={83} rx="8" ry="5" fill="#1e293b" />
            {/* Black Arms / Vest */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="26" ry="22" fill="#1e293b" />
            {/* White Tummy */}
            <ellipse cx={50 + hShift * 0.5} cy={68} rx="17" ry="16" fill="#f8fafc" />
            {/* White Head */}
            <circle cx={50 + hShift} cy={44} r="23" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Black Panda Ears */}
            <circle cx={30 + hShift} cy={26} r="8" fill="#1e293b" />
            <circle cx={70 + hShift} cy={26} r="8" fill="#1e293b" />
            {/* Black Eye Patches */}
            {!isFacingBack && (
              <>
                <ellipse cx={39 + hShift} cy={46} rx="7" ry="6" transform={`rotate(-15 ${39 + hShift} 46)`} fill="#1e293b" />
                <ellipse cx={61 + hShift} cy={46} rx="7" ry="6" transform={`rotate(15 ${61 + hShift} 46)`} fill="#1e293b" />
                <circle cx={50 + hShift} cy={51} r="2.5" fill="#0f172a" />
              </>
            )}
          </g>
        );

      case 'koala':
        return (
          <g>
            {/* Paws */}
            <ellipse cx={38} cy={83} rx="7" ry="4.5" fill="#64748b" />
            <ellipse cx={62} cy={83} rx="7" ry="4.5" fill="#64748b" />
            {/* Fuzzy Gray Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="25" ry="21" fill="#94a3b8" />
            <ellipse cx={50 + hShift * 0.5} cy={68} rx="16" ry="14" fill="#f1f5f9" />
            {/* Head */}
            <circle cx={50 + hShift} cy={44} r="23" fill="#94a3b8" />
            {/* Big Fuzzy Ears */}
            <circle cx={26 + hShift} cy={30} r="12" fill="#94a3b8" />
            <circle cx={26 + hShift} cy={30} r="7" fill="#f1f5f9" />
            <circle cx={74 + hShift} cy={30} r="12" fill="#94a3b8" />
            <circle cx={74 + hShift} cy={30} r="7" fill="#f1f5f9" />
            {/* Big Black Leather Nose */}
            {!isFacingBack && (
              <ellipse cx={50 + hShift} cy={48} rx="6.5" ry="9" fill="#1e293b" />
            )}
          </g>
        );

      case 'hamster':
        return (
          <g>
            {/* Tiny Pink Feet */}
            <ellipse cx={38} cy={83} rx="6" ry="3.5" fill="#fbcfe8" />
            <ellipse cx={62} cy={83} rx="6" ry="3.5" fill="#fbcfe8" />
            {/* Chubby Round Body */}
            <ellipse cx={50 + hShift * 0.3} cy={64} rx="27" ry="24" fill="#fdba74" stroke="#fb923c" strokeWidth="1" />
            {/* White Tummy & Cheeks */}
            {!isFacingBack && (
              <>
                <ellipse cx={50 + hShift * 0.5} cy={68} rx="18" ry="16" fill="#ffffff" />
                <circle cx={32 + hShift} cy={50} r="9" fill="#ffffff" />
                <circle cx={68 + hShift} cy={50} r="9" fill="#ffffff" />
              </>
            )}
            {/* Tiny Rounded Ears */}
            <circle cx={32 + hShift} cy={28} r="6.5" fill="#fdba74" />
            <circle cx={32 + hShift} cy={28} r="3.5" fill="#f472b6" />
            <circle cx={68 + hShift} cy={28} r="6.5" fill="#fdba74" />
            <circle cx={68 + hShift} cy={28} r="3.5" fill="#f472b6" />
            {/* Tiny Pink Nose */}
            {!isFacingBack && (
              <circle cx={50 + hShift} cy={48} r="2" fill="#f43f5e" />
            )}
          </g>
        );

      case 'chick':
        return (
          <g>
            {/* Orange Bird Feet */}
            <path d="M 38 80 L 38 85 M 35 85 L 41 85" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 62 80 L 62 85 M 59 85 L 65 85" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Downy Yellow Round Body */}
            <circle cx={50 + hShift * 0.3} cy={56} r="27" fill="#fde047" stroke="#facc15" strokeWidth="1" />
            {/* Tiny Feather Wings */}
            <ellipse cx={23 + hShift * 0.2} cy={58} rx="5" ry="12" transform="rotate(15 23 58)" fill="#facc15" />
            <ellipse cx={77 + hShift * 0.2} cy={58} rx="5" ry="12" transform="rotate(-15 77 58)" fill="#facc15" />
            {/* Feather Tuft on Head */}
            <path d={`M ${50 + hShift} 29 Q ${50 + hShift} 20 ${56 + hShift} 22`} stroke="#eab308" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Orange Beak */}
            {!isFacingBack && (
              <polygon points={`${46 + hShift},48 ${54 + hShift},48 ${50 + hShift},54`} fill="#f97316" />
            )}
          </g>
        );

      case 'dragon':
        return (
          <g>
            {/* Claws */}
            <ellipse cx={38} cy={82} rx="6" ry="4" fill="#6ee7b7" />
            <ellipse cx={62} cy={82} rx="6" ry="4" fill="#6ee7b7" />
            {/* Pastel Dragon Wings */}
            <path
              d={`M ${isFacingLeft ? 65 : 35} 52 Q ${isFacingLeft ? 88 : 12} 32 ${isFacingLeft ? 80 : 20} 58 Z`}
              fill="#fbcfe8"
              stroke="#f472b6"
              strokeWidth="1.2"
            />
            {/* Dragon Tail with Spade */}
            <path
              d={`M ${isFacingLeft ? 68 : 32} 70 Q ${isFacingLeft ? 86 : 14} 76 ${isFacingLeft ? 82 : 18} 62`}
              stroke="#a7f3d0"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <polygon
              points={`${isFacingLeft ? 84 : 16},58 ${isFacingLeft ? 88 : 12},66 ${isFacingLeft ? 78 : 22},64`}
              fill="#fbbf24"
            />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="24" ry="20" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="1.2" />
            {/* Pastel Ribbed Tummy */}
            {!isFacingBack && (
              <ellipse cx={50 + hShift * 0.5} cy={68} rx="15" ry="14" fill="#fbcfe8" opacity="0.85" />
            )}
            {/* Head */}
            <ellipse cx={50 + hShift} cy={44} rx="24" ry="21" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="1.2" />
            {/* Cute Golden Horns */}
            <path d={`M ${34 + hShift} 28 Q ${28 + hShift} 14 ${36 + hShift} 12`} stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${66 + hShift} 28 Q ${72 + hShift} 14 ${64 + hShift} 12`} stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Spine ridges */}
            <polygon points={`${50 + hShift},22 ${48 + hShift},27 ${52 + hShift},27`} fill="#fbbf24" />
          </g>
        );

      case 'starsprite':
        return (
          <g>
            {/* Glowing Celestial Rings */}
            <ellipse
              cx={50 + hShift}
              cy={56}
              rx="36"
              ry="12"
              transform={`rotate(-15 ${50 + hShift} 56)`}
              fill="none"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.8"
            />
            {/* Luminous Body Wisp */}
            <circle cx={50 + hShift} cy={52} r="26" fill="url(#starSpriteGrad)" />
            {/* Orbiting Sparkles */}
            <polygon points={`${20 + hShift},40 ${22 + hShift},44 ${26 + hShift},45 ${22 + hShift},46 ${20 + hShift},50 ${18 + hShift},46 ${14 + hShift},45 ${18 + hShift},44`} fill="#fde047" />
            <polygon points={`${80 + hShift},58 ${81 + hShift},61 ${84 + hShift},62 ${81 + hShift},63 ${80 + hShift},66 ${79 + hShift},63 ${76 + hShift},62 ${79 + hShift},61`} fill="#f472b6" />
          </g>
        );

      case 'axolotl':
        return (
          <g>
            {/* Little Paws */}
            <ellipse cx={38} cy={82} rx="6" ry="3.5" fill="#f472b6" />
            <ellipse cx={62} cy={82} rx="6" ry="3.5" fill="#f472b6" />
            {/* Swimming Fin Tail */}
            <path
              d={`M ${isFacingLeft ? 70 : 30} 70 Q ${isFacingLeft ? 86 : 14} 72 ${isFacingLeft ? 84 : 16} 56`}
              stroke="#fb7185"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Body */}
            <ellipse cx={50 + hShift * 0.3} cy={66} rx="24" ry="20" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
            {/* Head */}
            <ellipse cx={50 + hShift} cy={46} rx="26" ry="21" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
            {/* Frilly External Gills (3 on left, 3 on right) */}
            <path d={`M ${26 + hShift} 38 Q ${12 + hShift} 32 ${14 + hShift} 24`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${24 + hShift} 46 Q ${8 + hShift} 46 ${10 + hShift} 40`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${26 + hShift} 54 Q ${12 + hShift} 60 ${16 + hShift} 66`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${74 + hShift} 38 Q ${88 + hShift} 32 ${86 + hShift} 24`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${76 + hShift} 46 Q ${92 + hShift} 46 ${90 + hShift} 40`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M ${74 + hShift} 54 Q ${88 + hShift} 60 ${84 + hShift} 66`} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactiveRotate ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{
        width: `${size * scale}px`,
        height: `${size * scale}px`,
        touchAction: interactiveRotate ? 'none' : 'auto',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D Ground Shadow */}
      {showShadow && (
        <div
          className={`absolute bottom-2 w-2/3 h-5 rounded-full bg-stone-900/15 blur-[3px] pointer-events-none transition-all duration-300 ${shadowAnimClass}`}
          style={{ transform: `scale(${animState === 'sleep' ? 1.2 : 1})` }}
        />
      )}

      {/* Main 3D Pet Model SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full relative z-10 transition-transform duration-150 ${animClass}`}
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(251, 113, 133, 0.22))',
        }}
      >
        <defs>
          <radialGradient id="starSpriteGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </radialGradient>
        </defs>

        {/* Species 3D Geometry */}
        {renderSpeciesBody()}

        {/* Dynamic Expressions */}
        {renderFace()}

        {/* Neckwear / Bows / Scarves */}
        {renderNeckwear()}

        {/* Hats */}
        {renderHat()}

        {/* Held Toys */}
        {renderToy()}
      </svg>
    </div>
  );
};
