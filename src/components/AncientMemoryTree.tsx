import React, { useState, useEffect, useRef } from 'react';
import { MemoryItem, EmotionType, EMOTIONS } from '../types';
import { sound } from '../audio';
import { Sparkles, Calendar, Heart, Image as ImageIcon, Video, BookOpen, Feather } from 'lucide-react';

interface AncientMemoryTreeProps {
  memories: MemoryItem[];
  characterX: number;
  characterY: number;
  isNight: boolean;
  recentlyAddedMemoryId?: string | null;
  onSelectMemory: (memory: MemoryItem) => void;
  onOpenWrite?: () => void;
}

// Handcrafted natural branch anchor points across the ancient tree limbs
interface BranchSlot {
  x: number;
  y: number;
  branchPath: string;
  leafAngle: number;
  depth: number;
}

const BASE_BRANCH_SLOTS: BranchSlot[] = [
  // 1. First memory: lower-left sweeping bough
  { x: 135, y: 280, branchPath: 'M 215 285 Q 175 292 135 280', leafAngle: -25, depth: 1 },
  // 2. Second memory: mid-right twisting bough
  { x: 345, y: 265, branchPath: 'M 265 275 Q 305 278 345 265', leafAngle: 25, depth: 1 },
  // 3. Third memory: upper-left soaring limb
  { x: 105, y: 195, branchPath: 'M 185 240 Q 140 220 105 195', leafAngle: -40, depth: 2 },
  // 4. Fourth memory: upper-right graceful limb
  { x: 375, y: 185, branchPath: 'M 295 230 Q 340 210 375 185', leafAngle: 35, depth: 2 },
  // 5. Fifth memory: center crown apex
  { x: 240, y: 135, branchPath: 'M 240 220 Q 236 170 240 135', leafAngle: 0, depth: 2 },
  // 6. Sixth memory: lower-right gentle bough
  { x: 325, y: 325, branchPath: 'M 275 315 Q 305 328 325 325', leafAngle: 20, depth: 1 },
  // 7. Seventh memory: lower-left low bough
  { x: 155, y: 335, branchPath: 'M 205 325 Q 175 338 155 335', leafAngle: -15, depth: 1 },
  // 8. Eighth memory: far-left outer canopy
  { x: 65, y: 225, branchPath: 'M 105 195 Q 80 208 65 225', leafAngle: -55, depth: 3 },
  // 9. Ninth memory: far-right outer canopy
  { x: 415, y: 215, branchPath: 'M 375 185 Q 400 198 415 215', leafAngle: 50, depth: 3 },
  // 10. Tenth memory: upper-left high crown
  { x: 165, y: 110, branchPath: 'M 205 160 Q 180 130 165 110', leafAngle: -30, depth: 3 },
  // 11. Eleventh memory: upper-right high crown
  { x: 315, y: 105, branchPath: 'M 275 160 Q 300 128 315 105', leafAngle: 30, depth: 3 },
  // 12. Twelfth memory: high summit bloom
  { x: 240, y: 80, branchPath: 'M 240 135 Q 240 105 240 80', leafAngle: 0, depth: 4 },
  // 13. Mid-canopy left inner
  { x: 175, y: 185, branchPath: 'M 220 225 Q 195 205 175 185', leafAngle: -20, depth: 2 },
  // 14. Mid-canopy right inner
  { x: 305, y: 175, branchPath: 'M 260 225 Q 285 200 305 175', leafAngle: 20, depth: 2 },
  // 15. Crown left spray
  { x: 195, y: 70, branchPath: 'M 220 105 Q 205 85 195 70', leafAngle: -15, depth: 4 },
  // 16. Crown right spray
  { x: 285, y: 70, branchPath: 'M 260 105 Q 275 85 285 70', leafAngle: 15, depth: 4 },
  // 17. Deep left outer bough
  { x: 90, y: 275, branchPath: 'M 135 280 Q 110 280 90 275', leafAngle: -40, depth: 2 },
  // 18. Deep right outer bough
  { x: 390, y: 265, branchPath: 'M 345 265 Q 370 270 390 265', leafAngle: 40, depth: 2 },
  // 19. Mid-left upper spray
  { x: 125, y: 145, branchPath: 'M 165 175 Q 140 155 125 145', leafAngle: -45, depth: 3 },
  // 20. Mid-right upper spray
  { x: 355, y: 140, branchPath: 'M 315 170 Q 340 150 355 140', leafAngle: 45, depth: 3 },
];

export const AncientMemoryTree: React.FC<AncientMemoryTreeProps> = ({
  memories,
  characterX,
  characterY,
  isNight,
  recentlyAddedMemoryId,
  onSelectMemory,
  onOpenWrite,
}) => {
  const [hoveredMemory, setHoveredMemory] = useState<MemoryItem | null>(null);
  const [hoveredSlotPos, setHoveredSlotPos] = useState<{ x: number; y: number } | null>(null);
  const [reactingMemory, setReactingMemory] = useState<string | null>(null);
  const prevCountRef = useRef(memories.length);

  // Center position of tree base relative to parent container
  const TREE_BASE_X = 1250;
  const TREE_BASE_Y = 1050;

  // Proximity check for interaction
  const distanceToTree = Math.hypot(characterX - TREE_BASE_X, characterY - TREE_BASE_Y);
  const isNearby = distanceToTree < 160;

  // Track new memory reactions
  useEffect(() => {
    if (recentlyAddedMemoryId) {
      setReactingMemory(recentlyAddedMemoryId);
      const timer = setTimeout(() => {
        setReactingMemory(null);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (memories.length > prevCountRef.current && memories.length > 0) {
      // Latest added memory
      const latest = memories[memories.length - 1];
      setReactingMemory(latest.id);
      const timer = setTimeout(() => {
        setReactingMemory(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = memories.length;
  }, [recentlyAddedMemoryId, memories]);

  // Tree growth stage (from 0 to 4)
  const memoryCount = memories.length;
  let growthLevel = 0;
  if (memoryCount >= 15) growthLevel = 4;
  else if (memoryCount >= 7) growthLevel = 3;
  else if (memoryCount >= 3) growthLevel = 2;
  else if (memoryCount >= 1) growthLevel = 1;

  // Compute branch slot for each memory
  const memorySlots = memories.map((mem, index) => {
    if (index < BASE_BRANCH_SLOTS.length) {
      return {
        memory: mem,
        slot: BASE_BRANCH_SLOTS[index],
        isNew: mem.id === reactingMemory,
      };
    }
    // Procedural expansion for memories > 20
    const goldenAngle = 137.5 * (Math.PI / 180);
    const angle = index * goldenAngle;
    const radius = 120 + Math.min(80, (index - 20) * 4);
    const sx = Math.round(240 + Math.cos(angle) * radius);
    const sy = Math.round(180 + Math.sin(angle) * (radius * 0.7));
    const slot: BranchSlot = {
      x: Math.max(50, Math.min(430, sx)),
      y: Math.max(50, Math.min(360, sy)),
      branchPath: `M 240 220 Q ${(240 + sx) / 2} ${(220 + sy) / 2} ${sx} ${sy}`,
      leafAngle: (angle * 180) / Math.PI,
      depth: 3,
    };
    return {
      memory: mem,
      slot,
      isNew: mem.id === reactingMemory,
    };
  });

  return (
    <div
      id="ancient-memory-tree"
      className="group absolute select-none pointer-events-auto"
      style={{
        left: `${TREE_BASE_X}px`,
        top: `${TREE_BASE_Y}px`,
        transform: 'translate(-50%, -90%)',
        zIndex: Math.floor(TREE_BASE_Y),
        width: '480px',
        height: '460px',
      }}
    >
      {/* 🌸 Ambient Celestial / Warm Aura */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-1000 ${
          memoryCount === 0 ? 'opacity-20' : 'opacity-60'
        }`}
        style={{
          background: isNight
            ? 'radial-gradient(circle at 50% 50%, rgba(186, 148, 255, 0.35) 0%, rgba(255, 182, 193, 0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(255, 214, 230, 0.45) 0%, rgba(254, 243, 199, 0.25) 50%, transparent 75%)',
          filter: memoryCount > 0 ? 'blur(28px)' : 'blur(16px)',
        }}
      />

      {/* 🌞 Gentle Sunlight Beams filtering through */}
      {!isNight && (
        <div
          className="absolute -top-20 -left-12 w-96 h-96 pointer-events-none opacity-25 mix-blend-screen"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 230, 200, 0.3) 40%, transparent 70%)',
            transform: 'rotate(-15deg)',
          }}
        />
      )}

      {/* 🌾 Cobblestone Soft Ground Shadow */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: isNight
            ? 'radial-gradient(ellipse at center, rgba(15, 10, 25, 0.7) 0%, rgba(25, 15, 45, 0.4) 60%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(74, 52, 43, 0.35) 0%, rgba(130, 95, 80, 0.18) 55%, transparent 75%)',
          filter: 'blur(5px)',
        }}
      />

      {/* 🌳 Majestic 3D SVG Ancient Tree */}
      <svg
        viewBox="0 0 480 460"
        className="w-full h-full overflow-visible drop-shadow-md transition-transform duration-700"
      >
        <defs>
          {/* Wood Bark Gradients */}
          <linearGradient id="ancientTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isNight ? '#3a202a' : '#6b3c2e'} />
            <stop offset="25%" stopColor={isNight ? '#4e2d3c' : '#8c4e3e'} />
            <stop offset="60%" stopColor={isNight ? '#3a202a' : '#65372a'} />
            <stop offset="100%" stopColor={isNight ? '#25121c' : '#4a251b'} />
          </linearGradient>

          <linearGradient id="ancientBranchGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isNight ? '#4e2d3c' : '#7d4536'} />
            <stop offset="100%" stopColor={isNight ? '#3a202a' : '#5a2e22'} />
          </linearGradient>

          {/* Heartwood Chamber Glow */}
          <radialGradient id="heartwoodGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8db" stopOpacity="1" />
            <stop offset="45%" stopColor="#ffb3c6" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#c77dff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7209b7" stopOpacity="0" />
          </radialGradient>

          {/* Pastel Sakura Foliage Gradients for Growth Levels */}
          <radialGradient id="canopyPinkGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={isNight ? '#f3c4fb' : '#ffffff'} />
            <stop offset="30%" stopColor={isNight ? '#d884fb' : '#ffc2d4'} />
            <stop offset="70%" stopColor={isNight ? '#9d4edd' : '#ff85a1'} />
            <stop offset="100%" stopColor={isNight ? '#5a189a' : '#f72585'} />
          </radialGradient>

          <radialGradient id="canopyMintGrad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor={isNight ? '#bbf7d0' : '#ffffff'} />
            <stop offset="40%" stopColor={isNight ? '#86efac' : '#dcfce7'} />
            <stop offset="85%" stopColor={isNight ? '#22c55e' : '#86efac'} />
            <stop offset="100%" stopColor={isNight ? '#15803d' : '#4ade80'} />
          </radialGradient>

          {/* Golden Starlight Filter */}
          <filter id="memoryGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Deep Twisting Ancient Roots Sprawling Across Ground */}
        <g
          stroke={isNight ? '#25121c' : '#4a251b'}
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        >
          <path d="M 190 405 Q 150 422 105 432 Q 80 436 60 440" />
          <path d="M 215 412 Q 185 430 155 438" />
          <path d="M 290 405 Q 330 422 375 432 Q 400 436 420 440" />
          <path d="M 265 412 Q 295 430 325 438" />
          <path d="M 230 415 Q 215 434 200 444" />
          <path d="M 250 415 Q 265 434 280 444" />
        </g>

        {/* Root Highlight Accents */}
        <g
          stroke={isNight ? '#4e2d3c' : '#8c4e3e'}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        >
          <path d="M 195 403 Q 155 419 115 428" />
          <path d="M 285 403 Q 325 419 365 428" />
        </g>

        {/* 2. Massive Ancient Twisting Trunk */}
        <path
          d="M 192 235 
             Q 202 320 185 410 
             L 295 410 
             Q 278 320 288 235 
             Q 265 242 240 242 
             Q 215 242 192 235 Z"
          fill="url(#ancientTrunkGrad)"
        />

        {/* Bark Grain Swirls & Sacred Contours */}
        <g stroke={isNight ? '#1e0c15' : '#3d1e16'} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.65">
          <path d="M 210 260 Q 230 310 215 365 Q 205 390 200 408" />
          <path d="M 270 260 Q 250 310 265 365 Q 275 390 280 408" />
          <path d="M 230 250 Q 248 290 240 330" />
          <path d="M 250 250 Q 232 290 240 330" />
        </g>

        {/* 3. Primordial Bare Ancient Boughs (Present from the very start, dormant & beautiful) */}
        <g
          stroke="url(#ancientBranchGrad)"
          strokeLinecap="round"
          fill="none"
        >
          {/* Main Left Bough */}
          <path d="M 205 250 Q 155 230 115 190 Q 90 165 75 140" strokeWidth="18" />
          <path d="M 155 230 Q 130 255 105 275" strokeWidth="12" />
          <path d="M 115 190 Q 75 205 55 220" strokeWidth="9" />

          {/* Main Right Bough */}
          <path d="M 275 250 Q 325 230 365 190 Q 390 165 405 140" strokeWidth="18" />
          <path d="M 325 230 Q 350 255 375 275" strokeWidth="12" />
          <path d="M 365 190 Q 405 205 425 220" strokeWidth="9" />

          {/* Central Crown Fork */}
          <path d="M 240 240 Q 235 180 240 130 Q 238 90 240 60" strokeWidth="16" />
          <path d="M 238 180 Q 200 150 175 120" strokeWidth="11" />
          <path d="M 242 180 Q 280 150 305 120" strokeWidth="11" />
        </g>

        {/* Dormant Blossom Buds on bare branches (Peaceful anticipation when empty) */}
        {memoryCount === 0 && (
          <g fill={isNight ? '#8b5cf6' : '#fbcfe8'} opacity="0.6">
            <circle cx="75" cy="140" r="3.5" />
            <circle cx="105" cy="275" r="3" />
            <circle cx="55" cy="220" r="3" />
            <circle cx="405" cy="140" r="3.5" />
            <circle cx="375" cy="275" r="3" />
            <circle cx="425" cy="220" r="3" />
            <circle cx="240" cy="60" r="4" />
            <circle cx="175" cy="120" r="3.5" />
            <circle cx="305" cy="120" r="3.5" />
          </g>
        )}

        {/* 4. 💖 HEARTWOOD CHAMBER (Awakens when memories exist) */}
        <ellipse
          cx="240"
          cy="325"
          rx="14"
          ry="22"
          fill={isNight ? '#1a0d16' : '#2d140e'}
        />

        {/* Heartwood living light when memoryCount > 0 */}
        {memoryCount > 0 && (
          <g>
            <circle
              cx="240"
              cy="325"
              r="22"
              fill="url(#heartwoodGlow)"
              className="animate-pulse"
            />
            <circle
              cx="240"
              cy="325"
              r="8"
              fill="#ffffff"
              filter="drop-shadow(0 0 8px #ffb3c6)"
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
          </g>
        )}

        {/* Reaction Sparkle Pulse when a new memory is born */}
        {reactingMemory && (
          <g className="animate-in zoom-in-50 duration-700">
            <circle
              cx="240"
              cy="325"
              r="40"
              fill="none"
              stroke="#ffd166"
              strokeWidth="3"
              strokeDasharray="4,4"
              className="animate-spin"
              style={{ animationDuration: '8s' }}
            />
            <circle
              cx="240"
              cy="325"
              r="55"
              fill="radial-gradient(circle, rgba(255,214,102,0.6) 0%, transparent 70%)"
              className="animate-ping"
            />
          </g>
        )}

        {/* 5. 🌸 CANOPY FOLIAGE CLOUDS (Grows with user's memory count) */}
        {growthLevel >= 2 && (
          <g opacity={growthLevel === 2 ? '0.45' : growthLevel === 3 ? '0.75' : '0.92'} className="transition-opacity duration-1000">
            {/* Upper Left Foliage Cloud */}
            <circle cx="110" cy="170" r={growthLevel >= 3 ? 54 : 38} fill="url(#canopyPinkGrad)" />
            {/* Upper Right Foliage Cloud */}
            <circle cx="370" cy="165" r={growthLevel >= 3 ? 54 : 38} fill="url(#canopyPinkGrad)" />
            {/* Center Crown Cloud */}
            <circle cx="240" cy="115" r={growthLevel >= 3 ? 65 : 44} fill="url(#canopyPinkGrad)" />
            {/* Top Apex Cloud */}
            <circle cx="240" cy="70" r={growthLevel >= 3 ? 48 : 32} fill="url(#canopyPinkGrad)" />

            {growthLevel >= 3 && (
              <>
                <circle cx="170" cy="130" r="42" fill="url(#canopyMintGrad)" opacity="0.8" />
                <circle cx="310" cy="125" r="42" fill="url(#canopyMintGrad)" opacity="0.8" />
                <circle cx="65" cy="210" r="36" fill="url(#canopyPinkGrad)" />
                <circle cx="415" cy="200" r="36" fill="url(#canopyPinkGrad)" />
                <circle cx="240" cy="160" r="46" fill="#ffffff" opacity="0.3" />
              </>
            )}

            {growthLevel >= 4 && (
              <>
                <circle cx="130" cy="90" r="46" fill="url(#canopyPinkGrad)" />
                <circle cx="350" cy="85" r="46" fill="url(#canopyPinkGrad)" />
                <circle cx="240" cy="40" r="40" fill="url(#canopyPinkGrad)" />
              </>
            )}
          </g>
        )}

        {/* 6. 🌿 DYNAMIC MEMORY BRANCHES & FLOWERS (Organic, connected to user's saved memories only) */}
        {memorySlots.map(({ memory, slot, isNew }, idx) => {
          const emotionInfo = EMOTIONS[memory.emotion] || EMOTIONS.happy;
          const isHovered = hoveredMemory?.id === memory.id;
          const hasPhotos = memory.media && memory.media.some((m) => m.type === 'photo');
          const hasVideos = memory.media && memory.media.some((m) => m.type === 'video');

          return (
            <g
              key={memory.id}
              className={`cursor-pointer transition-all duration-300 ${
                isNew ? 'animate-in zoom-in-0 duration-700' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                sound.playTreeInteract();
                onSelectMemory(memory);
              }}
              onMouseEnter={() => {
                sound.playGentlePop();
                setHoveredMemory(memory);
                setHoveredSlotPos({ x: slot.x, y: slot.y });
              }}
              onMouseLeave={() => {
                setHoveredMemory(null);
                setHoveredSlotPos(null);
              }}
            >
              {/* Dynamic Connecting Branch to this Memory */}
              <path
                d={slot.branchPath}
                stroke={isNight ? '#5a2e3f' : '#8c4e3e'}
                strokeWidth={isHovered ? '6' : '4.5'}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-200"
              />

              {/* Gentle leaf cluster at branch tip */}
              <g transform={`translate(${slot.x}, ${slot.y}) rotate(${slot.leafAngle})`}>
                <path
                  d="M 0 0 Q -10 -14 0 -22 Q 10 -14 0 0"
                  fill={isNight ? '#15803d' : '#86efac'}
                  opacity="0.85"
                />
                <path
                  d="M 0 0 Q -16 -6 -18 -16 Q -6 -12 0 0"
                  fill={isNight ? '#166534' : '#4ade80'}
                  opacity="0.75"
                />
              </g>

              {/* 🌟 Radiant Memory Blossom / Glowing Element */}
              <g transform={`translate(${slot.x}, ${slot.y})`} filter="url(#memoryGlowFilter)">
                {/* Outer Breathing Aura */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 24 : 17}
                  fill={emotionInfo.themeColor}
                  opacity={isNight ? 0.45 : 0.28}
                  className="transition-all duration-300"
                />

                {/* Starlight Halo Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 18 : 13}
                  stroke={emotionInfo.secondaryColor}
                  strokeWidth="2"
                  strokeDasharray={hasPhotos || hasVideos ? '3,2' : undefined}
                  fill="none"
                  className={isHovered ? 'animate-spin' : undefined}
                  style={{ animationDuration: '6s' }}
                />

                {/* Emotion-Themed Blossom Design */}
                {memory.emotion === 'happy' && (
                  // 🌸 Warm Golden-Peach Sakura Flower
                  <g>
                    {[0, 72, 144, 216, 288].map((rot, i) => (
                      <path
                        key={i}
                        d="M 0 0 Q -6 -12 0 -15 Q 6 -12 0 0"
                        fill="#ff77a9"
                        transform={`rotate(${rot})`}
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="4.5" fill="#ffd166" />
                  </g>
                )}

                {memory.emotion === 'sad' && (
                  // 🌧️ Soothing Twilight-Blue Dewdrop Bell Flower
                  <g>
                    <path
                      d="M 0 -14 C -8 -6, -8 6, 0 10 C 8 6, 8 -6, 0 -14 Z"
                      fill="#5c7cfa"
                      opacity="0.9"
                    />
                    <circle cx="0" cy="2" r="3.5" fill="#dbe4ff" />
                  </g>
                )}

                {memory.emotion === 'peaceful' && (
                  // 🌱 Serene Mint-Jade Lotus Blossom
                  <g>
                    {[0, 60, 120, 180, 240, 300].map((rot, i) => (
                      <ellipse
                        key={i}
                        cx="0"
                        cy="-8"
                        rx="4"
                        ry="8"
                        fill="#38b000"
                        transform={`rotate(${rot})`}
                        opacity="0.9"
                      />
                    ))}
                    <circle cx="0" cy="0" r="4.5" fill="#bbf7d0" />
                  </g>
                )}

                {memory.emotion === 'love' && (
                  // 💗 Radiant Rosy Double-Blossom
                  <g>
                    {[0, 72, 144, 216, 288].map((rot, i) => (
                      <path
                        key={i}
                        d="M 0 0 Q -7 -13 0 -16 Q 7 -13 0 0"
                        fill="#f72585"
                        transform={`rotate(${rot})`}
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="5" fill="#ff758f" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                  </g>
                )}

                {memory.emotion === 'lonely' && (
                  // 🌙 Starlight Violet Lilac Flower
                  <g>
                    {[0, 60, 120, 180, 240, 300].map((rot, i) => (
                      <polygon
                        key={i}
                        points="0,-14 3,-5 0,0 -3,-5"
                        fill="#7950f2"
                        transform={`rotate(${rot})`}
                        opacity="0.9"
                      />
                    ))}
                    <circle cx="0" cy="0" r="3.5" fill="#e5dbff" />
                  </g>
                )}

                {memory.emotion === 'angry' && (
                  // 🔥 Warm Ember Flame Flower
                  <g>
                    {[0, 90, 180, 270].map((rot, i) => (
                      <path
                        key={i}
                        d="M 0 0 Q -6 -13 0 -17 Q 6 -13 0 0"
                        fill="#e03131"
                        transform={`rotate(${rot})`}
                        opacity="0.9"
                      />
                    ))}
                    <circle cx="0" cy="0" r="4" fill="#ffd43b" />
                  </g>
                )}

                {memory.emotion === 'hope' && (
                  // ☀️ Brilliant Golden Dawn Starburst
                  <g>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((rot, i) => (
                      <polygon
                        key={i}
                        points="0,-15 2,-4 0,0 -2,-4"
                        fill="#f59f00"
                        transform={`rotate(${rot})`}
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
                  </g>
                )}

                {/* Media Badge (Photo / Video gem indicator) */}
                {(hasPhotos || hasVideos) && (
                  <g transform="translate(9, -9)">
                    <circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke={emotionInfo.themeColor} strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="2.5" fill={emotionInfo.themeColor} />
                  </g>
                )}

                {/* Floating subtle pulse spark */}
                <circle
                  cx="0"
                  cy="0"
                  r="2"
                  fill="#ffffff"
                  className="animate-ping"
                  style={{ animationDuration: '4s', animationDelay: `${(idx % 5) * 0.7}s` }}
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* 🧭 Hovered Memory Discovery Capsule */}
      {hoveredMemory && hoveredSlotPos && (
        <div
          className="absolute z-50 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-90"
          style={{
            left: `${hoveredSlotPos.x}px`,
            top: `${hoveredSlotPos.y - 30}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-pink-200 text-stone-800 text-xs">
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="flex items-center gap-1 font-bold text-pink-900 truncate">
                <span>{EMOTIONS[hoveredMemory.emotion]?.emoji || '🌸'}</span>
                <span className="truncate">{hoveredMemory.title}</span>
              </span>
              <span className="text-[10px] text-stone-400 whitespace-nowrap">{hoveredMemory.date}</span>
            </div>

            {/* Photo Thumbnail Preview if present */}
            {hoveredMemory.media && hoveredMemory.media.some((m) => m.type === 'photo') && (
              <div className="w-full h-20 mb-2 rounded-xl overflow-hidden bg-pink-50 border border-pink-100">
                <img
                  src={hoveredMemory.media.find((m) => m.type === 'photo')?.url}
                  alt={hoveredMemory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <p className="text-[11px] text-stone-600 line-clamp-2 italic font-['Zen_Maru_Gothic']">
              "{hoveredMemory.text}"
            </p>

            <div className="mt-2 pt-2 border-t border-pink-100 flex items-center justify-between text-[10px] text-pink-600 font-bold">
              <span>Click to view full memory</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      )}

      {/* 🏷️ Ancient Memory Tree Header Badge / Discovery Status */}
      <div
        className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 font-bold transition-all duration-300 pointer-events-none flex items-center gap-2 shadow-xl ${
          isNearby
            ? 'scale-105 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white border border-white/60 -translate-y-2'
            : 'bg-white/95 text-stone-800 border border-pink-200'
        }`}
      >
        <span className="text-base">{memoryCount === 0 ? '🌱' : '🌸'}</span>
        <span className="text-xs font-black tracking-wider uppercase font-['Zen_Maru_Gothic']">
          ANCIENT MEMORY TREE
        </span>
        {memoryCount === 0 ? (
          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-black">
            Empty • Waiting
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-pink-100/40 text-white text-[10px] font-black">
            {memoryCount} {memoryCount === 1 ? 'Memory' : 'Memories'}
          </span>
        )}
      </div>

      {/* 💌 Proximity Interaction Prompt when Mori approaches */}
      {isNearby && (
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            if (memoryCount === 0 && onOpenWrite) {
              sound.playClick();
              onOpenWrite();
            }
          }}
        >
          {memoryCount === 0 ? (
            <button
              id="write-first-memory-tree-btn"
              onClick={() => {
                sound.playClick();
                onOpenWrite?.();
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-black shadow-xl border border-white/50 animate-bounce flex items-center gap-2 cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Write First Memory to Awaken the Tree</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Press E</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-stone-700 text-xs font-black border border-pink-200 shadow-xl flex items-center gap-2 animate-pulse">
              <span>✨</span>
              <span>Click any blossom to open its diary entry</span>
              <span className="text-[10px] text-pink-600 font-normal">(Press E for nearest)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
