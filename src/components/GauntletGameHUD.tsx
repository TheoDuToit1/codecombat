import React, { ReactNode } from 'react';
import { Heart, Star, Key, Trophy, Target, Clock, Skull, Pizza } from 'lucide-react';
import { MinimapOverlay } from './MinimapOverlay';
import { LevelConfig } from '../types/XCodeLevelTypes';
import { Position } from '../types/game';

interface GauntletGameHUDProps {
  // Player stats
  playerName: string;
  playerClass: 'warrior' | 'assassin' | 'wizard' | 'elf';
  health: number;
  maxHealth: number;
  food: number;
  maxFood: number;
  score: number;
  keys: number;
  potions: number;
  
  // Level info
  level: number;
  totalLevels: number;
  objective: string;
  timeRemaining?: number;
  
  // Map info
  levelConfig: LevelConfig;
  playerPosition: Position;
  
  // UI controls
  showMinimap: boolean;
  zoomedIn?: boolean;
  onToggleZoom?: () => void;
  
  // Children to render in the main area (GameGrid)
  children?: ReactNode;
}

export const GauntletGameHUD: React.FC<GauntletGameHUDProps> = ({
  // Player stats
  playerName,
  playerClass,
  health,
  maxHealth,
  food,
  maxFood,
  score,
  keys,
  potions,
  
  // Level info
  level,
  totalLevels,
  objective,
  timeRemaining,
  
  // Map info
  levelConfig,
  playerPosition,
  
  // UI controls
  showMinimap,
  zoomedIn,
  onToggleZoom,
  
  // Children
  children
}) => {
  const healthPercentage = (health / maxHealth) * 100;
  const foodPercentage = (food / maxFood) * 100;
  
  // Gauntlet-style warnings
  const healthWarning = health < maxHealth * 0.3;
  const foodWarning = food < maxFood * 0.3;
  
  // Character class icon
  const getClassIcon = () => {
    switch (playerClass) {
      case 'warrior': return '⚔️';
      case 'assassin': return '🗡️';
      case 'wizard': return '🧙‍♂️';
      case 'elf': return '🏹';
      default: return '👤';
    }
  };
  
  // Character class color
  const getClassColor = () => {
    switch (playerClass) {
      case 'warrior': return 'from-red-600 to-red-800';
      case 'assassin': return 'from-purple-600 to-purple-800';
      case 'wizard': return 'from-blue-600 to-blue-800';
      case 'elf': return 'from-green-600 to-green-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="flex h-full">
      {/* Main game area - takes up most of the screen */}
      <div className="flex-grow relative">
        {/* This is where the actual game grid will be rendered */}
        {children}
        
        {/* Minimap in top-right corner */}
        {showMinimap && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <MinimapOverlay 
              level={levelConfig} 
              playerPos={playerPosition} 
              show={showMinimap} 
            />
          </div>
        )}
        
        {/* Status messages can appear here */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold text-center">
          {/* Status messages will be injected here */}
        </div>
      </div>
      
      {/* Side panel for HUD elements */}
      <div className="w-64 bg-gray-900 p-4 space-y-4 overflow-y-auto">
        {/* Level Info - Gauntlet arcade style */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-xl shadow-lg border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Level {level}</h2>
              <p className="text-yellow-200">of {totalLevels}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 justify-end">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-xl font-bold text-yellow-400">{score}</span>
              </div>
              <p className="text-yellow-200 text-sm">Score</p>
            </div>
          </div>
        </div>

        {/* Character Class - Gauntlet style */}
        <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-blue-600">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getClassColor()} flex items-center justify-center text-white text-2xl`}>
              {getClassIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400">{playerName}</h3>
              <p className="text-sm text-blue-300 capitalize">{playerClass}</p>
            </div>
          </div>
        </div>

        {/* Health Meter */}
        <div className={`bg-black p-4 rounded-xl shadow-lg border-2 ${healthWarning ? 'border-red-600 animate-pulse' : 'border-red-400'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Heart className={`w-5 h-5 ${healthWarning ? 'text-red-600 animate-pulse' : 'text-red-500'}`} />
            <span className={`font-semibold ${healthWarning ? 'text-red-600' : 'text-red-400'}`}>Health</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                healthPercentage > 60 ? 'bg-green-500' : 
                healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className={`text-sm ${healthWarning ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
              {health}/{maxHealth}
            </p>
            {healthWarning && (
              <p className="text-sm text-red-600 font-bold animate-pulse">WARNING!</p>
            )}
          </div>
        </div>

        {/* Food Meter */}
        <div className={`bg-black p-4 rounded-xl shadow-lg border-2 ${foodWarning ? 'border-green-600 animate-pulse' : 'border-green-400'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Pizza className={`w-5 h-5 ${foodWarning ? 'text-green-600 animate-pulse' : 'text-green-500'}`} />
            <span className={`font-semibold ${foodWarning ? 'text-green-600' : 'text-green-400'}`}>Food</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                foodPercentage > 60 ? 'bg-green-500' : 
                foodPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${foodPercentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className={`text-sm ${foodWarning ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
              {food}/{maxFood}
            </p>
            {foodWarning && (
              <p className="text-sm text-green-600 font-bold animate-pulse">NEED FOOD!</p>
            )}
          </div>
        </div>

        {/* Inventory - Gauntlet style */}
        <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-amber-600">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-400">Inventory</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
              <span className="text-xl text-amber-400">🗝️</span>
              <span className="text-xs text-gray-300 mt-1">x{keys}</span>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
              <span className="text-xl text-blue-400">🧪</span>
              <span className="text-xs text-gray-300 mt-1">x{potions}</span>
            </div>
            
            {timeRemaining !== undefined && (
              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                <span className="text-xl text-purple-400">⏱️</span>
                <span className="text-xs text-gray-300 mt-1">{timeRemaining}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Objective - Gauntlet style */}
        <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-purple-600">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-purple-400">Mission</span>
          </div>
          <p className="text-purple-200">{objective}</p>
        </div>

        {/* Controls - only show if onToggleZoom is provided */}
        {onToggleZoom && (
          <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-blue-600">
            <button 
              onClick={onToggleZoom}
              className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              {zoomedIn ? '🔎 Zoom Out' : '🔍 Zoom In'}
            </button>
          </div>
        )}

        {/* Gauntlet Tips */}
        <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <Skull className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-400">Gauntlet Tips</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Health decreases over time - find food!</li>
            <li>• Destroy generators to stop enemies</li>
            <li>• Keys unlock doors to new areas</li>
            <li>• Potions grant temporary powers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 