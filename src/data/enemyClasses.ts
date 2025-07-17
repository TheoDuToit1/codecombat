export interface EnemyClass {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  health: number;
  speed: number;
  damage: number;
  attackType: 'melee' | 'ranged' | 'magic' | 'special';
}

// Four standardized enemy classes for consistent use across the application
export const ENEMY_CLASSES: EnemyClass[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    color: 'bg-green-600',
    icon: '👺',
    description: 'Small melee enemy. Weak but fast.',
    health: 60,
    speed: 3,
    damage: 8,
    attackType: 'melee'
  },
  {
    id: 'ghost',
    name: 'Crawlers',
    color: 'bg-cyan-500',
    icon: '👻',
    description: 'Fast moving enemy that can phase through obstacles.',
    health: 40,
    speed: 4,
    damage: 5,
    attackType: 'special'
  },
  {
    id: 'orc',
    name: 'Orc',
    color: 'bg-red-700',
    icon: '👹',
    description: 'Strong enemy with ranged attacks.',
    health: 80,
    speed: 2,
    damage: 12,
    attackType: 'ranged'
  },
  {
    id: 'sorcerer',
    name: 'Beasts',
    color: 'bg-violet-500', 
    icon: '🧙',
    description: 'Magic caster with area-of-effect attacks.',
    health: 50,
    speed: 2,
    damage: 15,
    attackType: 'magic'
  }
];

// Helper function to get an enemy class by ID
export const getEnemyClassById = (id: string): EnemyClass => {
  return ENEMY_CLASSES.find(enemyClass => enemyClass.id === id) || ENEMY_CLASSES[0];
}; 