import { LevelConfig } from '../types/gauntlet';
import meetTheHero from '../maps/xcodeacademy/sc1/level1/meetthehero';
import directions from '../maps/xcodeacademy/sc1/level2/directions';
import collecting from '../maps/xcodeacademy/sc1/level3/collecting';

// Map lesson IDs to their corresponding level configurations
export const LESSON_MAPS: Record<number, LevelConfig> = {
  1: meetTheHero,
  2: directions,
  3: collecting,
  // Add more lesson maps as they are created
};

// Helper function to get lesson map by ID
export const getLessonMap = (lessonId: number): LevelConfig | null => {
  return LESSON_MAPS[lessonId] || null;
};

// Helper function to get lesson map with fallback to babylon
export const getLessonMapWithFallback = (lessonId: number, fallbackMap: LevelConfig): LevelConfig => {
  return LESSON_MAPS[lessonId] || fallbackMap;
}; 