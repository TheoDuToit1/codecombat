import React from 'react';
import { MinimapOverlay } from './MinimapOverlay';
import { LevelConfig } from '../types/XCodeLevelTypes';
import { Position } from '../types/game';

// Stub InventoryPanel
export const InventoryPanel: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="p-2 bg-white bg-opacity-80 border rounded shadow text-xs">
    <strong>Inventory:</strong> {items.join(', ')}
  </div>
);

// Stub ZoomToggle
export const ZoomToggle: React.FC<{ zoomedIn: boolean; onToggle: () => void }> = ({ zoomedIn, onToggle }) => (
  <button onClick={onToggle} className="border p-1 rounded bg-blue-100">
    {zoomedIn ? '🔎 Zoom Out' : '🔍 Zoom In'}
  </button>
);

interface GameUIOverlayProps {
  showMinimap: boolean;
  inventory: string[];
  zoomedIn: boolean;
  onToggleZoom: () => void;
  level: LevelConfig;
  playerPos: Position;
}

export const GameUIOverlay: React.FC<GameUIOverlayProps> = ({
  showMinimap,
  inventory,
  zoomedIn,
  onToggleZoom,
  level,
  playerPos,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {showMinimap && (
        <div className="absolute top-2 right-2 pointer-events-auto">
          <MinimapOverlay level={level} playerPos={playerPos} show={showMinimap} />
        </div>
      )}

      <div className="absolute bottom-2 left-2 pointer-events-auto">
        <InventoryPanel items={inventory} />
      </div>

      <div className="absolute bottom-2 right-2 pointer-events-auto">
        <ZoomToggle zoomedIn={zoomedIn} onToggle={onToggleZoom} />
      </div>
    </div>
  );
}; 