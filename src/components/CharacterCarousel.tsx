import React, { useState, useEffect, ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Define character interface
interface Character {
  id: string;
  name: string;
  sprite: string | ReactNode;
  description: string;
  stats: {
    speed: number;
    health: number;
    attack: string;
  };
}

// Define character data
const characters: Character[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    sprite: '🛡️', // This would be replaced with actual sprite image
    description: 'Strong melee fighter with high defense.',
    stats: {
      speed: 2,
      health: 100,
      attack: 'melee'
    }
  },
  {
    id: 'wizard',
    name: 'Wizard',
    sprite: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="64" height="64">
        {/* Wizard hat */}
        <path d="M12 2C8 2 6 3 6 5C6 7 7 10 12 10C17 10 18 7 18 5C18 3 16 2 12 2Z" fill="#6b46c1" stroke="white" strokeWidth="1" />
        <path d="M7 5C7 5 8 8 12 8C16 8 17 5 17 5" stroke="white" strokeWidth="1" />
        
        {/* Hat brim */}
        <path d="M5 6C5 6 7 8 12 8C17 8 19 6 19 6" stroke="white" strokeWidth="1" />
        <path d="M4 6L20 6" stroke="white" strokeWidth="1" />
        
        {/* Wand */}
        <path d="M14 12L18 16" stroke="white" strokeWidth="2" />
        <circle cx="19" cy="17" r="1.5" fill="#ffd700" stroke="white" />
        
        {/* Sparkles */}
        <circle cx="20" cy="16" r="0.5" fill="white" />
        <circle cx="21" cy="17" r="0.5" fill="white" />
        <circle cx="20" cy="18" r="0.5" fill="white" />
      </svg>
    ),
    description: 'Master of spells with ranged attacks.',
    stats: {
      speed: 1,
      health: 70,
      attack: 'magic'
    }
  },
  {
    id: 'elf',
    name: 'Elf',
    sprite: '🏹', // This would be replaced with actual sprite image
    description: 'Agile archer with speed and precision.',
    stats: {
      speed: 3,
      health: 80,
      attack: 'ranged'
    }
  },
  {
    id: 'assassin',
    name: 'Assassin',
    sprite: '🗡️', // This would be replaced with actual sprite image
    description: 'Agile fighter with stealth and critical strikes.',
    stats: {
      speed: 2.5,
      health: 90,
      attack: 'melee'
    }
  }
];

interface CharacterCarouselProps {
  onSelect: (id: string) => void;
  onBack: () => void;
  initialCharacterId?: string;
}

const CharacterCarousel: React.FC<CharacterCarouselProps> = ({ 
  onSelect, 
  onBack,
  initialCharacterId = 'elf' // Default to elf
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find initial index based on initialCharacterId
  useEffect(() => {
    const index = characters.findIndex(char => char.id === initialCharacterId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [initialCharacterId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const currentCharacter = characters[currentIndex];
  const prevCharacter = characters[(currentIndex - 1 + characters.length) % characters.length];
  const nextCharacter = characters[(currentIndex + 1) % characters.length];

  // Helper function to render character sprite
  const renderSprite = (character: Character) => {
    return typeof character.sprite === 'string' ? (
      <div className="text-5xl">{character.sprite}</div>
    ) : (
      character.sprite
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-purple-700 rounded-t-xl p-4 text-center font-bold text-2xl border-4 border-yellow-400">
          CHARACTER SELECTION
        </div>
        
        {/* Main selection area */}
        <div className="bg-amber-700 p-8 relative border-l-4 border-r-4 border-yellow-400">
          {/* Character navigation */}
          <div className="flex items-center justify-between">
            {/* Left arrow */}
            <button 
              onClick={handlePrev}
              className="w-20 h-20 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transform -translate-x-4 border-4 border-yellow-400"
            >
              <ArrowLeft size={40} className="text-white" />
            </button>
            
            {/* Character display area */}
            <div className="flex items-center justify-center">
              {/* Previous character (dimmed) */}
              <div className="w-16 h-16 relative opacity-40 transform -translate-x-6">
                {renderSprite(prevCharacter)}
                <p className="text-xs absolute bottom-0 w-full text-center">{prevCharacter.name}</p>
              </div>
              
              {/* Current character (highlighted) */}
              <div className="w-48 h-48 bg-amber-600 rounded-xl flex flex-col items-center justify-center border-4 border-yellow-400 relative">
                <div className="mb-4">
                  {typeof currentCharacter.sprite === 'string' ? (
                    <div className="text-8xl">{currentCharacter.sprite}</div>
                  ) : (
                    React.cloneElement(currentCharacter.sprite as React.ReactElement, { width: 80, height: 80 })
                  )}
                </div>
                <h2 className="text-2xl font-bold absolute top-2">{currentCharacter.name}</h2>
              </div>
              
              {/* Next character (dimmed) */}
              <div className="w-16 h-16 relative opacity-40 transform translate-x-6">
                {renderSprite(nextCharacter)}
                <p className="text-xs absolute bottom-0 w-full text-center">{nextCharacter.name}</p>
              </div>
            </div>
            
            {/* Right arrow */}
            <button 
              onClick={handleNext}
              className="w-20 h-20 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transform translate-x-4 border-4 border-yellow-400"
            >
              <ArrowRight size={40} className="text-white" />
            </button>
          </div>
        </div>
        
        {/* Bottom buttons */}
        <div className="flex items-center justify-between bg-amber-700 rounded-b-xl p-4 border-l-4 border-r-4 border-b-4 border-yellow-400">
          <button 
            onClick={onBack}
            className="bg-purple-700 hover:bg-purple-600 px-10 py-3 rounded-xl font-bold text-xl border-4 border-yellow-400"
          >
            BACK
          </button>
          
          <button 
            onClick={() => onSelect(currentCharacter.id)}
            className="bg-purple-700 hover:bg-purple-600 px-10 py-3 rounded-xl font-bold text-xl border-4 border-yellow-400"
          >
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCarousel; 