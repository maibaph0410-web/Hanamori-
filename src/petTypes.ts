export type PetSpeciesId =
  | 'unicorn'
  | 'penguin'
  | 'dog'
  | 'cat'
  | 'alpaca'
  | 'bunny'
  | 'fox'
  | 'bear'
  | 'deer'
  | 'panda'
  | 'koala'
  | 'hamster'
  | 'chick'
  | 'dragon'
  | 'starsprite'
  | 'axolotl';

export type PetAnimState = 'idle' | 'walk' | 'run' | 'sleep' | 'play';

export type PetExpression = 'happy' | 'calm' | 'excited' | 'sleepy' | 'loving' | 'curious';

export type PetHatId = 'none' | 'mini_tophat' | 'blossom_crown' | 'straw_hat' | 'star_beret' | 'froggy_hood';
export type PetBowId = 'none' | 'pink_satin_bow' | 'emerald_ribbon' | 'bell_collar' | 'celestial_ribbon';
export type PetScarfId = 'none' | 'knit_scarf' | 'sakura_scarf' | 'warm_bandana';
export type PetToyId = 'yarn_ball' | 'star_squeaker' | 'bell_wand' | 'flower_pinwheel';

export interface PetAccessoryItem {
  id: string;
  name: string;
  type: 'hat' | 'bow' | 'scarf' | 'toy';
  emoji: string;
  description: string;
  minLevel: number;
}

export interface PetSpeciesDef {
  id: PetSpeciesId;
  name: string;
  emoji: string;
  category: 'cute' | 'fantasy' | 'woodland';
  tagline: string;
  description: string;
  baseColor: string;
  secondaryColor: string;
  accentColor: string;
  blushColor: string;
  eyeColor: string;
  soundType: 'chirp' | 'bark' | 'meow' | 'whinny' | 'peep' | 'purr' | 'squeak' | 'hum';
  favoriteFood: string;
  favoriteFoodEmoji: string;
  personality: string[];
}

export interface PetAccessories {
  hat: PetHatId;
  bow: PetBowId;
  scarf: PetScarfId;
  heldToy: PetToyId | 'none';
}

export interface CompanionPetState {
  id: string;
  name: string;
  species: PetSpeciesId;
  customNameChosen: boolean;
  createdAt: number;
  affectionScore: number; // 0 to 1000+
  level: number; // 1 to 10+
  accessories: PetAccessories;
  hungerLevel: number; // 0 to 100 (100 = full)
  energyLevel: number; // 0 to 100
  happinessLevel: number; // 0 to 100
  lastInteractedAt: number;
  totalPetsGiven: number;
  totalTreatsGiven: number;
  totalGamesPlayed: number;
}
