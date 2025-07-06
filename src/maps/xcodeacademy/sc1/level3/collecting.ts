import { LevelConfig } from '../../../../types/gauntlet';

const collecting: LevelConfig = {
  id: 'xcodeacademy-sc1-level3-collecting',
  name: '3. Collecting Gems',
  description: 'Enter the hidden garden to collect floating gems of knowledge with your pet owl companion.',
  difficulty: 'easy',
  width: 16,
  height: 12,
  playerStart: { x: 1, y: 1 },
  tiles: [
    // Row 0 (top border)
    Array(16).fill('wall'),
    // Row 1
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 2
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 3
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 4
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 5
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 6
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 7
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 8
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 9
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 10
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 11 (bottom border)
    Array(16).fill('wall'),
  ],
  objective: 'Collect all the gems scattered throughout the garden.',
  collectibles: {
    gems: 3,
    keys: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  }
};

export default collecting; 