export type EmotionType =
  | 'happy'
  | 'sad'
  | 'peaceful'
  | 'lonely'
  | 'love'
  | 'angry'
  | 'hope';

export interface EmotionInfo {
  type: EmotionType;
  label: string;
  emoji: string;
  treeTitle: string;
  themeColor: string;
  secondaryColor: string;
  lightBg: string;
  borderColor: string;
  description: string;
}

export const EMOTIONS: Record<EmotionType, EmotionInfo> = {
  happy: {
    type: 'happy',
    label: 'Happy',
    emoji: '🌸',
    treeTitle: 'Happy Tree',
    themeColor: '#ff77a9',
    secondaryColor: '#ffb3cf',
    lightBg: '#fff0f5',
    borderColor: '#ff94b8',
    description: 'Blossoms of joy, laughter, and sunny moments.'
  },
  sad: {
    type: 'sad',
    label: 'Sad',
    emoji: '🌧️',
    treeTitle: 'Sad Tree',
    themeColor: '#5c7cfa',
    secondaryColor: '#91a7ff',
    lightBg: '#edf2ff',
    borderColor: '#748ffc',
    description: 'Gentle weeping leaves that drink quiet tears and heal.'
  },
  peaceful: {
    type: 'peaceful',
    label: 'Peaceful',
    emoji: '🌱',
    treeTitle: 'Peace Tree',
    themeColor: '#38b000',
    secondaryColor: '#70e000',
    lightBg: '#f4fbf4',
    borderColor: '#48cae4',
    description: 'Serene boughs of calmness, deep breaths, and stillness.'
  },
  lonely: {
    type: 'lonely',
    label: 'Lonely',
    emoji: '🌙',
    treeTitle: 'Lonely Tree',
    themeColor: '#7048e8',
    secondaryColor: '#9775fa',
    lightBg: '#f3f0ff',
    borderColor: '#845ef7',
    description: 'Twilight purple branches adorned with soft guiding starlight.'
  },
  love: {
    type: 'love',
    label: 'Love',
    emoji: '💗',
    treeTitle: 'Love Tree',
    themeColor: '#f72585',
    secondaryColor: '#ff70a6',
    lightBg: '#fff0f6',
    borderColor: '#f72585',
    description: 'Heart-shaped canopies of fondness, warmth, and devotion.'
  },
  angry: {
    type: 'angry',
    label: 'Angry',
    emoji: '🔥',
    treeTitle: 'Angry Tree',
    themeColor: '#e03131',
    secondaryColor: '#ff6b6b',
    lightBg: '#fff5f5',
    borderColor: '#fa5252',
    description: 'Warm fire-leaf foliage where burning frustration safely dissolves.'
  },
  hope: {
    type: 'hope',
    label: 'Hope',
    emoji: '☀️',
    treeTitle: 'Hope Tree',
    themeColor: '#f59f00',
    secondaryColor: '#ffd43b',
    lightBg: '#fff9db',
    borderColor: '#fab005',
    description: 'Golden radiant crowns of faith, optimism, and dawn.'
  }
};

export type TreeGrowthStage = 'sprout' | 'sapling' | 'mature' | 'magical';

export interface MemoryMediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string; // Base64 data URL or object URL
  name?: string;
  caption?: string;
  size?: number;
  uploadedAt: number;
}

export interface UnplantedSeed {
  id: string;
  emotion: EmotionType;
  title: string;
  text: string;
  date: string;
  createdAt: number;
  media?: MemoryMediaItem[];
  note?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  text: string;
  emotion: EmotionType;
  date: string;
  position: { x: number; y: number };
  treeType: EmotionType;
  growthStage?: TreeGrowthStage;
  createdAt: number;
  media?: MemoryMediaItem[];
  note?: string;
  companionShared?: boolean;
  companionResponse?: string;
  companionSharedAt?: number;
}

// -------------------------------------------------------------
// LETTER TO FUTURE ME TYPES
// -------------------------------------------------------------
export interface FutureLetterReply {
  id: string;
  text: string;
  createdAt: number;
  dateString: string;
}

export type FutureLetterDurationPreset = '1_month' | '6_months' | '1_year' | 'custom';

export interface FutureLetter {
  id: string;
  title: string;
  message: string;
  mood: MoodType;
  photos: MemoryMediaItem[];
  createdAt: number;
  writtenDate: string; // e.g. "September 14, 2026"
  unlockDate: number; // Unix ms timestamp
  unlockDateString: string; // e.g. "October 14, 2026"
  durationPreset: FutureLetterDurationPreset;
  isSealed: boolean;
  isOpened: boolean;
  openedAt?: number;
  replies?: FutureLetterReply[];
  plantedMemoryId?: string; // Links to MemoryItem if converted into a Memory Tree
}


export type Direction = 'up' | 'down' | 'left' | 'right';

export interface CharacterState {
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  stepPhase: number;
  isSitting?: boolean;
}

export interface AppSettings {
  music: boolean;
  sfx: boolean;
  effects: boolean;
  isNight: boolean;
}

// -------------------------------------------------------------
// USER CUSTOM CHARACTER TYPES
// -------------------------------------------------------------
export type CharacterGender = 'female' | 'male' | 'other';

export type SkinToneId = 'very_light' | 'light' | 'medium' | 'tan' | 'deep';

export interface SkinToneOption {
  id: SkinToneId;
  label: string;
  baseColor: string;
  shadowColor: string;
  earColor: string;
  blushColor: string;
}

export type HairColorId =
  | 'black'
  | 'dark_brown'
  | 'brown'
  | 'light_brown'
  | 'blonde'
  | 'pink'
  | 'lavender'
  | 'blue'
  | 'silver'
  | 'white'
  | 'sage_green'
  | 'rose_gold';

export interface HairColorOption {
  id: HairColorId;
  label: string;
  colorHex: string;
  colorGradStart: string;
  colorGradMid: string;
  colorGradEnd: string;
}

export type HairLength = 'short' | 'medium' | 'long';

export type HairstyleId =
  // Female styles
  | 'long_straight'
  | 'long_wavy'
  | 'twin_tails'
  | 'ponytail'
  | 'bob'
  | 'shoulder_length'
  | 'braids'
  | 'half_up'
  // Male styles
  | 'short_straight'
  | 'side_part'
  | 'messy'
  | 'two_block'
  | 'short_wavy'
  | 'curly'
  | 'medium_length';

export interface HairstyleOption {
  id: HairstyleId;
  label: string;
  iconEmoji: string;
  category: 'female' | 'male' | 'unisex';
  desc: string;
}

export type EyeStyleId =
  | 'sparkle'
  | 'gentle'
  | 'calm'
  | 'cat'
  | 'starry'
  | 'bold';

export interface EyeStyleOption {
  id: EyeStyleId;
  label: string;
  desc: string;
}

export type FaceStyleId =
  | 'soft_blush'
  | 'rosy_cheeks'
  | 'freckles'
  | 'cute_smile'
  | 'cheerful';

export interface FaceStyleOption {
  id: FaceStyleId;
  label: string;
  desc: string;
}

export type ClothingStyleId =
  // Female
  | 'pastel_dress'
  | 'flower_dress'
  | 'fantasy_dress'
  | 'simple_white_dress'
  | 'pink_dress'
  | 'summer_sundress'
  | 'cozy_pajama_dress'
  | 'skirt_blouse'
  | 'skirt_sweater'
  | 'tshirt_pants_f'
  | 'hoodie_shorts_f'
  | 'casual_dungarees'
  | 'pastel_pajamas_f'
  | 'autumn_coat_f'
  | 'winter_scarf_jacket_f'
  // Male
  | 'tshirt_pants_m'
  | 'street_hoodie_m'
  | 'oxford_trousers_m'
  | 'denim_jacket_m'
  | 'bomber_jacket_m'
  | 'knit_sweater_m'
  | 'casual_overalls_m'
  | 'comfort_pajamas_m'
  | 'autumn_trench_m'
  | 'winter_puffer_m'
  | 'spring_cardigan_m';

export interface ClothingOption {
  id: ClothingStyleId;
  label: string;
  category: 'female' | 'male' | 'unisex';
  typeLabel: string;
  desc: string;
  primaryColor: string;
}

export type OutfitType = 'dress' | 'top_bottom';

export type DressId =
  | 'pastel_dress'
  | 'flower_dress'
  | 'fantasy_dress'
  | 'simple_white_dress'
  | 'pink_dress';

export type TopId =
  | 'pastel_sweater'
  | 'cute_blouse'
  | 'cardigan'
  | 'oversized_hoodie'
  | 'fantasy_top';

export type BottomId = 'skirt' | 'shorts' | 'wide_pants';

export type ShoesId =
  | 'sneakers'
  | 'boots'
  | 'mary_jane'
  | 'cute_flats'
  | 'loafers'
  | 'canvas_shoes'
  | 'slippers'
  | 'fantasy_shoes';

export type AccessoryId =
  | 'none'
  | 'bow'
  | 'flower'
  | 'hair_clip'
  | 'ribbon'
  | 'small_backpack'
  | 'star_accessory'
  | 'heart_accessory'
  | 'glasses'
  | 'sunglasses'
  | 'headphones'
  | 'beret';

export interface CharacterCustomization {
  name: string;
  gender: CharacterGender;
  skinTone: SkinToneId;
  hairColor: HairColorId;
  hairstyle: HairstyleId;
  hairLength: HairLength;
  eyeStyle: EyeStyleId;
  faceStyle: FaceStyleId;
  clothingId: ClothingStyleId;
  clothingColor?: string;
  shoes: ShoesId;
  accessory: AccessoryId;
  // Legacy compatibility
  outfitType?: OutfitType;
  dress?: DressId;
  top?: TopId;
  bottom?: BottomId;
}

// -------------------------------------------------------------
// DAILY MOOD & ATMOSPHERE PIANO TYPES
// -------------------------------------------------------------
export type MoodType =
  | 'happy'
  | 'sad'
  | 'calm'
  | 'lonely'
  | 'loved'
  | 'angry'
  | 'hopeful'
  | 'tired'
  | 'excited'
  | 'relaxed';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  pianoDescription: string;
  themeColor: string;
  lightBg: string;
}

export interface DailyMoodRecord {
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "September 13, 2026"
  mood: MoodType;
  customNote?: string;
  musicAtmosphere: string;
  pianoAtmosphere?: string;
  timestamp: number;
}
