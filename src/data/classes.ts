export type CharacterClass = 'warrior' | 'wizard' | 'elf' | 'assassin';

export interface CharacterConfig {
  name: string;
  speed: number;
  health: number;
  attackType: 'melee' | 'ranged' | 'magic';
  spriteKey: string;
}

export const CHARACTER_CLASSES: Record<CharacterClass, CharacterConfig> = {
  warrior: {
    name: 'Warrior',
    speed: 2,
    health: 100,
    attackType: 'melee',
    spriteKey: 'warrior',
  },
  wizard: {
    name: 'Wizard',
    speed: 1,
    health: 70,
    attackType: 'magic',
    spriteKey: 'wizard',
  },
  elf: {
    name: 'Elf',
    speed: 3,
    health: 80,
    attackType: 'ranged',
    spriteKey: 'elf',
  },
  assassin: {
    name: 'Assassin',
    speed: 2.5,
    health: 90,
    attackType: 'melee',
    spriteKey: 'assassin',
  },
};

// Animation actions available for characters and enemies
export const ACTIONS = [
  'Idle',
  'Walk',
  'Run',
  'Attack',
  'Hurt',
  'Die',
  'Interact',
  'Guard',
  'Punch',
  'Dance',
] as const;

// Direction keys for 8-directional movement
export const DIRECTIONS = [
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
  'nw',
] as const;

// Mapping for display labels
export const DIRECTION_LABELS = {
  n: 'N',
  ne: 'NE',
  e: 'E',
  se: 'SE',
  s: 'S',
  sw: 'SW',
  w: 'W',
  nw: 'NW',
} as const; 