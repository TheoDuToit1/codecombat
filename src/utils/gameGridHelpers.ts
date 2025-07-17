// Helper: check if a rectangle overlaps any wall tile
export function isBlockedAtPixel(x: number, y: number, width: number, height: number, tiles: string[][], wallCodes: string[], tileSize: number) {
  const points = [
    { px: x, py: y },
    { px: x + width - 1, py: y },
    { px: x, py: y + height - 1 },
    { px: x + width - 1, py: y + height - 1 },
  ];
  let blocked = false;
  for (const { px, py } of points) {
    const gridX = Math.floor(px / tileSize);
    const gridY = Math.floor(py / tileSize);
    let tile = 'out of bounds';
    if (gridY < 0 || gridY >= tiles.length || gridX < 0 || gridX >= tiles[0].length) {
      blocked = true;
    } else {
      tile = tiles[gridY][gridX];
      if (wallCodes.includes(tile)) blocked = true;
    }
  }
  return blocked;
}

// Helper: get player grid position from absolute position
export function getPlayerGridPos(absPos: {x: number, y: number}, tileSize: number) {
  return {
    x: Math.floor((absPos.x + tileSize/2) / tileSize),
    y: Math.floor((absPos.y + tileSize/2) / tileSize),
  };
} 