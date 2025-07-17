import React from 'react';
import { LevelConfig } from '../types/XCodeLevelTypes';

interface MinimapOverlayProps {
  level: LevelConfig;
  playerPos: { x: number; y: number };
  show: boolean;
}

export const MinimapOverlay: React.FC<MinimapOverlayProps> = ({
  level,
  playerPos,
  show
}) => {
  if (!show) return null;

  const TILE_COLORS: Record<string, string> = {
    wall: '#ff0000',
    empty: '#444444',
    gem: '#00ffff',
    food: '#00ff00',
    key: '#ffff00',
    exit: '#ff00ff',
    fire: '#ff6600',
    enemy: '#ff0066',
  };

  const MINIMAP_SIZE = 150;
  const tileSize = Math.max(2, Math.floor(MINIMAP_SIZE / Math.max(level.tiles.length, level.tiles[0].length)));

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: `${tileSize * level.tiles[0].length}px`,
        height: `${tileSize * level.tiles.length}px`,
        backgroundColor: '#000',
        border: '2px solid #666',
        borderRadius: '4px',
        padding: '2px'
      }}
    >
      {level.tiles.map((row, y) => (
        <div key={y} style={{ display: 'flex', height: `${tileSize}px` }}>
          {row.map((tile, x) => {
            const isPlayer = x === playerPos.x && y === playerPos.y;
            const color = isPlayer ? '#ffffff' : TILE_COLORS[tile] || '#444444';
            
            return (
              <div
                key={x}
                style={{
                  width: `${tileSize}px`,
                  height: `${tileSize}px`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}; 