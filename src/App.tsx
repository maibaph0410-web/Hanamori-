import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MemoryItem,
  EmotionType,
  EMOTIONS,
  CharacterState,
  AppSettings,
  UnplantedSeed,
  CharacterCustomization,
  MoodType,
  DailyMoodRecord,
  MemoryMediaItem,
  FutureLetter,
  FutureLetterReply,
} from './types';
import { sound } from './audio';
import { DEFAULT_CHARACTER_CUSTOMIZATION, MOOD_OPTIONS } from './characterData';
import { StartScreen } from './components/StartScreen';
import { GardenHeader } from './components/GardenHeader';
import { GardenWorld, WORLD_WIDTH, WORLD_HEIGHT, GRAND_TREE_POS, MAILBOX_POS } from './components/GardenWorld';
import { MemoryModal } from './components/MemoryModal';
import { WriteMemoryModal } from './components/WriteMemoryModal';
import { MemoryBookModal } from './components/MemoryBookModal';
import { MoodGardenModal } from './components/MoodGardenModal';
import { HanamoriTreeModal } from './components/HanamoriTreeModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileControls } from './components/MobileControls';
import { SeedInventoryBar } from './components/SeedInventoryBar';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { CharacterCreationModal } from './components/CharacterCreationModal';
import { DailyMoodCheckInModal } from './components/DailyMoodCheckInModal';
import { CompanionModal } from './components/CompanionModal';
import { MusicModal } from './components/MusicModal';
import { FutureLetterSanctuaryModal } from './components/FutureLetterSanctuaryModal';
import { CompanionPetState } from './petTypes';
import { PetFirstTimeSetupModal } from './components/PetFirstTimeSetupModal';
import { PetInteractionModal } from './components/PetInteractionModal';
import { TreeOptionsMenu } from './components/TreeOptionsMenu';
import { EditMemoryModal } from './components/EditMemoryModal';

const STORAGE_KEY = 'hanamori_memories_v1';
const SEEDS_KEY = 'hanamori_unplanted_seeds_v1';
const SETTINGS_KEY = 'hanamori_settings_v1';
const TUTORIAL_KEY = 'hanamori_tutorial_dismissed_v1';
const CHARACTER_KEY = 'hanamori_character_customization_v1';
const CURRENT_MOOD_KEY = 'hanamori_current_mood_v1';
const MOOD_HISTORY_KEY = 'hanamori_mood_history_v1';
const LAST_CHECKIN_DATE_KEY = 'hanamori_last_checkin_date_v1';
const FUTURE_LETTERS_KEY = 'hanamori_future_letters_v1';
const COMPANION_PET_KEY = 'hanamori_companion_pet_v1';

// Helper to ensure zero sample, demo, or fake letters ever appear
const isLegacySampleLetter = (item: unknown): boolean => {
  if (!item || typeof item !== 'object') return true;
  const l = item as Record<string, unknown>;
  const id = String(l.id || '').toLowerCase();
  const title = String(l.title || '').toLowerCase();
  if (id.includes('sample') || id.startsWith('letter-sample')) return true;
  if (title.includes('whisper from the day i arrived') || title.includes('six months into the future')) return true;
  return false;
};

// Initial letters: strictly empty by default. Only returns letters created by the user.
const getInitialFutureLetters = (): FutureLetter[] => {
  try {
    const saved = localStorage.getItem(FUTURE_LETTERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const userCreatedOnly = parsed.filter((l) => !isLegacySampleLetter(l));
        if (userCreatedOnly.length !== parsed.length) {
          localStorage.setItem(FUTURE_LETTERS_KEY, JSON.stringify(userCreatedOnly));
        }
        return userCreatedOnly;
      }
    }
  } catch {}

  return [];
};

// Cleanse helper to ensure zero fake or sample memories ever pollute the user's garden
const isLegacyMockMemory = (item: unknown): boolean => {
  if (!item || typeof item !== 'object') return true;
  const mem = item as Record<string, unknown>;
  const title = String(mem.title || '').trim().toLowerCase();
  const id = String(mem.id || '').toLowerCase();

  // Legacy demo titles from initial prototypes
  if (
    title === 'a warm afternoon' ||
    title === 'angry thoughts' ||
    title === 'the little surprise' ||
    title.includes('warm afternoon') ||
    title.includes('angry thoughts') ||
    title.includes('little surprise') ||
    title.includes('stargazing thoughts')
  ) {
    return true;
  }

  // Legacy test/demo identifiers
  if (
    id.startsWith('starter') ||
    id.startsWith('sample') ||
    id.startsWith('demo') ||
    id.startsWith('mock') ||
    id.startsWith('default') ||
    id === '1' ||
    id === '2' ||
    id === '3'
  ) {
    return true;
  }

  return false;
};

export default function App() {
  // App view state
  const [hasEnteredGarden, setHasEnteredGarden] = useState(false);

  // Character Customization
  const [characterCustomization, setCharacterCustomization] = useState<CharacterCustomization | null>(() => {
    try {
      const saved = localStorage.getItem(CHARACTER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });

  // Current Mood & Mood Atmosphere
  const [currentMood, setCurrentMood] = useState<MoodType>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_MOOD_KEY);
      if (saved) {
        return saved as MoodType;
      }
    } catch {}
    return 'calm';
  });

  // Mood History records
  const [moodHistory, setMoodHistory] = useState<DailyMoodRecord[]>(() => {
    try {
      const saved = localStorage.getItem(MOOD_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Modals for Character & Daily Mood
  const [isCharacterCreationOpen, setIsCharacterCreationOpen] = useState(false);
  const [isEditCharacterOnly, setIsEditCharacterOnly] = useState(false);
  const [isDailyMoodCheckInOpen, setIsDailyMoodCheckInOpen] = useState(false);

  // 🐾 Companion Pet State (personally chosen by user during first-time onboarding)
  const [companionPet, setCompanionPet] = useState<CompanionPetState | null>(() => {
    try {
      const saved = localStorage.getItem(COMPANION_PET_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });
  const [isPetSetupOpen, setIsPetSetupOpen] = useState(false);
  const [isPetInteractionOpen, setIsPetInteractionOpen] = useState(false);

  // Memories list loaded from localStorage (strictly 0 demo/starter trees)
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realMemories = parsed.filter((m) => !isLegacyMockMemory(m));
          if (realMemories.length !== parsed.length) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(realMemories));
            } catch {}
          }
          return realMemories;
        }
      }
    } catch {}
    return [];
  });

  // Unplanted memory seeds inventory (empty at start until user writes a memory)
  const [unplantedSeeds, setUnplantedSeeds] = useState<UnplantedSeed[]>(() => {
    try {
      const saved = localStorage.getItem(SEEDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realSeeds = parsed.filter((s) => !isLegacyMockMemory(s));
          if (realSeeds.length !== parsed.length) {
            try {
              localStorage.setItem(SEEDS_KEY, JSON.stringify(realSeeds));
            } catch {}
          }
          return realSeeds;
        }
      }
    } catch {}
    return [];
  });

  // Tutorial dismissed flag
  const [tutorialDismissed, setTutorialDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TUTORIAL_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Planting Mode State
  const [isPlantingMode, setIsPlantingMode] = useState(false);
  const [selectedSproutEmotion, setSelectedSproutEmotion] = useState<EmotionType | null>(null);

  // Settings state (default music: true so users can immediately enjoy solo piano)
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      music: true,
      sfx: true,
      effects: true,
      isNight: false,
    };
  });

  // Player Character State
  const [character, setCharacter] = useState<CharacterState>({
    x: 1250,
    y: 1180,
    direction: 'down',
    isMoving: false,
    stepPhase: 0,
    isSitting: false,
  });

  // Character reaction bubble & auto-walk target
  const [characterReaction, setCharacterReaction] = useState<{ emoji: string; text: string } | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);
  const walkTargetRef = useRef<{ x: number; y: number } | null>(null);

  // Newly planted tree highlight
  const [newlyPlantedId, setNewlyPlantedId] = useState<string | null>(null);

  // Modals state
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [selectedTreeForOptions, setSelectedTreeForOptions] = useState<MemoryItem | null>(null);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [activeMemoryForCompanion, setActiveMemoryForCompanion] = useState<MemoryItem | null>(null);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [writeInitialEmotion, setWriteInitialEmotion] = useState<EmotionType>('happy');
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isHanamoriTreeOpen, setIsHanamoriTreeOpen] = useState(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFutureLettersOpen, setIsFutureLettersOpen] = useState(false);

  // Future Letters to Future Me State
  const [futureLetters, setFutureLetters] = useState<FutureLetter[]>(getInitialFutureLetters);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Periodically refresh current time (every 30s) to evaluate unlock status
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Persist future letters whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(FUTURE_LETTERS_KEY, JSON.stringify(futureLetters));
    } catch {}
  }, [futureLetters]);

  // Mobile virtual joystick vector (-1 to 1)
  const joystickVectorRef = useRef({ vx: 0, vy: 0 });

  // Keyboard active keys map
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // Footstep audio timing ref
  const lastStepTimeRef = useRef<number>(0);

  // Save character customization whenever updated
  useEffect(() => {
    if (characterCustomization) {
      try {
        localStorage.setItem(CHARACTER_KEY, JSON.stringify(characterCustomization));
      } catch {}
    }
  }, [characterCustomization]);

  // Save current mood whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_MOOD_KEY, currentMood);
    } catch {}
  }, [currentMood]);

  // Save mood history whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  // Save memories to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch {}
  }, [memories]);

  // Save unplanted seeds to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(SEEDS_KEY, JSON.stringify(unplantedSeeds));
    } catch {}
  }, [unplantedSeeds]);

  // Save settings to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Handle start button clicked on StartScreen
  const handleStartScreenEnter = () => {
    if (!characterCustomization) {
      // First-time visitor: Launch Character Creation Wizard
      setIsEditCharacterOnly(false);
      setIsCharacterCreationOpen(true);
    } else if (!companionPet) {
      // Step 2 of first-time onboarding: Choose & Name Companion Pet before entering
      setIsPetSetupOpen(true);
    } else {
      // Returning user: Check if a new day has arrived for daily mood check-in
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastCheckin = localStorage.getItem(LAST_CHECKIN_DATE_KEY);

      // Start music with currently saved mood
      sound.setMusicEnabled(settings.music);
      sound.crossFadeToMood(currentMood);
      setHasEnteredGarden(true);

      if (lastCheckin !== todayStr) {
        // Prompt gentle daily mood check-in for the new day
        window.setTimeout(() => {
          setIsDailyMoodCheckInOpen(true);
        }, 600);
      }
    }
  };

  // When user finishes the character creation onboarding wizard
  const handleFinishCharacterCreation = (
    newCustomization: CharacterCustomization,
    mood: MoodType,
    customMoodNote?: string
  ) => {
    setCharacterCustomization(newCustomization);
    setCurrentMood(mood);

    // Record today's mood
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const displayDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
    const moodObj = MOOD_OPTIONS.find((m) => m.type === mood);

    const newRecord: DailyMoodRecord = {
      date: todayStr,
      displayDate,
      mood,
      customNote: customMoodNote,
      musicAtmosphere: moodObj?.pianoDescription || 'Gentle solo piano',
      pianoAtmosphere: moodObj?.pianoDescription || 'Gentle solo piano',
      timestamp: Date.now(),
    };

    setMoodHistory((prev) => [newRecord, ...prev]);
    try {
      localStorage.setItem(LAST_CHECKIN_DATE_KEY, todayStr);
    } catch {}

    // Close character wizard
    setIsCharacterCreationOpen(false);

    // STEP 2 OF ONBOARDING: Introduce Companion Pet before entering the garden!
    if (!companionPet) {
      setIsPetSetupOpen(true);
    } else {
      setHasEnteredGarden(true);
      sound.setMusicEnabled(settings.music);
      sound.crossFadeToMood(mood);
    }
  };

  // When user finishes choosing and naming their companion pet
  const handleFinishPetSetup = (newPet: CompanionPetState) => {
    setCompanionPet(newPet);
    try {
      localStorage.setItem(COMPANION_PET_KEY, JSON.stringify(newPet));
    } catch {}
    setIsPetSetupOpen(false);
    setHasEnteredGarden(true);

    // Start mood-adaptive piano music
    sound.setMusicEnabled(settings.music);
    sound.crossFadeToMood(currentMood);
  };

  // When pet stats / accessories / affection update
  const handleUpdatePet = (updatedPet: CompanionPetState) => {
    setCompanionPet(updatedPet);
    try {
      localStorage.setItem(COMPANION_PET_KEY, JSON.stringify(updatedPet));
    } catch {}
  };

  // When user saves a new mood from the daily mood check-in modal
  const handleSaveDailyMood = (mood: MoodType, customNote?: string) => {
    setCurrentMood(mood);

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const displayDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
    const moodObj = MOOD_OPTIONS.find((m) => m.type === mood);

    const newRecord: DailyMoodRecord = {
      date: todayStr,
      displayDate,
      mood,
      customNote,
      musicAtmosphere: moodObj?.pianoDescription || 'Solo acoustic piano',
      pianoAtmosphere: moodObj?.pianoDescription || 'Solo acoustic piano',
      timestamp: Date.now(),
    };

    setMoodHistory((prev) => [newRecord, ...prev]);
    try {
      localStorage.setItem(LAST_CHECKIN_DATE_KEY, todayStr);
    } catch {}

    // Seamlessly transition the solo piano sequence without page reload!
    sound.crossFadeToMood(mood);
  };

  // Character reaction trigger helper
  const triggerCharacterReaction = useCallback((emoji: string, text: string, durationMs = 3200) => {
    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current);
    }
    setCharacterReaction({ emoji, text });
    reactionTimeoutRef.current = window.setTimeout(() => {
      setCharacterReaction(null);
    }, durationMs);
  }, []);

  // Sit & relax toggle
  const handleToggleSit = useCallback(() => {
    walkTargetRef.current = null;
    setCharacter((prev) => {
      const nextSit = !prev.isSitting;
      if (nextSit) {
        sound.playBell();
        triggerCharacterReaction('🌸', 'Sitting peacefully in the garden...');
      } else {
        sound.playClick();
        triggerCharacterReaction('✨', 'Standing up refreshed!');
      }
      return {
        ...prev,
        isSitting: nextSit,
        isMoving: false,
      };
    });
  }, [triggerCharacterReaction]);

  // Auto-walk navigation targets
  const handleWalkToGround = useCallback((x: number, y: number) => {
    walkTargetRef.current = { x, y };
    setCharacter((prev) => ({ ...prev, isSitting: false }));
  }, []);

  const handleWalkToAncientTree = useCallback(() => {
    walkTargetRef.current = { x: GRAND_TREE_POS.x, y: GRAND_TREE_POS.y + 70 };
    setCharacter((prev) => ({ ...prev, isSitting: false }));
    triggerCharacterReaction('🌳', 'Walking to Ancient Memory Tree...');
    sound.playClick();
  }, [triggerCharacterReaction]);

  const handleWalkToPet = useCallback(() => {
    if (!companionPet) return;
    const targetX = character.x > 1250 ? character.x - 50 : character.x + 50;
    walkTargetRef.current = { x: targetX, y: character.y };
    setCharacter((prev) => ({ ...prev, isSitting: false }));
    triggerCharacterReaction('❤️', `Greeting ${companionPet.name}...`);
    sound.playSparkle();
  }, [companionPet, character.x, character.y, triggerCharacterReaction]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      keysPressedRef.current[e.key.toLowerCase()] = true;

      // 'E' or Space for interaction
      if (e.key.toLowerCase() === 'e' || e.key === ' ') {
        e.preventDefault();
        triggerProximityInteraction();
      }

      // 'R' for Sit / Relax toggle
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleToggleSit();
      }

      // Escape to cancel planting mode or close modals
      if (e.key === 'Escape') {
        if (isPlantingMode) {
          setIsPlantingMode(false);
          setSelectedSproutEmotion(null);
          return;
        }
        setSelectedMemory(null);
        setIsWriteOpen(false);
        setIsBookOpen(false);
        setIsMoodOpen(false);
        setIsHanamoriTreeOpen(false);
        setIsCompanionOpen(false);
        setIsMusicOpen(false);
        setIsSettingsOpen(false);
        setIsDailyMoodCheckInOpen(false);
        setIsCharacterCreationOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlantingMode, handleToggleSit]);

  // Main 60FPS Game Movement Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const keys = keysPressedRef.current;
      const joy = joystickVectorRef.current;

      let dx = 0;
      let dy = 0;

      // Keyboard movement (WASD + Arrow Keys)
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      // Mobile joystick movement
      if (joy.vx !== 0 || joy.vy !== 0) {
        dx += joy.vx;
        dy += joy.vy;
      }

      // If user uses manual input, cancel auto-walk navigation
      if (dx !== 0 || dy !== 0) {
        walkTargetRef.current = null;
      } else if (walkTargetRef.current) {
        // Auto-navigate toward target
        const tDx = walkTargetRef.current.x - character.x;
        const tDy = walkTargetRef.current.y - character.y;
        const dist = Math.hypot(tDx, tDy);
        if (dist > 12) {
          dx = tDx / dist;
          dy = tDy / dist;
        } else {
          walkTargetRef.current = null;
        }
      }

      const length = Math.hypot(dx, dy);
      const isMoving = length > 0.05;

      if (isMoving) {
        const speed = 4.2; // movement speed
        const normX = dx / Math.max(1, length);
        const normY = dy / Math.max(1, length);

        // Determine orientation
        let direction = character.direction;
        if (Math.abs(normX) > Math.abs(normY)) {
          direction = normX > 0 ? 'right' : 'left';
        } else {
          direction = normY > 0 ? 'down' : 'up';
        }

        // Calculate potential new position with world bounds
        const margin = 80;
        let newX = Math.max(margin, Math.min(WORLD_WIDTH - margin, character.x + normX * speed));
        let newY = Math.max(margin, Math.min(WORLD_HEIGHT - margin, character.y + normY * speed));

        // Play gentle footsteps sound periodically while moving
        if (settings.sfx && timestamp - lastStepTimeRef.current > 330) {
          sound.playStep();
          lastStepTimeRef.current = timestamp;
        }

        setCharacter((prev) => ({
          ...prev,
          x: newX,
          y: newY,
          direction,
          isMoving: true,
          isSitting: false,
          stepPhase: (prev.stepPhase + 0.12) % 1,
        }));
      } else if (character.isMoving) {
        setCharacter((prev) => ({
          ...prev,
          isMoving: false,
        }));
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [character.direction, character.isMoving, character.x, character.y, settings.sfx]);

  // Center camera on character
  const handleCenterCharacter = () => {
    setCharacter((prev) => ({ ...prev }));
  };

  // Find nearest interactable memory tree or mailbox
  const getNearbyInteractable = useCallback(() => {
    // Check Mailbox of the Future landmark first
    const mailboxDist = Math.hypot(character.x - MAILBOX_POS.x, character.y - MAILBOX_POS.y);
    if (mailboxDist <= 90) {
      return { type: 'mailbox' as const };
    }

    // Check Ancient Memory Tree at center plaza
    const ancientTreeDist = Math.hypot(character.x - GRAND_TREE_POS.x, character.y - (GRAND_TREE_POS.y + 40));
    if (ancientTreeDist <= 150) {
      if (memories.length === 0) {
        return { type: 'ancient_tree_empty' as const };
      } else {
        return { type: 'ancient_tree_memories' as const, latestMemory: memories[memories.length - 1] };
      }
    }

    let closestMem: MemoryItem | null = null;
    let minDist = 95; // Proximity threshold
    memories.forEach((mem) => {
      const d = Math.hypot(character.x - mem.position.x, character.y - mem.position.y);
      if (d < minDist) {
        minDist = d;
      }
    });

    for (const mem of memories) {
      const d = Math.hypot(character.x - mem.position.x, character.y - mem.position.y);
      if (d <= minDist) {
        closestMem = mem;
        break;
      }
    }

    if (closestMem) {
      return { type: 'memory_tree' as const, memory: closestMem };
    }

    return null;
  }, [character, memories]);

  // Trigger interaction with closest object
  const triggerProximityInteraction = useCallback(() => {
    const nearby = getNearbyInteractable();
    if (nearby) {
      if (nearby.type === 'memory_tree') {
        sound.playTreeInteract();
        setSelectedTreeForOptions(nearby.memory);
      } else if (nearby.type === 'mailbox') {
        sound.playMailboxDrop();
        setIsFutureLettersOpen(true);
      } else if (nearby.type === 'ancient_tree_empty') {
        sound.playClick();
        setWriteInitialEmotion('happy');
        setIsWriteOpen(true);
      } else if (nearby.type === 'ancient_tree_memories') {
        sound.playTreeInteract();
        setSelectedMemory(nearby.latestMemory);
      }
    }
  }, [getNearbyInteractable]);

  // Handle saving and sealing a new Future Letter
  const handleSaveNewFutureLetter = (
    letterData: Omit<FutureLetter, 'id' | 'createdAt' | 'isSealed' | 'isOpened'>
  ) => {
    const newLetter: FutureLetter = {
      ...letterData,
      id: `letter-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      isSealed: true,
      isOpened: false,
      replies: [],
    };

    setFutureLetters((prev) => [newLetter, ...prev]);
    sound.playChime(659.25, 0.4);
  };

  // Handle adding a reply to past self
  const handleAddLetterReply = (letterId: string, replyText: string) => {
    const now = new Date();
    const newReply: FutureLetterReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: replyText,
      createdAt: Date.now(),
      dateString: now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setFutureLetters((prev) =>
      prev.map((l) =>
        l.id === letterId
          ? {
              ...l,
              replies: [...(l.replies || []), newReply],
            }
          : l
      )
    );
  };

  // Handle planting an unlocked future letter as a memory tree in Hanamori
  const handlePlantLetterAsMemoryTree = (letter: FutureLetter) => {
    let emotion: EmotionType = 'hope';
    if (letter.mood === 'happy' || letter.mood === 'excited') emotion = 'happy';
    else if (letter.mood === 'loved') emotion = 'love';
    else if (letter.mood === 'calm' || letter.mood === 'relaxed') emotion = 'peaceful';
    else if (letter.mood === 'hopeful') emotion = 'hope';
    else if (letter.mood === 'lonely') emotion = 'lonely';
    else if (letter.mood === 'angry') emotion = 'angry';
    else if (letter.mood === 'sad' || letter.mood === 'tired') emotion = 'sad';

    const memoryTitle = `Future Letter: ${letter.title}`;
    const memoryNote = `Sealed across time on ${letter.writtenDate} • Unlocked on ${letter.unlockDateString}`;

    // Plant into memories list
    handlePlantMemory(
      memoryTitle,
      letter.message,
      emotion,
      letter.photos,
      memoryNote,
      letter.writtenDate
    );

    // Mark as planted
    setFutureLetters((prev) =>
      prev.map((l) => (l.id === letter.id ? { ...l, plantedMemoryId: `planted-${letter.id}` } : l))
    );
  };

  // Test helper to unlock letter immediately in this sandbox session
  const handleTestUnlockLetter = (letterId: string) => {
    setFutureLetters((prev) =>
      prev.map((l) =>
        l.id === letterId
          ? {
              ...l,
              isOpened: true,
              unlockDate: Date.now() - 1000,
              openedAt: Date.now(),
            }
          : l
      )
    );
  };

  // Write Memory -> Save Memory -> Generates a Sprout in the bottom inventory bar
  const handlePlantMemory = (
    title: string,
    text: string,
    emotion: EmotionType,
    media?: MemoryMediaItem[],
    note?: string,
    date?: string
  ) => {
    const today = new Date();
    const formattedDate =
      date ||
      today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    const newSeedId = `seed-${Date.now()}`;

    const newSeed: UnplantedSeed = {
      id: newSeedId,
      title: title.trim() || `${EMOTIONS[emotion].label} Memory`,
      text: text.trim(),
      emotion,
      date: formattedDate,
      createdAt: Date.now(),
      media,
      note,
    };

    // Save into unplanted seeds inventory
    setUnplantedSeeds((prev) => {
      const next = [newSeed, ...prev];
      try {
        localStorage.setItem(SEEDS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Automatically select the sprout so the user enters planting mode right away
    setSelectedSproutEmotion(emotion);
    setIsPlantingMode(true);

    // Audio cue
    sound.playGentlePop();
    sound.playChime(659.25, 0.4);
  };

  // User selects a sprout from the inventory
  const handleSelectSprout = (emotion: EmotionType) => {
    setSelectedSproutEmotion(emotion);
    setIsPlantingMode(true);
  };

  // User clicks empty sprout card in inventory
  const handleOpenWriteForEmotion = (emotion: EmotionType) => {
    setWriteInitialEmotion(emotion);
    setIsWriteOpen(true);
  };

  // Plant sprout at chosen world coordinates
  const handlePlantAtLocation = (targetX: number, targetY: number) => {
    if (!selectedSproutEmotion) return;

    // Find the seed to plant
    const seedIndex = unplantedSeeds.findIndex((s) => s.emotion === selectedSproutEmotion);
    const seed = seedIndex >= 0 ? unplantedSeeds[seedIndex] : null;

    const newTreeId = `mem-${Date.now()}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const newMemory: MemoryItem = {
      id: newTreeId,
      title: seed?.title || `${EMOTIONS[selectedSproutEmotion].label} Memory`,
      text: seed?.text || 'A quiet thought rooted in the soil of Hanamori.',
      emotion: selectedSproutEmotion,
      treeType: selectedSproutEmotion,
      date: seed?.date || formattedDate,
      position: { x: targetX, y: targetY },
      createdAt: Date.now(),
      growthStage: 'sprout',
      media: seed?.media,
      note: seed?.note,
    };

    // Remove seed from unplanted inventory and persist
    let remainingOfEmotion = 0;
    setUnplantedSeeds((prev) => {
      const next = prev.filter((_, idx) => idx !== seedIndex);
      try {
        localStorage.setItem(SEEDS_KEY, JSON.stringify(next));
      } catch {}
      remainingOfEmotion = next.filter((s) => s.emotion === selectedSproutEmotion).length;
      return next;
    });

    // Add tree to memories and persist
    setMemories((prev) => {
      const next = [...prev, newMemory];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    setNewlyPlantedId(newTreeId);

    // Play planting sound
    sound.playPlantMemory();

    // Turn character towards planted tree
    const pAngle = Math.atan2(targetY - character.y, targetX - character.x);
    let pDir = character.direction;
    if (Math.abs(Math.cos(pAngle)) > Math.abs(Math.sin(pAngle))) {
      pDir = Math.cos(pAngle) > 0 ? 'right' : 'left';
    } else {
      pDir = Math.sin(pAngle) > 0 ? 'down' : 'up';
    }
    setCharacter((prev) => ({ ...prev, direction: pDir }));

    // If no more seeds of that emotion remain, exit planting mode
    if (remainingOfEmotion <= 0) {
      setIsPlantingMode(false);
      setSelectedSproutEmotion(null);
    }

    // Animate growth to mature tree
    setTimeout(() => {
      setMemories((prev) =>
        prev.map((m) => (m.id === newTreeId ? { ...m, growthStage: 'mature' } : m))
      );
    }, 1200);

    setTimeout(() => {
      setNewlyPlantedId(null);
    }, 3500);
  };

  // Cancel planting mode
  const handleCancelPlanting = () => {
    setIsPlantingMode(false);
    setSelectedSproutEmotion(null);
  };

  // Day/Night toggle
  const handleToggleDayNight = () => {
    const nextNight = !settings.isNight;
    sound.playDayNightToggle(nextNight);
    setSettings((prev) => ({ ...prev, isNight: nextNight }));
  };

  // Select tree from book and walk character nearby
  const handleSelectMemoryFromBook = (mem: MemoryItem) => {
    setIsBookOpen(false);
    setSelectedMemory(mem);
    setCharacter((prev) => ({
      ...prev,
      x: mem.position.x,
      y: mem.position.y + 45,
      direction: 'up',
    }));
  };

  // Select a planted tree in the garden to open options menu
  const handleSelectPlantedTree = (tree: MemoryItem) => {
    sound.playTreeInteract();
    setSelectedTreeForOptions(tree);
  };

  // From Tree Options Menu: View Memory
  const handleViewMemoryFromOptions = (tree: MemoryItem) => {
    setSelectedTreeForOptions(null);
    setSelectedMemory(tree);
  };

  // From Tree Options Menu: Edit Memory
  const handleEditMemoryFromOptions = (tree: MemoryItem) => {
    setSelectedTreeForOptions(null);
    setEditingMemory(tree);
  };

  // From Tree Options Menu or Memory Modal: Remove Tree & Return Seedling to Hotbar
  const handleConfirmRemoveTree = (treeToRemove: MemoryItem) => {
    // 1. Remove from memories and persist
    setMemories((prev) => {
      const next = prev.filter((m) => m.id !== treeToRemove.id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // 2. Return seedling back to unplantedSeeds so user can replant it anywhere
    const returnedSeed: UnplantedSeed = {
      id: `seed-returned-${Date.now()}-${treeToRemove.id}`,
      title: treeToRemove.title,
      text: treeToRemove.text,
      emotion: treeToRemove.emotion,
      date: treeToRemove.date,
      createdAt: Date.now(),
      media: treeToRemove.media,
      note: treeToRemove.note,
    };

    setUnplantedSeeds((prev) => {
      const next = [returnedSeed, ...prev];
      try {
        localStorage.setItem(SEEDS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // 3. Audio & feedback
    sound.playGentlePop();
    sound.playChime(523.25, 0.35);

    // 4. Close menus
    setSelectedTreeForOptions(null);
    if (selectedMemory?.id === treeToRemove.id) {
      setSelectedMemory(null);
    }

    setToastNotification(`🌱 Tree "${treeToRemove.title}" removed! Its seedling has returned to your selection bar.`);
    setTimeout(() => {
      setToastNotification((cur) => (cur?.includes(treeToRemove.title) ? null : cur));
    }, 4000);
  };

  // Save updated memory from EditMemoryModal
  const handleSaveEditedMemory = (updated: MemoryItem) => {
    setMemories((prev) => {
      const next = prev.map((m) => (m.id === updated.id ? updated : m));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setEditingMemory(null);
    setSelectedTreeForOptions(null);
    if (selectedMemory?.id === updated.id) {
      setSelectedMemory(updated);
    }
    sound.playChime(659.25, 0.3);
    setToastNotification(`✨ Memory "${updated.title}" updated!`);
    setTimeout(() => {
      setToastNotification((cur) => (cur?.includes(updated.title) ? null : cur));
    }, 3000);
  };

  // Delete memory directly
  const handleDeleteMemory = (id: string) => {
    const target = memories.find((m) => m.id === id);
    if (target) {
      handleConfirmRemoveTree(target);
    } else {
      setMemories((prev) => prev.filter((m) => m.id !== id));
      setSelectedMemory(null);
    }
  };

  // Update memory keepsakes, notes, or companion response
  const handleUpdateMemory = (updated: MemoryItem) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMemory(updated);
  };

  // Open companion dialog with a specific memory context
  const handleOpenCompanionWithMemory = (mem: MemoryItem) => {
    setActiveMemoryForCompanion(mem);
    setIsCompanionOpen(true);
  };

  // Dismiss tutorial
  const handleDismissTutorial = () => {
    setTutorialDismissed(true);
    try {
      localStorage.setItem(TUTORIAL_KEY, 'true');
    } catch {}
  };

  // Determine current tutorial step
  let currentTutorialStep: TutorialStep = 'completed';
  if (!tutorialDismissed) {
    if (memories.length === 0 && unplantedSeeds.length === 0) {
      currentTutorialStep = 'empty_start';
    } else if (unplantedSeeds.length > 0 && !isPlantingMode) {
      currentTutorialStep = 'has_seeds';
    } else if (isPlantingMode) {
      currentTutorialStep = 'planting';
    } else {
      currentTutorialStep = 'completed';
    }
  }

  const nearbyItem = getNearbyInteractable();
  const isNearInteractable = Boolean(nearbyItem);
  const interactLabel =
    nearbyItem?.type === 'mailbox'
      ? 'OPEN MAILBOX'
      : nearbyItem?.type === 'ancient_tree_empty'
      ? 'WRITE FIRST MEMORY'
      : nearbyItem?.type === 'ancient_tree_memories'
      ? 'ANCIENT TREE'
      : isNearInteractable
      ? 'VIEW TREE'
      : 'INTERACT';

  const unlockedLettersCount = futureLetters.filter(
    (l) => currentTime >= l.unlockDate || l.isOpened
  ).length;

  const userName = characterCustomization?.name || '';
  const currentCustomization = characterCustomization || DEFAULT_CHARACTER_CUSTOMIZATION;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#ffdce5] font-['Nunito']">
      {/* 1. START SCREEN */}
      {!hasEnteredGarden && (
        <StartScreen
          userName={userName}
          customization={characterCustomization || undefined}
          onEnter={handleStartScreenEnter}
          onEditCharacter={() => {
            setIsEditCharacterOnly(true);
            setIsCharacterCreationOpen(true);
          }}
        />
      )}

      {/* 2. CHARACTER CREATION & ONBOARDING MODAL */}
      <CharacterCreationModal
        isOpen={isCharacterCreationOpen}
        initialCustomization={currentCustomization}
        isEditOnly={isEditCharacterOnly}
        onFinish={handleFinishCharacterCreation}
        onCloseEditOnly={() => setIsCharacterCreationOpen(false)}
      />

      {/* 3. DAILY MOOD CHECK-IN MODAL */}
      <DailyMoodCheckInModal
        isOpen={isDailyMoodCheckInOpen}
        userName={userName}
        currentMood={currentMood}
        moodHistory={moodHistory}
        onSaveMood={handleSaveDailyMood}
        onClose={() => setIsDailyMoodCheckInOpen(false)}
      />

      {/* 4. MAIN COZY GARDEN (Always initialized, guarantees zero black screen) */}
      <GardenWorld
        memories={memories}
        character={character}
        characterCustomization={currentCustomization}
        newlyPlantedId={newlyPlantedId}
        settings={settings}
        isPlantingMode={isPlantingMode}
        selectedSproutEmotion={selectedSproutEmotion}
        unlockedLettersCount={unlockedLettersCount}
        totalLettersCount={futureLetters.length}
        companionPet={companionPet}
        userMood={currentMood}
        characterReaction={characterReaction}
        onOpenPetInteraction={() => setIsPetInteractionOpen(true)}
        onPlantAtLocation={handlePlantAtLocation}
        onSelectPlantedTree={handleSelectPlantedTree}
        onSelectTree={(mem) => {
          sound.playTreeInteract();
          setSelectedMemory(mem);
        }}
        onOpenFutureLetters={() => setIsFutureLettersOpen(true)}
        onOpenWrite={() => {
          setWriteInitialEmotion('happy');
          setIsWriteOpen(true);
        }}
        onToggleSit={handleToggleSit}
        onWalkToAncientTree={handleWalkToAncientTree}
        onWalkToPet={handleWalkToPet}
        onWalkToGround={handleWalkToGround}
      />

      {/* 5. TOP NAVIGATION & HEADER (Section 41) */}
      {hasEnteredGarden && (
        <GardenHeader
          userName={userName}
          memoryCount={memories.length}
          currentMood={currentMood}
          isNight={settings.isNight}
          unlockedLettersCount={unlockedLettersCount}
          companionPet={companionPet}
          onOpenPetInteraction={() => setIsPetInteractionOpen(true)}
          onToggleDayNight={handleToggleDayNight}
          onCenterGarden={handleCenterCharacter}
          onOpenWrite={() => {
            setWriteInitialEmotion('happy');
            setIsWriteOpen(true);
          }}
          onOpenBook={() => setIsBookOpen(true)}
          onOpenCompanion={() => setIsCompanionOpen(true)}
          onOpenMusic={() => setIsMusicOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDailyMoodCheckIn={() => setIsDailyMoodCheckInOpen(true)}
          onOpenFutureLetters={() => setIsFutureLettersOpen(true)}
        />
      )}

      {/* 6. FIRST-TIME TUTORIAL OVERLAY */}
      {hasEnteredGarden && (
        <TutorialOverlay
          step={currentTutorialStep}
          onOpenWrite={() => {
            setWriteInitialEmotion('happy');
            setIsWriteOpen(true);
          }}
          onDismiss={handleDismissTutorial}
        />
      )}

      {/* 7. COZY SEED INVENTORY BAR */}
      {hasEnteredGarden && (
        <SeedInventoryBar
          unplantedSeeds={unplantedSeeds}
          selectedSproutEmotion={selectedSproutEmotion}
          isPlantingMode={isPlantingMode}
          onSelectSprout={handleSelectSprout}
          onCancelPlanting={handleCancelPlanting}
          onOpenWrite={() => {
            setWriteInitialEmotion('happy');
            setIsWriteOpen(true);
          }}
        />
      )}

      {/* 8. MOBILE VIRTUAL JOYSTICK & TOUCH INTERACT */}
      {hasEnteredGarden && !isPlantingMode && (
        <div className="sm:hidden">
          <MobileControls
            onMoveVector={(vx, vy) => {
              joystickVectorRef.current = { vx, vy };
            }}
            onInteract={triggerProximityInteraction}
            onOpenWrite={() => {
              setWriteInitialEmotion('happy');
              setIsWriteOpen(true);
            }}
            isNearInteractable={isNearInteractable}
            interactLabel={interactLabel}
          />
        </div>
      )}

      {/* 9. MODALS & DIALOGS */}
      {/* View Memory Dialog */}
      <MemoryModal
        memory={selectedMemory}
        userName={userName}
        onClose={() => setSelectedMemory(null)}
        onDelete={handleDeleteMemory}
        onRequestRemove={(mem) => {
          setSelectedMemory(null);
          setSelectedTreeForOptions(mem);
        }}
        onEdit={(mem) => {
          setSelectedMemory(null);
          setEditingMemory(mem);
        }}
        onUpdateMemory={handleUpdateMemory}
        onOpenCompanionChat={handleOpenCompanionWithMemory}
      />

      {/* Write Memory Dialog */}
      <WriteMemoryModal
        isOpen={isWriteOpen}
        initialEmotion={writeInitialEmotion}
        onClose={() => setIsWriteOpen(false)}
        onPlant={handlePlantMemory}
      />

      {/* Memory Book Dialog */}
      <MemoryBookModal
        isOpen={isBookOpen}
        memories={memories}
        userName={userName}
        onClose={() => setIsBookOpen(false)}
        onSelectMemory={handleSelectMemoryFromBook}
        onOpenWrite={() => {
          setWriteInitialEmotion('happy');
          setIsWriteOpen(true);
        }}
      />

      {/* Mood Garden Breakdown Dialog */}
      <MoodGardenModal
        isOpen={isMoodOpen}
        memories={memories}
        userName={userName}
        onClose={() => setIsMoodOpen(false)}
        onOpenWrite={() => {
          setWriteInitialEmotion('happy');
          setIsWriteOpen(true);
        }}
      />

      {/* Central Hanamori Grand Tree Reflection Dialog */}
      <HanamoriTreeModal
        isOpen={isHanamoriTreeOpen}
        memories={memories}
        userName={userName}
        onClose={() => setIsHanamoriTreeOpen(false)}
        onOpenWrite={() => {
          setWriteInitialEmotion('happy');
          setIsWriteOpen(true);
        }}
      />

      {/* Companion Hana Dialog */}
      <CompanionModal
        isOpen={isCompanionOpen}
        userName={userName}
        currentMood={currentMood}
        memories={memories}
        activeMemoryFocus={activeMemoryForCompanion}
        onClose={() => {
          setIsCompanionOpen(false);
          setActiveMemoryForCompanion(null);
        }}
        onOpenWrite={() => {
          setIsCompanionOpen(false);
          setActiveMemoryForCompanion(null);
          setWriteInitialEmotion('happy');
          setIsWriteOpen(true);
        }}
      />

      {/* Instrumental Solo Piano Music Dialog */}
      <MusicModal
        isOpen={isMusicOpen}
        currentMood={currentMood}
        musicEnabled={settings.music}
        onClose={() => setIsMusicOpen(false)}
        onSelectMood={(mood) => {
          setCurrentMood(mood);
          sound.crossFadeToMood(mood);
        }}
        onToggleMusic={(enabled) => {
          setSettings((prev) => ({ ...prev, music: enabled }));
          sound.setMusicEnabled(enabled);
        }}
      />

      {/* Settings Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        characterCustomization={currentCustomization}
        currentMood={currentMood}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        onOpenCharacterCreator={() => {
          setIsEditCharacterOnly(true);
          setIsSettingsOpen(false);
          setIsCharacterCreationOpen(true);
        }}
        onOpenDailyMoodCheckIn={() => {
          setIsSettingsOpen(false);
          setIsDailyMoodCheckInOpen(true);
        }}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Letter to Future Me Sanctuary Modal */}
      <FutureLetterSanctuaryModal
        isOpen={isFutureLettersOpen}
        userName={userName}
        letters={futureLetters}
        currentTime={currentTime}
        onClose={() => setIsFutureLettersOpen(false)}
        onSaveNewLetter={handleSaveNewFutureLetter}
        onAddReply={handleAddLetterReply}
        onPlantAsMemoryTree={handlePlantLetterAsMemoryTree}
        onTestUnlock={handleTestUnlockLetter}
      />

      {/* 🐾 3D Companion Pet First-Time Onboarding Wizard */}
      <PetFirstTimeSetupModal
        isOpen={isPetSetupOpen}
        onFinish={handleFinishPetSetup}
      />

      {/* 🐾 3D Companion Pet Interactive Bonding Modal */}
      {companionPet && (
        <PetInteractionModal
          isOpen={isPetInteractionOpen}
          pet={companionPet}
          userName={userName}
          userMood={currentMood}
          onClose={() => setIsPetInteractionOpen(false)}
          onUpdatePet={handleUpdatePet}
        />
      )}

      {/* 10. TREE OPTIONS MENU (View, Edit, Remove Tree) */}
      <TreeOptionsMenu
        tree={selectedTreeForOptions}
        isOpen={Boolean(selectedTreeForOptions)}
        onClose={() => setSelectedTreeForOptions(null)}
        onViewMemory={handleViewMemoryFromOptions}
        onEditMemory={handleEditMemoryFromOptions}
        onConfirmRemove={handleConfirmRemoveTree}
      />

      {/* 11. EDIT MEMORY MODAL */}
      <EditMemoryModal
        isOpen={Boolean(editingMemory)}
        memory={editingMemory}
        onClose={() => setEditingMemory(null)}
        onSave={handleSaveEditedMemory}
      />

      {/* 12. REAL-TIME TOAST NOTIFICATION */}
      {toastNotification && (
        <div
          id="tree-toast-notification"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="px-4 py-2.5 rounded-2xl bg-stone-900/90 text-white font-bold text-xs shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 max-w-sm text-center">
            <span>{toastNotification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
