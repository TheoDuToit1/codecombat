import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Layers, Award, Star, Map, UserX } from 'lucide-react';
import { GauntletContainer } from './GauntletContainer';

// Remove placeholder components and use the real ones

interface GauntletSelectionScreenProps {
  onBack: () => void;
}

const GauntletSelectionScreen: React.FC<GauntletSelectionScreenProps> = ({
  onBack
}) => {
  const [selectedMode, setSelectedMode] = useState<'arcade' | 'babylon-viewport' | 'babylon-topdown' | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('elf'); // Default to elf for testing
  const [showAdminTools, setShowAdminTools] = useState(false);

  // Handle mode selection
  const handleSelectMode = (mode: 'arcade' | 'babylon-viewport' | 'babylon-topdown') => {
    setSelectedMode(mode);
  };

  // Handle back button from game modes
  const handleBackFromMode = () => {
    setSelectedMode(null);
  };

  // Handle switching between viewport and top-down modes
  const handleSwitchToViewport = () => {
    setSelectedMode('babylon-viewport');
  };

  const handleSwitchToTopDown = () => {
    setSelectedMode('babylon-topdown');
  };

  const toggleAdminTools = () => {
    setShowAdminTools(prev => !prev);
  };
  
  // If a mode is selected, render the appropriate component
  if (selectedMode) {
    switch (selectedMode) {
      case 'arcade':
        return <GauntletContainer onBack={handleBackFromMode} />;
      case 'babylon-viewport':
        return <BabylonViewportMode 
                onBack={handleBackFromMode} 
                selectedCharacter={selectedCharacter}
                onSwitchToTopDown={handleSwitchToTopDown}
              />;
      case 'babylon-topdown':
        return <BabylonTopDownMode 
                onBack={handleBackFromMode}
                selectedCharacter={selectedCharacter}
                onSwitchToViewport={handleSwitchToViewport}
              />;
    }
  }

  // Otherwise, render the selection screen
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8 justify-between">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </button>
          
          {/* Remove Admin Tools button since we're removing that section */}
        </div>

        {/* Remove Admin Tools Section */}

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            The Great Gauntlet
          </h1>
          <p className="text-xl text-gray-400 mt-2">Choose your challenge mode</p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Gauntlet Arcade Mode */}
          <button 
            onClick={() => handleSelectMode('arcade')}
            className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left w-full"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Gauntlet Arcade</h3>
                <p className="text-yellow-200">100 Epic Levels + Bonus Maps</p>
              </div>
            </div>
            <p className="text-gray-200 mb-6">
              Challenge yourself with progressively difficult coding puzzles across 100 
              exciting levels and special bonus maps. Collect gems, defeat enemies, and 
              solve the mysteries of the Gauntlet.
            </p>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-yellow-300">Progressive difficulty</span>
            </div>
          </button>

          {/* Babylon Testing Area */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Babylon Testing Area</h3>
                <p className="text-blue-200">Interactive Map Testing</p>
              </div>
            </div>
            <p className="text-gray-200 mb-6">
              Explore and test the Babylon.js map rendering system with two different view modes.
              Perfect for testing movement, collision, and map interactions.
            </p>

            {/* Babylon Test Mode Options */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleSelectMode('babylon-viewport')}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 transition-all text-left flex items-center space-x-3 w-full"
              >
                <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Viewport Mode</h4>
                  <p className="text-xs text-gray-300">Focused camera following character</p>
                </div>
              </button>

              <button 
                onClick={() => handleSelectMode('babylon-topdown')}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 transition-all text-left flex items-center space-x-3 w-full"
              >
                <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Top-Down Mode</h4>
                  <p className="text-xs text-gray-300">Full overview of entire map</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GauntletSelectionScreen; 