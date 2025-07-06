import React from 'react';

interface DebugOverlayProps {
  playerPos: { x: number; y: number };
  playerAbsolutePos: { x: number; y: number };
  tiles: string[][];
  portalLocations: { x: number; y: number }[];
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ playerPos, playerAbsolutePos, tiles, portalLocations }) => (
  <div style={{
    position: 'absolute',
    top: 8,
    left: 8,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 14,
    zIndex: 1000,
    pointerEvents: 'none',
  }}>
    <div>Player Grid: ({playerPos.x}, {playerPos.y})</div>
    <div>Player Abs: ({Math.round(playerAbsolutePos.x)}, {Math.round(playerAbsolutePos.y)})</div>
    <div>Tile: {tiles[playerPos.y]?.[playerPos.x]}</div>
    <div>Portals: {portalLocations.map(p => `(${p.x},${p.y})`).join(' ')}</div>
  </div>
);

export default DebugOverlay; 