import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Code, Info, Play, Trophy } from 'lucide-react';
import GauntletLevelCarousel from './GauntletLevelCarousel';
import { GameGrid } from './GameGrid';
import babylon from '../maps/babylon'; // Using as a placeholder level

interface GauntletArcadeModeProps {
  onBack: () => void;
}

const GauntletArcadeMode: React.FC<GauntletArcadeModeProps> = ({ onBack }) => {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'details'>('browse');

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    setActiveTab('details');
  };

  const handleStartLevel = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <button 
            onClick={() => setIsPlaying(false)} 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Level Selection</span>
          </button>
        </div>
        <GameGrid level={babylon} /> {/* Using babylon as placeholder for now */}
      </div>
    );
  }

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
            <span>Back to Gauntlet Selection</span>
          </button>
          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'browse' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Browse Levels
            </button>
            {selectedLevelId && (
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  activeTab === 'details' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Info className="w-4 h-4 mr-2" />
                Level Details
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            Gauntlet Arcade
          </h1>
          <p className="text-xl text-gray-400 mt-2">
            {selectedLevelId && activeTab === 'details' 
              ? `Level ${selectedLevelId.split('-').pop()} Details` 
              : '100 Epic Levels + Bonus Maps'
            }
          </p>
        </div>

        {activeTab === 'browse' && (
          <GauntletLevelCarousel onSelectLevel={handleSelectLevel} />
        )}

        {activeTab === 'details' && selectedLevelId && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Level preview */}
              <div className="h-64 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                <span className="text-9xl font-bold text-white opacity-20">
                  {selectedLevelId.split('-').pop()}
                </span>
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleStartLevel}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-lg text-white font-bold flex items-center hover:from-green-600 hover:to-emerald-700 transition-colors shadow-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Level
                  </button>
                </div>
              </div>
              
              {/* Level details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Level {selectedLevelId.split('-').pop()}</h2>
                  <div className="flex space-x-4 mb-4">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                      Medium
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      20×20
                    </span>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                      Puzzle
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    This challenging level will test your ability to navigate through a complex maze while 
                    collecting gems and avoiding enemies. You'll need to use loops and conditionals to solve 
                    this puzzle efficiently.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      Objectives
                    </h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Collect all 10 gems</li>
                      <li>• Find the hidden key</li>
                      <li>• Reach the exit door</li>
                      <li>• Complete within 30 moves</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-blue-400" />
                      Available Commands
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div>• moveRight()</div>
                      <div>• moveLeft()</div>
                      <div>• moveUp()</div>
                      <div>• moveDown()</div>
                      <div>• collectItem()</div>
                      <div>• useDoorKey()</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Level Record Holders</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">JS</div>
                        <span>John Smith</span>
                      </div>
                      <div className="text-green-400">25 moves</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">LK</div>
                        <span>Lisa Kim</span>
                      </div>
                      <div className="text-green-400">28 moves</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-2">RJ</div>
                        <span>Ray Johnson</span>
                      </div>
                      <div className="text-green-400">30 moves</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GauntletArcadeMode; 