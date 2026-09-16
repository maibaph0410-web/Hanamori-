import React, { useState } from 'react';
import { PetSpeciesId, PetAnimState, PetExpression, CompanionPetState } from '../petTypes';
import { PET_SPECIES_LIST, PET_NAME_SUGGESTIONS } from '../petData';
import { CompanionPet3D } from './CompanionPet3D';
import { sound } from '../audio';
import {
  RotateCcw,
  RotateCw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Volume2,
  Heart,
  Smile,
  Zap,
  Moon,
  Footprints,
} from 'lucide-react';

interface PetFirstTimeSetupModalProps {
  isOpen: boolean;
  onFinish: (pet: CompanionPetState) => void;
  // Optional if opened later to switch or view
  allowCancel?: boolean;
  onCancel?: () => void;
}

export const PetFirstTimeSetupModal: React.FC<PetFirstTimeSetupModalProps> = ({
  isOpen,
  onFinish,
  allowCancel = false,
  onCancel,
}) => {
  // Step 1 = Choose Species, Step 2 = Name Companion
  const [step, setStep] = useState<1 | 2>(1);

  // Selected species
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<PetSpeciesId>('unicorn');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [previewAnim, setPreviewAnim] = useState<PetAnimState>('idle');
  const [previewExpr, setPreviewExpr] = useState<PetExpression>('happy');

  // Category filter for the large collection
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'cute' | 'fantasy' | 'woodland'>('all');

  // Step 2 Naming State
  const [petNameInput, setPetNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isCelebrating, setIsCelebrating] = useState(false);

  if (!isOpen) return null;

  const currentDef = PET_SPECIES_LIST.find((p) => p.id === selectedSpeciesId) || PET_SPECIES_LIST[0];

  const filteredSpecies = PET_SPECIES_LIST.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const handleSelectSpecies = (id: PetSpeciesId) => {
    sound.playClick();
    setSelectedSpeciesId(id);
    sound.playPetChirp();
    // Default suggested name for quick prefill if empty
    const suggestions = PET_NAME_SUGGESTIONS[id] || ['Mochi'];
    if (!petNameInput || PET_NAME_SUGGESTIONS[selectedSpeciesId]?.includes(petNameInput)) {
      setPetNameInput(suggestions[0]);
    }
  };

  const handleVoicePreview = () => {
    sound.playPetHappy();
    setPreviewExpr('loving');
    setTimeout(() => setPreviewExpr('happy'), 1500);
  };

  const handleNextToNaming = () => {
    sound.playClick();
    sound.playPetHappy();
    if (!petNameInput.trim()) {
      const suggestions = PET_NAME_SUGGESTIONS[selectedSpeciesId] || ['Mochi'];
      setPetNameInput(suggestions[0]);
    }
    setStep(2);
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = petNameInput.trim();
    if (!finalName) {
      setNameError('Please give your companion a sweet name 🌸');
      return;
    }

    sound.playPetCelebration();
    setIsCelebrating(true);

    setTimeout(() => {
      const newPet: CompanionPetState = {
        id: `pet-${Date.now()}`,
        name: finalName,
        species: selectedSpeciesId,
        customNameChosen: true,
        createdAt: Date.now(),
        affectionScore: 50,
        level: 1,
        accessories: { hat: 'none', bow: 'none', scarf: 'none', heldToy: 'none' },
        hungerLevel: 85,
        energyLevel: 95,
        happinessLevel: 100,
        lastInteractedAt: Date.now(),
        totalPetsGiven: 0,
        totalTreatsGiven: 0,
        totalGamesPlayed: 0,
      };

      onFinish(newPet);
    }, 1000);
  };

  return (
    <div
      id="pet-first-time-setup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-md animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#fffbfc] via-[#fff5f8] to-[#ffeef4] border-2 border-pink-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/85 backdrop-blur-md border-b border-pink-100 shadow-xs z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center text-xl shadow-sm">
              🐾
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#8b3559] font-['Zen_Maru_Gothic'] tracking-wide">
                {step === 1 ? 'Choose Your Companion Pet' : 'Name Your Companion Pet'}
              </h2>
              <p className="text-xs text-stone-500 font-semibold">
                {step === 1
                  ? 'Pick the little friend who will travel beside you in Hanamori'
                  : 'Give your companion a personal name to begin your journey'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setStep(1);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-rose-700 text-xs font-black cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Pets</span>
              </button>
            )}
            {allowCancel && onCancel && (
              <button
                onClick={() => {
                  sound.playClick();
                  onCancel();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
          {step === 1 ? (
            /* ============================================================
               STEP 1: CHOOSE YOUR PET
               ============================================================ */
            <div className="flex flex-col lg:flex-row gap-5 flex-1">
              {/* Left Column: 3D Interactive Stage */}
              <div className="w-full lg:w-1/2 flex flex-col items-center justify-between p-5 rounded-3xl bg-white/70 backdrop-blur-md border border-pink-100 shadow-sm relative overflow-hidden">
                {/* Ambient 3D Stage Lighting */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 45%, rgba(255, 215, 230, 0.5) 0%, rgba(255, 240, 245, 0.2) 60%, transparent 80%)',
                  }}
                />

                {/* Pet Identity Header */}
                <div className="relative z-10 text-center mb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200/80 text-[11px] font-black text-[#9d3862] mb-1">
                    <span>{currentDef.emoji}</span>
                    <span>{currentDef.tagline}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#8b3559] font-['Zen_Maru_Gothic']">
                    {currentDef.name}
                  </h3>
                </div>

                {/* 3D Pet Model Stage */}
                <div className="relative z-10 my-2 flex flex-col items-center justify-center">
                  <div className="relative">
                    <CompanionPet3D
                      species={selectedSpeciesId}
                      animState={previewAnim}
                      expression={previewExpr}
                      rotation={rotationAngle}
                      size={170}
                      interactiveRotate={true}
                      onRotateChange={setRotationAngle}
                      showShadow={true}
                    />
                  </div>

                  {/* Drag to rotate hint */}
                  <div className="text-[10px] text-stone-400 font-bold mt-1 flex items-center gap-1">
                    <span>🔄</span>
                    <span>Drag or use buttons below to rotate 360°</span>
                  </div>
                </div>

                {/* Rotation and Voice Controls */}
                <div className="relative z-10 flex items-center gap-2 mb-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setRotationAngle((prev) => (prev - 45 + 360) % 360);
                    }}
                    title="Rotate Left"
                    className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-stone-700 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleVoicePreview}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voice</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setRotationAngle((prev) => (prev + 45) % 360);
                    }}
                    title="Rotate Right"
                    className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-stone-700 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Animation Preview Switcher Buttons */}
                <div className="relative z-10 w-full pt-2 border-t border-pink-100/80 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Test Live 3D Animations
                  </span>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {[
                      { id: 'idle', label: 'Idle', icon: <Smile className="w-3 h-3" /> },
                      { id: 'walk', label: 'Walk', icon: <Footprints className="w-3 h-3" /> },
                      { id: 'run', label: 'Run', icon: <Zap className="w-3 h-3" /> },
                      { id: 'sleep', label: 'Sleep', icon: <Moon className="w-3 h-3" /> },
                      { id: 'play', label: 'Play', icon: <Sparkles className="w-3 h-3" /> },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          sound.playClick();
                          setPreviewAnim(btn.id as PetAnimState);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          previewAnim === btn.id
                            ? 'bg-[#8b3559] text-white shadow-xs scale-105'
                            : 'bg-stone-100 text-stone-600 hover:bg-pink-100/70 border border-stone-200/60'
                        }`}
                      >
                        {btn.icon}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personality Tags */}
                <div className="relative z-10 flex items-center gap-1.5 mt-3 flex-wrap justify-center">
                  {currentDef.personality.map((trait, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/90 border border-pink-100 text-[10px] font-bold text-stone-600"
                    >
                      ✨ {trait}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800">
                    Loves {currentDef.favoriteFoodEmoji} {currentDef.favoriteFood}
                  </span>
                </div>
              </div>

              {/* Right Column: Species Collection Selection */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  {/* Category Filter Pills */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#8b3559]">
                      Choose Companion Species ({PET_SPECIES_LIST.length} Available)
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'cute', label: 'Cute' },
                        { id: 'fantasy', label: 'Fantasy' },
                        { id: 'woodland', label: 'Woodland' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            sound.playClick();
                            setCategoryFilter(cat.id as any);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                            categoryFilter === cat.id
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-white text-stone-600 hover:bg-pink-50 border border-stone-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Species Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {filteredSpecies.map((pet) => {
                      const isSelected = pet.id === selectedSpeciesId;
                      return (
                        <button
                          key={pet.id}
                          onClick={() => handleSelectSpecies(pet.id)}
                          className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-rose-500 shadow-md shadow-pink-200/60 scale-[1.02]'
                              : 'bg-white/80 hover:bg-white border-pink-100 hover:border-pink-300'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                          )}
                          <div className="w-12 h-12 flex items-center justify-center text-2xl mb-1">
                            {pet.emoji}
                          </div>
                          <span className="text-xs font-black text-stone-800 font-['Zen_Maru_Gothic']">
                            {pet.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium line-clamp-1">
                            {pet.tagline}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Pet Description Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-white/85 border border-pink-100 shadow-xs">
                    <div className="text-xs font-black text-[#8b3559] mb-1 flex items-center gap-1.5">
                      <span>{currentDef.emoji}</span>
                      <span>About {currentDef.name}:</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-['Nunito']">
                      {currentDef.description}
                    </p>
                  </div>
                </div>

                {/* Primary Proceed Button */}
                <div className="pt-4 border-t border-pink-100 mt-4 flex justify-end">
                  <button
                    id="choose-pet-next-btn"
                    onClick={handleNextToNaming}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-black shadow-lg shadow-pink-300/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Next: Name Your {currentDef.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               STEP 2: NAME YOUR COMPANION
               ============================================================ */
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-4">
              {/* Chosen Pet 3D Showcase */}
              <div className="relative flex flex-col items-center mb-6">
                <div className="relative">
                  <CompanionPet3D
                    species={selectedSpeciesId}
                    animState="idle"
                    expression="loving"
                    rotation={0}
                    size={160}
                    showShadow={true}
                  />
                  {isCelebrating && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-3xl animate-ping">💖</div>
                    </div>
                  )}
                </div>

                {/* Identity Tag */}
                <div className="mt-2 px-3 py-1 rounded-full bg-white/90 border border-pink-200 text-xs font-black text-[#8b3559] flex items-center gap-1.5 shadow-xs">
                  <span>{currentDef.emoji}</span>
                  <span>{currentDef.name} Companion</span>
                </div>
              </div>

              {/* Title & Question */}
              <h3 className="text-2xl sm:text-3xl font-black text-[#8b3559] text-center mb-2 font-['Zen_Maru_Gothic']">
                What would you like to name your companion?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 text-center mb-6 font-semibold max-w-md">
                Your companion will explore the garden with you, stay by your side when you feel lonely, and celebrate your memories.
              </p>

              {/* Name Input Form */}
              <form onSubmit={handleFinalSubmit} className="w-full max-w-md space-y-4">
                <div className="relative">
                  <input
                    id="companion-name-input"
                    type="text"
                    maxLength={20}
                    value={petNameInput}
                    onChange={(e) => {
                      setPetNameInput(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Mochi, Clover, Stardust..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-pink-200 focus:border-rose-400 focus:outline-none text-center text-lg sm:text-xl font-black text-stone-800 shadow-sm placeholder:text-stone-300 font-['Zen_Maru_Gothic']"
                    autoFocus
                  />
                  {nameError && (
                    <p className="text-xs text-rose-500 font-bold mt-1 text-center">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Cute Suggested Names Pills */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold text-stone-400">
                    Cute Name Suggestions:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {(PET_NAME_SUGGESTIONS[selectedSpeciesId] || ['Mochi', 'Boba', 'Sakura', 'Clover', 'Pip']).map(
                      (sName) => (
                        <button
                          type="button"
                          key={sName}
                          onClick={() => {
                            sound.playClick();
                            setPetNameInput(sName);
                            if (nameError) setNameError('');
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            petNameInput === sName
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-white hover:bg-pink-50 text-stone-600 border border-pink-200'
                          }`}
                        >
                          {sName}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Primary Button: "Meet My Companion" */}
                <div className="pt-4 flex justify-center">
                  <button
                    id="meet-my-companion-btn"
                    type="submit"
                    disabled={isCelebrating}
                    className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-base sm:text-lg font-black tracking-wide shadow-xl shadow-pink-300/60 border border-white/40 cursor-pointer transition-all font-['Zen_Maru_Gothic']"
                  >
                    <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
                    <span>Meet My Companion</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
