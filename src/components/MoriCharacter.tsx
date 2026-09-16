import React from 'react';
import { Direction, CharacterCustomization } from '../types';
import { DEFAULT_CHARACTER_CUSTOMIZATION } from '../characterData';
import { CharacterAvatar } from './CharacterAvatar';

interface MoriCharacterProps {
  direction: Direction;
  isMoving: boolean;
  stepPhase: number;
  customization?: CharacterCustomization;
  isSitting?: boolean;
}

export const MoriCharacter: React.FC<MoriCharacterProps> = ({
  direction,
  isMoving,
  stepPhase,
  customization = DEFAULT_CHARACTER_CUSTOMIZATION,
  isSitting = false,
}) => {
  return (
    <CharacterAvatar
      customization={customization}
      direction={direction}
      isMoving={isMoving}
      stepPhase={stepPhase}
      isSitting={isSitting}
      size={58}
      enableIdleAnim={true}
    />
  );
};
