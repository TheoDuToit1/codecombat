import { LevelConfig } from '../../../../types/gauntlet';

const collectPotion: LevelConfig = {
  id: 'xcodeacademy-sc1-level6-collectpotion',
  name: '6. Collect the Potion',
  description: 'Move your hero to collect the healing potion!',
  difficulty: 'easy',
  width: 15,
  height: 15,
  playerStart: { x: 2, y: 8 },
  tiles: [
    // Row 0 (top border)
    Array(15).fill('wall'),
    // Rows 1-13 (hallway with walls on sides)
    ...Array(13).fill(null).map(() => ['wall', ...Array(13).fill('empty'), 'wall']),
    // Row 14 (bottom border)
    Array(15).fill('wall'),
  ],
  objective: 'Move your hero right to collect the healing potion at position (10, 8).',
  collectibles: {
    gems: 0,
    keys: 0,
    food: 1  // Representing the potion
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria for potion collection
  successCriteria: {
    type: 'position',
    position: { x: 10, y: 8 },
    message: "🎉 Success! You've collected the healing potion!"
  },
  // Example solution placeholder
  placeholderCode: "// Move right to collect the potion\nhero.moveRight(8);",
  // Visual markers
  waypointMarkers: [
    { x: 2, y: 8, label: "🧙 Start" },
    { x: 10, y: 8, label: "🧪 Potion" }
  ]
};

export default collectPotion; 