// XCodeLevelTypes.ts - Types for XCode Combat level structure and positioning

export type TileType =
  | 'wall'
  | 'empty'
  | 'gem'
  | 'food'
  | 'key'
  | 'exit'
  | 'fire'
  | 'enemy';

// Define success criteria types
export type SuccessCriteriaType = 
  | 'position' 
  | 'allDirections' 
  | 'multiStep' 
  | 'waypoints' 
  | 'variable' 
  | 'healthCheck' 
  | 'condition' 
  | 'combined';

// Define success criteria interface
export interface SuccessCriteria {
  type: SuccessCriteriaType;
  position?: { x: number; y: number };
  waypoints?: { x: number; y: number }[];
  commandCount?: number;
  message: string;
}

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
  // Add new properties for Lesson Start/End system
  successTarget?: { x: number; y: number };
  successCriteria?: SuccessCriteria;
  // New properties for enhanced level features
  placeholderCode?: string;
  waypointMarkers?: { x: number; y: number; label: string }[];
} 