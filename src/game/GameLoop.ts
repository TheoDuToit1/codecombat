import levels from '../maps/levels';

export class GameLoop {
  gameState: any;
  currentMap: any;
  hero: any;
  spawners: any[];
  exitTile: any;

  constructor() {
    this.gameState = {
      currentLevel: 1,
      levelComplete: false,
    };
    this.currentMap = levels[0];
    this.hero = null;
    this.spawners = [];
    this.exitTile = null;
  }

  update() {
    // Handle player movement, collision, rendering, etc.
    // Future logic can go here (e.g., checking for key, exit, etc.)
  }

  loadLevel(levelIndex = 0) {
    const level = levels[levelIndex];
    this.currentMap = level.tiles;
    this.hero = {
      position: level.playerStart,
      hasKey: false,
    };
    // Find exit tile position from tiles if needed
    let exitTile = null;
    for (let y = 0; y < level.tiles.length; y++) {
      for (let x = 0; x < level.tiles[y].length; x++) {
        if (level.tiles[y][x] === 'exit') {
          exitTile = { x, y };
        }
      }
    }
    this.exitTile = exitTile;
    this.spawners = [];
  }
}

export const gameLoop = new GameLoop(); 