import { LevelConfig } from '../../../../types/gauntlet';

const meetTheHero: LevelConfig = {
  id: 'xcodeacademy-sc1-level1-meetthehero',
  name: '1. Meet Your Hero',
  description: 'Begin your journey in the Syntaxia Courtyard. Learn to control your hero and explore the basics of movement.',
  difficulty: 'easy',
  width: 24,
  height: 16,
  playerStart: { x: 18, y: 7 },
  tiles: [
    // Row 0 (top border)
    Array(24).fill('wall'),
    // Rows 1-7 (walls on sides, empty inside)
    ...Array(7).fill(null).map(() => ['wall', ...Array(22).fill('empty'), 'wall']),
    // Row 8 (center row, place EN in the center)
    ['wall', ...Array(10).fill('empty'), 'EN', ...Array(11).fill('empty'), 'wall'],
    // Rows 9-14 (walls on sides, empty inside)
    ...Array(6).fill(null).map(() => ['wall', ...Array(22).fill('empty'), 'wall']),
    // Row 15 (bottom border)
    Array(24).fill('wall'),
  ],
  objective: 'Learn to control your hero and take your first steps in the world of coding!',
  collectibles: {
    gems: 0,
    keys: 0
  },
  enemies: {
    count: 0,
    positions: [],
    types: []
  }
};

export default meetTheHero; 