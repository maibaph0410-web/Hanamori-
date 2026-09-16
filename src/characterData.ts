import {
  SkinToneOption,
  HairColorOption,
  HairstyleOption,
  EyeStyleOption,
  FaceStyleOption,
  ClothingOption,
  DressId,
  TopId,
  BottomId,
  ShoesId,
  AccessoryId,
  CharacterCustomization,
  MoodOption,
} from './types';

export const SKIN_TONE_OPTIONS: SkinToneOption[] = [
  {
    id: 'very_light',
    label: 'Very Light',
    baseColor: '#fff5eb',
    shadowColor: '#ffe4d6',
    earColor: '#ffd5c4',
    blushColor: '#ff8aa9',
  },
  {
    id: 'light',
    label: 'Light',
    baseColor: '#fdeee3',
    shadowColor: '#fad4c0',
    earColor: '#f7c5ad',
    blushColor: '#ff7b9e',
  },
  {
    id: 'medium',
    label: 'Medium',
    baseColor: '#f2cca9',
    shadowColor: '#e0b289',
    earColor: '#d69e71',
    blushColor: '#ff7388',
  },
  {
    id: 'tan',
    label: 'Tan',
    baseColor: '#cf986d',
    shadowColor: '#b87e52',
    earColor: '#9e673e',
    blushColor: '#d8586c',
  },
  {
    id: 'deep',
    label: 'Deep',
    baseColor: '#845030',
    shadowColor: '#67391d',
    earColor: '#532912',
    blushColor: '#963445',
  },
];

export const HAIR_COLOR_OPTIONS: HairColorOption[] = [
  {
    id: 'black',
    label: 'Black',
    colorHex: '#252026',
    colorGradStart: '#3d343f',
    colorGradMid: '#252026',
    colorGradEnd: '#141115',
  },
  {
    id: 'dark_brown',
    label: 'Dark Brown',
    colorHex: '#4a2b1e',
    colorGradStart: '#6b4130',
    colorGradMid: '#4a2b1e',
    colorGradEnd: '#2e180f',
  },
  {
    id: 'brown',
    label: 'Brown',
    colorHex: '#734632',
    colorGradStart: '#996047',
    colorGradMid: '#734632',
    colorGradEnd: '#4f2d1e',
  },
  {
    id: 'light_brown',
    label: 'Light Brown',
    colorHex: '#aa7a59',
    colorGradStart: '#cca07e',
    colorGradMid: '#aa7a59',
    colorGradEnd: '#7a5136',
  },
  {
    id: 'blonde',
    label: 'Blonde',
    colorHex: '#f5d676',
    colorGradStart: '#ffea9f',
    colorGradMid: '#f5d676',
    colorGradEnd: '#cca637',
  },
  {
    id: 'pink',
    label: 'Pink',
    colorHex: '#ff8fb1',
    colorGradStart: '#ffb8ce',
    colorGradMid: '#ff8fb1',
    colorGradEnd: '#e05984',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    colorHex: '#bda3f2',
    colorGradStart: '#dcceff',
    colorGradMid: '#bda3f2',
    colorGradEnd: '#9071ce',
  },
  {
    id: 'blue',
    label: 'Blue',
    colorHex: '#7cb5f2',
    colorGradStart: '#a8d2ff',
    colorGradMid: '#7cb5f2',
    colorGradEnd: '#4c8acb',
  },
  {
    id: 'silver',
    label: 'Silver',
    colorHex: '#cbd3df',
    colorGradStart: '#e7ecf2',
    colorGradMid: '#cbd3df',
    colorGradEnd: '#9ba5b5',
  },
  {
    id: 'white',
    label: 'White',
    colorHex: '#f4f6fb',
    colorGradStart: '#ffffff',
    colorGradMid: '#edf1f8',
    colorGradEnd: '#cfd7e5',
  },
  {
    id: 'sage_green',
    label: 'Sage Green',
    colorHex: '#69db7c',
    colorGradStart: '#b2f2bb',
    colorGradMid: '#69db7c',
    colorGradEnd: '#2f9e44',
  },
  {
    id: 'rose_gold',
    label: 'Rose Gold',
    colorHex: '#e5989b',
    colorGradStart: '#ffb4a2',
    colorGradMid: '#e5989b',
    colorGradEnd: '#b5838d',
  },
];

export const HAIRSTYLE_OPTIONS: HairstyleOption[] = [
  // Feminine & Long Styles
  {
    id: 'long_straight',
    label: 'Long Straight',
    iconEmoji: '💇‍♀️',
    category: 'female',
    desc: 'Silky flowing straight hair reaching down past the shoulders',
  },
  {
    id: 'long_wavy',
    label: 'Long Wavy',
    iconEmoji: '🌊',
    category: 'female',
    desc: 'Gentle cascading waves with natural softness',
  },
  {
    id: 'twin_tails',
    label: 'Twin Tails',
    iconEmoji: '👧',
    category: 'female',
    desc: 'Playful bouncy high pigtails tied with sweet clips',
  },
  {
    id: 'ponytail',
    label: 'Ponytail',
    iconEmoji: '🐴',
    category: 'female',
    desc: 'High spirited ponytail with breezy swaying motion',
  },
  {
    id: 'bob',
    label: 'Short Bob',
    iconEmoji: '🎀',
    category: 'female',
    desc: 'Chic neat chin-length bob with clean inward tuck',
  },
  {
    id: 'shoulder_length',
    label: 'Shoulder-Length',
    iconEmoji: '🌸',
    category: 'female',
    desc: 'Soft gentle cut resting comfortably along the shoulders',
  },
  {
    id: 'braids',
    label: 'Twin Braids',
    iconEmoji: '🌾',
    category: 'female',
    desc: 'Whimsical cottage twin braids with ribbon ends',
  },
  {
    id: 'half_up',
    label: 'Half-Up Bun',
    iconEmoji: '💫',
    category: 'female',
    desc: 'Elegant top bun with loose flowing locks behind',
  },

  // Masculine & Shorter Styles
  {
    id: 'short_straight',
    label: 'Short Straight',
    iconEmoji: '👦',
    category: 'male',
    desc: 'Clean, tidy short hair with a crisp front fringe',
  },
  {
    id: 'side_part',
    label: 'Side-Part',
    iconEmoji: '💼',
    category: 'male',
    desc: 'Polished gentleman side parting with smooth taper',
  },
  {
    id: 'messy',
    label: 'Messy Hair',
    iconEmoji: '⚡',
    category: 'male',
    desc: 'Effortlessly cool tousled locks with charming texture',
  },
  {
    id: 'two_block',
    label: 'Two-Block Cut',
    iconEmoji: '💈',
    category: 'male',
    desc: 'Modern trendy layered cut with clean fade and soft volume',
  },
  {
    id: 'short_wavy',
    label: 'Short Wavy',
    iconEmoji: '🌊',
    category: 'male',
    desc: 'Breezy wavy strands framing the forehead naturally',
  },
  {
    id: 'curly',
    label: 'Curly Hair',
    iconEmoji: '🌀',
    category: 'male',
    desc: 'Fluffy defined curls with cheerful spring and bounce',
  },
  {
    id: 'medium_length',
    label: 'Medium-Length',
    iconEmoji: '🎸',
    category: 'male',
    desc: 'Free-spirited collar-length locks tucked behind ears',
  },
];

export const EYE_STYLE_OPTIONS: EyeStyleOption[] = [
  { id: 'sparkle', label: 'Sparkling Anime', desc: 'Large expressive eyes with double catchlight glimmer' },
  { id: 'gentle', label: 'Gentle & Warm', desc: 'Soft almond eyelids with peaceful warm gaze' },
  { id: 'calm', label: 'Calm & Serene', desc: 'Quiet, thoughtful level eyes reflecting stillness' },
  { id: 'cat', label: 'Cat Eyes', desc: 'Playful upward tilt with curious bright spark' },
  { id: 'starry', label: 'Starry Dreamer', desc: 'Glistening celestial twinkle inside the pupils' },
  { id: 'bold', label: 'Bold & Clear', desc: 'Direct, open and confident clear gaze' },
];

export const FACE_STYLE_OPTIONS: FaceStyleOption[] = [
  { id: 'soft_blush', label: 'Soft Pastel Blush', desc: 'Delicate sakura pink blush on both cheeks' },
  { id: 'rosy_cheeks', label: 'Rosy Blossom', desc: 'Warm rosy warmth like coming in from fresh air' },
  { id: 'freckles', label: 'Cute Freckles', desc: 'Charming sun-kissed freckle dust across the nose' },
  { id: 'cute_smile', label: 'Sweet Smile', desc: 'Tender curved peaceful smile' },
  { id: 'cheerful', label: 'Bright Cheerful', desc: 'Open joyful grin with warm cheeks' },
];

export const CLOTHING_OPTIONS: ClothingOption[] = [
  // FEMALE CLOTHING
  {
    id: 'pastel_dress',
    label: 'Pastel Lace Dress',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Soft gradient pink with white lace hem and rose bow',
    primaryColor: '#ffb8d2',
  },
  {
    id: 'flower_dress',
    label: 'Flower Daisy Sundress',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Mint green sundress dotted with delicate white daisies',
    primaryColor: '#b2e2cd',
  },
  {
    id: 'fantasy_dress',
    label: 'Fantasy Star Gown',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Starry lavender dress with shimmering golden star brooch',
    primaryColor: '#8d6be6',
  },
  {
    id: 'simple_white_dress',
    label: 'Cottage Cotton Dress',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Crisp, breezy ivory cottage dress with waist tie',
    primaryColor: '#f1f3f5',
  },
  {
    id: 'pink_dress',
    label: 'Rose Party Dress',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Tiered rose-petal ruffles with satin ribbon accents',
    primaryColor: '#ff7aa6',
  },
  {
    id: 'summer_sundress',
    label: 'Summer Sundress',
    category: 'female',
    typeLabel: 'Dresses',
    desc: 'Bright sunny pastel yellow dress with airy straps',
    primaryColor: '#ffe066',
  },
  {
    id: 'cozy_pajama_dress',
    label: 'Lace Nightgown',
    category: 'female',
    typeLabel: 'Pajamas',
    desc: 'Dreamy soft cloud nightgown for quiet evenings',
    primaryColor: '#e5dbff',
  },
  {
    id: 'skirt_blouse',
    label: 'Sailor Blouse & Skirt',
    category: 'female',
    typeLabel: 'Skirts with Tops',
    desc: 'Crisp white sailor collar blouse with pleated navy skirt',
    primaryColor: '#74c0fc',
  },
  {
    id: 'skirt_sweater',
    label: 'Cardigan & Plaid Skirt',
    category: 'female',
    typeLabel: 'Skirts with Tops',
    desc: 'Soft blush knit cardigan with pleated plaid school skirt',
    primaryColor: '#ffc9c9',
  },
  {
    id: 'tshirt_pants_f',
    label: 'Pastel Tee & High Pants',
    category: 'female',
    typeLabel: 'T-shirts and Pants',
    desc: 'Relaxed lavender print tee with high-waisted cotton trousers',
    primaryColor: '#d0bfff',
  },
  {
    id: 'hoodie_shorts_f',
    label: 'Bunny Hoodie & Shorts',
    category: 'female',
    typeLabel: 'Hoodies',
    desc: 'Oversized fleece lilac hoodie with comfy stretch shorts',
    primaryColor: '#e5dbff',
  },
  {
    id: 'casual_dungarees',
    label: 'Cute Denim Dungarees',
    category: 'female',
    typeLabel: 'Cute Casual Outfits',
    desc: 'Sky blue denim overalls paired with a cheerful striped shirt',
    primaryColor: '#91a7ff',
  },
  {
    id: 'pastel_pajamas_f',
    label: 'Strawberry Pajamas',
    category: 'female',
    typeLabel: 'Pajamas',
    desc: 'Silky button-down pastel pajama set with strawberry print',
    primaryColor: '#ffc9db',
  },
  {
    id: 'autumn_coat_f',
    label: 'Autumn Trench & Scarf',
    category: 'female',
    typeLabel: 'Seasonal Outfits',
    desc: 'Warm cinnamon trench coat with a soft woven wool scarf',
    primaryColor: '#d97706',
  },
  {
    id: 'winter_scarf_jacket_f',
    label: 'Winter Puffer & Fluff',
    category: 'female',
    typeLabel: 'Seasonal Outfits',
    desc: 'Snowy pearl puffer jacket with a plush fluffy pink muffler',
    primaryColor: '#e9ecef',
  },

  // MALE CLOTHING
  {
    id: 'tshirt_pants_m',
    label: 'Casual Tee & Chinos',
    category: 'male',
    typeLabel: 'T-shirts and Pants',
    desc: 'Clean relaxed crewneck tee with comfortable rolled chinos',
    primaryColor: '#4dabf7',
  },
  {
    id: 'street_hoodie_m',
    label: 'Cozy Street Hoodie',
    category: 'male',
    typeLabel: 'Hoodies',
    desc: 'Heavyweight two-tone streetwear hoodie with dark joggers',
    primaryColor: '#845ef7',
  },
  {
    id: 'oxford_trousers_m',
    label: 'Oxford Shirt & Trousers',
    category: 'male',
    typeLabel: 'Shirts and Trousers',
    desc: 'Sky blue button-down shirt with tailored charcoal trousers',
    primaryColor: '#339af0',
  },
  {
    id: 'denim_jacket_m',
    label: 'Vintage Denim Jacket',
    category: 'male',
    typeLabel: 'Jackets',
    desc: 'Washed indigo trucker jacket over a clean white undershirt',
    primaryColor: '#228be6',
  },
  {
    id: 'bomber_jacket_m',
    label: 'Varsity Bomber Jacket',
    category: 'male',
    typeLabel: 'Jackets',
    desc: 'Classic evergreen athletic bomber jacket with ribbed collar',
    primaryColor: '#2b8a3e',
  },
  {
    id: 'knit_sweater_m',
    label: 'Cable Knit Sweater',
    category: 'male',
    typeLabel: 'Sweaters',
    desc: 'Chunky cream cable-knit wool sweater with relaxed khaki slacks',
    primaryColor: '#fab005',
  },
  {
    id: 'casual_overalls_m',
    label: 'Workwear Dungarees',
    category: 'male',
    typeLabel: 'Casual Outfits',
    desc: 'Sturdy carpenter denim overalls with rolled cuffs and henley',
    primaryColor: '#495057',
  },
  {
    id: 'comfort_pajamas_m',
    label: 'Striped Nightwear',
    category: 'male',
    typeLabel: 'Pajamas',
    desc: 'Midnight navy and white relaxed cotton pajama set',
    primaryColor: '#364fc7',
  },
  {
    id: 'autumn_trench_m',
    label: 'Caramel Autumn Coat',
    category: 'male',
    typeLabel: 'Seasonal Outfits',
    desc: 'Tailored caramel longcoat over a dark ribbed turtleneck',
    primaryColor: '#b45309',
  },
  {
    id: 'winter_puffer_m',
    label: 'Arctic Winter Puffer',
    category: 'male',
    typeLabel: 'Seasonal Outfits',
    desc: 'Insulated cobalt winter parka with storm hood and warm cuffs',
    primaryColor: '#1c7ed6',
  },
  {
    id: 'spring_cardigan_m',
    label: 'Sage Spring Cardigan',
    category: 'male',
    typeLabel: 'Seasonal Outfits',
    desc: 'Lightweight sage green buttoned knit over an airy tee',
    primaryColor: '#20c997',
  },
];

export interface ItemChoice<T> {
  id: T;
  label: string;
  desc: string;
}

export const SHOES_OPTIONS: ItemChoice<ShoesId>[] = [
  { id: 'sneakers', label: 'Pastel Sneakers', desc: 'Pastel walking sneakers with white soles' },
  { id: 'boots', label: 'Traveler Boots', desc: 'Warm caramel leather adventurer boots' },
  { id: 'mary_jane', label: 'Mary Jane Shoes', desc: 'Classic buckle shoes with white frill socks' },
  { id: 'cute_flats', label: 'Ribbon Flats', desc: 'Sweet satin ribbon ballet flats' },
  { id: 'loafers', label: 'Classic Loafers', desc: 'Polished smart loafers for a sleek look' },
  { id: 'canvas_shoes', label: 'Canvas Low-Tops', desc: 'Casual everyday lace-up canvas sneakers' },
  { id: 'slippers', label: 'Fluffy Slippers', desc: 'Soft fuzzy cozy bear bedroom slippers' },
  { id: 'fantasy_shoes', label: 'Fantasy Slippers', desc: 'Pointed fairy slippers with gold buckles' },
];

export const ACCESSORY_OPTIONS: ItemChoice<AccessoryId>[] = [
  { id: 'none', label: 'None', desc: 'Clean, natural look' },
  { id: 'flower', label: 'Cherry Blossom', desc: 'Fresh pink sakura bloom' },
  { id: 'bow', label: 'Satin Bow', desc: 'Oversized rose ribbon hair bow' },
  { id: 'hair_clip', label: 'Golden Star Clip', desc: 'Twinkling celestial star hairpin' },
  { id: 'ribbon', label: 'Twin Ribbons', desc: 'Delicate braided pastel ribbons' },
  { id: 'small_backpack', label: 'Traveler Satchel', desc: 'Cozy leather satchel for your diary' },
  { id: 'star_accessory', label: 'Starlight Pin', desc: 'Shimmering crystal night star' },
  { id: 'heart_accessory', label: 'Heart Charm', desc: 'Glossy sweet candy heart pin' },
  { id: 'glasses', label: 'Gold Wire Glasses', desc: 'Delicate round scholar spectacles' },
  { id: 'sunglasses', label: 'Cool Sunglasses', desc: 'Stylish chic tinted shades' },
  { id: 'headphones', label: 'Pastel Headphones', desc: 'Comfortable wireless music headphones' },
  { id: 'beret', label: 'Painter Beret', desc: 'Chic French artist wool beret' },
];

export const DEFAULT_FEMALE_CUSTOMIZATION: CharacterCustomization = {
  name: '',
  gender: 'female',
  skinTone: 'very_light',
  hairColor: 'brown',
  hairstyle: 'long_straight',
  hairLength: 'long',
  eyeStyle: 'sparkle',
  faceStyle: 'soft_blush',
  clothingId: 'pastel_dress',
  shoes: 'mary_jane',
  accessory: 'flower',
  outfitType: 'dress',
  dress: 'pastel_dress',
  top: 'pastel_sweater',
  bottom: 'skirt',
};

export const DEFAULT_MALE_CUSTOMIZATION: CharacterCustomization = {
  name: '',
  gender: 'male',
  skinTone: 'light',
  hairColor: 'dark_brown',
  hairstyle: 'short_straight',
  hairLength: 'short',
  eyeStyle: 'calm',
  faceStyle: 'soft_blush',
  clothingId: 'tshirt_pants_m',
  shoes: 'sneakers',
  accessory: 'none',
  outfitType: 'top_bottom',
  dress: 'pastel_dress',
  top: 'pastel_sweater',
  bottom: 'wide_pants',
};

export const DEFAULT_CHARACTER_CUSTOMIZATION: CharacterCustomization = DEFAULT_FEMALE_CUSTOMIZATION;

export function getRandomCharacterCustomization(
  name: string,
  preferredGender?: 'female' | 'male' | 'other'
): CharacterCustomization {
  const randElem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const gender = preferredGender || (Math.random() > 0.5 ? 'female' : 'male');

  const filteredHair = HAIRSTYLE_OPTIONS.filter((h) =>
    gender === 'other' ? true : h.category === gender || h.category === 'unisex'
  );
  const filteredClothes = CLOTHING_OPTIONS.filter((c) =>
    gender === 'other' ? true : c.category === gender || c.category === 'unisex'
  );

  const hairChoice = randElem(filteredHair.length > 0 ? filteredHair : HAIRSTYLE_OPTIONS);
  const clothesChoice = randElem(filteredClothes.length > 0 ? filteredClothes : CLOTHING_OPTIONS);

  return {
    name: name || '',
    gender,
    skinTone: randElem(SKIN_TONE_OPTIONS).id,
    hairColor: randElem(HAIR_COLOR_OPTIONS).id,
    hairstyle: hairChoice.id,
    hairLength: hairChoice.category === 'female' ? 'long' : 'short',
    eyeStyle: randElem(EYE_STYLE_OPTIONS).id,
    faceStyle: randElem(FACE_STYLE_OPTIONS).id,
    clothingId: clothesChoice.id,
    shoes: randElem(SHOES_OPTIONS).id,
    accessory: randElem(ACCESSORY_OPTIONS).id,
  };
}

// -------------------------------------------------------------
// DAILY MOOD CHECK-IN OPTIONS & PIANO MUSIC PROFILE
// -------------------------------------------------------------
export const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'happy',
    label: 'Happy',
    emoji: '🌸',
    pianoDescription: 'Light, warm & cheerful piano with playful, bright melodies.',
    themeColor: '#ff77a9',
    lightBg: '#fff0f5',
  },
  {
    type: 'sad',
    label: 'Sad',
    emoji: '🌧️',
    pianoDescription: 'Slow, soft & gentle piano that wraps around you with comforting warmth.',
    themeColor: '#5c7cfa',
    lightBg: '#edf2ff',
  },
  {
    type: 'calm',
    label: 'Calm',
    emoji: '🌱',
    pianoDescription: 'Spacious, peaceful & slow piano, like resting silently under garden leaves.',
    themeColor: '#2b8a3e',
    lightBg: '#ebfbee',
  },
  {
    type: 'lonely',
    label: 'Lonely',
    emoji: '🌙',
    pianoDescription: 'Dreamy, quiet & reflective twilight piano with gentle reverberation.',
    themeColor: '#7048e8',
    lightBg: '#f3f0ff',
  },
  {
    type: 'loved',
    label: 'Loved',
    emoji: '💗',
    pianoDescription: 'Warm, soft & tender piano harmonies that feel like a gentle embrace.',
    themeColor: '#e64980',
    lightBg: '#fff0f6',
  },
  {
    type: 'angry',
    label: 'Angry',
    emoji: '🔥',
    pianoDescription: 'Deeper, controlled resonant piano notes releasing tension into stillness.',
    themeColor: '#e03131',
    lightBg: '#fff5f5',
  },
  {
    type: 'hopeful',
    label: 'Hopeful',
    emoji: '☀️',
    pianoDescription: 'Gentle, uplifting piano chords ascending towards the morning light.',
    themeColor: '#f59f00',
    lightBg: '#fff9db',
  },
  {
    type: 'tired',
    label: 'Tired',
    emoji: '😴',
    pianoDescription: 'Extremely soft, slow & soothing lullaby piano to help you unwind.',
    themeColor: '#868e96',
    lightBg: '#f8f9fa',
  },
  {
    type: 'excited',
    label: 'Excited',
    emoji: '✨',
    pianoDescription: 'Brisk, light & playful piano skipping with joyful optimism.',
    themeColor: '#fab005',
    lightBg: '#fff9db',
  },
  {
    type: 'relaxed',
    label: 'Relaxed',
    emoji: '😌',
    pianoDescription: 'Serene, flowing & tranquil piano melodies easing all weight away.',
    themeColor: '#20c997',
    lightBg: '#e6fcf5',
  },
];
