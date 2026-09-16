import React, { useState } from 'react';
import {
  CharacterCustomization,
  CharacterGender,
  MoodType,
  Direction,
  SkinToneId,
  HairColorId,
  HairstyleId,
  HairLength,
  EyeStyleId,
  FaceStyleId,
  ClothingStyleId,
  ShoesId,
  AccessoryId,
} from '../types';
import {
  SKIN_TONE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIRSTYLE_OPTIONS,
  EYE_STYLE_OPTIONS,
  FACE_STYLE_OPTIONS,
  CLOTHING_OPTIONS,
  SHOES_OPTIONS,
  ACCESSORY_OPTIONS,
  DEFAULT_FEMALE_CUSTOMIZATION,
  DEFAULT_MALE_CUSTOMIZATION,
  getRandomCharacterCustomization,
  MOOD_OPTIONS,
} from '../characterData';
import { CharacterAvatar } from './CharacterAvatar';
import { sound } from '../audio';
import {
  RotateCw,
  Dices,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Music,
  Check,
  Footprints,
  Coffee,
  Heart,
  Smile,
  Palette,
  Scissors,
  Shirt,
  Sparkle,
} from 'lucide-react';

interface CharacterCreationModalProps {
  initialCustomization?: CharacterCustomization;
  isOpen: boolean;
  onFinish: (customization: CharacterCustomization, mood: MoodType, customMoodNote?: string) => void;
  isEditOnly?: boolean;
  onCloseEditOnly?: () => void;
}

export const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({
  initialCustomization,
  isOpen,
  onFinish,
  isEditOnly = false,
  onCloseEditOnly,
}) => {
  // Wizard steps: 1 = Gender, 2 = Appearance Customizer, 3 = Name, 4 = Mood Check-in
  const [step, setStep] = useState<1 | 2 | 3 | 4>(isEditOnly ? 2 : 1);

  // Character Customization State
  const [customization, setCustomization] = useState<CharacterCustomization>(() => {
    return initialCustomization || DEFAULT_FEMALE_CUSTOMIZATION;
  });

  // Name Input
  const [nameInput, setNameInput] = useState(initialCustomization?.name || '');
  const [nameError, setNameError] = useState('');

  // Interactive Live Preview Controls
  const [previewDir, setPreviewDir] = useState<Direction>('down');
  const [isTestWalking, setIsTestWalking] = useState(false);
  const [isTestSitting, setIsTestSitting] = useState(false);
  const [walkPhase, setWalkPhase] = useState(0);

  // Appearance Tabs
  const [activeTab, setActiveTab] = useState<
    'skin_face' | 'hair' | 'clothing' | 'shoes' | 'accessories'
  >('skin_face');

  // Filter for hairstyles & clothing
  const [hairCategoryFilter, setHairCategoryFilter] = useState<'all' | 'female' | 'male'>('all');
  const [clothingCategoryFilter, setClothingCategoryFilter] = useState<'all' | 'female' | 'male'>('all');

  // Mood Check-in State
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [customMoodText, setCustomMoodText] = useState('');

  // Walk animation frame simulation in preview
  React.useEffect(() => {
    if (!isTestWalking) return;
    const interval = setInterval(() => {
      setWalkPhase((p) => (p + 0.1) % 1);
    }, 60);
    return () => clearInterval(interval);
  }, [isTestWalking]);

  if (!isOpen) return null;

  // Step 1: Choose Gender preset
  const handleSelectGender = (gender: CharacterGender) => {
    sound.playClick();
    if (gender === 'male') {
      setCustomization((prev) => ({
        ...DEFAULT_MALE_CUSTOMIZATION,
        name: prev.name || nameInput,
        gender: 'male',
      }));
      setHairCategoryFilter('male');
      setClothingCategoryFilter('male');
    } else if (gender === 'female') {
      setCustomization((prev) => ({
        ...DEFAULT_FEMALE_CUSTOMIZATION,
        name: prev.name || nameInput,
        gender: 'female',
      }));
      setHairCategoryFilter('female');
      setClothingCategoryFilter('female');
    } else {
      setCustomization((prev) => ({
        ...prev,
        gender: 'other',
      }));
      setHairCategoryFilter('all');
      setClothingCategoryFilter('all');
    }
    setStep(2);
  };

  // Step 2 -> Step 3: Finish Appearance -> Go to Name
  const handleAppearanceNext = () => {
    sound.playClick();
    if (isEditOnly) {
      // In edit only mode, finish directly
      onFinish(customization, selectedMood, isCustomMood ? customMoodText : undefined);
      onCloseEditOnly?.();
      return;
    }
    setStep(3);
  };

  // Step 3 -> Step 4: Finish Name -> Go to Mood Check-in
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Please give your character a name 🌸');
      return;
    }
    sound.playClick();
    setNameError('');
    setCustomization((prev) => ({ ...prev, name: trimmed }));
    setStep(4);
  };

  // Step 4: Finalize Onboarding & Enter Hanamori
  const handleFinalFinish = () => {
    sound.playSparkle();
    const finalCustomization = {
      ...customization,
      name: customization.name || nameInput.trim() || 'Traveler',
    };
    onFinish(finalCustomization, selectedMood, isCustomMood ? customMoodText : undefined);
  };

  // Rotate preview direction
  const cyclePreviewDirection = () => {
    sound.playClick();
    const dirs: Direction[] = ['down', 'right', 'up', 'left'];
    const nextIdx = (dirs.indexOf(previewDir) + 1) % dirs.length;
    setPreviewDir(dirs[nextIdx]);
  };

  // Randomize
  const handleRandomize = () => {
    sound.playClick();
    const random = getRandomCharacterCustomization(customization.name || nameInput, customization.gender);
    setCustomization(random);
  };

  // Reset
  const handleReset = () => {
    sound.playClick();
    const base = customization.gender === 'male' ? DEFAULT_MALE_CUSTOMIZATION : DEFAULT_FEMALE_CUSTOMIZATION;
    setCustomization({
      ...base,
      name: customization.name || nameInput,
    });
  };

  // Filtered hairstyles
  const filteredHairstyles = HAIRSTYLE_OPTIONS.filter((h) => {
    if (hairCategoryFilter === 'all') return true;
    return h.category === hairCategoryFilter || h.category === 'unisex';
  });

  // Filtered clothing
  const filteredClothing = CLOTHING_OPTIONS.filter((c) => {
    if (clothingCategoryFilter === 'all') return true;
    return c.category === clothingCategoryFilter || c.category === 'unisex';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-pink-100/80 flex items-center justify-between bg-gradient-to-r from-pink-50/70 via-rose-50/40 to-pink-50/70">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <h2 className="text-lg font-black text-stone-800 tracking-tight flex items-center gap-2">
                <span>{isEditOnly ? 'Customize Character' : 'Create Your Character'}</span>
                {!isEditOnly && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                    Step {step} of 4
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500">
                {step === 1 && 'Choose how you would like your character to look'}
                {step === 2 && 'Personalize hair, face, outfit, and accessories'}
                {step === 3 && 'Give your character a memorable name'}
                {step === 4 && 'Tune in to your heart with your daily mood check-in'}
              </p>
            </div>
          </div>

          {/* Close button for edit mode */}
          {isEditOnly && onCloseEditOnly && (
            <button
              onClick={onCloseEditOnly}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CHOOSE GENDER */}
        {/* ------------------------------------------------------------- */}
        {step === 1 && (
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-3xl mb-4 shadow-inner">
              🌸
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-800 mb-2">
              How would you like your character to look?
            </h3>
            <p className="text-stone-500 text-sm max-w-md mb-8">
              Choose an aesthetic foundation to start. All hairstyles, clothing, and colors remain completely open and unrestricted for everyone!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
              {/* Female Option */}
              <button
                type="button"
                onClick={() => handleSelectGender('female')}
                className="p-6 rounded-3xl bg-gradient-to-b from-pink-50 to-rose-50/50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-3 text-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  👧
                </div>
                <div>
                  <div className="text-base font-black text-stone-800">Female</div>
                  <div className="text-xs text-stone-500 mt-1">Soft dresses, twin tails, bows & sweet styles</div>
                </div>
                <span className="text-xs font-bold text-pink-600 bg-pink-100/80 px-3 py-1 rounded-full mt-2">
                  Select Style →
                </span>
              </button>

              {/* Male Option */}
              <button
                type="button"
                onClick={() => handleSelectGender('male')}
                className="p-6 rounded-3xl bg-gradient-to-b from-blue-50 to-indigo-50/50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-3 text-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  👦
                </div>
                <div>
                  <div className="text-base font-black text-stone-800">Male</div>
                  <div className="text-xs text-stone-500 mt-1">Short cuts, hoodies, jackets, trousers & cool looks</div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full mt-2">
                  Select Style →
                </span>
              </button>

              {/* Other / Prefer not to specify */}
              <button
                type="button"
                onClick={() => handleSelectGender('other')}
                className="p-6 rounded-3xl bg-gradient-to-b from-purple-50 to-pink-50/50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-3 text-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  🌈
                </div>
                <div>
                  <div className="text-base font-black text-stone-800">Other / Free Choice</div>
                  <div className="text-xs text-stone-500 mt-1">Mix and match any appearance freely without restrictions</div>
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-100/80 px-3 py-1 rounded-full mt-2">
                  Select Style →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: APPEARANCE CUSTOMIZER */}
        {/* ------------------------------------------------------------- */}
        {step === 2 && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Interactive 3D Avatar Preview Panel */}
            <div className="w-full md:w-80 bg-gradient-to-b from-pink-50/80 via-white to-rose-50/50 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-pink-100">
              <div className="w-full text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-100/80 px-3 py-1 rounded-full">
                  Live 3D Avatar
                </span>
                <h4 className="text-sm font-black text-stone-700 mt-2">
                  {customization.name || 'Your Character'}
                </h4>
              </div>

              {/* Main Avatar Stage */}
              <div className="relative my-4 flex items-center justify-center w-48 h-56 bg-radial from-white via-pink-50/50 to-transparent rounded-full shadow-inner border border-white">
                <CharacterAvatar
                  customization={customization}
                  direction={previewDir}
                  isMoving={isTestWalking}
                  stepPhase={walkPhase}
                  isSitting={isTestSitting}
                  size={95}
                  enableIdleAnim={true}
                />
              </div>

              {/* Preview Action Controls */}
              <div className="w-full flex flex-col gap-2">
                {/* 360 Rotate and Animation Toggles */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={cyclePreviewDirection}
                    className="px-2 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold shadow-sm hover:border-pink-300 hover:bg-pink-50/50 flex flex-col items-center gap-1 transition"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-4 h-4 text-pink-600" />
                    <span>Rotate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsTestWalking((prev) => !prev);
                      if (!isTestWalking) setIsTestSitting(false);
                    }}
                    className={`px-2 py-2 rounded-xl border text-xs font-bold shadow-sm flex flex-col items-center gap-1 transition ${
                      isTestWalking
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-pink-300 hover:bg-pink-50/50'
                    }`}
                    title="Test walking animation"
                  >
                    <Footprints className="w-4 h-4" />
                    <span>{isTestWalking ? 'Walking' : 'Walk'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsTestSitting((prev) => !prev);
                      if (!isTestSitting) setIsTestWalking(false);
                    }}
                    className={`px-2 py-2 rounded-xl border text-xs font-bold shadow-sm flex flex-col items-center gap-1 transition ${
                      isTestSitting
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-pink-300 hover:bg-pink-50/50'
                    }`}
                    title="Test sitting / relaxing pose"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>{isTestSitting ? 'Sitting' : 'Sit'}</span>
                  </button>
                </div>

                {/* Randomize & Reset */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-600 text-xs font-bold hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Dices className="w-3.5 h-3.5 text-amber-500" />
                    <span>Random</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Options & Category Tabs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Category Tab Bar */}
              <div className="flex border-b border-pink-100 bg-stone-50/60 overflow-x-auto px-4 gap-2 py-2">
                {[
                  { id: 'skin_face' as const, label: 'Skin & Face', icon: '🎨' },
                  { id: 'hair' as const, label: 'Hairstyle', icon: '💇' },
                  { id: 'clothing' as const, label: 'Clothing', icon: '👗' },
                  { id: 'shoes' as const, label: 'Shoes', icon: '👟' },
                  { id: 'accessories' as const, label: 'Accessories', icon: '✨' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      activeTab === tab.id
                        ? 'bg-pink-600 text-white shadow-sm shadow-pink-300'
                        : 'text-stone-600 hover:bg-white hover:text-pink-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Scrollable Customization Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-6">
                {/* 1. SKIN & FACE TAB */}
                {activeTab === 'skin_face' && (
                  <div className="space-y-6">
                    {/* Skin Tone */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                        <span>Skin Tone</span>
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {SKIN_TONE_OPTIONS.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, skinTone: st.id }));
                            }}
                            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                              customization.skinTone === st.id
                                ? 'border-pink-600 bg-pink-50/50 shadow-md scale-105'
                                : 'border-stone-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <div
                              className="w-9 h-9 rounded-full shadow-inner border border-black/10"
                              style={{ backgroundColor: st.baseColor }}
                            />
                            <span className="text-[11px] font-bold text-stone-700">{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Eye Style */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                        <span>Eye Style</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {EYE_STYLE_OPTIONS.map((eye) => (
                          <button
                            key={eye.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, eyeStyle: eye.id }));
                            }}
                            className={`p-3 rounded-2xl border-2 text-left transition-all ${
                              customization.eyeStyle === eye.id
                                ? 'border-pink-600 bg-pink-50/50 shadow-md'
                                : 'border-stone-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <div className="font-bold text-xs text-stone-800">{eye.label}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{eye.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Face Style / Blush & Freckles */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                        <span>Face Style & Expression</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {FACE_STYLE_OPTIONS.map((face) => (
                          <button
                            key={face.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, faceStyle: face.id }));
                            }}
                            className={`p-3 rounded-2xl border-2 text-left transition-all ${
                              customization.faceStyle === face.id
                                ? 'border-pink-600 bg-pink-50/50 shadow-md'
                                : 'border-stone-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <div className="font-bold text-xs text-stone-800">{face.label}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{face.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HAIRSTYLE TAB */}
                {activeTab === 'hair' && (
                  <div className="space-y-6">
                    {/* Hair Color Palette */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
                        Hair Color
                      </h4>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {HAIR_COLOR_OPTIONS.map((hc) => (
                          <button
                            key={hc.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, hairColor: hc.id }));
                            }}
                            className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                              customization.hairColor === hc.id
                                ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-300'
                                : 'border-stone-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                              style={{ backgroundColor: hc.colorHex }}
                            />
                            <span className="text-[10px] font-bold text-stone-700 truncate">
                              {hc.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hairstyle Gender / Style Filter */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                          Hairstyle Choice
                        </h4>
                        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                          {(['all', 'female', 'male'] as const).map((filter) => (
                            <button
                              key={filter}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setHairCategoryFilter(filter);
                              }}
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold capitalize transition ${
                                hairCategoryFilter === filter
                                  ? 'bg-white text-pink-600 shadow-sm'
                                  : 'text-stone-500 hover:text-stone-700'
                              }`}
                            >
                              {filter === 'all' ? 'All' : filter === 'female' ? '👧 Female' : '👦 Male'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hairstyles Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredHairstyles.map((hs) => (
                          <button
                            key={hs.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, hairstyle: hs.id }));
                            }}
                            className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 ${
                              customization.hairstyle === hs.id
                                ? 'border-pink-600 bg-pink-50/50 shadow-md scale-102'
                                : 'border-stone-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <span className="text-2xl">{hs.iconEmoji}</span>
                            <div>
                              <div className="font-bold text-xs text-stone-800 flex items-center gap-1">
                                <span>{hs.label}</span>
                                {hs.category === 'female' && <span className="text-[9px] text-pink-500">♀</span>}
                                {hs.category === 'male' && <span className="text-[9px] text-blue-500">♂</span>}
                              </div>
                              <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{hs.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hair Length Toggle */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
                        Hair Length Feel
                      </h4>
                      <div className="flex gap-2">
                        {(['short', 'medium', 'long'] as HairLength[]).map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setCustomization((prev) => ({ ...prev, hairLength: len }));
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition ${
                              customization.hairLength === len
                                ? 'border-pink-600 bg-pink-600 text-white'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-pink-300'
                            }`}
                          >
                            {len}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CLOTHING TAB */}
                {activeTab === 'clothing' && (
                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                        Outfits & Clothing
                      </h4>
                      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                        {(['all', 'female', 'male'] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setClothingCategoryFilter(filter);
                            }}
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold capitalize transition ${
                              clothingCategoryFilter === filter
                                ? 'bg-white text-pink-600 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                            }`}
                          >
                            {filter === 'all' ? 'All Outfits' : filter === 'female' ? '👧 Female' : '👦 Male'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Outfits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredClothing.map((cl) => (
                        <button
                          key={cl.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCustomization((prev) => ({
                              ...prev,
                              clothingId: cl.id,
                              dress: cl.id as any,
                            }));
                          }}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                            customization.clothingId === cl.id
                              ? 'border-pink-600 bg-pink-50/50 shadow-md scale-101'
                              : 'border-stone-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                              style={{ backgroundColor: cl.primaryColor }}
                            />
                            <div>
                              <div className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                                <span>{cl.label}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-500 font-normal">
                                  {cl.typeLabel}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{cl.desc}</div>
                            </div>
                          </div>

                          {customization.clothingId === cl.id && (
                            <Check className="w-4 h-4 text-pink-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. SHOES TAB */}
                {activeTab === 'shoes' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                      Footwear & Shoes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SHOES_OPTIONS.map((sh) => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCustomization((prev) => ({ ...prev, shoes: sh.id }));
                          }}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                            customization.shoes === sh.id
                              ? 'border-pink-600 bg-pink-50/50 shadow-md'
                              : 'border-stone-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="font-bold text-xs text-stone-800">{sh.label}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{sh.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. ACCESSORIES TAB */}
                {activeTab === 'accessories' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                      Hair & Head Accessories
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ACCESSORY_OPTIONS.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCustomization((prev) => ({ ...prev, accessory: acc.id }));
                          }}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                            customization.accessory === acc.id
                              ? 'border-pink-600 bg-pink-50/50 shadow-md'
                              : 'border-stone-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="font-bold text-xs text-stone-800">{acc.label}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{acc.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer for Step 2 */}
              <div className="p-4 border-t border-pink-100 flex items-center justify-between bg-white">
                {!isEditOnly ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Change Gender / Style</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleAppearanceNext}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-black shadow-lg shadow-pink-300/50 hover:brightness-105 active:scale-95 transition flex items-center gap-2"
                >
                  <span>{isEditOnly ? 'Save Changes' : 'Next: Name Character'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: CHARACTER NAME */}
        {/* ------------------------------------------------------------- */}
        {step === 3 && (
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center shadow-inner overflow-hidden">
                <CharacterAvatar
                  customization={customization}
                  direction="down"
                  size={65}
                  enableIdleAnim={true}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md text-sm">
                ✏️
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-stone-800 mb-2">
              What is your character's name?
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mb-6">
              This will become your main identity across Hanamori as you tend to your garden of memories.
            </p>

            <form onSubmit={handleNameSubmit} className="w-full max-w-sm flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  maxLength={20}
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setNameError('');
                  }}
                  placeholder="e.g. Kaede, Haru, Ren, Sakura..."
                  autoFocus
                  className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border-2 border-pink-200 focus:border-pink-500 focus:bg-white text-stone-800 font-bold text-center text-lg outline-none transition shadow-sm"
                />
                {nameError && (
                  <p className="text-xs text-rose-500 font-bold mt-2 animate-shake">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Quick Name Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="text-[11px] text-stone-400 font-bold mr-1">Ideas:</span>
                {['Sakura', 'Haru', 'Kaede', 'Ren', 'Aoi', 'Yuki', 'Sora', 'Noa'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setNameInput(sug);
                      setNameError('');
                    }}
                    className="px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-sm font-black shadow-lg shadow-pink-300/50 hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: DAILY MOOD CHECK-IN */}
        {/* ------------------------------------------------------------- */}
        {step === 4 && (
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center">
            <div className="text-center max-w-lg mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                Welcome to Hanamori, {nameInput}!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-800 mt-2 mb-1">
                How is your heart feeling today?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Your garden blooms in harmony with your emotions. Select your current mood to tune the atmosphere and gentle piano melody.
              </p>
            </div>

            {/* Mood Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-3xl mb-6">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.type}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedMood(mood.type);
                    setIsCustomMood(false);
                    sound.crossFadeToMood(mood.type);
                  }}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                    selectedMood === mood.type && !isCustomMood
                      ? 'border-pink-600 bg-pink-50/70 shadow-md scale-102 ring-2 ring-pink-300'
                      : 'border-stone-200 hover:border-pink-300 bg-white'
                  }`}
                >
                  <span className="text-3xl mb-1.5">{mood.emoji}</span>
                  <span className="text-xs font-black text-stone-800">{mood.label}</span>
                  <span className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                    {mood.pianoDescription}
                  </span>
                </button>
              ))}
            </div>

            {/* Optional Custom Mood Note */}
            <div className="w-full max-w-lg mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-600">Personal Thought (Optional)</span>
                <span className="text-[10px] text-stone-400">Kept private in your diary</span>
              </div>
              <input
                type="text"
                value={customMoodText}
                onChange={(e) => setCustomMoodText(e.target.value)}
                placeholder="A gentle word about today..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-pink-400 focus:bg-white text-xs font-medium text-stone-800 outline-none transition"
              />
            </div>

            {/* Action Bar */}
            <div className="w-full max-w-lg flex items-center justify-between gap-4 pt-2 border-t border-pink-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalFinish}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white text-sm font-black shadow-xl shadow-pink-300/50 hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enter Hanamori Garden 🌸</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
