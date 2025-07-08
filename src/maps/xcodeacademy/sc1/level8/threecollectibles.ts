import { LevelConfig } from '../../../../types/gauntlet';

const threeGems: LevelConfig = {
  id: 'xcodeacademy-sc1-level8-threegems',
  name: '8. Treasure Hunt: Three Gems',
  description: 'Collect all three gems in this exciting treasure hunt!',
  difficulty: 'easy',
  width: 11,
  height: 11,
  playerStart: { x: 5, y: 5 },
  tiles: [
    // Row 0 (top border)
    Array(11).fill('wall'),
    // Row 1 
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 2
    ['wall', 'empty', 'empty', 'empty', 'empty', 'gem', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 3
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 4
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 5 (player row)
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'gem', 'empty', 'wall'],
    // Row 6
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 7
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 8
    ['wall', 'empty', 'gem', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 9
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    // Row 10 (bottom border)
    Array(11).fill('wall'),
  ],
  objective: 'Collect all three gems! First get the blue gem above, then the green gem to the right, and finally the red gem at the bottom-left.',
  collectibles: {
    gems: 3,  // Three gems to collect
    keys: 0,
    food: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria - player must reach the final gem position
  successCriteria: {
    type: 'position',
    position: { x: 2, y: 8 },
    message: "🎉 Success! You've collected all three gems and completed the treasure hunt!"
  },
  // Example solution placeholder with hints
  placeholderCode: "// First go up to get the blue gem\nhero.moveUp(3);\n\n// Go back to the starting position\nhero.moveDown(3);\n\n// Then go right to get the green gem\nhero.moveRight(3);\n\n// Go back to the starting position\nhero.moveLeft(3);\n\n// Finally, go to the bottom-left for the red gem\nhero.moveLeft(3);\nhero.moveDown(3);",
  // Visual markers
  waypointMarkers: [
    { x: 5, y: 5, label: "🧙 Start" },
    { x: 5, y: 2, label: "🔵 Blue Gem" },
    { x: 8, y: 5, label: "🟢 Green Gem" },
    { x: 2, y: 8, label: "🔴 Red Gem" }
  ]
};

export default threeGems; 