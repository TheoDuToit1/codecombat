import { LevelConfig } from '../../../../types/gauntlet';

const collecting: LevelConfig = {
  id: 'xcodeacademy-sc1-level3-collecting',
  name: '3. Multi-Step Movement',
  description: 'Learn to move your hero multiple spaces at once using a single command.',
  difficulty: 'easy',
  width: 16,
  height: 12,
  playerStart: { x: 5, y: 0 },
  tiles: [
    // Row 0 (top row, not a wall)
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 1
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 2
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 3
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 4
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 5
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 6
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 7
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 8
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 9
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 10
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    // Row 11
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ],
  objective: 'Move your hero multiple spaces at once by adding a number in the brackets.',
  collectibles: {
    gems: 0,
    keys: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria for Level 3: Using a multi-step movement
  successCriteria: {
    type: 'multiStep',
    message: "🎉 Success! You've learned how to move multiple steps with a single command!"
  }
};

export default collecting; 