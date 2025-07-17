export interface CharacterClass {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  health: number;
  speed: number;
  damage: number;
  attackType: 'melee' | 'ranged' | 'magic' | 'special';
  specialAbility: string;
}

// Four standardized character classes for consistent use across the application
export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    color: 'bg-red-500',
    icon: '🛡️',
    description: 'Melee fighter with high defense and health.',
    health: 100,
    speed: 3,
    damage: 15,
    attackType: 'melee',
    specialAbility: 'Shield Bash - Stuns enemies'
  },
  {
    id: 'wizard',
    name: 'Wizard',
    color: 'bg-blue-500',
    icon: '🪄',
    description: 'Magic user with powerful area-of-effect spells.',
    health: 60,
    speed: 2,
    damage: 20,
    attackType: 'magic',
    specialAbility: 'Fireball - Area damage spell'
  },
  {
    id: 'elf',
    name: 'Elf',
    color: 'bg-green-500',
    icon: '🏹',
    description: 'Ranged attacker with high speed and accuracy.',
    health: 70,
    speed: 5,
    damage: 12,
    attackType: 'ranged',
    specialAbility: 'Multi-shot - Attack multiple targets'
  },
  {
    id: 'assassin',
    name: 'Assassin',
    color: 'bg-purple-500',
    icon: '🗡️',
    description: 'Agile fighter with stealth and critical strike abilities.',
    health: 75,
    speed: 5,
    damage: 18,
    attackType: 'melee',
    specialAbility: 'Shadow Strike - High damage from stealth'
  }
];

// Helper function to get a character class by ID
export const getCharacterClassById = (id: string): CharacterClass => {
  return CHARACTER_CLASSES.find(characterClass => characterClass.id === id) || CHARACTER_CLASSES[0];
}; 