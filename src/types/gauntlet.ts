export type TileType =
  | 'wall'
  | 'empty'
  | 'gem'
  | 'food'
  | 'key'
  | 'exit'
  | 'fire'
  | 'enemy';

export interface LevelConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  tiles: string[][];
  playerStart: { x: number; y: number };
  width: number;
  height: number;
  objective?: string;
  allowedCommands?: string[];
  timeLimit?: number;
  collectibles?: {
    gems?: number;
    keys?: number;
    food?: number;
  };
  enemies?: {
    count: number;
    positions: { x: number; y: number }[];
    types: string[];
  };
}

export interface GauntletState {
  level: number;
  health: number;
  score: number;
  gems: number;
  keys: number;
  food: number;
  playerPosition: { x: number; y: number };
  enemyPositions: { x: number; y: number; type: string }[];
  timeRemaining: number;
  levelComplete: boolean;
  gameOver: boolean;
}

export interface GauntletAction {
  movePlayer: (dx: number, dy: number) => void;
  collectItem: (x: number, y: number) => void;
  attackEnemy: (x: number, y: number) => void;
  useSpecialAbility: () => void;
  resetLevel: () => void;
}

export interface GauntletContext {
  state: GauntletState;
  actions: GauntletAction;
} 