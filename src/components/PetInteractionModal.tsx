import React, { useState } from 'react';
import { CompanionPetState, PetAnimState, PetExpression, PetHatId, PetBowId, PetScarfId, PetToyId } from '../petTypes';
import { PET_SPECIES_LIST, PET_ACCESSORIES_CATALOG, PET_TREATS, PET_LEVEL_TITLES } from '../petData';
import { CompanionPet3D } from './CompanionPet3D';
import { sound } from '../audio';
import { MoodType } from '../types';
import {
  X,
  Heart,
  Sparkles,
  Cookie,
  MessageCircle,
  Gamepad2,
  Shirt,
  Check,
  ChevronRight,
  Smile,
  Volume2,
} from 'lucide-react';

interface PetInteractionModalProps {
  isOpen: boolean;
  pet: CompanionPetState;
  userName: string;
  userMood: MoodType;
  onClose: () => void;
  onUpdatePet: (updatedPet: CompanionPetState) => void;
}

export const PetInteractionModal: React.FC<PetInteractionModalProps> = ({
  isOpen,
  pet,
  userName,
  userMood,
  onClose,
  onUpdatePet,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'feed' | 'play' | 'dress' | 'talk'>('main');
  const [petAnim, setPetAnim] = useState<PetAnimState>('idle');
  const [petExpr, setPetExpr] = useState<PetExpression>('happy');
  const [reactionMsg, setReactionMsg] = useState<string>('');
  const [isAnimatingAction, setIsAnimatingAction] = useState(false);

  if (!isOpen) return null;

  const def = PET_SPECIES_LIST.find((p) => p.id === pet.species) || PET_SPECIES_LIST[0];

  // Helper to add affection and level up
  const addAffection = (amount: number, happinessBonus: number = 10, hungerBonus: number = 0) => {
    const newAffection = pet.affectionScore + amount;
    // Calculate level (every 100 points = 1 level, up to level 6+)
    const newLevel = Math.max(1, Math.min(6, Math.floor(newAffection / 100) + 1));
    const newHappiness = Math.min(100, pet.happinessLevel + happinessBonus);
    const newHunger = Math.min(100, pet.hungerLevel + hungerBonus);

    const updated: CompanionPetState = {
      ...pet,
      affectionScore: newAffection,
      level: newLevel,
      happinessLevel: newHappiness,
      hungerLevel: newHunger,
      lastInteractedAt: Date.now(),
    };

    onUpdatePet(updated);
  };

  // Action: Pet
  const handlePetAction = () => {
    if (isAnimatingAction) return;
    setIsAnimatingAction(true);
    sound.playPetHappy();
    setPetAnim('play');
    setPetExpr('loving');
    setReactionMsg(`${pet.name} leans warmly into your hand, purring with gentle affection! 💖`);
    addAffection(15, 20);

    setTimeout(() => {
      setPetAnim('idle');
      setPetExpr('happy');
      setIsAnimatingAction(false);
    }, 1800);
  };

  // Action: Feed
  const handleFeedTreat = (treat: typeof PET_TREATS[0]) => {
    if (isAnimatingAction) return;
    setIsAnimatingAction(true);
    sound.playPetEat();
    setPetAnim('play');
    setPetExpr('excited');
    setReactionMsg(`${pet.name} happily munches on the ${treat.name}! Delicious! ${treat.emoji}`);
    addAffection(25, treat.happinessBonus, treat.hungerBonus);

    setTimeout(() => {
      setPetAnim('idle');
      setPetExpr('loving');
      setIsAnimatingAction(false);
    }, 1800);
  };

  // Action: Play
  const handlePlayGame = (gameName: string, toyEmoji: string) => {
    if (isAnimatingAction) return;
    setIsAnimatingAction(true);
    sound.playPetToy();
    setPetAnim('play');
    setPetExpr('excited');
    setReactionMsg(`${pet.name} plays ${gameName} with you! ${toyEmoji} Look at them bounce!`);
    addAffection(30, 25);

    setTimeout(() => {
      setPetAnim('idle');
      setPetExpr('happy');
      setIsAnimatingAction(false);
    }, 2000);
  };

  // Action: Talk
  const handleTalk = () => {
    sound.playPetChirp();
    setPetExpr('curious');

    // Mood-adaptive response
    let msg = '';
    if (userMood === 'sad' || userMood === 'lonely') {
      msg = `${pet.name} sits close to you and gently rests its head on your lap. "You are never alone in Hanamori, ${userName}." 🌸`;
    } else if (userMood === 'happy' || userMood === 'excited') {
      msg = `${pet.name} does a joyful little bounce! "Your bright energy makes the entire garden glow today!" ✨`;
    } else if (userMood === 'angry') {
      msg = `${pet.name} stays quietly right beside you, offering a soft grounding presence. "Take a deep breath. I am right here." 🍃`;
    } else {
      msg = `${pet.name} chirps happily. "I love walking through the blossoms with you, ${userName}!" 🌿`;
    }

    setReactionMsg(msg);
  };

  // Equip accessory
  const handleEquipAccessory = (item: typeof PET_ACCESSORIES_CATALOG[0]) => {
    sound.playClick();
    sound.playPetHappy();

    const updatedAcc = { ...pet.accessories };
    if (item.type === 'hat') {
      updatedAcc.hat = updatedAcc.hat === item.id ? 'none' : (item.id as PetHatId);
    } else if (item.type === 'bow') {
      updatedAcc.bow = updatedAcc.bow === item.id ? 'none' : (item.id as PetBowId);
    } else if (item.type === 'scarf') {
      updatedAcc.scarf = updatedAcc.scarf === item.id ? 'none' : (item.id as PetScarfId);
    } else if (item.type === 'toy') {
      updatedAcc.heldToy = updatedAcc.heldToy === item.id ? 'none' : (item.id as PetToyId);
    }

    onUpdatePet({
      ...pet,
      accessories: updatedAcc,
    });
  };

  const currentLevelTitle = PET_LEVEL_TITLES[pet.level] || 'Cherished Companion';
  const progressToNextLevel = (pet.affectionScore % 100);

  return (
    <div
      id="pet-interaction-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/65 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#fffbfc] via-[#fff5f8] to-[#ffeef4] border-2 border-pink-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center text-xl shadow-sm">
              {def.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#8b3559] font-['Zen_Maru_Gothic']">
                  {pet.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#9d3862] text-[10px] font-black">
                  Lvl {pet.level} • {currentLevelTitle}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-semibold font-['Nunito']">
                {def.tagline} • {def.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-pink-100/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pet 3D Display Stage & Status */}
        <div className="relative p-5 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-pink-100/30 border-b border-pink-100">
          <div className="relative">
            <CompanionPet3D
              species={pet.species}
              animState={petAnim}
              expression={petExpr}
              accessories={pet.accessories}
              size={150}
              showShadow={true}
            />
          </div>

          {/* Affection Progress Bar */}
          <div className="w-full max-w-xs mt-3 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-stone-600">
              <span className="flex items-center gap-1 text-rose-600">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Affection Level {pet.level}</span>
              </span>
              <span>{progressToNextLevel}/100 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden border border-pink-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>

          {/* Reaction Text Bubble */}
          {reactionMsg && (
            <div className="mt-3 px-4 py-2 rounded-2xl bg-white/95 border border-pink-200 shadow-xs text-xs font-bold text-[#8b3559] text-center max-w-md animate-fadeIn">
              {reactionMsg}
            </div>
          )}
        </div>

        {/* Action Tabs Bar */}
        <div className="flex items-center justify-around px-4 py-2 bg-white/70 border-b border-pink-100 text-xs font-black">
          {[
            { id: 'main', label: 'Actions', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'feed', label: 'Feed', icon: <Cookie className="w-3.5 h-3.5" /> },
            { id: 'play', label: 'Play', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
            { id: 'talk', label: 'Talk', icon: <MessageCircle className="w-3.5 h-3.5" /> },
            { id: 'dress', label: 'Dress Up', icon: <Shirt className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
                setReactionMsg('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-pink-100/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-Tab Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* MAIN ACTIONS TAB */}
          {activeTab === 'main' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePetAction}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-rose-50 border-2 border-pink-100 hover:border-rose-300 shadow-xs transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center text-2xl mb-2">
                  ✋
                </div>
                <span className="text-sm font-black text-stone-800">Pet {pet.name}</span>
                <span className="text-[11px] text-stone-400 font-medium">Gentle stroke on head</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('feed');
                }}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-pink-100 hover:border-amber-300 shadow-xs transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-2xl mb-2">
                  🍓
                </div>
                <span className="text-sm font-black text-stone-800">Feed Treat</span>
                <span className="text-[11px] text-stone-400 font-medium">Give sweet garden snack</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('play');
                }}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-purple-50 border-2 border-pink-100 hover:border-purple-300 shadow-xs transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center text-2xl mb-2">
                  🎾
                </div>
                <span className="text-sm font-black text-stone-800">Play Game</span>
                <span className="text-[11px] text-stone-400 font-medium">Playful spin & fetch</span>
              </button>

              <button
                onClick={handleTalk}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-pink-100 hover:border-emerald-300 shadow-xs transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center text-2xl mb-2">
                  💬
                </div>
                <span className="text-sm font-black text-stone-800">Talk Together</span>
                <span className="text-[11px] text-stone-400 font-medium">Hear sweet comforting words</span>
              </button>
            </div>
          )}

          {/* FEED TAB */}
          {activeTab === 'feed' && (
            <div className="space-y-2">
              <span className="text-xs font-black text-stone-500 block mb-2">
                Choose a tasty snack for {pet.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PET_TREATS.map((treat) => (
                  <button
                    key={treat.id}
                    onClick={() => handleFeedTreat(treat)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-pink-50 border border-pink-100 hover:border-pink-300 transition-all text-left cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="text-2xl">{treat.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-black text-stone-800">{treat.name}</div>
                      <div className="text-[10px] text-stone-400 line-clamp-1">{treat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PLAY TAB */}
          {activeTab === 'play' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { name: 'Feather Wand Chase', emoji: '🪄', desc: 'Leaps up high to catch the ribbon' },
                { name: 'Squeaky Star Toss', emoji: '⭐', desc: 'Tosses star into the flower grass' },
                { name: 'Bouncy Spin Dance', emoji: '💃', desc: 'Spins around with dizzy joy' },
                { name: 'Hide and Pounce', emoji: '🌿', desc: 'Peeks playfully behind the leaves' },
              ].map((game, i) => (
                <button
                  key={i}
                  onClick={() => handlePlayGame(game.name, game.emoji)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-purple-50 border border-pink-100 hover:border-purple-300 transition-all text-left cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="text-2xl">{game.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs font-black text-stone-800">{game.name}</div>
                    <div className="text-[10px] text-stone-400">{game.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TALK TAB */}
          {activeTab === 'talk' && (
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
              <div className="text-3xl mb-2">{def.emoji}</div>
              <h4 className="text-sm font-black text-[#8b3559] mb-1 font-['Zen_Maru_Gothic']">
                Heart-to-Heart with {pet.name}
              </h4>
              <p className="text-xs text-stone-500 mb-4 max-w-sm">
                {pet.name} is deeply attuned to how you feel today ({userMood}). Tap below to share a gentle moment.
              </p>
              <button
                onClick={handleTalk}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95"
              >
                Listen to {pet.name}
              </button>
            </div>
          )}

          {/* DRESS UP / ACCESSORIES TAB */}
          {activeTab === 'dress' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-600">
                  Wardrobe & Accessories (Level Unlocks)
                </span>
                <span className="text-[11px] font-extrabold text-rose-600">
                  Your Level: {pet.level}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PET_ACCESSORIES_CATALOG.map((item) => {
                  const isLocked = pet.level < item.minLevel;
                  const isEquipped =
                    pet.accessories.hat === item.id ||
                    pet.accessories.bow === item.id ||
                    pet.accessories.scarf === item.id ||
                    pet.accessories.heldToy === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={isLocked}
                      onClick={() => handleEquipAccessory(item)}
                      className={`relative flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                          : isEquipped
                          ? 'bg-rose-50 border-rose-400 shadow-xs'
                          : 'bg-white hover:bg-pink-50 border-pink-100'
                      }`}
                    >
                      {isEquipped && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="text-xs font-black text-stone-800 line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {isLocked ? `Unlocks at Lvl ${item.minLevel}` : item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
