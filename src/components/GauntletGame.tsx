import React, { useState, useEffect, useMemo } from 'react';
import { GauntletGameHUD } from './GauntletGameHUD';
import { GameGrid } from './GameGrid';
import { LevelConfig } from '../types/gauntlet';
import { ArrowLeft } from 'lucide-react';
import { getCharacterAnimationsByClass } from '../utils/characterAnimationSaver';
import { adaptSupabaseAnimation } from '../utils/animationAdapter';

interface GauntletGameProps {
  level: LevelConfig;
  playerClass: 'warrior' | 'assassin' | 'wizard' | 'elf';
  playerName: string;
  onBack: () => void;
  onLevelComplete: (score: number, time: number) => void;
}

export const GauntletGame: React.FC<GauntletGameProps> = ({
  level,
  playerClass,
  playerName,
  onBack,
  onLevelComplete
}) => {
  // Create a modified level with an EN tile if one doesn't exist
  const modifiedLevel = useMemo(() => {
    // If there's already an EN tile, no need to modify
    if (level.tiles.some(row => row.some(tile => tile === 'EN'))) return level;
    
    // Clone the level to avoid mutating the original
    const newLevel = { ...level };
    const newTiles = level.tiles.map(row => [...row]);
    
    // Get the player start position
    const { x, y } = level.playerStart || { x: 1, y: 1 };
    
    // Replace the tile at the player start position with EN
    if (newTiles[y] && newTiles[y][x] !== undefined) {
      newTiles[y][x] = 'EN';
    }
    
    newLevel.tiles = newTiles;
    return newLevel;
  }, [level]);
  
  // Game state
  const [health, setHealth] = useState(100);
  const maxHealth = 100;
  const [food, setFood] = useState(100);
  const maxFood = 100;
  const [score, setScore] = useState(0);
  const [keys, setKeys] = useState(0);
  const [potions, setPotions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(level.timeLimit || 0);
  const [characterSprites, setCharacterSprites] = useState<any>(null);
  const [loadedTileImages, setLoadedTileImages] = useState<Record<string, string>>({});
  
  // Track player position for minimap and HUD
  const [playerPosition, setPlayerPosition] = useState(modifiedLevel.playerStart);
  
  // Update player position when modifiedLevel changes
  useEffect(() => {
    setPlayerPosition(modifiedLevel.playerStart);
  }, [modifiedLevel]);
  
  const gridCodes = Array.isArray(level.tiles) ? Array.from(new Set(level.tiles.flat())) : [];
  const loadedCodes = loadedTileImages ? Object.keys(loadedTileImages) : [];
  const missingCodes = gridCodes.filter(code => !loadedCodes.includes(code) && code !== 'EM');
  
  // Create a basic fallback animation
  const createFallbackAnimation = () => {
    // Simple animation with a single frame per direction
    return {
      idle: {
        down: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        up: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        left: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        right: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC']
      },
      walk: {
        down: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        up: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        left: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        right: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC']
      },
      attack: {
        down: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        up: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        left: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC'],
        right: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCgYasPyn+oeRkfE9ExPTfwYGxjtvr7Hc3f1EnZ2Z+f9/JqZ/jP8ZGf5//fGPoXnaSw+gACdmxtO9V5u3rn7Edfb///9ejEysIBtBYuEiH/69f/OJpWXaS0cGOoLlJ6vUGRkZp9Dd9QxYNtB4GmgAAPKhSc6lMFfiAAAAAElFTkSuQmCC']
      }
    };
  };
  
  // Handle character selection
  useEffect(() => {
    // Load default sprites for the selected character
    const sprites = createFallbackAnimation();
    setCharacterSprites(sprites);
  }, [playerClass]);

  useEffect(() => {
    if (characterSprites) {
      for (const state of Object.keys(characterSprites)) {
      }
    }
  }, [characterSprites]);
  
  // Food depletion timer
  useEffect(() => {
    if (gameOver || levelComplete) return;
    
    const foodInterval = setInterval(() => {
      setFood(prev => {
        const newFood = Math.max(0, prev - 1);
        if (newFood === 0 && health <= 10) {
          // Player is starving and low health
          setGameOver(true);
        }
        return newFood;
      });
    }, 1000); // Decrease food every second
    
    return () => clearInterval(foodInterval);
  }, [gameOver, levelComplete, health]);
  
  // Time countdown
  useEffect(() => {
    if (gameOver || levelComplete || !level.timeLimit) return;
    
    const timeInterval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          // Time's up!
          setGameOver(true);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, [gameOver, levelComplete, level.timeLimit]);
  
  // Health depletion when food is at 0
  useEffect(() => {
    if (gameOver || levelComplete || food > 0) return;
    
    const healthInterval = setInterval(() => {
      setHealth(prev => {
        const newHealth = Math.max(0, prev - 5);
        if (newHealth === 0) {
          // Player died
          setGameOver(true);
        }
        return newHealth;
      });
    }, 2000); // Decrease health every 2 seconds when starving
    
    return () => clearInterval(healthInterval);
  }, [gameOver, levelComplete, food]);
  
  // Handle player movement
  const handlePlayerMove = () => {
    // This will be called when the player moves in the GameGrid
    // We'll use it to update food consumption
    setFood(prev => Math.max(0, prev - 0.5)); // Moving costs food
  };
  
  // Handle item collection
  const handleCollectItem = (itemType: string) => {
    switch (itemType) {
      case 'food':
        setFood(prev => Math.min(maxFood, prev + 25));
        setScore(prev => prev + 10);
        break;
      case 'gem':
        setScore(prev => prev + 50);
        break;
      case 'key':
        setKeys(prev => prev + 1);
        setScore(prev => prev + 25);
        break;
      case 'potion':
        setPotions(prev => prev + 1);
        setScore(prev => prev + 15);
        break;
      default:
        break;
    }
  };
  
  // Handle level completion
  const handleLevelComplete = () => {
    setLevelComplete(true);
    onLevelComplete(score, timeRemaining);
  };
  
  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
  };
  
  // Toggle zoom level
  const handleToggleZoom = () => {
    setZoomedIn(prev => !prev);
  };

  return (
    <div className="h-screen w-screen bg-black">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-[104px] left-4 z-50 flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back to Levels</span>
      </button>
      
      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
          <h2 className="text-4xl text-white font-bold mb-6">GAME OVER</h2>
          <p className="text-xl text-white mb-4">Score: {score}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors mt-4"
          >
            Return to Level Select
          </button>
        </div>
      )}
      
      {/* Level complete overlay */}
      {levelComplete && (
        <div className="absolute inset-0 bg-green-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
          <h2 className="text-4xl text-white font-bold mb-6">LEVEL COMPLETE!</h2>
          <p className="text-xl text-white mb-2">Score: {score}</p>
          <p className="text-xl text-white mb-4">Time Remaining: {timeRemaining}s</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors mt-4"
          >
            Return to Level Select
          </button>
        </div>
      )}
      
      {/* Main game with HUD */}
      <GauntletGameHUD
        // Player stats
        playerName={playerName}
        playerClass={playerClass}
        health={health}
        maxHealth={maxHealth}
        food={food}
        maxFood={maxFood}
        score={score}
        keys={keys}
        potions={potions}
        
        // Level info
        level={1} // This would be dynamic in a full implementation
        totalLevels={100}
        objective={level.objective || "Collect all items and reach the exit"}
        timeRemaining={level.timeLimit ? timeRemaining : undefined}
        
        // Map info
        levelConfig={modifiedLevel}
        playerPosition={playerPosition}
        
        // UI controls
        showMinimap={true}
        zoomedIn={zoomedIn}
        onToggleZoom={handleToggleZoom}
      >
        {/* The GameGrid will be rendered inside the main area of the HUD */}
        <GameGrid
          level={modifiedLevel}
          viewMode={zoomedIn ? 'viewport' : 'topdown'}
          zoomLevel={zoomedIn ? 1.8 : 1.05}
          onMove={handlePlayerMove}
          onCollectItem={handleCollectItem}
          showMinimap={true}
          character={playerClass}
          characterName={playerName}
          sprites={characterSprites}
          onTileImagesLoaded={setLoadedTileImages}
        />
      </GauntletGameHUD>
    </div>
  );
}; 