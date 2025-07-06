import React, { useState, useEffect } from 'react';
import AnimatedCharacter from './AnimatedCharacter';
import { CharacterController } from './CharacterController';
import { Position } from '../types/game';
import SpriteFrameViewer from './SpriteFrameViewer';

interface CharacterDemoProps {
  onBack?: () => void;
}

export const CharacterDemo: React.FC<CharacterDemoProps> = ({ onBack }) => {
  const [position, setPosition] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [state, setState] = useState<'idle' | 'walk' | 'attack' | 'chasing'>('idle');
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Handle position changes and update direction
  const handlePositionChange = (newPosition: Position) => {
    const dx = newPosition.x - position.x;
    const dy = newPosition.y - position.y;

    // Update direction based on movement
    if (dx > 0) setDirection('right');
    else if (dx < 0) setDirection('left');
    else if (dy > 0) setDirection('down');
    else if (dy < 0) setDirection('up');

    // Set walking state
    setState('walk');
    setLastMoveTime(Date.now());
    setPosition(newPosition);
  };

  // Check if the position is blocked (out of bounds)
  const isBlocked = (x: number, y: number) => {
    return x < 0 || y < 0 || x > 10 || y > 10;
  };

  // Reset to idle state after movement stops
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (Date.now() - lastMoveTime > 200) {
        setState('idle');
      }
    }, 200);

    return () => clearTimeout(idleTimer);
  }, [position, lastMoveTime]);

  // Get sprite sheet URL based on direction
  const getSpriteSheetUrl = () => {
    switch (direction) {
      case 'up': return '/images/character=sprite-north.png';
      case 'down': return '/images/character=sprite-south.png';
      case 'left': return '/images/character=sprite-west.png';
      case 'right': return '/images/character=sprite-east.png';
      default: return '/images/character=sprite-south.png';
    }
  };

  // Get direction index for sprite sheet
  const getDirectionIndex = (dir: string): number => {
    switch (dir) {
      case 'down': return 0;
      case 'left': return 1;
      case 'right': return 2;
      case 'up': return 3;
      default: return 0;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Character Animation Demo</h2>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <h3 className="text-white mb-4">Sprite Sheet Animation</h3>
            <div className="border-2 border-gray-600 rounded-lg p-4 bg-gray-700 w-64 h-64 flex items-center justify-center">
              <AnimatedCharacter 
                direction={direction}
                state={state}
                size={64}
                spriteSheet={{
                  url: getSpriteSheetUrl(),
                  frameWidth: 64,
                  frameHeight: 64,
                  frameCount: 6
                }}
                debug={true}
              />
            </div>
            <div className="mt-4 text-white">
              <p>Direction: {direction}</p>
              <p>State: {state}</p>
              <p>Position: ({position.x}, {position.y})</p>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="mb-4">Controls</h3>
            <p className="mb-4">Use arrow keys or WASD to move the character.</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div></div>
              <button 
                className="bg-gray-300 p-2 rounded"
                onClick={() => handlePositionChange({ ...position, y: position.y - 1 })}
              >
                ↑
              </button>
              <div></div>
              
              <button 
                className="bg-gray-300 p-2 rounded"
                onClick={() => handlePositionChange({ ...position, x: position.x - 1 })}
              >
                ←
              </button>
              <div></div>
              <button 
                className="bg-gray-300 p-2 rounded"
                onClick={() => handlePositionChange({ ...position, x: position.x + 1 })}
              >
                →
              </button>
              
              <div></div>
              <button 
                className="bg-gray-300 p-2 rounded"
                onClick={() => handlePositionChange({ ...position, y: position.y + 1 })}
              >
                ↓
              </button>
              <div></div>
            </div>
            
            <button 
              className="bg-red-500 text-white p-2 rounded w-full mb-2"
              onClick={() => setState('attack')}
            >
              Attack
            </button>
            
            <button 
              className="bg-blue-500 text-white p-2 rounded w-full"
              onClick={() => setState('idle')}
            >
              Idle
            </button>
          </div>
        </div>

        {/* Frame viewer */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-4">Individual Frames</h3>
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <button 
                className="bg-gray-300 p-2 rounded mr-2"
                onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
              >
                Prev
              </button>
              <span className="mx-2">Frame {currentFrame + 1} of 6</span>
              <button 
                className="bg-gray-300 p-2 rounded ml-2"
                onClick={() => setCurrentFrame((currentFrame + 1) % 6)}
              >
                Next
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <span className="mb-2">Down</span>
                <SpriteFrameViewer 
                  spriteSheet="/images/character=sprite-south.png"
                  frameX={currentFrame}
                  frameY={0}
                  frameWidth={64}
                  frameHeight={64}
                  size={64}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="mb-2">Left</span>
                <SpriteFrameViewer 
                  spriteSheet="/images/character=sprite-west.png"
                  frameX={currentFrame}
                  frameY={0}
                  frameWidth={64}
                  frameHeight={64}
                  size={64}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="mb-2">Right</span>
                <SpriteFrameViewer 
                  spriteSheet="/images/character=sprite-east.png"
                  frameX={currentFrame}
                  frameY={0}
                  frameWidth={64}
                  frameHeight={64}
                  size={64}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="mb-2">Up</span>
                <SpriteFrameViewer 
                  spriteSheet="/images/character=sprite-north.png"
                  frameX={currentFrame}
                  frameY={0}
                  frameWidth={64}
                  frameHeight={64}
                  size={64}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Direct sprite sheet display for debugging */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-4">Sprite Sheet Debug View</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-center mb-2">North (Up)</h4>
              <img 
                src="/images/character=sprite-north.png" 
                alt="North Sprite Sheet" 
                className="border border-gray-400 max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h4 className="text-center mb-2">South (Down)</h4>
              <img 
                src="/images/character=sprite-south.png" 
                alt="South Sprite Sheet" 
                className="border border-gray-400 max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h4 className="text-center mb-2">West (Left)</h4>
              <img 
                src="/images/character=sprite-west.png" 
                alt="West Sprite Sheet" 
                className="border border-gray-400 max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h4 className="text-center mb-2">East (Right)</h4>
              <img 
                src="/images/character=sprite-east.png" 
                alt="East Sprite Sheet" 
                className="border border-gray-400 max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Invisible controller for keyboard input */}
      <CharacterController 
        position={position}
        setPosition={handlePositionChange}
        isBlocked={isBlocked}
      />
    </div>
  );
};

export default CharacterDemo; 