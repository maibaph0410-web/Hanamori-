import React, { useEffect, useState } from 'react';
import { CharacterCustomization, Direction } from '../types';
import {
  SKIN_TONE_OPTIONS,
  HAIR_COLOR_OPTIONS,
} from '../characterData';

interface CharacterAvatarProps {
  customization: CharacterCustomization;
  direction?: Direction;
  isMoving?: boolean;
  stepPhase?: number;
  isSitting?: boolean;
  size?: number; // pixel width
  enableIdleAnim?: boolean;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  customization,
  direction = 'down',
  isMoving = false,
  stepPhase = 0,
  isSitting = false,
  size = 64,
  enableIdleAnim = true,
  className = '',
}) => {
  // Blinking state for lifelike expression
  const [isBlinking, setIsBlinking] = useState(false);
  // Idle breathing cycle
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    if (!enableIdleAnim) return;

    // Periodic natural eye blinks every 3-5 seconds
    let blinkTimer: number;
    const triggerBlink = () => {
      setIsBlinking(true);
      window.setTimeout(() => setIsBlinking(false), 140);
      blinkTimer = window.setTimeout(triggerBlink, 2800 + Math.random() * 2500);
    };
    blinkTimer = window.setTimeout(triggerBlink, 2000);

    // Subtle breathing animation
    const breathInterval = window.setInterval(() => {
      setBreathPhase((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 50);

    return () => {
      clearTimeout(blinkTimer);
      clearInterval(breathInterval);
    };
  }, [enableIdleAnim]);

  // Skin tone data
  const skin =
    SKIN_TONE_OPTIONS.find((s) => s.id === customization.skinTone) ||
    SKIN_TONE_OPTIONS[0];

  // Hair color data
  const hair =
    HAIR_COLOR_OPTIONS.find((h) => h.id === customization.hairColor) ||
    HAIR_COLOR_OPTIONS[2];

  // Motion dynamics
  const legAngle = isMoving && !isSitting ? Math.sin(stepPhase * Math.PI * 2) * 22 : 0;
  const armAngle = isMoving && !isSitting ? -Math.sin(stepPhase * Math.PI * 2) * 25 : 0;
  const hairSway = isMoving && !isSitting
    ? Math.sin(stepPhase * Math.PI * 2) * 4
    : Math.sin(breathPhase) * 1.5;
  const breathBob = enableIdleAnim && !isMoving ? Math.sin(breathPhase) * 1.2 : 0;
  const bodyBob = isSitting
    ? -8
    : isMoving
    ? Math.abs(Math.sin(stepPhase * Math.PI * 2)) * 3.5
    : -breathBob;

  // Directions
  const isFacingLeft = direction === 'left';
  const isFacingBack = direction === 'up';

  // Unique SVG IDs per instance
  const gradId = React.useId().replace(/:/g, '');

  // Resolve outfit identifier with fallback
  const outfit = customization.clothingId || customization.dress || 'pastel_dress';
  const shoes = customization.shoes || 'sneakers';
  const accessory = customization.accessory || 'none';
  const eyeStyle = customization.eyeStyle || 'sparkle';
  const faceStyle = customization.faceStyle || 'soft_blush';
  const hairstyle = customization.hairstyle || 'long_straight';

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 1.3}px`,
        transform: `translateY(-${bodyBob}px)`,
        transition: 'transform 0.08s linear',
      }}
    >
      {/* Ground Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-stone-900/20 blur-[1.5px]"
        style={{
          width: isSitting ? `${size * 0.9}px` : `${size * 0.72}px`,
          height: `${size * 0.22}px`,
          transform: `translateX(-50%) scale(${isMoving ? 0.92 : 1})`,
        }}
      />

      {/* Floating Peaceful Particle when Sitting / Relaxing */}
      {isSitting && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none text-xs animate-bounce opacity-80 flex gap-1">
          <span>🌸</span>
          <span className="text-[10px] text-pink-400 font-bold">♪</span>
        </div>
      )}

      <svg
        viewBox="0 0 70 95"
        className="w-full h-full drop-shadow-sm overflow-visible"
        style={{
          transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)',
          transformOrigin: '50% 85%',
        }}
      >
        <defs>
          {/* Hair Gradient */}
          <linearGradient id={`hairGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hair.colorGradStart} />
            <stop offset="50%" stopColor={hair.colorGradMid} />
            <stop offset="100%" stopColor={hair.colorGradEnd} />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id={`skinGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skin.baseColor} />
            <stop offset="100%" stopColor={skin.shadowColor} />
          </linearGradient>

          {/* Outfit Gradients */}
          <linearGradient id={`pastelPinkGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fff0f5" />
            <stop offset="100%" stopColor="#ffb8d2" />
          </linearGradient>

          <linearGradient id={`flowerMintGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8f8f0" />
            <stop offset="100%" stopColor="#b2e2cd" />
          </linearGradient>

          <linearGradient id={`fantasyGownGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8b3f5" />
            <stop offset="60%" stopColor="#8d6be6" />
            <stop offset="100%" stopColor="#5d3ba8" />
          </linearGradient>

          <linearGradient id={`cottageWhiteGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e9ecef" />
          </linearGradient>

          <linearGradient id={`rosePartyGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb3cb" />
            <stop offset="100%" stopColor="#e64980" />
          </linearGradient>

          <linearGradient id={`summerCitrusGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9db" />
            <stop offset="100%" stopColor="#ffd43b" />
          </linearGradient>

          <linearGradient id={`blueDenimGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#74c0fc" />
            <stop offset="100%" stopColor="#1c7ed6" />
          </linearGradient>

          <linearGradient id={`hoodieLilacGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3d9fa" />
            <stop offset="100%" stopColor="#b197fc" />
          </linearGradient>

          <linearGradient id={`warmAutumnGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59f00" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id={`winterPufferGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e7f5ff" />
            <stop offset="100%" stopColor="#339af0" />
          </linearGradient>

          <linearGradient id={`oxfordBlueGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#d0ebff" />
            <stop offset="100%" stopColor="#74c0fc" />
          </linearGradient>

          <linearGradient id={`varsityGreenGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#40c057" />
            <stop offset="100%" stopColor="#2b8a3e" />
          </linearGradient>

          <linearGradient id={`cableKnitGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff9db" />
            <stop offset="100%" stopColor="#fab005" />
          </linearGradient>

          <linearGradient id={`sageCardiganGrad_${gradId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d3f9d8" />
            <stop offset="100%" stopColor="#38d9a9" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* BACK HAIR LAYER (Behind Body) */}
        {/* ------------------------------------------------------------- */}
        <g style={{ transform: `rotate(${hairSway * 0.5}deg)`, transformOrigin: '35px 28px' }}>
          {hairstyle === 'long_straight' && (
            <path
              d="M 20 28 C 12 45, 12 70, 22 75 C 28 75, 35 72, 42 75 C 52 70, 52 45, 44 28 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}

          {hairstyle === 'long_wavy' && (
            <path
              d="M 19 28 C 10 42, 22 55, 14 74 C 23 78, 35 72, 47 78 C 42 55, 54 42, 45 28 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}

          {hairstyle === 'twin_tails' && (
            <>
              <g style={{ transform: `rotate(${-hairSway * 1.5}deg)`, transformOrigin: '16px 28px' }}>
                <path d="M 17 28 Q 6 36 8 52 Q 13 54 18 42 Z" fill={`url(#hairGrad_${gradId})`} />
                <ellipse cx="17" cy="28" rx="3.5" ry="3.5" fill="#ff7aa6" />
              </g>
              <g style={{ transform: `rotate(${hairSway * 1.5}deg)`, transformOrigin: '47px 28px' }}>
                <path d="M 47 28 Q 58 36 56 52 Q 51 54 46 42 Z" fill={`url(#hairGrad_${gradId})`} />
                <ellipse cx="47" cy="28" rx="3.5" ry="3.5" fill="#ff7aa6" />
              </g>
            </>
          )}

          {hairstyle === 'ponytail' && (
            <g style={{ transform: `rotate(${hairSway * 2}deg)`, transformOrigin: '32px 18px' }}>
              <path
                d="M 33 18 Q 48 16 50 35 Q 46 48 42 52 Q 38 45 36 26 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <circle cx="34" cy="20" r="3.5" fill="#ff7aa6" />
            </g>
          )}

          {hairstyle === 'braids' && (
            <>
              <path d="M 18 28 Q 12 42 16 62 Q 19 62 19 45 Z" fill={`url(#hairGrad_${gradId})`} />
              <circle cx="16" cy="60" r="2.5" fill="#ff6b8b" />
              <path d="M 46 28 Q 52 42 48 62 Q 45 62 45 45 Z" fill={`url(#hairGrad_${gradId})`} />
              <circle cx="48" cy="60" r="2.5" fill="#ff6b8b" />
            </>
          )}

          {hairstyle === 'half_up' && (
            <>
              <path
                d="M 21 28 C 16 45, 16 65, 23 70 C 35 68, 41 68, 47 70 C 48 65, 48 45, 43 28 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <ellipse cx="32" cy="19" rx="4" ry="4" fill={`url(#hairGrad_${gradId})`} />
              <circle cx="32" cy="20" r="2.2" fill="#ffd43b" />
            </>
          )}

          {hairstyle === 'shoulder_length' && (
            <path
              d="M 19 28 C 13 38, 14 56, 21 60 C 27 60, 36 58, 43 60 C 51 56, 51 38, 45 28 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}

          {hairstyle === 'bob' && (
            <path
              d="M 18 26 C 13 36, 14 50, 22 52 C 28 53, 36 53, 42 52 C 50 50, 51 36, 46 26 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}

          {hairstyle === 'medium_length' && (
            <path
              d="M 18 26 C 14 36, 15 48, 20 50 C 27 50, 37 49, 44 50 C 49 48, 50 36, 46 26 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}

          {hairstyle === 'curly' && (
            <path
              d="M 17 26 C 9 38, 12 55, 16 68 C 24 72, 40 72, 48 68 C 52 55, 55 38, 47 26 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          )}
        </g>

        {/* Small Backpack / Satchel (Back Layer) */}
        {accessory === 'small_backpack' && isFacingBack && (
          <g transform="translate(25, 42)">
            <rect x="0" y="0" width="14" height="15" rx="4" fill="#a06030" stroke="#7a441e" strokeWidth="1" />
            <rect x="2" y="3" width="10" height="7" rx="2" fill="#c47d45" />
            <circle cx="7" cy="7" r="1.5" fill="#ffd43b" />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LEGS & SHOES LAYER */}
        {/* ------------------------------------------------------------- */}
        {isSitting ? (
          /* Sitting cross-legged or cozy bent knees on grass */
          <g transform="translate(18, 59)">
            <rect x="0" y="0" width="16" height="7" rx="3.5" fill={skin.shadowColor} />
            <rect x="12" y="0" width="16" height="7" rx="3.5" fill={skin.shadowColor} />
            {/* Sitting Shoes Tips */}
            <circle cx="2" cy="4" r="3" fill="#333333" />
            <circle cx="26" cy="4" r="3" fill="#333333" />
          </g>
        ) : (
          <>
            {/* Left Leg */}
            <g style={{ transform: `rotate(${legAngle}deg)`, transformOrigin: '27px 62px' }}>
              <rect x="24" y="60" width="6" height="18" rx="3" fill={skin.shadowColor} />
              {/* Shoe */}
              <g transform="translate(22, 72)">
                {shoes === 'sneakers' && (
                  <>
                    <path d="M 0 4 C 0 1, 10 1, 10 4 C 10 9, -1 9, 0 4 Z" fill="#ff85a1" />
                    <rect x="0" y="7" width="10" height="2.5" rx="1" fill="#ffffff" />
                  </>
                )}
                {shoes === 'boots' && (
                  <path d="M -0.5 0 L 8.5 0 L 9 8 C 9 10, -1 10, -0.5 8 Z" fill="#8c5836" stroke="#67391d" strokeWidth="0.8" />
                )}
                {shoes === 'mary_jane' && (
                  <>
                    <rect x="1" y="-2" width="7" height="6" rx="2" fill="#ffffff" />
                    <path d="M 0 3 C 0 1, 9 1, 9 3 C 9 8, -1 8, 0 3 Z" fill="#2b2b2b" />
                    <line x1="1" y1="3" x2="8" y2="3" stroke="#ffd43b" strokeWidth="0.8" />
                  </>
                )}
                {shoes === 'cute_flats' && (
                  <path d="M 0 3 C 0 1, 9 1, 9 3 C 9 8, -1 8, 0 3 Z" fill="#ff70a6" />
                )}
                {shoes === 'loafers' && (
                  <path d="M -0.5 2 C 0 0, 9.5 0, 9.5 2 C 9.5 8, -1 8, -0.5 2 Z" fill="#1f2421" stroke="#3d405b" strokeWidth="0.6" />
                )}
                {shoes === 'canvas_shoes' && (
                  <>
                    <path d="M 0 3 C 0 1, 9.5 1, 9.5 3 C 9.5 8, -0.5 8, 0 3 Z" fill="#4dabf7" />
                    <rect x="0" y="6.5" width="9.5" height="2.5" rx="1" fill="#ffffff" />
                  </>
                )}
                {shoes === 'slippers' && (
                  <path d="M -1 2 C 0 -1, 10 -1, 10.5 2 C 11 8, -2 8, -1 2 Z" fill="#e5dbff" />
                )}
                {shoes === 'fantasy_shoes' && (
                  <path d="M -1 3 C 0 1, 10 1, 11 2 C 12 5, 8 8, -1 8 Z" fill="#845ef7" stroke="#ffd43b" strokeWidth="0.8" />
                )}
              </g>
            </g>

            {/* Right Leg */}
            <g style={{ transform: `rotate(${-legAngle}deg)`, transformOrigin: '37px 62px' }}>
              <rect x="34" y="60" width="6" height="18" rx="3" fill={skin.shadowColor} />
              {/* Shoe */}
              <g transform="translate(32, 72)">
                {shoes === 'sneakers' && (
                  <>
                    <path d="M 0 4 C 0 1, 10 1, 10 4 C 10 9, -1 9, 0 4 Z" fill="#ff85a1" />
                    <rect x="0" y="7" width="10" height="2.5" rx="1" fill="#ffffff" />
                  </>
                )}
                {shoes === 'boots' && (
                  <path d="M -0.5 0 L 8.5 0 L 9 8 C 9 10, -1 10, -0.5 8 Z" fill="#8c5836" stroke="#67391d" strokeWidth="0.8" />
                )}
                {shoes === 'mary_jane' && (
                  <>
                    <rect x="1" y="-2" width="7" height="6" rx="2" fill="#ffffff" />
                    <path d="M 0 3 C 0 1, 9 1, 9 3 C 9 8, -1 8, 0 3 Z" fill="#2b2b2b" />
                    <line x1="1" y1="3" x2="8" y2="3" stroke="#ffd43b" strokeWidth="0.8" />
                  </>
                )}
                {shoes === 'cute_flats' && (
                  <path d="M 0 3 C 0 1, 9 1, 9 3 C 9 8, -1 8, 0 3 Z" fill="#ff70a6" />
                )}
                {shoes === 'loafers' && (
                  <path d="M -0.5 2 C 0 0, 9.5 0, 9.5 2 C 9.5 8, -1 8, -0.5 2 Z" fill="#1f2421" stroke="#3d405b" strokeWidth="0.6" />
                )}
                {shoes === 'canvas_shoes' && (
                  <>
                    <path d="M 0 3 C 0 1, 9.5 1, 9.5 3 C 9.5 8, -0.5 8, 0 3 Z" fill="#4dabf7" />
                    <rect x="0" y="6.5" width="9.5" height="2.5" rx="1" fill="#ffffff" />
                  </>
                )}
                {shoes === 'slippers' && (
                  <path d="M -1 2 C 0 -1, 10 -1, 10.5 2 C 11 8, -2 8, -1 2 Z" fill="#e5dbff" />
                )}
                {shoes === 'fantasy_shoes' && (
                  <path d="M -1 3 C 0 1, 10 1, 11 2 C 12 5, 8 8, -1 8 Z" fill="#845ef7" stroke="#ffd43b" strokeWidth="0.8" />
                )}
              </g>
            </g>
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CLOTHING (DRESSES, SKIRTS, PANTS, HOODIES, JACKETS, SWEATERS) */}
        {/* ------------------------------------------------------------- */}
        <g>
          {/* 1. Pastel Lace Dress */}
          {outfit === 'pastel_dress' && (
            <>
              <path
                d="M 25 42 Q 16 58 20 67 Q 32 70 44 67 Q 48 58 39 42 Z"
                fill={`url(#pastelPinkGrad_${gradId})`}
                stroke="#ffb3cb"
                strokeWidth="0.8"
              />
              <path d="M 20 67 Q 32 70 44 67" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <path d="M 26 40 L 38 40 L 39 50 L 25 50 Z" fill="#ff70a6" />
              <circle cx="32" cy="45" r="1.8" fill="#ffffff" />
            </>
          )}

          {/* 2. Flower Daisy Sundress */}
          {outfit === 'flower_dress' && (
            <>
              <path
                d="M 25 42 Q 15 58 19 67 Q 32 70 45 67 Q 49 58 39 42 Z"
                fill={`url(#flowerMintGrad_${gradId})`}
                stroke="#8ce99a"
                strokeWidth="0.8"
              />
              <circle cx="27" cy="58" r="1.5" fill="#ffffff" />
              <circle cx="27" cy="58" r="0.7" fill="#ffd43b" />
              <circle cx="37" cy="62" r="1.5" fill="#ffffff" />
              <circle cx="37" cy="62" r="0.7" fill="#ffd43b" />
              <circle cx="33" cy="53" r="1.5" fill="#ffffff" />
              <circle cx="33" cy="53" r="0.7" fill="#ffd43b" />
              <line x1="26" y1="48" x2="38" y2="48" stroke="#38d9a9" strokeWidth="1.8" />
            </>
          )}

          {/* 3. Fantasy Star Gown */}
          {outfit === 'fantasy_dress' && (
            <>
              <path
                d="M 25 42 Q 13 58 18 69 Q 32 72 46 69 Q 51 58 39 42 Z"
                fill={`url(#fantasyGownGrad_${gradId})`}
                stroke="#d0bfff"
                strokeWidth="0.8"
              />
              <path d="M 18 69 Q 32 72 46 69" stroke="#ffd43b" strokeWidth="2" fill="none" />
              <polygon points="32,44 33.5,47 36,47 34,49 35,52 32,50 29,52 30,49 28,47 30.5,47" fill="#ffd43b" />
            </>
          )}

          {/* 4. Cottage Cotton Dress */}
          {outfit === 'simple_white_dress' && (
            <>
              <path
                d="M 25 42 Q 16 58 20 66 Q 32 69 44 66 Q 48 58 39 42 Z"
                fill={`url(#cottageWhiteGrad_${gradId})`}
                stroke="#ced4da"
                strokeWidth="0.8"
              />
              <path d="M 20 66 Q 32 69 44 66" stroke="#ffffff" strokeWidth="2" fill="none" />
              <line x1="26" y1="47" x2="38" y2="47" stroke="#adb5bd" strokeWidth="1.2" />
            </>
          )}

          {/* 5. Rose Party Dress */}
          {outfit === 'pink_dress' && (
            <>
              <path
                d="M 24 42 Q 14 58 18 68 Q 32 71 46 68 Q 50 58 40 42 Z"
                fill={`url(#rosePartyGrad_${gradId})`}
                stroke="#ff85a1"
                strokeWidth="0.8"
              />
              <path d="M 21 57 Q 32 60 43 57" stroke="#fff0f5" strokeWidth="1.5" fill="none" />
              <path d="M 18 68 Q 32 71 46 68" stroke="#ffffff" strokeWidth="2" fill="none" />
              <circle cx="32" cy="46" r="2.2" fill="#ff3377" />
            </>
          )}

          {/* 6. Summer Citrus Sundress */}
          {outfit === 'summer_sundress' && (
            <>
              <path
                d="M 25 42 Q 15 58 19 67 Q 32 70 45 67 Q 49 58 39 42 Z"
                fill={`url(#summerCitrusGrad_${gradId})`}
                stroke="#fcc419"
                strokeWidth="0.8"
              />
              <path d="M 19 67 Q 32 70 45 67" stroke="#ffffff" strokeWidth="1.8" fill="none" />
              <circle cx="32" cy="47" r="1.5" fill="#e67700" />
            </>
          )}

          {/* 7. Lace Nightgown Pajamas */}
          {outfit === 'cozy_pajama_dress' && (
            <>
              <path
                d="M 24 41 Q 14 58 18 70 Q 32 73 46 70 Q 50 58 40 41 Z"
                fill="#f3d9fa"
                stroke="#d0bfff"
                strokeWidth="0.8"
              />
              <path d="M 18 70 Q 32 73 46 70" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <circle cx="32" cy="46" r="1.5" fill="#b197fc" />
            </>
          )}

          {/* 8. Sailor Blouse & Skirt */}
          {outfit === 'skirt_blouse' && (
            <>
              {/* Pleated Navy Skirt */}
              <path d="M 26 51 L 21 66 Q 32 68 43 66 L 38 51 Z" fill="#1864ab" stroke="#1c7ed6" strokeWidth="0.8" />
              {/* White Sailor Top */}
              <path d="M 25 40 L 24 52 Q 32 53 40 52 L 39 40 Z" fill="#ffffff" stroke="#ced4da" strokeWidth="0.6" />
              <polygon points="32,46 27,40 37,40" fill="#339af0" />
              <circle cx="32" cy="46" r="1.5" fill="#ff6b6b" />
            </>
          )}

          {/* 9. Cardigan & Plaid Skirt */}
          {outfit === 'skirt_sweater' && (
            <>
              <path d="M 26 51 L 21 66 Q 32 68 43 66 L 38 51 Z" fill="#e03131" stroke="#c92a2a" strokeWidth="0.8" />
              <path d="M 24 40 L 22 53 Q 32 55 42 53 L 40 40 Z" fill="#fff0f6" stroke="#ffb8d2" strokeWidth="0.8" />
              <line x1="32" y1="40" x2="32" y2="53" stroke="#ff85a1" strokeWidth="1" />
              <circle cx="32" cy="44" r="1" fill="#e64980" />
              <circle cx="32" cy="48" r="1" fill="#e64980" />
            </>
          )}

          {/* 10. Pastel Tee & High Pants (Female) */}
          {outfit === 'tshirt_pants_f' && (
            <>
              <path d="M 26 50 L 21 72 L 29 72 L 32 57 L 35 72 L 43 72 L 38 50 Z" fill="#d0bfff" stroke="#b197fc" strokeWidth="0.8" />
              <path d="M 25 40 L 24 50 Q 32 51 40 50 L 39 40 Z" fill="#ffffff" stroke="#dee2e6" strokeWidth="0.6" />
              <circle cx="32" cy="45" r="2" fill="#ff85a1" />
            </>
          )}

          {/* 11. Bunny Hoodie & Shorts */}
          {outfit === 'hoodie_shorts_f' && (
            <>
              <path d="M 26 52 L 23 63 L 30 63 L 32 58 L 34 63 L 41 63 L 38 52 Z" fill="#74c0fc" />
              <path d="M 23 39 L 21 54 Q 32 56 43 54 L 41 39 Z" fill={`url(#hoodieLilacGrad_${gradId})`} stroke="#9775fa" strokeWidth="0.8" />
              <rect x="27" y="47" width="10" height="5" rx="2" fill="#e5dbff" />
            </>
          )}

          {/* 12. Cute Denim Dungarees (Female) */}
          {outfit === 'casual_dungarees' && (
            <>
              {/* Inner Striped Shirt */}
              <path d="M 24 40 L 23 52 Q 32 54 41 52 L 40 40 Z" fill="#ffffff" />
              <line x1="24" y1="44" x2="40" y2="44" stroke="#ff6b6b" strokeWidth="1" />
              <line x1="24" y1="48" x2="40" y2="48" stroke="#ff6b6b" strokeWidth="1" />
              {/* Denim Overalls */}
              <path d="M 26 50 L 21 68 Q 32 70 43 68 L 38 50 Z" fill="#339af0" stroke="#1c7ed6" strokeWidth="0.8" />
              <rect x="28" y="44" width="8" height="7" rx="1.5" fill="#339af0" />
              <circle cx="32" cy="47" r="1" fill="#ffd43b" />
            </>
          )}

          {/* 13. Strawberry Pajamas (Female) */}
          {outfit === 'pastel_pajamas_f' && (
            <>
              <path d="M 26 51 L 22 72 L 29 72 L 32 58 L 35 72 L 42 72 L 38 51 Z" fill="#ffc9db" />
              <path d="M 24 40 L 23 52 Q 32 54 41 52 L 40 40 Z" fill="#ffc9db" stroke="#ff85a1" strokeWidth="0.8" />
              <circle cx="28" cy="45" r="1" fill="#ff3366" />
              <circle cx="36" cy="45" r="1" fill="#ff3366" />
              <circle cx="32" cy="49" r="1" fill="#ff3366" />
            </>
          )}

          {/* 14. Autumn Wool Coat (Female) */}
          {outfit === 'autumn_coat_f' && (
            <>
              <path d="M 23 40 L 19 66 Q 32 68 45 66 L 41 40 Z" fill={`url(#warmAutumnGrad_${gradId})`} stroke="#78350f" strokeWidth="0.8" />
              {/* Plaid Scarf */}
              <ellipse cx="32" cy="41" rx="9" ry="3.5" fill="#f03e3e" stroke="#c92a2a" strokeWidth="0.8" />
              <rect x="30" y="42" width="4" height="8" rx="1" fill="#f03e3e" />
            </>
          )}

          {/* 15. Winter Puffer & Scarf (Female) */}
          {outfit === 'winter_scarf_jacket_f' && (
            <>
              <path d="M 23 40 L 20 62 Q 32 64 44 62 L 41 40 Z" fill="#f1f3f5" stroke="#adb5bd" strokeWidth="0.8" />
              <line x1="22" y1="48" x2="42" y2="48" stroke="#ced4da" strokeWidth="1" />
              <line x1="21" y1="55" x2="43" y2="55" stroke="#ced4da" strokeWidth="1" />
              {/* Fluffy Pink Muffler */}
              <ellipse cx="32" cy="41" rx="9.5" ry="4" fill="#ff85a1" />
            </>
          )}

          {/* 16. Casual Tee & Chinos (Male) */}
          {outfit === 'tshirt_pants_m' && (
            <>
              {/* Chinos */}
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#d8b48f" stroke="#b08968" strokeWidth="0.8" />
              {/* Crewneck Tee */}
              <path d="M 24 39 L 23 52 Q 32 54 41 52 L 40 39 Z" fill="#4dabf7" stroke="#339af0" strokeWidth="0.8" />
              <line x1="28" y1="40" x2="36" y2="40" stroke="#1c7ed6" strokeWidth="1.2" />
            </>
          )}

          {/* 17. Streetwear Hoodie & Joggers (Male) */}
          {outfit === 'street_hoodie_m' && (
            <>
              {/* Dark Joggers */}
              <path d="M 26 52 L 22 72 L 29 72 L 32 58 L 35 72 L 42 72 L 38 52 Z" fill="#343a40" stroke="#212529" strokeWidth="0.8" />
              {/* Street Hoodie */}
              <path d="M 23 39 L 21 54 Q 32 56 43 54 L 41 39 Z" fill="#7048e8" stroke="#5f3dc4" strokeWidth="0.8" />
              <rect x="27" y="47" width="10" height="5" rx="2" fill="#845ef7" />
            </>
          )}

          {/* 18. Oxford Shirt & Trousers (Male) */}
          {outfit === 'oxford_trousers_m' && (
            <>
              {/* Tailored Slacks */}
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#495057" stroke="#343a40" strokeWidth="0.8" />
              {/* Oxford Shirt */}
              <path d="M 24 39 L 23 52 Q 32 54 41 52 L 40 39 Z" fill={`url(#oxfordBlueGrad_${gradId})`} stroke="#74c0fc" strokeWidth="0.8" />
              <polygon points="32,43 28,40 36,40" fill="#ffffff" stroke="#4dabf7" strokeWidth="0.6" />
              <line x1="32" y1="43" x2="32" y2="52" stroke="#4dabf7" strokeWidth="0.8" />
            </>
          )}

          {/* 19. Vintage Denim Jacket (Male) */}
          {outfit === 'denim_jacket_m' && (
            <>
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#343a40" />
              <path d="M 23 39 L 22 53 Q 32 55 42 53 L 41 39 Z" fill={`url(#blueDenimGrad_${gradId})`} stroke="#1864ab" strokeWidth="0.8" />
              <polygon points="30,40 34,40 33,53 31,53" fill="#ffffff" />
              <line x1="28" y1="46" x2="31" y2="46" stroke="#ffd43b" strokeWidth="0.8" />
              <line x1="33" y1="46" x2="36" y2="46" stroke="#ffd43b" strokeWidth="0.8" />
            </>
          )}

          {/* 20. Varsity Bomber Jacket (Male) */}
          {outfit === 'bomber_jacket_m' && (
            <>
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#212529" />
              <path d="M 23 39 L 22 53 Q 32 55 42 53 L 41 39 Z" fill={`url(#varsityGreenGrad_${gradId})`} stroke="#236f32" strokeWidth="0.8" />
              <line x1="32" y1="41" x2="32" y2="53" stroke="#f1f3f5" strokeWidth="1.2" />
              <circle cx="28" cy="46" r="1.5" fill="#fcc419" />
            </>
          )}

          {/* 21. Cable Knit Sweater (Male) */}
          {outfit === 'knit_sweater_m' && (
            <>
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#868e96" />
              <path d="M 24 39 L 22 53 Q 32 55 42 53 L 40 39 Z" fill={`url(#cableKnitGrad_${gradId})`} stroke="#fab005" strokeWidth="0.8" />
              <line x1="28" y1="42" x2="28" y2="52" stroke="#e67700" strokeWidth="0.8" strokeDasharray="1,1" />
              <line x1="32" y1="42" x2="32" y2="52" stroke="#e67700" strokeWidth="0.8" strokeDasharray="1,1" />
              <line x1="36" y1="42" x2="36" y2="52" stroke="#e67700" strokeWidth="0.8" strokeDasharray="1,1" />
            </>
          )}

          {/* 22. Workwear Dungarees (Male) */}
          {outfit === 'casual_overalls_m' && (
            <>
              <path d="M 24 39 L 23 52 Q 32 54 41 52 L 40 39 Z" fill="#dee2e6" />
              <path d="M 26 50 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 50 Z" fill="#1c7ed6" stroke="#1971c2" strokeWidth="0.8" />
              <rect x="28" y="44" width="8" height="7" rx="1.5" fill="#1c7ed6" />
              <circle cx="32" cy="47" r="1" fill="#fab005" />
            </>
          )}

          {/* 23. Midnight Striped Pajamas (Male) */}
          {outfit === 'comfort_pajamas_m' && (
            <>
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#1864ab" />
              <path d="M 24 39 L 23 52 Q 32 54 41 52 L 40 39 Z" fill="#1864ab" stroke="#1971c2" strokeWidth="0.8" />
              <line x1="24" y1="43" x2="40" y2="43" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <line x1="24" y1="48" x2="40" y2="48" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
            </>
          )}

          {/* 24. Caramel Autumn Coat (Male) */}
          {outfit === 'autumn_trench_m' && (
            <>
              <path d="M 23 39 L 19 68 Q 32 70 45 68 L 41 39 Z" fill={`url(#warmAutumnGrad_${gradId})`} stroke="#78350f" strokeWidth="0.8" />
              <polygon points="30,40 34,40 33,52 31,52" fill="#212529" />
              <circle cx="34" cy="48" r="1" fill="#78350f" />
              <circle cx="34" cy="54" r="1" fill="#78350f" />
            </>
          )}

          {/* 25. Arctic Winter Puffer (Male) */}
          {outfit === 'winter_puffer_m' && (
            <>
              <path d="M 23 39 L 20 64 Q 32 66 44 64 L 41 39 Z" fill={`url(#winterPufferGrad_${gradId})`} stroke="#1864ab" strokeWidth="0.8" />
              <line x1="22" y1="47" x2="42" y2="47" stroke="#1864ab" strokeWidth="1" />
              <line x1="21" y1="55" x2="43" y2="55" stroke="#1864ab" strokeWidth="1" />
              <rect x="29" y="38" width="6" height="4" rx="1.5" fill="#adb5bd" />
            </>
          )}

          {/* 26. Sage Spring Cardigan (Male) */}
          {outfit === 'spring_cardigan_m' && (
            <>
              <path d="M 26 51 L 21 72 L 29 72 L 32 58 L 35 72 L 43 72 L 38 51 Z" fill="#ced4da" />
              <path d="M 24 39 L 23 53 Q 32 55 41 53 L 40 39 Z" fill={`url(#sageCardiganGrad_${gradId})`} stroke="#20c997" strokeWidth="0.8" />
              <polygon points="30,40 34,40 33,53 31,53" fill="#ffffff" />
              <circle cx="32" cy="46" r="0.8" fill="#0ca678" />
              <circle cx="32" cy="49" r="0.8" fill="#0ca678" />
            </>
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ARMS */}
        {/* ------------------------------------------------------------- */}
        {/* Left Arm */}
        <g style={{ transform: `rotate(${isSitting ? -20 : armAngle}deg)`, transformOrigin: '24px 42px' }}>
          <path d="M 24 42 Q 18 50 20 54" stroke={skin.shadowColor} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="42" r="4.2" fill="#ffffff" stroke="#ffdce8" strokeWidth="0.8" />
        </g>

        {/* Right Arm */}
        <g style={{ transform: `rotate(${isSitting ? 20 : -armAngle}deg)`, transformOrigin: '40px 42px' }}>
          <path d="M 40 42 Q 46 50 44 54" stroke={skin.shadowColor} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="42" r="4.2" fill="#ffffff" stroke="#ffdce8" strokeWidth="0.8" />
        </g>

        {/* Small Backpack (Front Straps) */}
        {accessory === 'small_backpack' && !isFacingBack && (
          <g>
            <path d="M 26 40 L 26 50" stroke="#7a441e" strokeWidth="1.2" fill="none" />
            <path d="M 38 40 L 38 50" stroke="#7a441e" strokeWidth="1.2" fill="none" />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* HEAD, EYES, AND FACE */}
        {/* ------------------------------------------------------------- */}
        <g>
          {/* Head Shape */}
          <ellipse cx="32" cy="27" rx="14" ry="13.5" fill={`url(#skinGrad_${gradId})`} />

          {/* Facing Back: Hair covers head */}
          {isFacingBack ? (
            <path
              d="M 18 28 C 18 13, 46 13, 46 28 C 46 40, 18 40, 18 28 Z"
              fill={`url(#hairGrad_${gradId})`}
            />
          ) : (
            <>
              {/* Ears */}
              <ellipse cx="18" cy="28" rx="2.5" ry="3.5" fill={skin.earColor} />
              <ellipse cx="46" cy="28" rx="2.5" ry="3.5" fill={skin.earColor} />

              {/* Cheeks Blush / Freckles based on FaceStyle */}
              {faceStyle === 'soft_blush' && (
                <>
                  <ellipse cx="23" cy="31" rx="3.5" ry="2" fill={skin.blushColor} opacity="0.45" />
                  <ellipse cx="41" cy="31" rx="3.5" ry="2" fill={skin.blushColor} opacity="0.45" />
                </>
              )}
              {faceStyle === 'rosy_cheeks' && (
                <>
                  <circle cx="23" cy="31" r="3.2" fill={skin.blushColor} opacity="0.65" />
                  <circle cx="41" cy="31" r="3.2" fill={skin.blushColor} opacity="0.65" />
                </>
              )}
              {faceStyle === 'freckles' && (
                <>
                  <ellipse cx="23" cy="31" rx="3" ry="1.8" fill={skin.blushColor} opacity="0.35" />
                  <ellipse cx="41" cy="31" rx="3" ry="1.8" fill={skin.blushColor} opacity="0.35" />
                  <circle cx="29" cy="30.5" r="0.6" fill="#8c5836" />
                  <circle cx="31" cy="30" r="0.6" fill="#8c5836" />
                  <circle cx="33" cy="30.5" r="0.6" fill="#8c5836" />
                  <circle cx="35" cy="30" r="0.6" fill="#8c5836" />
                </>
              )}
              {faceStyle === 'cheerful' && (
                <>
                  <ellipse cx="23" cy="30.5" rx="3.8" ry="2.2" fill={skin.blushColor} opacity="0.55" />
                  <ellipse cx="41" cy="30.5" rx="3.8" ry="2.2" fill={skin.blushColor} opacity="0.55" />
                </>
              )}

              {/* Expressive Eyes or Blinking */}
              {isBlinking || isSitting ? (
                /* Blinking / Serene meditating curved eye lines */
                <g>
                  <path d="M 22 28 Q 25 31 28 28" stroke="#252026" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d="M 36 28 Q 39 31 42 28" stroke="#252026" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </g>
              ) : (
                <>
                  {/* Left Eye */}
                  <g>
                    <ellipse cx="25" cy="27" rx={eyeStyle === 'cat' ? 3.0 : 3.2} ry={eyeStyle === 'calm' ? 3.8 : 4.5} fill="#1e1820" />
                    <ellipse cx="25" cy="27" rx="2.9" ry="3.8" fill={hair.colorHex} opacity="0.85" />
                    <circle cx="25" cy="27" r="1.8" fill="#141115" />
                    {/* Catchlight sparkles */}
                    <circle cx="24" cy="25" r={eyeStyle === 'sparkle' ? 1.4 : 1.1} fill="#ffffff" />
                    {eyeStyle === 'sparkle' && <circle cx="26.2" cy="28.8" r="0.75" fill="#ffffff" />}
                    {eyeStyle === 'starry' && (
                      <polygon points="25,24 25.5,25.5 27,25.5 25.8,26.5 26.2,28 25,27 23.8,28 24.2,26.5 23,25.5 24.5,25.5" fill="#ffffff" />
                    )}
                    {/* Upper Eyelash */}
                    <path
                      d={eyeStyle === 'cat' ? "M 21 25 Q 25 21 29.5 22.5" : "M 21 24 Q 25 21.5 29 24"}
                      stroke="#1e1820"
                      strokeWidth="1.3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Right Eye */}
                  <g>
                    <ellipse cx="39" cy="27" rx={eyeStyle === 'cat' ? 3.0 : 3.2} ry={eyeStyle === 'calm' ? 3.8 : 4.5} fill="#1e1820" />
                    <ellipse cx="39" cy="27" rx="2.9" ry="3.8" fill={hair.colorHex} opacity="0.85" />
                    <circle cx="39" cy="27" r="1.8" fill="#141115" />
                    <circle cx="38" cy="25" r={eyeStyle === 'sparkle' ? 1.4 : 1.1} fill="#ffffff" />
                    {eyeStyle === 'sparkle' && <circle cx="40.2" cy="28.8" r="0.75" fill="#ffffff" />}
                    {eyeStyle === 'starry' && (
                      <polygon points="39,24 39.5,25.5 41,25.5 39.8,26.5 40.2,28 39,27 37.8,28 38.2,26.5 37,25.5 38.5,25.5" fill="#ffffff" />
                    )}
                    <path
                      d={eyeStyle === 'cat' ? "M 34.5 22.5 Q 39 21 43 25" : "M 35 24 Q 39 21.5 43 24"}
                      stroke="#1e1820"
                      strokeWidth="1.3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                </>
              )}

              {/* Mouth based on FaceStyle */}
              {faceStyle === 'cheerful' ? (
                <path d="M 30 32.5 Q 32 36 34 32.5 Z" fill="#e03131" stroke="#c92a2a" strokeWidth="0.8" />
              ) : (
                <path d="M 30.5 33 Q 32 35 33.5 33" stroke="#b04b36" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              )}
            </>
          )}

          {/* ------------------------------------------------------------- */}
          {/* FRONT HAIR (BANGS & FRINGE ADAPTED TO HAIRSTYLE) */}
          {/* ------------------------------------------------------------- */}
          {/* Side-part */}
          {hairstyle === 'side_part' && (
            <>
              <path
                d="M 17 24 C 18 12, 46 12, 47 24 C 42 20, 36 21, 30 18 C 24 23, 19 22, 17 24 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <path d="M 18 22 Q 16 30 20 34" stroke={hair.colorHex} strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 46 22 Q 47 30 45 33" stroke={hair.colorHex} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Messy */}
          {hairstyle === 'messy' && (
            <>
              <path
                d="M 16 23 C 18 10, 46 10, 48 23 C 44 20, 40 23, 37 18 C 34 22, 31 17, 28 22 C 24 19, 20 21, 16 23 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              {/* Spiky soft tufts */}
              <polygon points="26,16 29,11 32,16" fill={`url(#hairGrad_${gradId})`} />
              <polygon points="34,15 38,10 40,16" fill={`url(#hairGrad_${gradId})`} />
              <path d="M 17 22 Q 14 29 18 32" stroke={hair.colorHex} strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 47 22 Q 50 29 46 32" stroke={hair.colorHex} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Two-block */}
          {hairstyle === 'two_block' && (
            <>
              <path
                d="M 17 24 C 18 12, 46 12, 47 24 C 43 20, 38 23, 33 21 C 28 23, 23 20, 17 24 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <path d="M 18 22 Q 16 28 19 32" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 46 22 Q 48 28 45 32" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Short straight */}
          {hairstyle === 'short_straight' && (
            <>
              <path
                d="M 17 23 C 18 12, 46 12, 47 23 C 42 21, 38 23, 34 20 C 30 23, 26 21, 21 23 C 19 22, 18 22, 17 23 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <path d="M 18 22 Q 17 28 19 30" stroke={hair.colorHex} strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 46 22 Q 47 28 45 30" stroke={hair.colorHex} strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Short wavy & Curly & Medium */}
          {(hairstyle === 'short_wavy' || hairstyle === 'curly' || hairstyle === 'medium_length') && (
            <>
              <path
                d="M 17 24 C 18 12, 46 12, 47 24 C 44 21, 39 24, 35 19 C 31 23, 27 20, 23 23 C 20 21, 18 22, 17 24 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <path d="M 18 22 Q 15 30 19 34" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 46 22 Q 49 30 45 34" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Feminine styles default front bangs */}
          {(hairstyle === 'long_straight' ||
            hairstyle === 'long_wavy' ||
            hairstyle === 'twin_tails' ||
            hairstyle === 'ponytail' ||
            hairstyle === 'bob' ||
            hairstyle === 'shoulder_length' ||
            hairstyle === 'braids' ||
            hairstyle === 'half_up') && (
            <>
              <path
                d="M 17 24 C 18 12, 46 12, 47 24 C 43 21, 39 24, 36 19 C 33 24, 29 21, 26 24 C 22 20, 19 22, 17 24 Z"
                fill={`url(#hairGrad_${gradId})`}
              />
              <path d="M 18 23 Q 15 32 19 36" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 46 23 Q 49 32 45 36" stroke={hair.colorHex} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* ------------------------------------------------------------- */}
          {/* ACCESSORIES (Glasses, Flower, Bow, Headphones, Beret, etc.) */}
          {/* ------------------------------------------------------------- */}
          {accessory === 'glasses' && !isFacingBack && (
            <g transform="translate(18, 23)">
              <circle cx="7" cy="4" r="4.2" fill="none" stroke="#d4af37" strokeWidth="0.9" />
              <circle cx="21" cy="4" r="4.2" fill="none" stroke="#d4af37" strokeWidth="0.9" />
              <line x1="11.2" y1="4" x2="16.8" y2="4" stroke="#d4af37" strokeWidth="0.9" />
              <line x1="2.8" y1="4" x2="0" y2="3" stroke="#d4af37" strokeWidth="0.8" />
              <line x1="25.2" y1="4" x2="28" y2="3" stroke="#d4af37" strokeWidth="0.8" />
            </g>
          )}

          {accessory === 'sunglasses' && !isFacingBack && (
            <g transform="translate(18, 23)">
              <rect x="3" y="1.5" width="9" height="6.5" rx="2" fill="#212529" stroke="#495057" strokeWidth="0.8" />
              <rect x="16" y="1.5" width="9" height="6.5" rx="2" fill="#212529" stroke="#495057" strokeWidth="0.8" />
              <line x1="12" y1="4" x2="16" y2="4" stroke="#212529" strokeWidth="1.2" />
            </g>
          )}

          {accessory === 'headphones' && (
            <g>
              {/* Headband arch */}
              <path d="M 16 28 C 16 12, 48 12, 48 28" fill="none" stroke="#f06595" strokeWidth="2.5" />
              {/* Ear pads */}
              <rect x="14" y="24" width="4" height="8" rx="2" fill="#fcc2d7" stroke="#e64980" strokeWidth="0.8" />
              <rect x="46" y="24" width="4" height="8" rx="2" fill="#fcc2d7" stroke="#e64980" strokeWidth="0.8" />
            </g>
          )}

          {accessory === 'beret' && (
            <g transform="translate(20, 11)">
              <ellipse cx="14" cy="5" rx="16" ry="6" fill="#c92a2a" stroke="#a61e4d" strokeWidth="0.8" />
              <circle cx="14" cy="0" r="1.2" fill="#a61e4d" />
            </g>
          )}

          {accessory === 'flower' && (
            <g transform="translate(41, 15)">
              <circle cx="0" cy="-3" r="2.5" fill="#ff8da7" />
              <circle cx="3" cy="-1" r="2.5" fill="#ff8da7" />
              <circle cx="2" cy="3" r="2.5" fill="#ff8da7" />
              <circle cx="-2" cy="3" r="2.5" fill="#ff8da7" />
              <circle cx="-3" cy="-1" r="2.5" fill="#ff8da7" />
              <circle cx="0" cy="0" r="1.6" fill="#fffb99" />
            </g>
          )}

          {accessory === 'bow' && (
            <g transform="translate(40, 16)">
              <polygon points="-4,-2 0,0 -4,2" fill="#ff3377" />
              <polygon points="4,-2 0,0 4,2" fill="#ff3377" />
              <circle cx="0" cy="0" r="1.8" fill="#ffd4e3" />
              <path d="M -1 1 Q -2 6 -4 7" stroke="#ff3377" strokeWidth="1" fill="none" />
              <path d="M 1 1 Q 2 6 4 7" stroke="#ff3377" strokeWidth="1" fill="none" />
            </g>
          )}

          {accessory === 'hair_clip' && (
            <g transform="translate(42, 16)">
              <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,2.5 0,1.2 -2,2.5 -1.5,0.5 -3,-1 -1,-1" fill="#ffd43b" />
            </g>
          )}

          {accessory === 'ribbon' && (
            <>
              <g transform="translate(18, 22)">
                <ellipse cx="0" cy="0" rx="2" ry="1" fill="#ff85a1" />
                <path d="M 0 0 L -2 5" stroke="#ff85a1" strokeWidth="1" />
              </g>
              <g transform="translate(46, 22)">
                <ellipse cx="0" cy="0" rx="2" ry="1" fill="#ff85a1" />
                <path d="M 0 0 L 2 5" stroke="#ff85a1" strokeWidth="1" />
              </g>
            </>
          )}

          {accessory === 'star_accessory' && (
            <g transform="translate(41, 14)">
              <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" fill="#ffd43b" stroke="#ffffff" strokeWidth="0.5" />
            </g>
          )}

          {accessory === 'heart_accessory' && (
            <g transform="translate(41, 15)">
              <path
                d="M 0 0 C -2 -3, -4 0, 0 3.5 C 4 0, 2 -3, 0 0 Z"
                fill="#ff4d6d"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
