import React, { useState, useEffect, useRef } from 'react';
import { CompanionPetState, PetAnimState, PetExpression } from '../petTypes';
import { CompanionPet3D } from './CompanionPet3D';
import { MoodType } from '../types';
import { sound } from '../audio';
import { Heart, Sparkles } from 'lucide-react';

interface PetInGardenProps {
  pet: CompanionPetState;
  characterX: number;
  characterY: number;
  characterDirection: 'up' | 'down' | 'left' | 'right';
  characterIsMoving: boolean;
  userMood: MoodType;
  onOpenInteraction: () => void;
  isNight?: boolean;
}

export const PetInGarden: React.FC<PetInGardenProps> = ({
  pet,
  characterX,
  characterY,
  characterDirection,
  characterIsMoving,
  userMood,
  onOpenInteraction,
  isNight = false,
}) => {
  // Initialize pet slightly behind the character
  const [petPos, setPetPos] = useState({
    x: characterX - 45,
    y: characterY + 20,
  });

  const [animState, setAnimState] = useState<PetAnimState>('idle');
  const [expression, setExpression] = useState<PetExpression>('happy');
  const [rotation, setRotation] = useState(0);
  const [thoughtBubble, setThoughtBubble] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const petPosRef = useRef(petPos);
  petPosRef.current = petPos;

  // Occasional random thoughts or reactions
  useEffect(() => {
    const thoughts = [
      `Happy to be with you! 💖`,
      `Sniffing the sweet blossoms... 🌸`,
      `The garden breeze feels lovely! 🍃`,
      `I've got your back! 🐾`,
      `Let's explore together! ✨`,
    ];

    const interval = setInterval(() => {
      if (Math.random() < 0.35 && !thoughtBubble) {
        const rand = thoughts[Math.floor(Math.random() * thoughts.length)];
        setThoughtBubble(rand);
        setTimeout(() => setThoughtBubble(null), 4000);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [thoughtBubble]);

  // Adjust expression based on user's current mood
  useEffect(() => {
    if (userMood === 'sad' || userMood === 'lonely') {
      setExpression('loving');
    } else if (userMood === 'happy' || userMood === 'excited') {
      setExpression('excited');
    } else if (userMood === 'calm') {
      setExpression('calm');
    } else {
      setExpression('happy');
    }
  }, [userMood]);

  // Main following movement loop (tick every ~40ms for smooth 30-60fps tracking)
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Compute ideal follow anchor relative to player character
      let targetOffsetX = -38;
      let targetOffsetY = 15;

      if (characterDirection === 'down') {
        targetOffsetX = -35;
        targetOffsetY = -30;
      } else if (characterDirection === 'up') {
        targetOffsetX = 35;
        targetOffsetY = 35;
      } else if (characterDirection === 'right') {
        targetOffsetX = -45;
        targetOffsetY = 15;
      } else if (characterDirection === 'left') {
        targetOffsetX = 45;
        targetOffsetY = 15;
      }

      // If user is sad, pet sits a bit closer for comfort
      if (userMood === 'sad' || userMood === 'lonely') {
        targetOffsetX *= 0.65;
        targetOffsetY *= 0.65;
      }

      const targetX = characterX + targetOffsetX;
      const targetY = characterY + targetOffsetY;

      const currentX = petPosRef.current.x;
      const currentY = petPosRef.current.y;

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const distToTarget = Math.hypot(dx, dy);

      // Avoid overlapping player character directly
      const distToChar = Math.hypot(characterX - currentX, characterY - currentY);
      const minDistance = 32;

      if (distToTarget > 12 && distToChar > minDistance - 5) {
        // Move towards target
        const isSprinting = distToTarget > 140;
        const speed = isSprinting ? 210 : 130;
        const step = speed * dt;

        const moveX = (dx / distToTarget) * Math.min(step, distToTarget);
        const moveY = (dy / distToTarget) * Math.min(step, distToTarget);

        const nextX = currentX + moveX;
        const nextY = currentY + moveY;

        setPetPos({ x: nextX, y: nextY });

        // Calculate rotation based on movement vector
        if (Math.abs(moveX) > 0.5) {
          setRotation(moveX > 0 ? 80 : 280);
        } else if (moveY < -0.5) {
          setRotation(180);
        } else {
          setRotation(0);
        }

        setAnimState(isSprinting ? 'run' : 'walk');
      } else {
        // Pet has arrived and is resting/idle
        setAnimState('idle');
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [characterX, characterY, characterDirection, characterIsMoving, userMood]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    sound.playPetHappy();
    onOpenInteraction();
  };

  return (
    <div
      id={`companion-pet-${pet.id}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute cursor-pointer select-none group transition-transform duration-75 ease-out"
      style={{
        left: `${petPos.x}px`,
        top: `${petPos.y}px`,
        transform: 'translate(-50%, -85%)',
        zIndex: Math.floor(petPos.y),
      }}
    >
      {/* Speech / Thought Bubble */}
      {thoughtBubble && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-2xl bg-white/95 backdrop-blur-xs border border-pink-200 shadow-md text-[11px] font-bold text-[#8b3559] animate-bounce z-30 pointer-events-none">
          {thoughtBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-pink-200 rotate-45" />
        </div>
      )}

      {/* Pet Overhead Name Pill */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-pink-200/80 shadow-xs flex items-center gap-1 z-20 pointer-events-none transition-all group-hover:scale-105 group-hover:border-rose-400">
        <span className="text-[10px] font-black text-[#8b3559] font-['Zen_Maru_Gothic']">
          {pet.name}
        </span>
        <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
      </div>

      {/* Click / Approach Prompt when hovered */}
      {isHovered && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 z-30 animate-pulse">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Pet {pet.name}</span>
        </div>
      )}

      {/* 3D Pet Model */}
      <div className="relative transform group-hover:scale-110 transition-transform">
        <CompanionPet3D
          species={pet.species}
          animState={animState}
          expression={expression}
          rotation={rotation}
          size={78}
          accessories={pet.accessories}
          showShadow={true}
        />
      </div>
    </div>
  );
};
