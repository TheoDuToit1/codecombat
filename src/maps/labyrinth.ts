import { LevelConfig } from '../types/gauntlet';

// This maps the layout characters to the tile types
// P = Player start, W = Wall, E = Empty, S = Scroll/Gem
// G = Guardian/Enemy, K = Key, X = Exit

const labyrinth: LevelConfig = {
  id: 'labyrinth-map',
  name: 'Ancient Labyrinth',
  description: 'A winding labyrinth filled with ancient knowledge. Find your way through the maze, collect the scrolls, and locate the key to escape.',
  difficulty: 'medium',
  width: 16,
  height: 16,
  playerStart: { x: 0, y: 0 },
  tiles: [
    ['empty','empty','empty','wall','wall','wall','wall','wall','empty','wall','wall','wall','wall','wall','wall','wall'],
    ['empty','gem','empty','wall','empty','empty','empty','empty','empty','empty','empty','empty','empty','gem','empty','wall'],
    ['wall','wall','empty','wall','empty','wall','gem','wall','wall','wall','wall','wall','wall','wall','empty','wall'],
    ['wall','gem','empty','wall','empty','wall','empty','empty','empty','empty','gem','empty','empty','wall','empty','wall'],
    ['wall','empty','empty','wall','empty','wall','wall','wall','wall','wall','wall','wall','empty','wall','empty','wall'],
    ['wall','wall','wall','wall','empty','empty','empty','empty','empty','empty','empty','wall','empty','wall','gem','wall'],
    ['wall','gem','empty','empty','empty','wall','wall','wall','wall','wall','empty','wall','empty','empty','empty','wall'],
    ['wall','wall','wall','wall','empty','wall','key','wall','empty','wall','empty','wall','wall','wall','empty','wall'],
    ['wall','gem','empty','empty','empty','wall','empty','wall','empty','wall','gem','wall','empty','empty','empty','wall'],
    ['wall','wall','wall','wall','empty','wall','empty','wall','empty','wall','empty','wall','empty','wall','wall','wall'],
    ['wall','gem','empty','empty','empty','wall','empty','wall','empty','wall','empty','wall','gem','wall','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','empty','wall','empty','wall','empty','wall','empty','wall','empty','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','wall','empty','wall','empty','gem','empty','wall','gem','wall'],
    ['wall','gem','gem','gem','gem','gem','gem','wall','empty','wall','enemy','wall','wall','wall','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall','wall','empty','wall','empty','empty','empty','empty','empty','exit'],
    ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall']
  ],
  objective: 'Navigate the labyrinth, collect the ancient scrolls, find the key, and reach the exit.',
  collectibles: {
    gems: 15,
    keys: 1,
    food: 0
  },
  enemies: {
    count: 1,
    positions: [
      { x: 10, y: 13 }
    ],
    types: ['guardian']
  }
};

export default labyrinth; 