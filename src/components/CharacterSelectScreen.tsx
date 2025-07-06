import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHARACTER_CLASSES, CharacterClass, CharacterConfig } from '../data/classes';

interface CharacterSelectProps {
  onSelect: (character: CharacterConfig) => void;
}

const CharacterSelectScreen: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<CharacterConfig | null>(null);

  // Preselect the elf character when component mounts
  useEffect(() => {
    const elfCharacter = Object.values(CHARACTER_CLASSES).find(char => char.spriteKey === 'elf');
    if (elfCharacter) {
      setSelected(elfCharacter);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Choose Your Champion</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Object.values(CHARACTER_CLASSES).map((data: CharacterConfig) => (
          <motion.div
            key={data.name}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer ${selected?.name === data.name ? 'ring-4 ring-indigo-500' : ''}`}
            onClick={() => setSelected(data)}
          >
            <div className="rounded-2xl shadow-lg bg-white flex flex-col items-center p-4">
              <h2 className="text-xl font-semibold mb-1">{data.name}</h2>
              <ul className="text-sm text-gray-600">
                <li><strong>Speed:</strong> {data.speed}</li>
                <li><strong>Health:</strong> {data.health}</li>
                <li><strong>Attack Type:</strong> {data.attackType}</li>
                <li><strong>Sprite:</strong> {data.spriteKey}</li>
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        className="mt-8 px-6 py-3 text-lg bg-blue-600 text-white rounded-xl disabled:bg-gray-400"
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
      >
        Start Game
      </button>
    </div>
  );
};

export default CharacterSelectScreen; 