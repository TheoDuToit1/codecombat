import { LevelConfig } from '../types/XCodeLevelTypes';

const babylonTestLevel: LevelConfig = {
  id: 'babylon-test-level',
  name: 'Babylon – Place of Gathering',
  description: 'A test level for the Babylon rendering system.',
  difficulty: 'easy',
  width: 8,
  height: 8,
  playerStart: { x: 1, y: 1 },
  tiles: [
    ['wall','wall','wall','wall','wall','wall','wall','wall'],
    ['wall','empty','empty','food','empty','gem','key','wall'],
    ['wall','enemy','wall','empty','wall','empty','empty','wall'],
    ['wall','empty','empty','empty','empty','wall','exit','wall'],
    ['wall','food','wall','fire','empty','empty','empty','wall'],
    ['wall','empty','gem','empty','enemy','wall','empty','wall'],
    ['wall','empty','empty','empty','food','empty','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall','wall'],
  ],
  objective: "Collect gems and reach the exit",
  collectibles: {
    gems: 2,
    keys: 1,
    food: 3
  },
  enemies: {
    count: 2,
    positions: [
      { x: 1, y: 2 },
      { x: 4, y: 5 }
    ],
    types: ['grunt']
  }
};

export default babylonTestLevel; 