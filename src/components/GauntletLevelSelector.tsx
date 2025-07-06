import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Trophy, Gamepad2 } from 'lucide-react';
import { LevelConfig } from '../types/gauntlet';
import { useNavigate } from 'react-router-dom';

interface GauntletLevelSelectorProps {
  levels: LevelConfig[];
  onSelectLevel: (level: LevelConfig) => void;
  onBack: () => void;
  playerProgress?: {
    completedLevels: string[];
    highScores: Record<string, number>;
  };
}

export const GauntletLevelSelector: React.FC<GauntletLevelSelectorProps> = ({
  levels,
  onSelectLevel,
  onBack,
  playerProgress = { completedLevels: [], highScores: {} }
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  
  const levelsPerPage = 9;
  const totalPages = Math.ceil(levels.length / levelsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    setSelectedLevel(null);
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    setSelectedLevel(null);
  };
  
  const handleSelectLevel = (level: LevelConfig) => {
    console.log("Level selected in GauntletLevelSelector:", level);
    setSelectedLevel(level);
    
    // Force scroll to the details section
    setTimeout(() => {
      const detailsSection = document.getElementById('level-details-section');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handlePlayLevel = (level: LevelConfig) => {
    const levelNumber = parseInt(level.id.split('-').pop() || '0');
    if (levelNumber > 0) {
      // Navigate directly to the level URL
      navigate(`/gauntlet-level/${levelNumber}`);
    } else {
      // Fallback to the old method if we can't extract the level number
      onSelectLevel(level);
    }
  };
  
  const currentLevels = levels.slice(
    currentPage * levelsPerPage,
    (currentPage + 1) * levelsPerPage
  );
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'epic': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Floor name based on level range
  const getFloorName = (levelNumber: number) => {
    if (levelNumber <= 25) return "Dungeon Depths";
    if (levelNumber <= 50) return "Crystal Caverns";
    if (levelNumber <= 75) return "Logic Labyrinth";
    return "Master's Tower";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Selection</span>
          </button>
          <div className="ml-auto flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg ${
                currentPage === 0 ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 bg-gray-800 rounded-lg">
              {currentPage + 1} / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg ${
                currentPage === totalPages - 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            The Great Gauntlet
          </h1>
          <p className="text-xl text-gray-400 mt-2">
            {getFloorName(currentPage * levelsPerPage + 1)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentLevels.map((level) => {
            const levelNumber = parseInt(level.id.split('-').pop() || '0');
            const isCompleted = playerProgress.completedLevels.includes(level.id);
            const highScore = playerProgress.highScores[level.id] || 0;
            
            return (
              <div
                key={level.id}
                className={`bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-blue-500 ${
                  selectedLevel?.id === level.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
                onClick={() => handleSelectLevel(level)}
              >
                <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-900 relative">
                  {/* Level number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white opacity-20">
                      {levelNumber}
                    </span>
                  </div>
                  
                  {/* Completed indicator */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                      <Star className="w-4 h-4 text-white" fill="white" />
                    </div>
                  )}
                  
                  {/* Difficulty badge */}
                  <div className={`absolute bottom-2 right-2 ${getDifficultyColor(level.difficulty)} px-2 py-1 rounded text-xs font-bold`}>
                    {level.difficulty.toUpperCase()}
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-bold"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        console.log("Play overlay button clicked for level:", level);
                        handlePlayLevel(level);
                      }}
                    >
                      <Gamepad2 className="w-5 h-5 mr-2" /> Play Now
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{level.name}</h3>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{level.width}×{level.height}</span>
                    {highScore > 0 && (
                      <span className="flex items-center text-yellow-400">
                        <Trophy className="w-3 h-3 mr-1" /> {highScore}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{level.description || "No description available."}</p>
                  
                  {/* Action buttons */}
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-blue-400 bg-blue-900 bg-opacity-30 px-2 py-1 rounded-full">
                      Click to select
                    </span>
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full flex items-center"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        console.log("Quick play button clicked for level:", level);
                        handlePlayLevel(level);
                      }}
                    >
                      <Gamepad2 className="w-3 h-3 mr-1" /> Play
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Level details and play button */}
        {selectedLevel && (
          <div id="level-details-section" className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Level preview */}
              <div className="h-64 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                <span className="text-9xl font-bold text-white opacity-20">
                  {selectedLevel.id.split('-').pop()}
                </span>
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Play button clicked for level:", selectedLevel);
                      handlePlayLevel(selectedLevel);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-lg text-white font-bold flex items-center hover:from-green-600 hover:to-emerald-700 transition-colors shadow-lg"
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Play Level
                  </button>
                </div>
              </div>
              
              {/* Level details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedLevel.name}</h2>
                  <div className="flex space-x-4 mb-4">
                    <span className={`${getDifficultyColor(selectedLevel.difficulty)} text-white px-3 py-1 rounded-full text-sm`}>
                      {selectedLevel.difficulty.toUpperCase()}
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {selectedLevel.width}×{selectedLevel.height}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {selectedLevel.description || "No description available for this level."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      Objectives
                    </h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• {selectedLevel.objective || "Reach the exit"}</li>
                      {selectedLevel.collectibles?.gems && (
                        <li>• Collect {selectedLevel.collectibles.gems} gems</li>
                      )}
                      {selectedLevel.collectibles?.keys && (
                        <li>• Find {selectedLevel.collectibles.keys} key(s)</li>
                      )}
                      {selectedLevel.timeLimit && (
                        <li>• Complete within {selectedLevel.timeLimit} seconds</li>
                      )}
                    </ul>
                  </div>
                  
                  {selectedLevel.enemies && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <span className="mr-2">👹</span>
                        Enemies
                      </h3>
                      <div className="text-gray-300">
                        <p>{selectedLevel.enemies.count} enemies to defeat</p>
                        <p className="mt-2">Types: {selectedLevel.enemies.types.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {playerProgress.completedLevels.includes(selectedLevel.id) && (
                  <div className="bg-green-900 bg-opacity-30 rounded-lg p-4 border border-green-700">
                    <h3 className="font-semibold flex items-center text-green-400">
                      <Star className="w-5 h-5 mr-2" fill="currentColor" />
                      Level Completed
                    </h3>
                    <div className="mt-2 flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="text-yellow-400">High Score: {playerProgress.highScores[selectedLevel.id] || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 