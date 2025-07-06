import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CharacterSelect from './CharacterSelect';
import { GauntletLevelSelector } from './GauntletLevelSelector';
import { GauntletGame } from './GauntletGame';
import { LevelConfig } from '../types/gauntlet';
import { supabase } from '../lib/supabase';
import babylonTestLevel from '../maps/babylonTestLevel'; // Using as a placeholder until we have real levels

// Views in the Gauntlet flow
type GauntletView = 'character-select' | 'level-select' | 'gameplay';

interface GauntletContainerProps {
  onBack: () => void; // Back to main menu/dashboard
}

export const GauntletContainer: React.FC<GauntletContainerProps> = ({ onBack }) => {
  // Get level number from URL if available
  const { levelNumber } = useParams<{ levelNumber?: string }>();
  const navigate = useNavigate();
  
  // Current view in the flow - start directly at level-select for testing
  const [currentView, setCurrentView] = useState<GauntletView>(levelNumber ? 'gameplay' : 'level-select');
  
  // Selected character and level
  const [selectedCharacter, setSelectedCharacter] = useState<string>('warrior'); // Default to warrior for testing
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  
  // Player name (could be customizable in the future)
  const [playerName, setPlayerName] = useState('Hero');
  
  // Player progress (would be loaded from storage/database in a real app)
  const [playerProgress, setPlayerProgress] = useState({
    completedLevels: [] as string[],
    highScores: {} as Record<string, number>
  });
  
  // Mock levels for now - in a real app, these would be loaded from a database or file
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch a specific level from Supabase if levelNumber is provided
  useEffect(() => {
    if (levelNumber) {
      const fetchLevel = async () => {
        setIsLoading(true);
        try {
          // Convert level number to integer
          const levelNum = parseInt(levelNumber);
          if (isNaN(levelNum)) {
            throw new Error('Invalid level number');
          }
          
          // Fetch level from supabase
          const { data, error } = await supabase
            .from('gauntlet_levels')
            .select('*')
            .eq('level_number', levelNum)
            .single();
          
          if (error) throw error;
          if (!data) throw new Error('Level not found');
          
          console.log('Fetched level data:', data);
          
          // Find a good player start position in the grid
          let playerStart = { x: 1, y: 1 }; // Default start position
          if (data.grid_data && Array.isArray(data.grid_data)) {
            for (let y = 0; y < data.grid_data.length; y++) {
              for (let x = 0; x < data.grid_data[y].length; x++) {
                if (data.grid_data[y][x] === 'EN') { // Entrance tile is the player start position
                  playerStart = { x, y };
                  console.log(`Found entrance (EN) at position (${x}, ${y}), setting as player start`);
                  break;
                }
              }
            }
          }

          // Convert the data to a LevelConfig format
          const levelConfig: LevelConfig = {
            id: data.id,
            name: data.name,
            description: data.description || '',
            difficulty: data.difficulty || 'medium',
            width: data.width,
            height: data.height,
            playerStart: playerStart,
            tiles: data.grid_data || [], // Pass the grid_data directly to be processed by GameGrid
            // Add any additional properties needed
            collectibles: {
              gems: 5,
              keys: 1,
              food: 3
            }
          };
          
          console.log('Converted to level config:', levelConfig);
          setSelectedLevel(levelConfig);
          setIsLoading(false);
        } catch (err: any) {
          console.error('Error fetching level:', err);
          setError(err.message || 'Failed to load level');
          setIsLoading(false);
        }
      };
      
      fetchLevel();
    }
  }, [levelNumber]);
  
  // Load mock levels
  useEffect(() => {
    if (!levelNumber) {
      // Create 100 mock levels based on the babylonTestLevel template
      const mockLevels: LevelConfig[] = [];
      
      for (let i = 1; i <= 100; i++) {
        const floorIndex = Math.floor((i - 1) / 25);
        const floorNames = ["Dungeon Depths", "Crystal Caverns", "Logic Labyrinth", "Master's Tower"];
        const floorName = floorNames[floorIndex];
        
        // Adjust difficulty based on level number
        let difficulty: 'easy' | 'medium' | 'hard' | 'epic' = 'easy';
        if (i > 75) difficulty = 'epic';
        else if (i > 50) difficulty = 'hard';
        else if (i > 25) difficulty = 'medium';
        
        mockLevels.push({
          ...babylonTestLevel,
          id: `gauntlet-level-${i}`,
          name: `${floorName} - Level ${i}`,
          description: `Level ${i} of the Great Gauntlet. Explore the ${floorName} and overcome its challenges.`,
          difficulty,
          // Increase collectibles and enemies as levels progress
          collectibles: {
            gems: Math.min(5 + Math.floor(i / 10), 20),
            keys: Math.min(1 + Math.floor(i / 20), 3),
            food: Math.min(3 + Math.floor(i / 15), 10)
          },
          enemies: {
            count: Math.min(3 + Math.floor(i / 5), 30),
            positions: babylonTestLevel.enemies?.positions || [],
            types: ['grunt', 'ghost', ...(i > 50 ? ['demon'] : [])]
          },
          // Add time limits to later levels
          timeLimit: i > 50 ? 300 - Math.floor((i - 50) / 10) * 30 : undefined
        });
      }
      
      setLevels(mockLevels);
    }
  }, [levelNumber]);
  
  // Handle character selection
  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    setCurrentView('level-select');
  };
  
  // Handle level selection
  const handleLevelSelect = (level: LevelConfig) => {
    console.log("Level selected in GauntletContainer:", level);
    console.log("Current view before change:", currentView);
    setSelectedLevel(level);
    setCurrentView('gameplay');
    console.log("Current view after change (will update on next render):", 'gameplay');
  };
  
  // Handle level completion
  const handleLevelComplete = (levelId: string, score: number, timeRemaining: number) => {
    // Update player progress
    setPlayerProgress(prev => {
      const completedLevels = [...prev.completedLevels];
      if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId);
      }
      
      const highScores = { ...prev.highScores };
      if (!highScores[levelId] || score > highScores[levelId]) {
        highScores[levelId] = score;
      }
      
      return { completedLevels, highScores };
    });
    
    // In a real app, you would save this progress to a database or local storage
  };
  
  // If loading, show loading indicator
  if (levelNumber && isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading level {levelNumber}...</p>
        </div>
      </div>
    );
  }
  
  // If there was an error loading the level
  if (levelNumber && error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Level</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/gauntlet-mode')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Back to Level Select
          </button>
        </div>
      </div>
    );
  }
  
  // Render the current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'character-select':
        return (
          <CharacterSelect 
            onSelect={handleCharacterSelect}
            onBack={onBack}
          />
        );
        
      case 'level-select':
        return (
          <GauntletLevelSelector
            levels={levels}
            onSelectLevel={handleLevelSelect}
            onBack={onBack} // Go back to dashboard instead of character select for testing
            playerProgress={playerProgress}
          />
        );
        
      case 'gameplay':
        if (!selectedCharacter || !selectedLevel) {
          // This shouldn't happen, but just in case
          return <div>Error: No character or level selected</div>;
        }
        
        return (
          <GauntletGame
            level={selectedLevel}
            playerClass={selectedCharacter as 'warrior' | 'assassin' | 'wizard' | 'elf'}
            playerName={playerName}
            onBack={() => levelNumber ? navigate('/gauntlet-mode') : setCurrentView('level-select')}
            onLevelComplete={(score, time) => {
              handleLevelComplete(selectedLevel.id, score, time);
              // After a delay, go back to level select
              setTimeout(() => {
                navigate('/gauntlet-mode');
              }, 3000);
            }}
          />
        );
        
      default:
        return <div>Unknown view</div>;
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Debug controls - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 z-50 bg-black bg-opacity-70 p-2 text-xs">
          <div className="flex flex-col space-y-1">
            <div className="text-white">Debug: {currentView}</div>
            {levelNumber && <div className="text-white">Level: {levelNumber}</div>}
            <button 
              onClick={() => {
                // Use the first level as a test
                if (levels.length > 0) {
                  const testLevel = levels[0];
                  console.log("Debug: Testing level selection with:", testLevel);
                  handleLevelSelect(testLevel);
                }
              }}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Test Level Select
            </button>
          </div>
        </div>
      )}
      {renderCurrentView()}
    </div>
  );
}; 