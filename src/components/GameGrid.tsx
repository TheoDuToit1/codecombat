import React, { useEffect, useState, useRef } from 'react';
import { MinimapOverlay } from './MinimapOverlay';
import { LevelConfig } from '../types/gauntlet';
import babylonTestLevel from '../maps/babylonTestLevel';
import { AnimatedCharacter } from './AnimatedCharacter';
import { listAnimations } from '../utils/supabaseAnimationSaver';
import { fetchGauntletObjects } from '../lib/supabase';

const PLAYER_SPEED = 3; // Pixels per frame for smooth movement

// Emoji mapping for our Ancient Archive theme
const TILE_EMOJIS: Record<string, string> = {
  wall: '🧱', // Ancient stone walls
  wall_lt: '🏛️', // Top-left corner wall
  wall_rt: '🏛️', // Top-right corner wall
  wall_lb: '🏛️', // Bottom-left corner wall
  wall_rb: '🏛️', // Bottom-right corner wall
  empty: '', // Make empty tiles truly empty
  player: '🧙', // Explorer character
  gem: '💎', // Diamond gem
  food: '🧪', // Ancient magical potions
  key: '🗝️', // Ancient ornate key
  exit: '🏛️', // Temple exit
  fire: '✨', // Magical trap
  enemy: '🗿', // Ancient guardian statues
  trap: '🔮', // Hidden magic rune
  chest_silver: '🧰', // Placeholder for silver chest
  chest_blue: '💎',   // Placeholder for blue chest
  chest_blue_gold: '🎁', // Placeholder for blue-gold chest
};

// Mapping for gauntlet level editor codes
const GAUNTLET_TILE_MAP: Record<string, string> = {
  'WA': 'wall',   // Wall (standard)
  'W1': 'wall',   // Wall variant 1
  'W2': 'wall',   // Wall variant 2
  'FL': 'FL',  // Floor (use asset if available)
  'PT': 'trap',   // Pit/hole
  'LT': 'wall_lt',   // Top-left corner
  'RT': 'wall_rt',   // Top-right corner
  'LB': 'wall_lb',   // Bottom-left corner
  'RB': 'wall_rb',   // Bottom-right corner
  'L1': 'enemy',  // Lizard (basic)
  'L2': 'enemy',  // Poison Lizard
  'F1': 'enemy',  // Fire Fox
  'F2': 'enemy',  // Ice Fox
  'M1': 'enemy',  // Mimic Chest
  'D1': 'enemy',  // Mini Dragon
  'GE': 'gem',    // Gem
  'GO': 'chest_silver', // Gold
  'KE': 'key',    // Key
  'FO': 'food',   // Food
  'PO': 'potion', // Potion
  'CH': 'chest_blue', // Chest
  'EN': 'entrance', // Entrance - Player spawn point
  'EX': 'exit',   // Exit
  'DO': 'door',   // Door
  'EM': 'empty',  // Empty
};

// Viewport settings
const VIEW_RADIUS = 4; // Number of tiles in each direction around player
const FIXED_TILE_SIZE = 32; // Use fixed tile size for more stability
const ARROW_SIZE = 32; // Fixed arrow size for directional indicators

interface GameGridProps {
  level: LevelConfig;
  viewMode: 'topdown' | 'viewport';
  zoomLevel?: number;
  showMinimap?: boolean;
  onMove?: () => void;
  onCollectItem?: (itemType: string) => void;
  character?: string;
  sprites?: any;
  characterName?: string;
  initialPosition?: { x: number, y: number };
}

const getTileSize = (level: LevelConfig, zoomLevel = 1) => {
  return FIXED_TILE_SIZE * zoomLevel;
};

// Helper function to determine if a tile is blocking
function isBlockingTile(code: string) {
  if (!code) return false;
  return code.startsWith('W') || ['LT', 'RT', 'LB', 'RB'].includes(code);
}

export const GameGrid: React.FC<GameGridProps> = ({ 
  level = babylonTestLevel,
  viewMode = 'viewport',
  zoomLevel = 1,
  onMove,
  onCollectItem,
  showMinimap = true,
  character,
  characterName,
  sprites,
  onTileImagesLoaded
}) => {
  // Process the level data for custom grid format
  const processGridData = (levelData: LevelConfig) => {
    // Find EN tile and set player start position
    if (Array.isArray(levelData.tiles) && levelData.tiles.length > 0) {
      for (let y = 0; y < levelData.tiles.length; y++) {
        for (let x = 0; x < levelData.tiles[y].length; x++) {
          if (levelData.tiles[y][x] === 'EN') {
            // Set player start to EN position
            levelData.playerStart = { x, y };
            break;
          }
        }
      }
    }
    
    // Process grid normally
      const processedGrid: string[][] = [];
    if (Array.isArray(levelData.tiles) && levelData.tiles.length > 0) {
      for (let y = 0; y < levelData.tiles.length; y++) {
        const row: string[] = [];
        for (let x = 0; x < levelData.tiles[y].length; x++) {
          const code = levelData.tiles[y][x];
          const tileType = typeof code === 'string'
            ? (GAUNTLET_TILE_MAP[code] || code)
            : (code as string);
            row.push(tileType);
        }
        processedGrid.push(row);
      }
      }
      return processedGrid;
  };
  
  // Process the level data for custom grid format
  const processedTiles = processGridData(level);
  const initialPlayerStart = level.playerStart; // This is now set to EN by processGridData
  const initialGrid = Array.isArray(processedTiles) ? [...processedTiles] : [];

  const [tiles, setTiles] = useState<string[][]>(initialGrid);
  const [playerPos, setPlayerPos] = useState<{x: number, y: number}>(initialPlayerStart);
  
  const [zoomed, setZoomed] = useState(viewMode === 'viewport');
  const [tileSize, setTileSize] = useState(getTileSize(level, zoomLevel));
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [hasKey, setHasKey] = useState(false);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [wallOpened, setWallOpened] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to track last move time to prevent duplicate moves
  const lastMoveTime = useRef(0);
  const MOVE_DELAY = 150; // 150ms delay between moves
  
  // Get total gems from level config safely
  const totalGems = level.collectibles?.gems || 0;

  // Add a state to track the player's direction
  const [playerDirection, setPlayerDirection] = useState<'down' | 'left' | 'right' | 'up'>('down');

  // Chest animation state
  const [chestAnimations, setChestAnimations] = useState<Record<string, string[]>>({});
  const [chestFrameIndices, setChestFrameIndices] = useState<Record<string, number>>({});
  const chestAnimationTimers = useRef<Record<string, number>>({});

  // Add state for custom asset images
  const [tileImages, setTileImages] = useState<Record<string, string>>({});
  
  // Pixel-based player position for smooth movement
  const [playerPixelPos, setPlayerPixelPos] = useState<{x: number, y: number}>(
    { x: initialPlayerStart.x * tileSize, y: initialPlayerStart.y * tileSize }
  );
  // Track pressed movement keys for smooth, responsive movement
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Animation state for the player
  const [playerAnimState, setPlayerAnimState] = useState<'idle' | 'walk'>('idle');
  const [playerAnimDirection, setPlayerAnimDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  
  // Keep track of whether the player character is rendered to prevent duplicates
  const [playerCharacterRendered, setPlayerCharacterRendered] = useState(false);
  
  // Force playerCharacterRendered to false for debugging
  useEffect(() => {
    setPlayerCharacterRendered(false);
  }, []);

  // Function to render directional arrows with the correct size
  const renderArrow = (direction: 'up' | 'down' | 'left' | 'right') => {
    const arrowStyles: React.CSSProperties = {
      width: `${ARROW_SIZE}px`,
      height: `${ARROW_SIZE}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    };

    let arrow = '';
    switch (direction) {
      case 'up': arrow = '↑'; break;
      case 'down': arrow = '↓'; break;
      case 'left': arrow = '←'; break;
      case 'right': arrow = '→'; break;
    }

    return (
      <div style={arrowStyles}>
        {arrow}
      </div>
    );
  };

  // Fetch tile images from Supabase on component mount
  useEffect(() => {
    const loadTileAssets = async () => {
      try {
        // Get assets from each gauntlet section (1-4)
        const sections = [1, 2, 3, 4];
        const imageMap: Record<string, string> = {};
        
        // Add custom images for specific tiles
        imageMap['gem'] = '/images/diamond.png';
        imageMap['gem-blue'] = '/images/gem-blue.png';
        imageMap['gem-red'] = '/images/gem-red.png';
        console.log('Tile image map loaded:', imageMap);
        
        for (const section of sections) {
          const objects = await fetchGauntletObjects(section);
          objects.forEach(obj => {
            if (obj.image_url && obj.code) {
              imageMap[obj.code] = obj.image_url;
              
              // Also map to the corresponding wall_ type if this is a special wall
              if (obj.code === 'LT') imageMap['wall_lt'] = obj.image_url;
              else if (obj.code === 'RT') imageMap['wall_rt'] = obj.image_url;
              else if (obj.code === 'LB') imageMap['wall_lb'] = obj.image_url;
              else if (obj.code === 'RB') imageMap['wall_rb'] = obj.image_url;
            }
          });
        }
        
        setTileImages(imageMap);
        if (onTileImagesLoaded) onTileImagesLoaded(imageMap);
      } catch (error) {
        console.error("Failed to load tile assets:", error);
      }
    };
    
    loadTileAssets();
  }, [onTileImagesLoaded]);

  // Fetch chest assets and set up animation
  useEffect(() => {
    let isMounted = true;
    async function fetchChests() {
      try {
        // Find the three chest assets by name (more precise matching)
      const chestMap: Record<string, string[]> = {};
        
        // Initialize with empty arrays to avoid undefined errors
        chestMap['chest_silver'] = [];
        chestMap['chest_blue'] = [];
        chestMap['chest_blue_gold'] = [];
        
      const assets = await listAnimations();
        
      assets.forEach((asset: any) => {
          const name = asset.name ? asset.name.toLowerCase() : '';
          
          // More precise matching for chest types
          if (name.includes('chest') && name.includes('silver')) {
            const frames = (asset.data?.frames || []).map((f: any) => typeof f === 'string' ? f : f.data || '');
            if (frames.length > 0) {
              chestMap['chest_silver'] = frames;
            }
          }
          else if (name.includes('chest') && name.includes('blue') && name.includes('gold')) {
            const frames = (asset.data?.frames || []).map((f: any) => typeof f === 'string' ? f : f.data || '');
            if (frames.length > 0) {
              chestMap['chest_blue_gold'] = frames;
            }
          }
          else if (name.includes('chest') && name.includes('blue')) {
            const frames = (asset.data?.frames || []).map((f: any) => typeof f === 'string' ? f : f.data || '');
            if (frames.length > 0) {
              chestMap['chest_blue'] = frames;
            }
          }
        });
        
        // If we don't have any chest animations, create fallbacks
        if (chestMap['chest_silver'].length === 0) {
          // Silver chest - gray/silver color
          chestMap['chest_silver'] = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XvUrEQBDHk9zFRrCxsLGxsbCxsLGxsbCx8BEsfAIfwcLCwsLCwsJH8BEsLCwsLCwsLCx8BBvB5s7/JBMIIdndJKfeNQO/ZJPszH47O5tNLpfJZPqfCgBFgAZAF2AM8AzwBvAJ8APwDfAC8AAwAGgDVAHyYZwcQA2gBzAFeAVYRdAXwBigA1AGKIQFLwCUAQYAjwBrC9A4WgLMANoAJRvwEkAL4MwReB2tAC4B6iYPVABOHMPr6ASgbgJvAOxHAK/rAaBhAj9UvkUkWgJUdPAKwFWE8LpuAEo6+BHAImL4X10D7OrgY4BvB+AzT/DfAGMdvA/w4QD8HaDnCf4doKeDtwAeHIC/AbQ9wX8CtHTwEsCZA/BXgIYn+FeAug6+AzBxAP4M0PUE/wRQ0cGzAIcRw+tDMauDq1VsGDG8PpSHJvAGwG1E4DcAdRM4wJ5yJWzwywC7NvAiwcieBVTRRN4FqAEMIwAfghQdAGvDpgqwKEn8EOAfdOhZPNADqAJMPUEPgVoqHjW4GqSqQOcAjwbQNXf0/+qABwDlG3gM5lMpj+rX4cHwg+hLGSoAAAAAElFTkSuQmCC'];
        }
        
        if (chestMap['chest_blue'].length === 0) {
          // Blue chest - blue color
          chestMap['chest_blue'] = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XPU/CQBTH2/IhJsYYY4wxxhhjjDHGGGOMMX4EY/wEfgRjjDHGGGP8CH4EY4wxxhhjjDHGj2CMkbb8T3mXEKC9K5TLJbnkl/a4e+/9v7vXu1Yqk8n0PxUAigBNgC7AGOAZ4A3gE+AH4BvgBWAAMACoAuTDODmAGkAPYArwCrCKoC+AMUAHoAxQCAteBCgDDAEeAdYWoHG0BJgBtAFKNuAlgBbAmSN4Ha0ALgHqJg9UAE4cw+voBKBuAm8A7EcAr+sBoGECH6rfIhItASo6eAXgKkJ4XTcAJR38CGARMfyvrgF2dfAxwLcD8Jkn+G+AsQ7eB/hwAP4O0PME/w7Q08FbAI8OwN8AWp7gPwFaOngJ4MwB+CtAwxP8K0BdB98BmDgAfwao+oJ/Aqjo4FmAwxjg9aGY1cHVKjaMGF4fysMseANgGBH4DUA9C1y5ErbBLwPsZoEXAUYRwauYKmaBZwFKAMMI4IcARRfw6oCpAhx6gh8C7JsOJZsHcgBNgKkn8ClAQ8Wzgqt5pg5wCvCcAVV/T/+rAnAMULaBz2QymX5Bv4Ywwg9TwlnYAAAAAElFTkSuQmCC'];
        }
        
        if (chestMap['chest_blue_gold'].length === 0) {
          // Blue gold chest - gold/yellow color
          chestMap['chest_blue_gold'] = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuklEQVR42u2XvUrEQBDHc7mLjWBjYWNjY2FjYWNjY2Fj4SNY+AQ+goWFhYWFhYWP4CNYWFhYWFhYWFj4CDaCzZ3/SSYQQrK7SU69awZ+ySbZnf12djabXC6TyfQ/FQCKAHWADsAI4BngDeAT4AfgG+AF4B6gD1AFyIdxcgA1gC7AFOAVYBVBM4ARQBugDFAIC14EKAMMAh5ZwONoATADaACUbMBLAA2AU0fgdbQEuACoZXmgAnDsGF5HxwC1LPAGwJ5j8B89ANSzwAfqt4hES4CKDl4BuIwQXtcNQEkHPwCYRwz/qyuAHR18BPDtAHzmCf4bYKSD9wDeHYC/A3Q9wb8DdHXwJsCDA/A3gKYn+E+Ahg5eAjh1AP4KUPcE/wpQ08G3AMYO4GcAVV/wTwAVHTwLcBADvD4Uszq4WsUGEcPrQ7mfBa8D3EQEfg1QywJXroRt8IsAO1ngRYBhRPAqpopZ4FmAEsB1BPADgKILeHXAVAEOPMEPAPZMh5LNAzmABsDEE/gEoK7iWcHVPFMDOAF4zoCqv6f/VQE4AijbwGcymUy/oF+zj8IPL2PXOAAAAABJRU5ErkJggg=='];
        }
        
      if (isMounted) setChestAnimations(chestMap);
      } catch (error) {
        console.error("Error fetching chest animations:", error);
      }
    }
    fetchChests();
    return () => { isMounted = false; };
  }, []);

  // Animate chest frames
  useEffect(() => {
    // Clear previous timers
    Object.values(chestAnimationTimers.current).forEach(timerId => window.clearInterval(timerId));
    chestAnimationTimers.current = {};
    
    // Set up animation for each chest type
    Object.keys(chestAnimations).forEach(type => {
      if (chestAnimations[type]?.length > 1) {
        // Initialize the frame index if it doesn't exist
        if (chestFrameIndices[type] === undefined) {
          setChestFrameIndices(prev => ({
            ...prev,
            [type]: 0
          }));
        }
        
        chestAnimationTimers.current[type] = window.setInterval(() => {
          setChestFrameIndices(prev => ({
            ...prev,
            [type]: ((prev[type] || 0) + 1) % chestAnimations[type].length
          }));
        }, 200) as unknown as number;
      }
    });
    
    return () => {
      Object.values(chestAnimationTimers.current).forEach(timerId => window.clearInterval(timerId));
    };
  }, [chestAnimations]); // Update when chestAnimations changes

  // Focus the game container when component mounts
  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    
    // Set initial status message
    setStatusMessage(`Navigate the labyrinth and collect the ancient scrolls`);
    
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setTileSize(getTileSize(level, zoomLevel));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level, zoomLevel]);

  // Update tileSize when zoomLevel changes
  useEffect(() => {
    setTileSize(getTileSize(level, zoomLevel));
  }, [zoomLevel, level]);
  
  // Magic wall mechanics: Open walls at specific scroll counts
  useEffect(() => {
    const newTiles = [...tiles];
    let wallChanged = false;
    let notificationText = '';
    
    // First magic wall - opens after 2 scrolls
    if (gemsCollected >= 2 && !wallOpened && level.id === 'labyrinth-map') {
      // Open the wall at position [3,1]
      if (newTiles[1] && newTiles[1][3] === 'wall') {
        newTiles[1][3] = 'empty';
        wallChanged = true;
        notificationText = '✨ First ancient passage revealed! ✨';
        setWallOpened(true);
        setStatusMessage('Ancient magic has opened a path to more scrolls!');
      }
    }
    
    // Second magic wall - opens after 7 scrolls
    if (gemsCollected >= 7 && level.id === 'labyrinth-map') {
      // Open the wall at position [6,6] to access the key
      if (newTiles[6] && newTiles[6][6] === 'wall') {
        newTiles[6][6] = 'empty';
        wallChanged = true;
        notificationText = '✨ Path to the key revealed! ✨';
        setStatusMessage('Ancient magic has opened a path to the key!');
      }
    }
    
    // Third magic wall - opens after 13 scrolls
    if (gemsCollected >= 13 && level.id === 'labyrinth-map') {
      // Open the wall at position [12,13]
      if (newTiles[13] && newTiles[13][12] === 'wall') {
        newTiles[13][12] = 'empty';
        wallChanged = true;
        notificationText = '✨ Final path revealed! ✨';
        setStatusMessage('Ancient magic has opened the final path to freedom!');
      }
    }
    
    // Show notification and update tiles if any wall was opened
    if (wallChanged) {
      setTiles(newTiles);
      
      // Visual effect for the magic wall opening
      const notification = document.createElement('div');
      notification.innerHTML = notificationText;
      notification.style.position = 'fixed';
      notification.style.top = '20%';
      notification.style.left = '50%';
      notification.style.transform = 'translate(-50%, -50%)';
      notification.style.background = 'rgba(0, 0, 0, 0.8)';
      notification.style.color = '#ffcc00';
      notification.style.padding = '20px';
      notification.style.borderRadius = '10px';
      notification.style.zIndex = '1000';
      notification.style.fontWeight = 'bold';
      notification.style.fontSize = '24px';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  }, [gemsCollected, wallOpened, tiles, level.id]);

  // Update status message based on game state
  useEffect(() => {
    if (hasKey && gemsCollected >= totalGems) {
      setStatusMessage('You have the key and all scrolls! Find the exit.');
    } else if (hasKey && gemsCollected >= 13) {
      setStatusMessage('You have the key and enough scrolls to open the final path!');
    } else if (hasKey) {
      setStatusMessage('You found the key! Collect more scrolls to unlock the final path.');
    } else if (gemsCollected < 2) {
      setStatusMessage(`Find ${2 - gemsCollected} more scrolls to unlock the first passage.`);
    } else if (gemsCollected >= 2 && gemsCollected < 7) {
      setStatusMessage(`First passage open! Find ${7 - gemsCollected} more scrolls to reveal the key.`);
    } else if (gemsCollected >= 7 && gemsCollected < 13) {
      setStatusMessage(`Path to key open! Find ${13 - gemsCollected} more scrolls for the final path.`);
    } else if (gemsCollected >= 13) {
      setStatusMessage('All passages are open! Find the key and escape.');
    }
  }, [hasKey, gemsCollected, totalGems]);

  // For smoother movement
    let animationFrameId: number;
  
  // Game loop for smooth movement
  useEffect(() => {
    function gameLoop() {
      if (!gameContainerRef.current) return;
      
      // Handle smooth movement with pressed keys
      if (pressedKeys.size > 0 && !gameOver && !win) {
      let dx = 0;
      let dy = 0;
      let newDirection = playerAnimDirection;
        
        if (pressedKeys.has('ArrowUp') || pressedKeys.has('w')) { dy = -1; newDirection = 'up'; }
        if (pressedKeys.has('ArrowDown') || pressedKeys.has('s')) { dy = 1; newDirection = 'down'; }
        if (pressedKeys.has('ArrowLeft') || pressedKeys.has('a')) { dx = -1; newDirection = 'left'; }
        if (pressedKeys.has('ArrowRight') || pressedKeys.has('d')) { dx = 1; newDirection = 'right'; }
        
        // Calculate magnitude for diagonal movement normalization
        const magnitude = Math.sqrt(dx * dx + dy * dy);
      if (magnitude > 0) {
          // Normalize for diagonal movement (maintain consistent speed)
          dx = dx / magnitude;
          dy = dy / magnitude;
          
          let newX = playerPixelPos.x;
          let newY = playerPixelPos.y;
          
          // Try moving in the requested direction
        const tryX = playerPixelPos.x + dx * PLAYER_SPEED;
        const tryY = playerPixelPos.y + dy * PLAYER_SPEED;
          
          // Convert to tile coordinates
          const tileX = Math.floor(tryX / tileSize);
          const tileY = Math.floor(tryY / tileSize);
          const currentTileX = Math.floor(playerPixelPos.x / tileSize);
          const currentTileY = Math.floor(playerPixelPos.y / tileSize);
          
          // Check if we're trying to move to a new tile and if that tile is blocking
          const movingToNewTile = tileX !== currentTileX || tileY !== currentTileY;
          const targetTileIsBlocking = isBlockingTile(tiles[tileY]?.[tileX]);
          
          // Only update position if not moving into a blocking tile
          if (!targetTileIsBlocking) {
          newX = tryX;
          newY = tryY;
            
            // If we're moving to a new tile, check for interactions
            if (movingToNewTile) {
              handleInteraction();
              if (onMove) onMove();
              setMoveCount(prev => prev + 1);
            }
          } else {
            // Handle sliding along walls - try to move in just X or just Y direction
            if (!isBlockingTile(tiles[currentTileY]?.[tileX])) {
              newX = tryX;
            } else if (!isBlockingTile(tiles[tileY]?.[currentTileX])) {
              newY = tryY;
      }
          }
          
          // Update animation state based on movement
      setPlayerAnimState(magnitude > 0 ? 'walk' : 'idle');
      setPlayerAnimDirection(newDirection);
          
        setPlayerPixelPos({ x: newX, y: newY });
        // Optionally update playerPos for minimap, etc.
          const newTileX = Math.floor((newX + tileSize / 2) / tileSize);
          const newTileY = Math.floor((newY + tileSize / 2) / tileSize);
          if (newTileX !== playerPos.x || newTileY !== playerPos.y) {
            setPlayerPos({ x: newTileX, y: newTileY });
      }
        }
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pressedKeys, playerPixelPos, tileSize, tiles, playerPos, playerAnimDirection, gameOver, win]);

  // Keyboard controls for smooth movement (track all pressed keys)
    function handleKeyDown(e: KeyboardEvent) {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
      e.preventDefault(); // Prevent scrolling
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.add(key);
        return newKeys;
      });
    }
  }
  
    function handleKeyUp(e: KeyboardEvent) {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(key);
        return newKeys;
      });
      
      // If no movement keys are pressed, set to idle
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].some(k => 
        k !== key && pressedKeys.has(k))) {
        setPlayerAnimState('idle');
      }
    }
  }
  
  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  // Update zoomed state when viewMode changes
  useEffect(() => {
    setZoomed(viewMode === 'viewport');
  }, [viewMode]);

  // Update when level changes
  useEffect(() => {
    const newProcessedTiles = processGridData(level);
    setTiles(Array.isArray(newProcessedTiles) ? [...newProcessedTiles] : []);
    setPlayerPos(level.playerStart);
    setPlayerPixelPos({ x: level.playerStart.x * tileSize, y: level.playerStart.y * tileSize });
    
    // Initialize viewport offset based on player position
    updateViewportOffset(level.playerStart);
  }, [level, tileSize]);
  
  // Update viewport offset when player moves
  useEffect(() => {
    if (zoomed) {
      updateViewportOffset(playerPos);
    }
  }, [playerPos, zoomed]);
  
  // Handle viewport mode changes
  useEffect(() => {
    setZoomed(viewMode === 'viewport');
    if (viewMode === 'viewport') {
      updateViewportOffset(playerPos);
    }
  }, [viewMode]);
  
  // Update viewport offset calculation
  const updateViewportOffset = (pos: {x: number, y: number}) => {
    if (!tiles.length) return;
    
    const gridWidth = tiles[0].length;
    const gridHeight = tiles.length;
    
    // Calculate the ideal center position for the viewport
    let offsetX = Math.max(0, pos.x - VIEW_RADIUS);
    let offsetY = Math.max(0, pos.y - VIEW_RADIUS);
    
    // Ensure we don't show beyond the grid boundaries
    offsetX = Math.min(offsetX, gridWidth - (VIEW_RADIUS * 2 + 1));
    offsetY = Math.min(offsetY, gridHeight - (VIEW_RADIUS * 2 + 1));
    
    // Ensure offsets are not negative (happens with small grids)
    offsetX = Math.max(0, offsetX);
    offsetY = Math.max(0, offsetY);
    
    setViewportOffset({ x: offsetX, y: offsetY });
  };

  // On mount or when level changes, ensure player starts on a non-blocking tile
  useEffect(() => {
    const { x, y } = level.playerStart;
    
    if (!isBlockingTile(tiles[y]?.[x])) {
      setPlayerPixelPos({ x: x * tileSize, y: y * tileSize });
      setPlayerPos({ x, y });
    } else {
      // Find nearest non-blocking tile
      const maxDistance = Math.max(tiles.length, tiles[0]?.length || 0);
      
      outer: for (let d = 1; d <= maxDistance; d++) {
        for (let i = -d; i <= d; i++) {
          for (let j = -d; j <= d; j++) {
            if (Math.abs(i) !== d && Math.abs(j) !== d) continue; // Only check the perimeter
            
            const xx = x + i;
            const yy = y + j;
            
            if (xx >= 0 && xx < tiles[0]?.length && yy >= 0 && yy < tiles.length) {
          if (!isBlockingTile(tiles[yy][xx])) {
            setPlayerPixelPos({ x: xx * tileSize, y: yy * tileSize });
            setPlayerPos({ x: xx, y: yy });
            break outer;
          }
        }
      }
    }
      }
    }
  }, [level, tiles, tileSize]);

  // Force player to spawn on EN tile
  useEffect(() => {
    // Find EN tile
    let enTilePos = null;
    for (let y = 0; y < level.tiles.length; y++) {
      for (let x = 0; x < level.tiles[y].length; x++) {
        if (level.tiles[y][x] === 'EN') {
          enTilePos = { x, y };
          break;
        }
      }
      if (enTilePos) break;
    }
    
    if (enTilePos) {
      setPlayerPos(enTilePos);
      setPlayerPixelPos({ 
        x: enTilePos.x * tileSize, 
        y: enTilePos.y * tileSize 
      });
    }
  }, [level.tiles, tileSize]);

  // CRITICAL: Always ensure player starts at EN tile
  useEffect(() => {
    // Find EN tile in the current level
    let enTilePos = null;
    
    // Search for EN tile in the grid
    if (Array.isArray(level.tiles)) {
      for (let y = 0; y < level.tiles.length; y++) {
        for (let x = 0; x < level.tiles[y].length; x++) {
          if (level.tiles[y][x] === 'EN') {
            enTilePos = { x, y };
            break;
          }
        }
        if (enTilePos) break;
      }
    }
    
    // If EN tile found, force player position to it
    if (enTilePos) {
      setPlayerPos({ x: enTilePos.x, y: enTilePos.y });
      setPlayerPixelPos({ x: enTilePos.x * tileSize, y: enTilePos.y * tileSize });
    } else {
      console.log('⚠️ DEBUG: ERROR - No EN tile found in level!');
    }
  }, [level, tileSize]);

  const collectGem = (x: number, y: number) => {
    setGemsCollected(prev => prev + 1);
    const newTiles = [...tiles];
    newTiles[y] = [...tiles[y]];
    newTiles[y][x] = 'empty';
    setTiles(newTiles);
    
    if (onCollectItem) onCollectItem('gem');
    
    // Update status message based on collection milestones
    if (gemsCollected + 1 === 2) {
      setStatusMessage('You collected the 2nd scroll! The first passage will open...');
    } else if (gemsCollected + 1 === 7) {
      setStatusMessage('You collected the 7th scroll! The path to the key will appear...');
    } else if (gemsCollected + 1 === 13) {
      setStatusMessage('You collected the 13th scroll! The final path will be revealed...');
    } else if (gemsCollected + 1 === 1) {
      setStatusMessage('You found an ancient scroll! Knowledge is power.');
    } else {
      setStatusMessage(`Scroll collected! (${gemsCollected + 1}/${totalGems})`);
    }
  };

  const collectFood = (x: number, y: number) => {
    const newTiles = [...tiles];
    newTiles[y] = [...tiles[y]];
    newTiles[y][x] = 'empty';
    setTiles(newTiles);
    
    setStatusMessage('You found a magical potion!');
    
    if (onCollectItem) onCollectItem('food');
  };

  const collectKey = (x: number, y: number) => {
    setHasKey(true);
    const newTiles = [...tiles];
    newTiles[y] = [...tiles[y]];
    newTiles[y][x] = 'empty';
    setTiles(newTiles);
    
    setStatusMessage('You found the ancient key! Now find the exit.');
    
    if (onCollectItem) onCollectItem('key');
  };

  const winLevel = () => {
    setWin(true);
    setStatusMessage('You escaped the ancient archive with its knowledge!');
  };

  const triggerGameOver = () => {
    setGameOver(true);
    setStatusMessage('The ancient guardians have captured you!');
  };

  const handleInteraction = () => {
    // Space bar interaction with current tile
    const { x, y } = playerPos;
    const tile = tiles[y]?.[x];
    
    switch (tile) {
      case 'gem': collectGem(x, y); break;
      case 'food': collectFood(x, y); break;
      case 'key': collectKey(x, y); break;
      case 'exit': 
        if (hasKey) winLevel(); 
        else setStatusMessage('You need the key to exit!');
        break;
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setWin(false);
    setPlayerPos({ x: level.playerStart.x, y: level.playerStart.y });
    setHasKey(false);
    setGemsCollected(0);
    setMoveCount(0);
    setTiles(initialGrid);
    setWallOpened(false);
    setStatusMessage('Navigate the labyrinth and collect the ancient scrolls');
  };

  const handleKeyDownLocal = (e: React.KeyboardEvent) => {
    // We'll just prevent default behavior here since we're handling keys globally
    e.preventDefault();
    
    // Only handle space key for restart functionality
    if ((gameOver || win) && e.key === ' ') {
      restartGame();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Calculate dynamic sizing for topdown view (move this to top level)
  const containerStyle = zoomed 
    ? { 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '100%'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '100%',
        overflow: 'auto',
        maxWidth: '100%',
        maxHeight: '100%'
  };

  const renderTiles = () => {
    let displayTiles = tiles;
    let offsetX = 0, offsetY = 0;
    
    if (zoomed) {
      // Use the calculated viewport offset
      offsetX = viewportOffset.x;
      offsetY = viewportOffset.y;
      
      // Fixed viewport size
      const viewportWidth = VIEW_RADIUS * 2 + 1;
      const viewportHeight = VIEW_RADIUS * 2 + 1;
      
      // Extract the visible portion
      displayTiles = Array.from({ length: Math.min(viewportHeight, tiles.length - offsetY) }, 
        (_, i) => {
          const y = i + offsetY;
          if (y < tiles.length) {
            return tiles[y].slice(
              offsetX, 
              Math.min(offsetX + viewportWidth, tiles[y].length)
            );
          }
          return [];
        });
    }

    // Calculate proper scale for topdown mode
    let gridScale = 1;
    if (!zoomed && tiles.length > 0) {
      // Get the container size and grid size to calculate optimal scale
      const containerWidth = gameContainerRef.current?.clientWidth || 800;
      const containerHeight = gameContainerRef.current?.clientHeight || 600;
      const gridWidth = tiles[0].length * tileSize;
      const gridHeight = tiles.length * tileSize;
      
      // Calculate scale to fit grid in container with padding
      const horizontalScale = (containerWidth - 100) / gridWidth;
      const verticalScale = (containerHeight - 100) / gridHeight;
      
      // Use the smaller scale to ensure both dimensions fit
      gridScale = Math.min(horizontalScale, verticalScale, 1); 
      
      // Don't make it too small
      gridScale = Math.max(gridScale, 0.15);
    }
    
    return (
      <div className="game-grid-container overflow-hidden" style={{
        ...containerStyle,
        gap: 0, // Remove any gaps between tiles
        position: 'relative' // Ensure relative positioning for absolute children
      }}>
        {/* Player Character (AnimatedCharacter) - only one, absolutely positioned above the grid */}
        {sprites && (
          <div
            style={{
              position: 'absolute',
              left: playerPixelPos.x,
              top: playerPixelPos.y,
              width: tileSize,
              height: tileSize,
              zIndex: 1000
            }}
          >
            <AnimatedCharacter
              spriteType={character || 'warrior'}
              state={playerAnimState}
              direction={playerAnimDirection}
              sprites={sprites}
              size={tileSize}
            />
          </div>
        )}
        <div 
          className="grid-scaling-container"
          style={{
            transform: !zoomed ? `scale(${gridScale})` : 'none',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: 0, // Remove any gaps between rows
            position: 'relative' // Ensure relative positioning for player
          }}
        >
          {/* Render the grid tiles */}
          {displayTiles.map((row: string[], rowIndex: number) => (
            <div key={rowIndex} style={{ 
              display: 'flex',
              gap: 0 // Remove gaps between columns
            }}>
              {row.map((tile: string, colIndex: number) => {
                const worldY = rowIndex + offsetY;
                const worldX = colIndex + offsetX;
                const imageUrl = tileImages[tile] || null;
                if (tile === 'gem-blue' || tile === 'gem-red') {
                  console.log(`Rendering tile at (${worldX}, ${worldY}):`, tile, 'URL:', imageUrl);
                }
                const isWall = tile === 'wall' || tile.startsWith('wall_');
                let wallColor = '#222';
                let wallBorder = 'none';
                let wallShadow = 'none';
                if (tile === 'wall_lt' || tile === 'wall_rt' || tile === 'wall_lb' || tile === 'wall_rb') {
                  wallColor = '#333';
                } else if (!isWall) {
                  wallColor = 'transparent';
                  wallBorder = 'none';
                  wallShadow = 'none';
                }
                // Remove any player rendering from the grid tiles
                if (tile === 'player') return <div key={`${worldX}-${worldY}`} style={{ width: tileSize, height: tileSize }} />;
                
                // Use our custom arrow renderer for directional indicators
                const isArrow = tile === 'arrow_up' || tile === 'arrow_down' || 
                               tile === 'arrow_left' || tile === 'arrow_right';
                
                if (isArrow) {
                  const direction = tile.replace('arrow_', '') as 'up' | 'down' | 'left' | 'right';
                  return (
                    <div key={`${worldX}-${worldY}`} style={{ width: tileSize, height: tileSize }}>
                      {renderArrow(direction)}
                    </div>
                  );
                }
                
                return (
                  <div
                    key={`${worldX}-${worldY}`}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      fontSize: Math.max(16, tileSize * 0.7),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      position: 'relative',
                      backgroundColor: isWall ? wallColor : 'transparent',
                      boxShadow: 'none',
                      transition: 'all 0.1s ease',
                      padding: 0,
                      margin: 0
                    }}
                    className={`tile ${tile}`}
                  >
                    {/* Check if this is a chest tile and we have animations for it */}
                    {(tile === 'chest_blue' || tile === 'chest_silver' || tile === 'chest_blue_gold') && 
                     chestAnimations[tile] && 
                     chestAnimations[tile].length > 0 ? (
                      <img 
                        src={chestAnimations[tile][chestFrameIndices[tile] || 0]}
                        alt={`${tile} animation`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={tile}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain'
                        }}
                      />
                    ) : TILE_EMOJIS[tile] || TILE_EMOJIS.empty}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full h-full"
      ref={gameContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDownLocal}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{ outline: 'none', width: '100%', height: '100%', overflow: 'auto' }}
    >
      {renderTiles()}
      {showMinimap && zoomed && <MinimapOverlay level={level} playerPos={playerPos} />}
    </div>
  );
};