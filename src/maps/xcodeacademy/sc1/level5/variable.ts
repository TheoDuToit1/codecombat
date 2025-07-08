import { LevelConfig } from '../../../../types/gauntlet';

const variableChallenge: LevelConfig = {
  id: 'xcodeacademy-sc1-level5-variable',
  name: '5. What is a Variable?',
  description: 'Collect the book and return to your starting point using only 2 lines of code.',
  difficulty: 'easy',
  width: 15,
  height: 15,
  playerStart: { x: 7, y: 3 },
  tiles: [
    // Row 0 (top border)
    Array(15).fill('wall'),
    // Rows 1-13 (hallway with walls on sides)
    ...Array(13).fill(null).map(() => ['wall', ...Array(13).fill('empty'), 'wall']),
    // Row 14 (bottom border)
    Array(15).fill('wall'),
  ],
  objective: 'Collect the book at position (7,13) and return to your starting position (7,3) using exactly 2 lines of code.',
  collectibles: {
    gems: 1,  // Using gem to represent the book
    keys: 0,
    food: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria for book collection challenge
  successCriteria: {
    type: 'position',
    position: { x: 7, y: 3 },
    commandCount: 2,
    message: "🎉 Success! You've collected the book and returned using only 2 lines of code!"
  },
  // Example solution placeholder
  placeholderCode: "// Use exactly 2 lines of code to:\n// 1. Go down to get the book\n// 2. Return to where you started\n\n// Hint: Use hero.moveDown() and hero.moveUp()",
  // Visual markers
  waypointMarkers: [
    { x: 7, y: 3, label: "📚 Start/End" },
    { x: 7, y: 13, label: "📕 Book" }
  ]
};

export default variableChallenge; 