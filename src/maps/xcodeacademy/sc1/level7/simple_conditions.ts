import { LevelConfig } from '../../../../types/gauntlet';

const twoGems: LevelConfig = {
  id: 'xcodeacademy-sc1-level7-twogems',
  name: '7. Collect Two Gems',
  description: 'Move your hero to collect two special gems!',
  difficulty: 'easy',
  width: 15,
  height: 15,
  playerStart: { x: 5, y: 1 },
  tiles: [
    // Row 0 (top border)
    Array(15).fill('wall'),
    // Rows 1-13 (open space with walls on sides)
    ...Array(13).fill(null).map((_, rowIndex) => {
      // Create the basic row with walls on sides
      const row = ['wall', ...Array(13).fill('empty'), 'wall'];
      
      // Place gems at specific positions
      if (rowIndex === 12) { // This is row 13 (0-indexed)
        row[2] = 'gem';  // Blue gem at (2, 13)
        row[11] = 'gem'; // Red gem at (11, 13)
      }
      
      return row;
    }),
    // Row 14 (bottom border)
    Array(15).fill('wall'),
  ],
  objective: 'Collect both gems! First move down and left to get the blue gem, then move right to get the red gem.',
  collectibles: {
    gems: 2,  // Two gems to collect
    keys: 0,
    food: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria for collecting both gems
  successCriteria: {
    type: 'position',
    position: { x: 11, y: 13 },
    message: "🎉 Success! You've collected both gems!"
  },
  // Example solution placeholder
  placeholderCode: "// First move down and left to get the blue gem\nhero.moveDown(12);\nhero.moveLeft(3);\n\n// Then move right to get the red gem\nhero.moveRight(9);",
  // Visual markers
  waypointMarkers: [
    { x: 5, y: 1, label: "🧙 Start" },
    { x: 2, y: 13, label: "💎 First Diamond" },
    { x: 11, y: 13, label: "💎 Second Diamond" }
  ]
};

export default twoGems; 