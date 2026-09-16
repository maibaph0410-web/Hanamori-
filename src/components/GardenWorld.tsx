import React, { useRef, useEffect, useState } from 'react';
import { MemoryItem, CharacterState, Direction, AppSettings, EmotionType, EMOTIONS, CharacterCustomization, MoodType } from '../types';
import { MoriCharacter } from './MoriCharacter';
import { EmotionalTree } from './EmotionalTree';
import { SproutIcon } from './SproutIcon';
import { Mailbox3D } from './Mailbox3D';
import { CompanionPetState } from '../petTypes';
import { PetInGarden } from './PetInGarden';
import { AncientMemoryTree } from './AncientMemoryTree';
import { sound } from '../audio';

interface GardenWorldProps {
  memories: MemoryItem[];
  character: CharacterState;
  characterCustomization?: CharacterCustomization;
  newlyPlantedId: string | null;
  settings: AppSettings;
  isPlantingMode?: boolean;
  selectedSproutEmotion?: EmotionType | null;
  unlockedLettersCount?: number;
  totalLettersCount?: number;
  companionPet?: CompanionPetState | null;
  userMood?: MoodType;
  characterReaction?: { emoji: string; text: string } | null;
  onOpenPetInteraction?: () => void;
  onPlantAtLocation?: (x: number, y: number) => void;
  onSelectTree: (memory: MemoryItem) => void;
  onSelectPlantedTree?: (memory: MemoryItem) => void;
  onMoriPositionChange?: (x: number, y: number) => void;
  onOpenFutureLetters?: () => void;
  onOpenWrite?: () => void;
  onToggleSit?: () => void;
  onWalkToAncientTree?: () => void;
  onWalkToPet?: () => void;
  onWalkToGround?: (x: number, y: number) => void;
}

// World dimension constants
export const WORLD_WIDTH = 2500;
export const WORLD_HEIGHT = 2100;
export const GRAND_TREE_POS = { x: 1250, y: 1050 };
export const MAILBOX_POS = { x: 1400, y: 980 };

export const GardenWorld: React.FC<GardenWorldProps> = ({
  memories,
  character,
  characterCustomization,
  newlyPlantedId,
  settings,
  isPlantingMode = false,
  selectedSproutEmotion = null,
  unlockedLettersCount = 0,
  totalLettersCount = 0,
  companionPet,
  userMood = 'calm',
  characterReaction,
  onOpenPetInteraction,
  onPlantAtLocation,
  onSelectTree,
  onSelectPlantedTree,
  onOpenFutureLetters,
  onOpenWrite,
  onToggleSit,
  onWalkToAncientTree,
  onWalkToPet,
  onWalkToGround,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

  // Holographic planting cursor in world coordinates
  const [plantCursor, setPlantCursor] = useState<{ x: number; y: number } | null>(null);
  const [collisionAlert, setCollisionAlert] = useState<{
    x: number;
    y: number;
    message: string;
  } | null>(null);

  // Collision radii
  const TREE_COLLISION_RADIUS = 85;
  const ANCIENT_TREE_COLLISION_RADIUS = 135;
  const MAILBOX_COLLISION_RADIUS = 75;

  // Real-time collision check at cursor
  const collidingTree = plantCursor
    ? memories.find(
        (m) =>
          Math.hypot(m.position.x - plantCursor.x, m.position.y - plantCursor.y) <
          TREE_COLLISION_RADIUS
      )
    : null;

  const isCollidingAncientTree = plantCursor
    ? Math.hypot(GRAND_TREE_POS.x - plantCursor.x, GRAND_TREE_POS.y - plantCursor.y) <
      ANCIENT_TREE_COLLISION_RADIUS
    : false;

  const isCollidingMailbox = plantCursor
    ? Math.hypot(MAILBOX_POS.x - plantCursor.x, MAILBOX_POS.y - plantCursor.y) <
      MAILBOX_COLLISION_RADIUS
    : false;

  const isOccupiedLocation = Boolean(
    collidingTree || isCollidingAncientTree || isCollidingMailbox
  );

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute camera offset to center Mori on screen, clamped to world bounds
  const cameraX = Math.min(
    0,
    Math.max(viewportSize.width - WORLD_WIDTH, viewportSize.width / 2 - character.x)
  );
  const cameraY = Math.min(
    0,
    Math.max(viewportSize.height - WORLD_HEIGHT, viewportSize.height / 2 - character.y)
  );

  // Handle pointer movement to track planting target on ground
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlantingMode) return;
    const worldX = Math.max(100, Math.min(WORLD_WIDTH - 100, Math.round(e.clientX - cameraX)));
    const worldY = Math.max(120, Math.min(WORLD_HEIGHT - 100, Math.round(e.clientY - cameraY)));
    setPlantCursor({ x: worldX, y: worldY });
  };

  // Handle click on canvas (planting if planting mode, otherwise walk to location)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const worldX = Math.max(100, Math.min(WORLD_WIDTH - 100, Math.round(e.clientX - cameraX)));
    const worldY = Math.max(120, Math.min(WORLD_HEIGHT - 100, Math.round(e.clientY - cameraY)));

    if (!isPlantingMode) {
      onWalkToGround?.(worldX, worldY);
      return;
    }

    if (!onPlantAtLocation) return;

    // Collision check: do not place overlapping trees or build on occupied structures
    if (isOccupiedLocation) {
      sound.playBump();
      setCollisionAlert({
        x: worldX,
        y: worldY,
        message: collidingTree
          ? `This spot already has a tree ("${collidingTree.title}")! Please choose another location.`
          : isCollidingAncientTree
          ? 'Central Ancient Tree area! Please choose another location.'
          : 'Hanamori Mailbox area! Please choose another location.',
      });
      setTimeout(() => setCollisionAlert(null), 3200);
      return;
    }

    onPlantAtLocation(worldX, worldY);
  };

  // Selected emotion info for planting mode preview
  const currentPlantEmotion = selectedSproutEmotion ? EMOTIONS[selectedSproutEmotion] : null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onClick={handleCanvasClick}
      className={`relative w-full h-full overflow-hidden select-none ${
        isPlantingMode ? 'cursor-crosshair' : ''
      }`}
      style={{
        backgroundColor: settings.isNight ? '#1a102f' : '#ffdce5',
      }}
    >
      {/* Sky & Weather Gradient Filter */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 z-20"
        style={{
          background: settings.isNight
            ? 'linear-gradient(180deg, rgba(20, 10, 45, 0.55) 0%, rgba(35, 15, 60, 0.4) 100%)'
            : 'linear-gradient(180deg, rgba(255, 230, 240, 0.25) 0%, rgba(255, 210, 225, 0.1) 100%)',
        }}
      />

      {/* Floating Clouds Background */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-40">
        {[
          { top: '10%', anim: 'animate-[bounce_18s_infinite]' },
          { top: '40%', anim: 'animate-[bounce_24s_infinite]' },
          { top: '70%', anim: 'animate-[bounce_20s_infinite]' },
        ].map((c, i) => (
          <div
            key={i}
            className={`absolute w-72 h-24 rounded-full bg-white/60 blur-md ${c.anim}`}
            style={{ top: c.top, left: `${i * 35}%` }}
          />
        ))}
      </div>

      {/* Dynamic Night Sky Stars & Moon */}
      {settings.isNight && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Glowing Crescent Moon */}
          <div className="absolute top-16 right-20 w-16 h-16 rounded-full bg-amber-100/90 shadow-[0_0_40px_#fde047] flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-[#1e1338] transform translate-x-3 -translate-y-2" />
          </div>

          {/* Twinkling Fireflies and Constellations */}
          {[
            { x: '15%', y: '20%', d: '0.4s' },
            { x: '35%', y: '12%', d: '1.2s' },
            { x: '55%', y: '25%', d: '0.8s' },
            { x: '75%', y: '15%', d: '1.9s' },
            { x: '88%', y: '30%', d: '2.5s' },
            { x: '25%', y: '65%', d: '1.1s' },
            { x: '65%', y: '75%', d: '0.6s' },
            { x: '80%', y: '85%', d: '1.7s' },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_#fef08a] animate-ping"
              style={{
                top: s.y,
                left: s.x,
                animationDuration: '3.2s',
                animationDelay: s.d,
              }}
            />
          ))}
        </div>
      )}

      {/* Moving Garden World Plane */}
      <div
        id="hanamori-garden-canvas"
        className="absolute transition-transform duration-75 ease-out origin-top-left"
        style={{
          width: `${WORLD_WIDTH}px`,
          height: `${WORLD_HEIGHT}px`,
          transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
        }}
      >
        {/* Soft Pastel Grass Ground with Cozy Grid Tiles */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            backgroundColor: settings.isNight ? '#241b3b' : '#cdebc4',
            backgroundImage: settings.isNight
              ? 'radial-gradient(#382b57 15%, transparent 16%), radial-gradient(#2d2247 15%, transparent 16%)'
              : 'radial-gradient(#bfe4b5 15%, transparent 16%), radial-gradient(#dbf2d4 15%, transparent 16%)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* Soft Cobblestone Paths connecting Hanamori Tree */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
        >
          {/* Main Central Plaza around Grand Tree */}
          <ellipse
            cx={GRAND_TREE_POS.x}
            cy={GRAND_TREE_POS.y + 60}
            rx="180"
            ry="110"
            fill={settings.isNight ? '#3b2f56' : '#faeedb'}
            stroke={settings.isNight ? '#4e3f70' : '#ebd5b5'}
            strokeWidth="8"
          />

          {/* Stepping Path North to Cottages */}
          <path
            d={`M ${GRAND_TREE_POS.x} ${GRAND_TREE_POS.y - 50} Q ${GRAND_TREE_POS.x - 150} 650 620 480`}
            stroke={settings.isNight ? '#3b2f56' : '#faeedb'}
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stepping Path North-East */}
          <path
            d={`M ${GRAND_TREE_POS.x + 80} ${GRAND_TREE_POS.y - 30} Q ${GRAND_TREE_POS.x + 300} 650 1950 520`}
            stroke={settings.isNight ? '#3b2f56' : '#faeedb'}
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stepping Path South-East to Pond */}
          <path
            d={`M ${GRAND_TREE_POS.x + 120} ${GRAND_TREE_POS.y + 100} Q 1550 1250 1780 1480`}
            stroke={settings.isNight ? '#3b2f56' : '#faeedb'}
            strokeWidth="48"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stepping Path West */}
          <path
            d={`M ${GRAND_TREE_POS.x - 150} ${GRAND_TREE_POS.y + 50} Q 800 1100 450 1150`}
            stroke={settings.isNight ? '#3b2f56' : '#faeedb'}
            strokeWidth="44"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stepping Path South */}
          <path
            d={`M ${GRAND_TREE_POS.x} ${GRAND_TREE_POS.y + 170} Q ${GRAND_TREE_POS.x - 50} 1500 1200 1850`}
            stroke={settings.isNight ? '#3b2f56' : '#faeedb'}
            strokeWidth="44"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* 🌳 THE ANCIENT MEMORY TREE (Centerpiece and Heart of Hanamori) */}
        <AncientMemoryTree
          memories={memories}
          characterX={character.x}
          characterY={character.y}
          isNight={settings.isNight}
          recentlyAddedMemoryId={newlyPlantedId}
          onSelectMemory={onSelectTree}
          onOpenWrite={onOpenWrite}
        />

        {/* ✉️ Mailbox to Future Landmark */}
        {(() => {
          const mailboxDist = Math.hypot(character.x - MAILBOX_POS.x, character.y - MAILBOX_POS.y);
          const isMailboxNearby = mailboxDist < 90;
          return (
            <div
              className="absolute"
              style={{
                left: `${MAILBOX_POS.x}px`,
                top: `${MAILBOX_POS.y}px`,
                transform: 'translate(-50%, -85%)',
                zIndex: Math.floor(MAILBOX_POS.y),
              }}
            >
              <Mailbox3D
                isNearby={isMailboxNearby}
                unlockedCount={unlockedLettersCount}
                totalLetters={totalLettersCount}
                onClick={() => onOpenFutureLetters?.()}
              />
            </div>
          );
        })()}

        {/* All Emotional Trees (Planted memories by user only) */}
        {memories.map((mem) => {
          // Distance from Mori to this tree
          const dist = Math.hypot(character.x - mem.position.x, character.y - mem.position.y);
          const isNearby = dist < 90;

          return (
            <div
              key={mem.id}
              className="absolute"
              style={{
                left: `${mem.position.x}px`,
                top: `${mem.position.y}px`,
                transform: 'translate(-50%, -85%)',
                zIndex: Math.floor(mem.position.y),
              }}
            >
              <EmotionalTree
                id={mem.id}
                emotion={mem.emotion}
                title={mem.title}
                isNearby={isNearby}
                isNewlyPlanted={mem.id === newlyPlantedId}
                growthStage={mem.growthStage || 'mature'}
                hasMedia={Boolean(mem.media && mem.media.length > 0)}
                mediaCount={mem.media?.length || 0}
                hasNote={Boolean(mem.note)}
                onClick={() => {
                  if (onSelectPlantedTree) {
                    onSelectPlantedTree(mem);
                  } else {
                    onSelectTree(mem);
                  }
                }}
              />
            </div>
          );
        })}

        {/* Player Character */}
        <div
          id="user-player-avatar"
          className="absolute cursor-pointer transition-transform active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSit?.();
          }}
          style={{
            left: `${character.x}px`,
            top: `${character.y}px`,
            transform: 'translate(-50%, -85%)',
            zIndex: Math.floor(character.y),
          }}
          title={`${characterCustomization?.name || 'Character'} (${character.isSitting ? 'Click to stand up' : 'Click to sit & relax'})`}
        >
          {/* Floating Reaction Bubble */}
          {characterReaction && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-pink-200 shadow-xl text-[11px] font-black text-stone-800 whitespace-nowrap animate-in zoom-in-75 fade-in duration-200 z-50 flex items-center gap-1.5 pointer-events-none">
              <span className="text-sm">{characterReaction.emoji}</span>
              <span>{characterReaction.text}</span>
            </div>
          )}

          {/* Name Tag */}
          {characterCustomization?.name && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200/80 shadow-sm text-[10px] font-bold text-stone-700 whitespace-nowrap pointer-events-none flex items-center gap-1 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span>{characterCustomization.name}</span>
            </div>
          )}

          <MoriCharacter
            direction={character.direction}
            isMoving={character.isMoving}
            stepPhase={character.stepPhase}
            customization={characterCustomization}
            isSitting={character.isSitting}
          />
        </div>

        {/* 🐾 Active 3D Companion Pet Following User */}
        {companionPet && (
          <PetInGarden
            pet={companionPet}
            characterX={character.x}
            characterY={character.y}
            characterDirection={character.direction}
            characterIsMoving={character.isMoving}
            userMood={userMood}
            onOpenInteraction={() => onOpenPetInteraction?.()}
            isNight={settings.isNight}
          />
        )}

        {/* Holographic Glowing Circle Following Cursor in Planting Mode */}
        {isPlantingMode && plantCursor && currentPlantEmotion && (
          <div
            className="absolute pointer-events-none transition-transform duration-75"
            style={{
              left: `${plantCursor.x}px`,
              top: `${plantCursor.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.floor(plantCursor.y) + 50,
            }}
          >
            {/* Soft Glowing Circle on the ground */}
            <div
              className={`w-28 h-18 rounded-full border-2 border-dashed flex items-center justify-center relative transition-all duration-150 ${
                isOccupiedLocation
                  ? 'border-red-500 bg-red-500/25 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse'
                  : 'animate-pulse'
              }`}
              style={{
                borderColor: isOccupiedLocation ? '#ef4444' : currentPlantEmotion.themeColor,
                backgroundColor: isOccupiedLocation
                  ? 'rgba(239, 68, 68, 0.25)'
                  : `${currentPlantEmotion.themeColor}22`,
                boxShadow: isOccupiedLocation
                  ? '0 0 30px rgba(239, 68, 68, 0.7)'
                  : `0 0 25px ${currentPlantEmotion.themeColor}66`,
              }}
            >
              {/* Floating Sprout preview */}
              <div
                className={`absolute -top-8 transition-transform ${
                  isOccupiedLocation ? 'scale-90 opacity-60' : 'animate-bounce'
                }`}
              >
                <SproutIcon emotion={currentPlantEmotion.type} size={40} />
              </div>

              {/* Holographic center dot */}
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: isOccupiedLocation
                    ? '#ef4444'
                    : currentPlantEmotion.themeColor,
                }}
              />
            </div>

            {/* "Plant Here" Badge / Collision Alert Badge */}
            <div
              className={`absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-white text-[11px] font-black shadow-lg border flex items-center gap-1.5 transition-all ${
                isOccupiedLocation
                  ? 'bg-red-600/95 border-red-300 shadow-red-500/50'
                  : 'bg-stone-900/90 border-white/30'
              }`}
            >
              {isOccupiedLocation ? (
                <>
                  <span>⚠️</span>
                  <span>Spot occupied • Choose another location</span>
                </>
              ) : (
                <>
                  <span>🌱</span>
                  <span>Click to plant seedling here</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating Collision Error Toast on Ground */}
        {collisionAlert && (
          <div
            className="absolute pointer-events-none z-50 animate-in zoom-in-75 fade-in duration-200"
            style={{
              left: `${collisionAlert.x}px`,
              top: `${collisionAlert.y - 65}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="px-4 py-2 rounded-2xl bg-red-600/95 text-white text-xs font-black shadow-2xl border-2 border-white/90 flex items-center gap-2 max-w-xs text-center backdrop-blur-md">
              <span className="text-base">🚫</span>
              <span>{collisionAlert.message}</span>
            </div>
          </div>
        )}

        {/* Floating Blossom Particles in Day / Fireflies at Night */}
        {settings.effects && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            {[
              { x: 300, y: 400, s: 6, dur: '5s' },
              { x: 700, y: 800, s: 8, dur: '6.2s' },
              { x: 1200, y: 650, s: 5, dur: '4.5s' },
              { x: 1600, y: 950, s: 7, dur: '5.8s' },
              { x: 1100, y: 1300, s: 6, dur: '6.5s' },
              { x: 1800, y: 1600, s: 5, dur: '5.1s' },
              { x: 850, y: 1400, s: 8, dur: '7s' },
              { x: 1400, y: 450, s: 6, dur: '4.8s' },
            ].map((pt, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none animate-pulse"
                style={{
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                  width: `${pt.s}px`,
                  height: `${pt.s}px`,
                  backgroundColor: settings.isNight ? '#fde047' : '#ffb3cb',
                  boxShadow: settings.isNight
                    ? '0 0 10px #fef08a'
                    : '0 0 6px rgba(255, 179, 203, 0.8)',
                  animationDuration: pt.dur,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Controls Floating Bar (hidden during planting mode to keep HUD clean) */}
      {!isPlantingMode && (
        <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md shadow-pink-200/30 text-[11px] font-extrabold text-stone-700 select-none">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-mono text-[9px]">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-mono text-[9px]">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-mono text-[9px]">S</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-mono text-[9px]">D</kbd>
            <span className="text-stone-400 font-normal">/</span>
            <span className="text-stone-500 font-bold">Arrow Keys</span>
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-pink-600 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-pink-100 border border-pink-300 font-mono text-[9px] text-pink-700">E</kbd>
            <span>Interact</span>
          </span>
          <span className="text-stone-300">•</span>
          <button
            type="button"
            onClick={onToggleSit}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition cursor-pointer ${
              character.isSitting
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-stone-100 text-stone-700 hover:bg-pink-100 hover:text-pink-700'
            }`}
          >
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 font-mono text-[9px]">R</kbd>
            <span>{character.isSitting ? '🧍 Stand Up' : '🌸 Sit & Relax'}</span>
          </button>
          <span className="text-stone-300">•</span>
          <button
            type="button"
            onClick={onWalkToAncientTree}
            className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-pink-100 hover:text-pink-700 transition cursor-pointer text-stone-700"
          >
            🌳 Walk to Ancient Tree
          </button>
          {companionPet && (
            <>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={onWalkToPet}
                className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-pink-100 hover:text-pink-700 transition cursor-pointer text-stone-700"
              >
                🐾 Walk to Pet
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

