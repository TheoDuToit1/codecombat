import { LevelConfig } from '../../../../types/gauntlet';

const directions: LevelConfig = {
  id: 'xcodeacademy-sc1-level2-directions',
  name: '2. Directions and Movement',
  description: 'Master the four sacred directions as you navigate through the side streets of Syntaxia.',
  difficulty: 'easy',
  width: 20,
  height: 12,
  playerStart: { x: 6, y: 10 },
  tiles: [
    // Row 0 (top border)
    Array(20).fill('wall'),
    // Row 1
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 2
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 3
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 4
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 5
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 6
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 7
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 8
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 9
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 10
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 11 (bottom border)
    Array(20).fill('wall'),
    // Row 12 (add left arrow at (3,12))
    ['wall', 'empty', 'empty', 'arrow_left', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ],
  objective: 'Navigate to the exit using all four directions: up, down, left, and right.',
  collectibles: {
    gems: 0,
    keys: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Add lesson-specific success criteria for using all four directions
  successCriteria: {
    type: 'allDirections',
    message: "🎉 Success! You've used all four directions and completed the objective!"
  }
};

export default directions; 