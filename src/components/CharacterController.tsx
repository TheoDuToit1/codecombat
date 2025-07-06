import React, { useEffect } from 'react';
import { Position } from '../types/game';

interface CharacterControllerProps {
  position: Position;
  setPosition: (pos: Position) => void;
  isBlocked: (x: number, y: number) => boolean;
}

export const CharacterController: React.FC<CharacterControllerProps> = ({
  position,
  setPosition,
  isBlocked,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case 'ArrowUp':
        case 'w': dy = -1; break;
        case 'ArrowDown':
        case 's': dy = 1; break;
        case 'ArrowLeft':
        case 'a': dx = -1; break;
        case 'ArrowRight':
        case 'd': dx = 1; break;
      }
      const newX = position.x + dx;
      const newY = position.y + dy;
      if (!isBlocked(newX, newY)) {
        setPosition({ x: newX, y: newY });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, setPosition, isBlocked]);

  return null;
}; 