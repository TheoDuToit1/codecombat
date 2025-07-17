import React from 'react';
import { Character } from '../types/game';
import { Heart, Star, Key, Trophy, Target, Code } from 'lucide-react';

interface GameStatsProps {
  character: Character;
  level: number;
  totalLevels: number;
  moves?: number;
  score: number;
  objective: string;
}

export const GameStats: React.FC<GameStatsProps> = ({
  character,
  level,
  totalLevels,
  moves = 0,
  score,
  objective
}) => {
  const healthPercentage = (character.health / character.maxHealth) * 100;
  
  return (
    <div className="space-y-4">
      {/* Level Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Level {level}</h2>
            <p className="text-indigo-100">of {totalLevels}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Trophy className="w-5 h-5" />
              <span className="text-xl font-bold">{score}</span>
            </div>
            <p className="text-indigo-100 text-sm">Score</p>
          </div>
        </div>
      </div>

      {/* Character Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-700">Health</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                healthPercentage > 60 ? 'bg-green-500' : 
                healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{character.health}/{character.maxHealth}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-700">Moves</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{moves}</div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-amber-200">
        <div className="flex items-center space-x-2 mb-3">
          <Key className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-gray-700">Inventory</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-xl">💎</span>
            <span className="font-medium">{character.gems}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xl">🗝️</span>
            <span className={`font-medium ${character.hasKey ? 'text-green-600' : 'text-gray-400'}`}>
              {character.hasKey ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Bracket Notation Help */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Code className="w-5 h-5" />
          <span className="font-semibold">Bracket Notation</span>
        </div>
        <div className="space-y-1 text-sm text-cyan-100">
          <div className="font-mono">yourName.moveRight(3)</div>
          <div className="font-mono">yourName.attack[5]</div>
          <div className="text-xs">Repeat commands easily!</div>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Objective</span>
        </div>
        <p className="text-green-100">{objective}</p>
      </div>
    </div>
  );
};