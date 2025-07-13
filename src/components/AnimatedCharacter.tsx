import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCharacterProps {
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'idle' | 'walk' | 'attack' | 'chasing';
  style?: React.CSSProperties;
  spriteType?: string;
  position?: { x: number; y: number };
  size?: number;
  sprites?: any;
  scale?: number;
  spriteSheet?: {
    url: string;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
  };
  debug?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  direction = 'down',
  state = 'idle',
  style = {},
  spriteType = 'warrior',
  position = { x: 0, y: 0 },
  size = 48,
  sprites,
  scale = 2.0,
  spriteSheet,
  debug = false
}) => {
  const [frame, setFrame] = useState(0);
  const frameCount = spriteSheet ? spriteSheet.frameCount : 6; // Default to 6 frames per animation
  const prevSpritesRef = useRef<string>(JSON.stringify(sprites || {}));
  const [error, setError] = useState<string | null>(null);

  // Animation speed control
  const frameDelay = state === 'idle' ? 180 : state === 'attack' ? 75 : 120; // Faster for attack animations

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % frameCount);
    }, frameDelay);

    return () => clearInterval(animationInterval);
  }, [frameDelay, frameCount]);

  // If using sprite sheets
  if (spriteSheet) {
    // Debug logging
    console.log("Rendering with sprite sheet:", spriteSheet);
    
    // Map direction to row index in sprite sheet
    const getDirectionIndex = (dir: string): number => {
      switch (dir) {
        case 'down': return 0;
        case 'left': return 1;
        case 'right': return 2;
        case 'up': return 3;
        default: return 0;
      }
    };

    const directionIndex = getDirectionIndex(direction);
    
    // For sprite sheets, we'll use an img element with object-fit instead of background-position
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center" 
        style={{ background: 'none', ...style }}
      >
        <img
          src={spriteSheet.url}
          alt={`Character ${state} ${direction}`}
          className="max-h-full max-w-full"
          style={{ 
            imageRendering: 'pixelated',
            objectFit: 'cover',
            objectPosition: `-${frame * spriteSheet.frameWidth}px -${directionIndex * spriteSheet.frameHeight}px`,
            width: size,
            height: size,
            border: debug ? '1px solid red' : 'none'
          }}
          onError={(e) => {
            console.error('Error loading sprite sheet:', e, spriteSheet.url);
            setError(`Failed to load: ${spriteSheet.url}`);
          }}
        />
        {(debug || error) && (
          <div className="mt-2 text-xs bg-black bg-opacity-70 text-white p-1 rounded absolute -bottom-6 left-0 right-0 text-center">
            {error ? error : `Frame: ${frame}, Dir: ${directionIndex}`}
          </div>
        )}
      </div>
    );
  }

  // If sprites prop is provided, use it for animation rendering
  if (sprites) {
    // Check if the sprites has the state (idle, walk, etc.)
    const stateKey = state ? state.toLowerCase() : 'idle';
    
    if (sprites[stateKey]) {
      // Check if the state has the direction directly
      const dirKey = direction ? direction.toLowerCase() : 'down';
      
      if (sprites[stateKey][dirKey]) {
        const framesData = sprites[stateKey][dirKey];
        
        // Handle both array of strings and SpriteAnimation objects
        let frames: string[] = [];
        if (Array.isArray(framesData)) {
          frames = framesData;
        } else if (framesData.frames && Array.isArray(framesData.frames)) {
          frames = framesData.frames;
        }
        
        if (frames && frames.length > 0) {
          const frameUrl = frames[frame % frames.length];
          
          // Debug log to see what URL we're getting
          if (debug) {
            console.log("Using frame URL:", frameUrl);
          }
          
          return (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'none', ...style }}>
              <img
                src={frameUrl}
                alt={`Character ${state} ${direction}`}
                className="max-h-full max-w-full object-contain"
                style={{ imageRendering: 'pixelated', width: size, height: size }}
                onError={(e) => {
                  console.error('Failed to load image:', frameUrl, e);
                }}
              />
              {debug && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {frameUrl}
                </div>
              )}
            </div>
          );
        }
      }
      
      // Try fallback to other available directions if the requested one isn't available
      const availableDirections = Object.keys(sprites[stateKey]);
      if (availableDirections.length > 0) {
        const fallbackDirection = availableDirections[0];
        const framesData = sprites[stateKey][fallbackDirection];
        
        // Handle both array of strings and SpriteAnimation objects
        let frames: string[] = [];
        if (Array.isArray(framesData)) {
          frames = framesData;
        } else if (framesData.frames && Array.isArray(framesData.frames)) {
          frames = framesData.frames;
        }
        
        if (frames && frames.length > 0) {
          const originalFrameUrl = frames[frame % frames.length];
          // Fix image URL if needed
          let frameUrl = originalFrameUrl;
          if (frameUrl.startsWith('/public/')) {
            frameUrl = frameUrl.replace('/public/', '/');
          }
          
          return (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'none', ...style }}>
              <img
                src={frameUrl}
                alt={`Character ${state} ${fallbackDirection}`}
                className="max-h-full max-w-full object-contain"
                style={{ imageRendering: 'pixelated', width: size, height: size }}
                onError={(e) => {
                  console.error('Failed to load fallback image:', frameUrl, e);
                }}
              />
              {debug && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {frameUrl}
                </div>
              )}
            </div>
          );
        }
      }
    }
    
    // Try fallback to another state if the requested one isn't available
    const availableStates = Object.keys(sprites);
    if (availableStates.length > 0) {
      const fallbackState = availableStates[0];
      const availableDirections = Object.keys(sprites[fallbackState]);
      
      if (availableDirections.length > 0) {
        const fallbackDirection = availableDirections[0];
        const framesData = sprites[fallbackState][fallbackDirection];
        
        // Handle both array of strings and SpriteAnimation objects
        let frames: string[] = [];
        if (Array.isArray(framesData)) {
          frames = framesData;
        } else if (framesData.frames && Array.isArray(framesData.frames)) {
          frames = framesData.frames;
        }
        
        if (frames && frames.length > 0) {
          const originalFrameUrl = frames[frame % frames.length];
          // Fix image URL if needed
          let frameUrl = originalFrameUrl;
          if (frameUrl.startsWith('/public/')) {
            frameUrl = frameUrl.replace('/public/', '/');
          }
          
          return (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'none', ...style }}>
              <img
                src={frameUrl}
                alt={`Character ${fallbackState} ${fallbackDirection}`}
                className="max-h-full max-w-full object-contain"
                style={{ imageRendering: 'pixelated', width: size, height: size }}
                onError={(e) => {
                  console.error('Failed to load state fallback image:', frameUrl, e);
                }}
              />
              {debug && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {frameUrl}
                </div>
              )}
            </div>
          );
        }
      }
    }
  }

  // Convert state to animation folder name
  const getAnimationFolder = (state: string) => {
    switch (state) {
      case 'idle': return 'Idle';
      case 'walk': return 'Walk';
      case 'attack': return 'Swing'; // Use Swing animations for attacks
      default: return 'Idle';
    }
  };

  // Render different character types
  let characterElement = null;

  if (spriteType === 'angryPea') {
    // Render the angry pea enemy with a simple green circle and angry eyes
    const stateClass = state === 'chasing' ? 'animate-pulse' : '';
    
    return (
      <div 
        className={`relative ${stateClass}`}
        style={{ 
          width: size, 
          height: size,
          transform: `translate(${position.x * size}px, ${position.y * size}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Main pea body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-3/4 h-3/4 rounded-full bg-green-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}
          >
            {/* Eyes */}
            <div className="relative w-full h-full">
              {/* Left eye */}
              <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-white rounded-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
              </div>
              {/* Right eye */}
              <div className="absolute top-1/4 right-1/4 w-1/5 h-1/5 bg-white rounded-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
              </div>
              {/* Angry eyebrows */}
              <div className="absolute top-1/6 left-1/5 w-1/5 h-1/10 bg-black rounded-full transform rotate-45"></div>
              <div className="absolute top-1/6 right-1/5 w-1/5 h-1/10 bg-black rounded-full transform -rotate-45"></div>
              {/* Mouth */}
              <div className="absolute bottom-1/4 left-1/3 w-1/3 h-1/10 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create a colored placeholder if no sprites are available
  const placeholderColors = {
    idle: '#3498db', // Blue for idle
    walk: '#2ecc71', // Green for walking
    attack: '#e74c3c', // Red for attack
    chasing: '#f39c12'  // Orange for chasing
  };
  
  const directionMarkers = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
  };
  
  return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ background: 'none', ...style }}
      >
      <div 
        className="w-full h-full rounded-md flex items-center justify-center"
        style={{ 
          backgroundColor: placeholderColors[state] || '#9b59b6',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          animation: state === 'walk' ? 'pulse 1s infinite' : 'none'
        }}
      >
        {directionMarkers[direction]}
      </div>
      </div>
    );
};

export default AnimatedCharacter;