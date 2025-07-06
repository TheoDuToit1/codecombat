import { LevelConfig } from '../types/gauntlet';

const babylon: LevelConfig = {
  id: 'babylon-test-map',
  name: 'Babylon',
  description: 'An ancient archive filled with lost knowledge. Explore and collect scrolls while avoiding the guardians.',
  difficulty: 'easy',
  width: 16,
  height: 16,
  playerStart: { x: 1, y: 1 },
  tiles: [
    ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','chest_silver','exit','wall'],
    ['wall','empty','wall','wall','wall','empty','wall','wall','wall','empty','wall','wall','wall','empty','empty','wall'],
    ['wall','food','wall','gem','wall','empty','wall','gem','wall','empty','wall','key','wall','empty','fire','wall'],
    ['wall','empty','wall','wall','wall','empty','wall','wall','wall','empty','wall','wall','wall','empty','empty','wall'],
    ['wall','enemy','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','enemy','wall'],
    ['wall','empty','wall','wall','wall','empty','empty','empty','empty','empty','wall','wall','wall','empty','empty','wall'],
    ['wall','gem','wall','food','wall','empty','empty','gem','empty','empty','wall','food','wall','empty','gem','wall'],
    ['wall','empty','wall','wall','wall','empty','empty','empty','empty','empty','wall','wall','wall','empty','chest_blue','wall'],
    ['wall','enemy','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','enemy','wall'],
    ['wall','empty','wall','wall','wall','empty','empty','empty','empty','empty','wall','wall','wall','empty','empty','wall'],
    ['wall','gem','wall','food','wall','empty','empty','gem','empty','empty','wall','food','wall','empty','gem','wall'],
    ['wall','empty','wall','wall','wall','empty','empty','empty','empty','empty','wall','wall','wall','empty','empty','wall'],
    ['wall','enemy','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','enemy','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','chest_blue_gold','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
  ],
  objective: 'Collect ancient scrolls and find the key to escape the archive.',
  collectibles: {
    gems: 8,
    keys: 1,
    food: 4
  },
  enemies: {
    count: 5,
    positions: [
      { x: 1, y: 5 },
      { x: 14, y: 5 },
      { x: 1, y: 9 },
      { x: 14, y: 9 },
      { x: 1, y: 13 }
    ],
    types: ['guardian']
  }
};

export default babylon; 