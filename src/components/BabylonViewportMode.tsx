import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crosshair, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { GameGrid } from './GameGrid';
import { LevelConfig } from '../types/XCodeLevelTypes';
import babylon from '../maps/babylon';
import labyrinth from '../maps/labyrinth';
import { Link } from 'react-router-dom';
import { loadCharacterAnimations } from '../utils/loadCharacterAnimations';
import { getCharacterAnimationsByClass } from '../utils/characterAnimationSaver';
import { createClient } from '@supabase/supabase-js';

interface BabylonViewportModeProps {
  onBack?: () => void;
  selectedCharacter?: string | null;
  onSwitchToTopDown?: () => void;
  selectedLevel?: LevelConfig;
  onComplete?: () => void;
}

// Player data interface
interface PlayerData {
  id: string;
  name: string;
  character_class: string;
  position_x: number;
  position_y: number;
  health: number;
  experience: number;
  level: number;
  created_at?: string;
  updated_at?: string;
}

const BabylonViewportMode: React.FC<BabylonViewportModeProps> = ({ 
  onBack,
  selectedCharacter,
  onSwitchToTopDown,
  selectedLevel,
  onComplete
}) => {
  const level = selectedLevel || babylon;
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [showMinimap, setShowMinimap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [stokkieSprites, setStokkieSprites] = useState<any>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [playerPosition, setPlayerPosition] = useState<{x: number, y: number} | null>(null);

  // Supabase configuration
  const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Load default warrior animations for the player as fallback
  const defaultPlayerSprites = loadCharacterAnimations('warrior');
  
  // Create a simple animation structure that will work with the game grid
  const createBasicAnimation = (color = '#3498db') => {
    // Create a data URI for a colored square
    const dataUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="${color.replace('#', '%23')}" /></svg>`;
    
    // Return animation structure with this image for all directions
    return {
      idle: {
        down: [dataUri],
        up: [dataUri],
        left: [dataUri],
        right: [dataUri]
      },
      walk: {
        down: [dataUri],
        up: [dataUri],
        left: [dataUri],
        right: [dataUri]
      }
    };
  };
  
  // Fetch player data from Supabase database
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        console.log('Fetching player data from Supabase...');
        
        // Query the players table for stokkie
        const { data, error } = await supabase
          .from('character_animations')
          .select('*')
          .eq('id', '968de10c-a304-42fa-93ee-41fef72400c7')
          .single();
        
        if (error) {
          console.error('Error fetching player data:', error);
          setLoadingError(`Error fetching player data: ${error.message}`);
          return;
        }
        
        if (data) {
          console.log('Found player data:', data);
          setPlayerData(data);
          
          // Set default position if not available in database
          const position = {
            x: data.position_x || 5,
            y: data.position_y || 5
          };
          
          setPlayerPosition(position);
          console.log('Player position set to:', position);
        } else {
          console.log('No player data found');
          setLoadingError('No player data found');
        }
      } catch (error: any) {
        console.error('Error in fetchPlayerData:', error);
        setLoadingError(`Error fetching player data: ${error.message || 'Unknown error'}`);
      }
    };
    
    fetchPlayerData();
  }, []);
  
  // Load stokkie animations from the database
  useEffect(() => {
    console.log('Attempting to load stokkie animations...');
    
    // Create a simple purple square animation as last resort fallback
    const fallbackAnimation = createBasicAnimation('#9b59b6'); // Purple for stokkie
    
    // Try to load stokkie animations from Supabase
    getCharacterAnimationsByClass('stokkie')
      .then(anims => {
        console.log('Loaded stokkie animations from Supabase:', anims);
        
        if (anims && anims.length > 0) {
          console.log('Found stokkie animation in database:', anims[0].name);
          
          try {
            // Create a simple animation structure if the database one isn't properly formatted
            const adaptedAnimation = adaptSupabaseAnimation(anims[0]);
            setStokkieSprites(adaptedAnimation);
            setLoadingError(null);
          } catch (error) {
            console.error('Error adapting animation:', error);
            setStokkieSprites(fallbackAnimation);
            setLoadingError('Error adapting animation format');
          }
        }
        else {
          console.log('No stokkie animations found in database, using fallback');
          setStokkieSprites(fallbackAnimation);
          setLoadingError('No stokkie animations found in database');
        }
      })
      .catch(error => {
        console.error('Error loading stokkie animations:', error);
        setStokkieSprites(fallbackAnimation);
        setLoadingError(`Error loading animations: ${error.message || 'Unknown error'}`);
      });
  }, []);
  
  // Helper function to adapt Supabase animation data to the format expected by GameGrid
  const adaptSupabaseAnimation = (animation: any) => {
    console.log('Adapting animation:', animation);
    
    // Check if the animation has the expected structure
    const hasIdle = animation.Idle || animation.idle;
    const hasWalk = animation.Walk || animation.walk;
    
    if (hasIdle && hasWalk) {
      // Animation already has the expected structure
      return {
        idle: animation.Idle || animation.idle,
        walk: animation.Walk || animation.walk
      };
    }
    
    // If we have an animations field with the expected structure
    if (animation.animations && typeof animation.animations === 'object') {
      const anims = animation.animations;
      
      if (anims.idle && anims.walk) {
        return {
          idle: anims.idle,
          walk: anims.walk
        };
      }
    }
    
    // Create a simple colored square animation as fallback
    console.warn('Animation did not have expected structure, creating fallback');
    return createBasicAnimation('#9b59b6'); // Purple for stokkie
  };
  
  // Reset the level
  const resetLevel = () => {
    setMoveCount(0);
    setGemsCollected(0);
  };

  // Increment move count
  const incrementMoveCount = () => {
    setMoveCount(prev => prev + 1);
  };

  // Collect gem
  const collectGem = (itemType: string) => {
    if (itemType === 'gem') {
      setGemsCollected(prev => prev + 1);
    }
  };

  // Update player position in database when it changes
  const updatePlayerPosition = async (x: number, y: number) => {
    if (!playerData) return;
    
    try {
      const { error } = await supabase
        .from('character_animations')
        .update({ position_x: x, position_y: y })
        .eq('id', playerData.id);
      
      if (error) {
        console.error('Error updating player position:', error);
      } else {
        console.log(`Updated player position to (${x}, ${y})`);
        setPlayerPosition({ x, y });
      }
    } catch (error) {
      console.error('Failed to update player position:', error);
    }
  };

  // Handle player movement
  const handlePlayerMove = () => {
    incrementMoveCount();
    
    // Since we don't have position parameters, we'll use a random nearby position
    // In a real implementation, you would get the position from the game state
    const newX = Math.floor(Math.random() * 10) + 1;
    const newY = Math.floor(Math.random() * 10) + 1;
    updatePlayerPosition(newX, newY);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          {onBack ? (
          <button 
            onClick={onBack} 
            className="flex items-center text-gray-300 hover:text-white transition-colors mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>
          ) : (
            <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors mr-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </Link>
          )}
          <h1 className="text-xl font-bold text-white">{level.name} - Viewport Mode</h1>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showMinimap}
              onChange={() => setShowMinimap(!showMinimap)}
              className="mr-2 h-4 w-4"
            />
            <span>Show Minimap</span>
          </label>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1">
        <div className="flex-1 bg-black">
        <GameGrid 
          level={level} 
          viewMode="viewport" 
          zoomLevel={zoomLevel}
            onMove={handlePlayerMove}
          onCollectItem={collectGem}
          showMinimap={showMinimap}
            character="stokkie"
            sprites={stokkieSprites || defaultPlayerSprites}
            characterName="stokkie"
            initialPosition={playerPosition || undefined}
        />
        </div>

        {/* Info Panel */}
        {showInfoPanel && (
          <div className="w-80 bg-gray-800 p-4 flex flex-col border-l border-gray-700 h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-medium text-white">Map Information</h2>
                {onSwitchToTopDown && (
              <button 
                    onClick={onSwitchToTopDown}
                    className="ml-3 text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition-colors"
              >
                    Jump to Top-Down
              </button>
                )}
              </div>
              <button onClick={() => setShowInfoPanel(false)} className="text-gray-400 hover:text-white">
                {/* X icon would be here */}
              </button>
            </div>

            {/* Character Info */}
            <div className="mb-6 bg-gray-700 p-3 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Character</h3>
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="text-white">Stokkie</span>
              </div>
              <div className="flex justify-between">
                <span>Class:</span>
                <span className="text-white">{playerData?.character_class || 'Elf'}</span>
              </div>
              {playerPosition && (
                <div className="flex justify-between mt-1">
                  <span>Position:</span>
                  <span className="text-white">({playerPosition.x}, {playerPosition.y})</span>
                </div>
              )}
              {loadingError && (
                <div className="mt-2 text-xs text-orange-400">
                  {loadingError}
                </div>
              )}
            </div>
            
            <div className="space-y-6 text-sm text-gray-400 flex-1 overflow-y-auto">
              <div>
                <h3 className="font-medium text-blue-400 mb-2">Map Details</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="text-white">{level.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-white">{level.width} × {level.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="text-white capitalize">{level.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collectibles:</span>
                    <span className="text-white">{level.collectibles?.gems || 0} scrolls, {level.collectibles?.keys || 0} keys</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-400 mb-2">Controls</h3>
                <div className="space-y-1">
                  <p>Use <span className="text-white">arrow keys</span> or <span className="text-white">WASD</span> to move</p>
                  <p>Press <span className="text-white">space</span> to interact</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-400 mb-2">Viewport Mode</h3>
                <p className="text-gray-300">In viewport mode, the camera follows Stokkie as they explore the map. The view is centered on the character at all times.</p>
              </div>
                </div>
            
            {/* Stats */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Moves:</span>
                    <span className="text-white">{moveCount}</span>
                  </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gems collected:</span>
                    <span className="text-white">{gemsCollected}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BabylonViewportMode; 