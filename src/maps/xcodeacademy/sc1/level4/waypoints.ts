import { LevelConfig } from '../../../../types/gauntlet';

const waypoints: LevelConfig = {
  id: 'xcodeacademy-sc1-level4-waypoints',
  name: '4. Waypoint Challenge',
  description: 'Reach all four waypoints in only 4 moves using multi-step movement. Each move must use a number in the brackets.',
  difficulty: 'medium',
  width: 20,
  height: 20,
  playerStart: { x: 11, y: 11 },
  tiles: [
    // Row 0 (top border)
    Array(20).fill('wall'),
    // Rows 1-18 (walls on sides, empty inside)
    ...Array(18).fill(null).map(() => ['wall', ...Array(18).fill('empty'), 'wall']),
    // Row 19 (bottom border)
    Array(20).fill('wall'),
  ],
  objective: 'Reach all waypoints in sequence: 1️⃣ (11,14) → 2️⃣ (8,14) → 3️⃣ (8,5) → 4️⃣ (7,3) using exactly 4 movement commands.',
  collectibles: {
    gems: 0,
    keys: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  },
  // Success criteria for waypoints challenge with numbered waypoints
  successCriteria: {
    type: 'waypoints',
    waypoints: [
      { x: 11, y: 14 },  // Waypoint 1
      { x: 8, y: 14 },   // Waypoint 2
      { x: 8, y: 5 },    // Waypoint 3
      { x: 7, y: 3 }    // Waypoint 4
    ],
    commandCount: 4,
    message: "🎉 Success! You've completed the waypoint challenge using exactly 4 commands!"
  },
  // Display example solution as placeholder code
  placeholderCode: "hero.moveDown(3)\nhero.moveLeft(3)\nhero.moveUp(9)\nhero.moveLeft(1)",
  // Add visual markings for waypoints
  waypointMarkers: [
    { x: 11, y: 14, label: "1️⃣" },
    { x: 8, y: 14, label: "2️⃣" },
    { x: 8, y: 5, label: "3️⃣" },
    { x: 7, y: 3, label: "4️⃣" }
  ]
};

export default waypoints; 