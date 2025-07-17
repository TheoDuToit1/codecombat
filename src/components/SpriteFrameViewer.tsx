import React from 'react';

interface SpriteFrameViewerProps {
  spriteSheet: string;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  size?: number;
}

export const SpriteFrameViewer: React.FC<SpriteFrameViewerProps> = ({
  spriteSheet,
  frameX,
  frameY,
  frameWidth,
  frameHeight,
  size = 64
}) => {
  return (
    <div 
      className="border border-gray-400 bg-gray-700 flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <img
        src={spriteSheet}
        alt={`Sprite frame at ${frameX},${frameY}`}
        style={{
          position: 'absolute',
          left: -frameX * frameWidth,
          top: -frameY * frameHeight,
          imageRendering: 'pixelated',
          maxWidth: 'none',
          maxHeight: 'none'
        }}
        onError={(e) => console.error('Error loading sprite frame:', e)}
      />
    </div>
  );
};

export default SpriteFrameViewer; 