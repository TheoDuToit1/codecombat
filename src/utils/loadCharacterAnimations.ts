import { SpriteAnimation } from '../types/game';

export type AnimationType = 'idle' | 'walk' | 'attack' | 'death';
export type Direction = 'down' | 'left' | 'right' | 'up';
export type CharacterClass = 'warrior' | 'wizard' | 'elf' | 'assassin' | 'mage';

// Statically import all possible frames for all classes/types/directions
const allFrames: Record<CharacterClass, Record<string, Record<string, string>>> = {
  warrior: {
    idle_down: import.meta.glob('/src/assets/characters/warrior/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/warrior/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/warrior/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/warrior/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/warrior/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/warrior/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/warrior/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/warrior/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/warrior/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/warrior/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/warrior/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/warrior/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/warrior/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/warrior/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/warrior/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/warrior/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  wizard: {
    idle_down: import.meta.glob('/src/assets/characters/wizard/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/wizard/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/wizard/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/wizard/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/wizard/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/wizard/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/wizard/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/wizard/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/wizard/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/wizard/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/wizard/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/wizard/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/wizard/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/wizard/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/wizard/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/wizard/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  elf: {
    idle_down: import.meta.glob('/src/assets/characters/elf/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/elf/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/elf/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/elf/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/elf/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/elf/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/elf/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/elf/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/elf/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/elf/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/elf/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/elf/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/elf/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/elf/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/elf/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/elf/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  assassin: {
    idle_down: import.meta.glob('/src/assets/characters/assassin/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/assassin/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/assassin/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/assassin/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/assassin/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/assassin/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/assassin/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/assassin/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/assassin/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/assassin/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/assassin/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/assassin/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/assassin/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/assassin/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/assassin/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/assassin/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  mage: {
    idle_down: import.meta.glob('/src/assets/characters/mage/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/mage/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/mage/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/mage/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/mage/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/mage/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/mage/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/mage/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/mage/Swing_Down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/mage/Swing_Left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/mage/Swing_Right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/mage/Swing_Up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: {},
    death_left: {},
    death_right: {},
    death_up: {},
  },
};

function getFrameUrls(characterClass: CharacterClass, animType: AnimationType, dir: Direction): string[] {
  const key = `${animType}_${dir}`;
  const modules = allFrames[characterClass]?.[key] || {};
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

// Static mapping for all decoy (assasin-wolf) animation/direction pairs
const decoyFrameGlobs: { [key: string]: Record<string, unknown> } = {
  idle_down: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  idle_left: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  idle_right: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  idle_up: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  walk_down: import.meta.glob('/public/assets/characters/assasin-wolf/Walk_Down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  walk_left: import.meta.glob('/public/assets/characters/assasin-wolf/Walk_Left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  walk_right: import.meta.glob('/public/assets/characters/assasin-wolf/Walk_Right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  walk_up: import.meta.glob('/public/assets/characters/assasin-wolf/Walk_Up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  attack_down: import.meta.glob('/public/assets/characters/assasin-wolf/Swing_Down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  attack_left: import.meta.glob('/public/assets/characters/assasin-wolf/Swing_Left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  attack_right: import.meta.glob('/public/assets/characters/assasin-wolf/Swing_Right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  attack_up: import.meta.glob('/public/assets/characters/assasin-wolf/Swing_Up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  death_down: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  death_left: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  death_right: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  death_up: import.meta.glob('/public/assets/characters/assasin-wolf/Idle_Up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
};

function getCustomDecoySpriteAnimation(animType: AnimationType, dir: Direction): SpriteAnimation {
  const key = `${animType}_${dir}`;
  const modules = decoyFrameGlobs[key] || {};
  const frames = Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => {
      // Transform URL from '/public/assets/...' to '/assets/...' format for browser access
      const urlStr = url as string;
      return urlStr.replace('/public/assets/', '/assets/');
    });
  return {
    name: key,
    frames,
    settings: {
      speed: animType === 'walk' ? 1.2 : 1, // Slightly faster animation for walking for smoother movement
      loop: true,
      pingPong: false,
      reverse: false,
    }
  };
}

export function loadCharacterAnimations(characterClass: CharacterClass | 'assasin-wolf'): Record<string, Record<string, SpriteAnimation>> {
  const animationTypes: AnimationType[] = ['idle', 'walk', 'attack', 'death'];
  const directions: Direction[] = ['down', 'left', 'right', 'up'];
  const animations: Record<string, Record<string, SpriteAnimation>> = {};

  for (const animType of animationTypes) {
    const stateKey = animType.toLowerCase();
    animations[stateKey] = {};
    for (const dir of directions) {
      const dirKey = dir.toLowerCase();
      if (characterClass === 'assasin-wolf') {
        animations[stateKey][dirKey] = getCustomDecoySpriteAnimation(animType, dir);
      } else {
        animations[stateKey][dirKey] = getFrameUrls(characterClass as CharacterClass, animType, dir) as unknown as SpriteAnimation;
      }
    }
  }

  return animations;
} 