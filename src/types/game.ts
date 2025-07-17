export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Character {
  id: string;
  name: string;
  position: Position;
  size: Size;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'idle' | 'walking' | 'attacking';
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  inventory: string[];
}

export interface Enemy {
  id: string;
  // Note: 'ghost' is displayed as 'Crawlers' and 'sorcerer' is displayed as 'Beasts' in the UI
  type: 'grunt' | 'ghost' | 'demon' | 'sorcerer' | 'lobber' | 'death' | 'orc' | 'skeleton' | 'dragon' | 'angryPea';
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  isAlive: boolean;
  speed: number;
  behavior: 'chase' | 'shoot' | 'teleport' | 'patrol';
  spawnedFromGenerator?: boolean;
  generatorId?: string;
  spriteType?: 'warrior' | 'angryPea'; // Custom sprite type for rendering
  direction?: 'up' | 'down' | 'left' | 'right'; // Direction the enemy is facing
  state?: 'idle' | 'chasing' | 'attacking'; // Current state for animation
  lastUpdate?: number; // Timestamp of last update for movement timing
}

export interface Level {
  id: string;
  name: string;
  map: string[][];
  enemies: Enemy[];
  items: Item[];
  startPosition: Position;
  exitPosition: Position;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'key';
  effect?: {
    type: 'health' | 'attack' | 'defense' | 'speed';
    value: number;
  };
  position?: Position;
}

export interface GameState {
  character: Character;
  currentLevel: Level;
  inventory: Item[];
  gameTime: number;
  score: number;
}

export interface Asset {
  id: string;
  name: string;
  tags: string[];
  spriteSheet: string;
  behaviorCode: string;
  frameWidth: number;
  frameHeight: number;
  createdAt: string;
}

export interface Animation {
  name: string;
  frames: number[];
  frameRate: number;
  loop: boolean;
}

export interface SpriteSheet {
  id: string;
  name: string;
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, Animation>;
}

export interface Character {
  name: string;
  class: 'warrior' | 'valkyrie' | 'wizard' | 'elf' | 'monster';
  position: Position;
  health: number;
  maxHealth: number;
  food: number;
  maxFood: number;
  gems: number;
  hasKey: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  specialPower?: string;
  level: number;
  experience: number;
}

export interface Collectible {
  id: string;
  position: Position;
  type: 'gem' | 'heart' | 'key' | 'coin' | 'food' | 'potion' | 'treasure';
  value: number;
  collected: boolean;
  effect?: string;
  duration?: number;
}

export interface Obstacle {
  id: string;
  position: Position;
  type: 'wall' | 'spike' | 'fire' | 'poison' | 'acid' | 'it' | 'generator' | 'water' | 'lava';
  damage?: number;
  generatesType?: string;
  generationRate?: number;
  health?: number;
}

// New Construct 3-style sprite interfaces
export interface SpriteAnimation {
  name: string;
  frames: string[];
  settings: {
    speed: number;
    loop: boolean;
    pingPong: boolean;
    reverse: boolean;
  };
}

export interface SpriteDirection {
  frames: SpriteFrame[];
  frameCount: number;
  animationSpeed: number;
  loop: boolean;
}

export interface SpriteFrame {
  id: string;
  url: string;
  width: number;
  height: number;
  sourceX: number; // X position in sprite sheet
  sourceY: number; // Y position in sprite sheet (usually 0 for horizontal sheets)
}

export interface SpriteSheet {
  id: string;
  name: string;
  animationType: 'idle' | 'walk' | 'attack' | 'death';
  direction: 'down' | 'left' | 'right' | 'up';
  file: File;
  url: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animationSpeed: number;
  frames: SpriteFrame[];
}

export enum TileType {
  Empty = 0,
  Wall = 1,
  Floor = 2,
  Crate = 3,
  Exit = 4
}

export interface TileData {
  type: TileType;
  x: number;
  y: number;
  properties?: {
    [key: string]: unknown;
  };
}

export interface TileMap {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileData[];
  startPosition: {
    x: number;
    y: number;
  };
  exitPosition?: {
    x: number;
    y: number;
  };
}

export interface CodeExecution {
  success: boolean;
  error?: string;
  steps: ExecutionStep[];
}

export interface ExecutionStep {
  type: 'move' | 'attack' | 'collect' | 'wait' | 'say';
  data: unknown;
  timestamp: number;
}

// Gauntlet-specific interfaces
export interface Generator {
  id: string;
  position: Position;
  // Note: 'ghost' is displayed as 'Crawlers' in the UI
  type: 'grunt' | 'ghost' | 'demon';
  health: number;
  maxHealth: number;
  generationRate: number; // in seconds
  lastGenerated: number;
  isActive: boolean;
}

export interface PowerUp {
  id: string;
  type: 'health' | 'speed' | 'strength' | 'shield' | 'key' | 'potion';
  position: Position;
  value: number;
  isCollected: boolean;
}

export interface GauntletVoiceLine {
  text: string;
  trigger: string;
  played: boolean;
}

export interface AnimationFolder {
  id: string;
  name: string;
  animations: number[]; // Array of animation indices
  isOpen: boolean;
}

export interface Sprite {
  id: string;
  name: string;
  animations: SpriteAnimation[];
  folders: AnimationFolder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Projectile {
  id: string;
  type: 'arrow' | 'fireball' | 'ice' | 'magic';
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
  damage: number;
  speed: number;
  isActive: boolean;
  sourceId: string; // ID of the entity that fired the projectile
}

export interface FoodItem {
  id: string;
  type: 'apple' | 'bread' | 'meat' | 'potion';
  position: Position;
  value: number;
  isCollected: boolean;
}