import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Star, Trophy, Zap, Puzzle, Skull, Clock } from 'lucide-react';
import { LevelConfig } from '../types/XCodeLevelTypes';

interface GauntletLevelCarouselProps {
  onSelectLevel: (levelId: string) => void;
}

// Mock level data
const MOCK_LEVELS: LevelConfig[] = [
  {
    id: 'gauntlet-level-1',
    name: 'Gateway to Adventure',
    description: 'The first level of your journey. Master the basics of movement and simple interactions.',
    difficulty: 'easy',
    width: 16,
    height: 16,
    playerStart: { x: 1, y: 1 },
    tiles: [[]],  // Mock tiles, not used for display
    objective: 'Collect all gems and reach the exit',
    collectibles: {
      gems: 3,
      keys: 1,
      food: 2
    },
    enemies: {
      count: 1,
      positions: [{ x: 10, y: 10 }],
      types: ['basic']
    }
  },
  {
    id: 'gauntlet-level-2',
    name: 'The Puzzling Path',
    description: 'Use your coding skills to navigate a series of challenging puzzles.',
    difficulty: 'easy',
    width: 18,
    height: 18,
    playerStart: { x: 1, y: 1 },
    tiles: [[]],  // Mock tiles, not used for display
    objective: 'Solve the puzzle to unlock the hidden path',
    collectibles: {
      gems: 5,
      keys: 2,
      food: 3
    },
    enemies: {
      count: 2,
      positions: [{ x: 8, y: 8 }, { x: 12, y: 12 }],
      types: ['basic', 'fast']
    }
  },
  {
    id: 'gauntlet-level-3',
    name: 'Enemy Territory',
    description: 'Your first real challenge. Enemies are patrolling the area!',
    difficulty: 'medium',
    width: 20,
    height: 20,
    playerStart: { x: 1, y: 1 },
    tiles: [[]],  // Mock tiles, not used for display
    objective: 'Defeat all enemies and collect the hidden treasure',
    collectibles: {
      gems: 8,
      keys: 1,
      food: 4
    },
    enemies: {
      count: 4,
      positions: [{ x: 5, y: 5 }, { x: 10, y: 10 }, { x: 15, y: 15 }, { x: 8, y: 12 }],
      types: ['basic', 'fast', 'strong', 'basic']
    }
  },
  {
    id: 'gauntlet-level-4',
    name: 'The Labyrinth',
    description: 'A complex maze filled with traps and treasures.',
    difficulty: 'medium',
    width: 22,
    height: 22,
    playerStart: { x: 1, y: 1 },
    tiles: [[]],  // Mock tiles, not used for display
    objective: 'Navigate the labyrinth and find the hidden exit',
    collectibles: {
      gems: 10,
      keys: 3,
      food: 5
    },
    enemies: {
      count: 3,
      positions: [{ x: 7, y: 7 }, { x: 14, y: 14 }, { x: 18, y: 18 }],
      types: ['fast', 'strong', 'boss']
    }
  },
  {
    id: 'gauntlet-level-5',
    name: 'Trial by Fire',
    description: 'The floor is lava! Use your coding skills to navigate safely.',
    difficulty: 'hard',
    width: 24,
    height: 24,
    playerStart: { x: 1, y: 1 },
    tiles: [[]],  // Mock tiles, not used for display
    objective: 'Cross the lava field without getting burned',
    collectibles: {
      gems: 15,
      keys: 2,
      food: 6
    },
    enemies: {
      count: 5,
      positions: [
        { x: 6, y: 6 }, 
        { x: 12, y: 12 }, 
        { x: 18, y: 18 }, 
        { x: 8, y: 16 },
        { x: 16, y: 8 }
      ],
      types: ['fire', 'fire', 'fire', 'fire', 'boss']
    }
  }
];

const GauntletLevelCarousel: React.FC<GauntletLevelCarouselProps> = ({ onSelectLevel }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 3;
  const totalPages = Math.ceil(MOCK_LEVELS.length / levelsPerPage);
  
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get the levels for the current page
  const currentLevels = MOCK_LEVELS.slice(
    currentPage * levelsPerPage, 
    (currentPage + 1) * levelsPerPage
  );
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'epic': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      case 'epic': return 4;
      default: return 1;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Select a Level</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevPage}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            disabled={currentPage === 0}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white">
            {currentPage + 1} / {totalPages}
          </span>
          <button 
            onClick={handleNextPage}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            disabled={currentPage === totalPages - 1}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {currentLevels.map((level) => (
          <div 
            key={level.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => onSelectLevel(level.id)}
          >
            {/* Level preview image (mockup) */}
            <div className="h-40 bg-gradient-to-br from-purple-900 to-blue-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-white opacity-50">
                  {level.id.split('-').pop()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 p-2">
                <div className={`${getDifficultyColor(level.difficulty)} px-2 py-1 rounded text-xs font-medium text-white`}>
                  {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                </div>
              </div>
            </div>
            
            {/* Level details */}
            <div className="p-4">
              <h3 className="font-bold text-xl mb-1 text-white">{level.name}</h3>
              
              <div className="flex mb-2">
                {[...Array(getDifficultyStars(level.difficulty))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{level.description}</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Gems: {level.collectibles?.gems || 0}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Skull className="w-4 h-4 mr-1 text-red-500" />
                  <span>Enemies: {level.enemies?.count || 0}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Puzzle className="w-4 h-4 mr-1 text-blue-500" />
                  <span>{level.width}x{level.height}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Zap className="w-4 h-4 mr-1 text-purple-500" />
                  <span>XP: {100 + parseInt(level.id.split('-').pop() || '0') * 50}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Level selection pagination (mobile) */}
      <div className="mt-6 flex justify-center lg:hidden">
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                i === currentPage ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GauntletLevelCarousel; 