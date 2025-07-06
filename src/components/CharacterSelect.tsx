import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCharacterAnimationsByClass } from '../utils/characterAnimationSaver';
import { AnimatedCharacter } from './AnimatedCharacter';
import { analyzeAnimationStructure } from '../utils/debugHelper';
import { adaptSupabaseAnimation } from '../utils/animationAdapter';

// Character class definitions with stats and icons
const characterClasses = [
  {
    id: 'warrior',
    name: 'WARRIOR',
    description: 'Master of Combat',
    icon: (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6V12C4 15.31 7.58 20 12 22C16.42 20 20 15.31 20 12V6L12 2Z" 
          stroke="#00FFBB" strokeWidth="2" fill="#003344" />
        <path d="M8 11L11 14L16 9" stroke="#00FFBB" strokeWidth="2" />
      </svg>
    ),
    stats: {
      damage: 80,
      speed: 50,
      accuracy: 60,
      armor: 90
    },
    color: '#9B2C2C',
    image: '🛡️'
  },
  {
    id: 'wizard',
    name: 'WIZARD',
    description: 'Master of Spells',
    icon: (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.5 9H21L15 13.5L17 21L12 16L7 21L9 13.5L3 9H10.5L12 2Z" 
          stroke="#00FFBB" strokeWidth="2" fill="#003344" />
      </svg>
    ),
    stats: {
      damage: 90,
      speed: 40,
      accuracy: 85,
      armor: 30
    },
    color: '#2C5282',
    image: '🧙‍♂️'
  },
  {
    id: 'elf',
    name: 'ELF',
    description: 'Master of Archery',
    icon: (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
          stroke="#00FFBB" strokeWidth="2" fill="#003344" />
        <path d="M16 10L12 6L8 10" stroke="#00FFBB" strokeWidth="2" />
        <path d="M12 6V16" stroke="#00FFBB" strokeWidth="2" />
        <path d="M8 14L12 18L16 14" stroke="#00FFBB" strokeWidth="2" />
      </svg>
    ),
    stats: {
      damage: 70,
      speed: 90,
      accuracy: 95,
      armor: 40
    },
    color: '#276749',
    image: '🏹'
  },
  {
    id: 'assassin',
    name: 'ASSASSIN',
    description: 'Master of Stealth',
    icon: (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 5L5 19" stroke="#00FFBB" strokeWidth="2" />
        <path d="M12 12L19 19" stroke="#00FFBB" strokeWidth="2" />
        <path d="M5 5L12 12" stroke="#00FFBB" strokeWidth="2" />
        <circle cx="5" cy="5" r="2" fill="#003344" stroke="#00FFBB" />
        <circle cx="19" cy="19" r="2" fill="#003344" stroke="#00FFBB" />
      </svg>
    ),
    stats: {
      damage: 85,
      speed: 80,
      accuracy: 75,
      armor: 45
    },
    color: '#553C9A',
    image: '🗡️'
  }
];

interface CharacterSelectProps {
  onSelect: (id: string) => void;
  onBack?: () => void; // Optional back handler
}

const CharacterSelect = ({ onSelect, onBack }: CharacterSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  // Preselect the elf character when component mounts
  useEffect(() => {
    setSelected('elf');
  }, []);

  const selectedCharacter = characterClasses.find(char => char.id === selected) || characterClasses[0];

  // Progress to next screen with the selected character
  const handleConfirmSelection = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  // Navigate to previous/next character
  const handlePrevCharacter = () => {
    const currentIndex = characterClasses.findIndex(char => char.id === selected);
    const prevIndex = (currentIndex - 1 + characterClasses.length) % characterClasses.length;
    setSelected(characterClasses[prevIndex].id);
  };

  const handleNextCharacter = () => {
    const currentIndex = characterClasses.findIndex(char => char.id === selected);
    const nextIndex = (currentIndex + 1) % characterClasses.length;
    setSelected(characterClasses[nextIndex].id);
  };

  // Render a stat bar
  const renderStatBar = (label: string, value: number) => (
    <div className="mb-4">
      <div className="uppercase text-xs tracking-wider mb-1 text-gray-400">{label}</div>
      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 to-cyan-500" 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Back to Main button */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={onBack} 
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Main
          </button>
        </div>


        
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Character Display */}
            <div className="p-8 flex flex-col items-center justify-center relative min-h-[500px]" 
                 style={{ 
                   background: `radial-gradient(circle at center, rgba(0,60,90,0.4) 0%, rgba(8,20,40,0) 70%)`,
                 }}>
              {/* Character Navigation Arrows */}

              
              <div className="absolute right-4 inset-y-0 flex items-center">
                <button 
                  onClick={handleNextCharacter}
                  className="w-10 h-10 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-80 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
              
              {/* Character Model */}
              <motion.div
                key={selectedCharacter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-56 h-56 rounded-full bg-cyan-900 bg-opacity-10 border-2 border-cyan-800 border-opacity-20 flex items-center justify-center mb-6">
                  <div className="text-9xl">{selectedCharacter.image}</div>
                </div>
                
                {/* Glowing platform beneath character */}
                <div className="w-40 h-4 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 blur-md rounded-full" />
              </motion.div>
            </div>
            
            {/* Right side - Character Info */}
            <div className="p-8 bg-gray-900">
              <div className="flex items-start mb-6">
                <div className="mr-4">
                  {selectedCharacter.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedCharacter.name}</h2>
                  <p className="text-gray-400">{selectedCharacter.description}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Stats */}
                <div className="mb-8">
                  {renderStatBar('Damage', selectedCharacter.stats.damage)}
                  {renderStatBar('Speed', selectedCharacter.stats.speed)}
                  {renderStatBar('Accuracy', selectedCharacter.stats.accuracy)}
                  {renderStatBar('Armor', selectedCharacter.stats.armor)}
                </div>
                
                {/* Character Description */}
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-gray-300 mb-8">
                  <p className="mb-2">
                    The {selectedCharacter.name.toLowerCase()} specializes in {selectedCharacter.id === 'warrior' 
                      ? 'powerful melee attacks and defensive techniques'
                      : selectedCharacter.id === 'wizard'
                      ? 'devastating magical abilities and ranged attacks'
                      : selectedCharacter.id === 'elf'
                      ? 'precise archery and swift movement'
                      : 'quick strikes and stealth tactics'}.
                  </p>
                  <p>
                    {selectedCharacter.id === 'warrior' 
                      ? 'With high armor and damage, warriors excel at front-line combat.'
                      : selectedCharacter.id === 'wizard'
                      ? 'Masters of the arcane, wizards can devastate enemies from afar.'
                      : selectedCharacter.id === 'elf'
                      ? 'Elves combine speed and precision to outmaneuver their foes.'
                      : 'Assassins strike from the shadows, dealing massive critical damage.'}
                  </p>
                </div>
                
                {/* Select Button */}
                <button
                  onClick={handleConfirmSelection}
                  disabled={!selected}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all shadow-lg disabled:opacity-50"
                >
                  SELECT CHARACTER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect; 