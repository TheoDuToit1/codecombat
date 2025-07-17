import { LevelConfig } from '../types/XCodeLevelTypes';
import meetTheHero from '../maps/xcodeacademy/sc1/level1/meetthehero';
import directions from '../maps/xcodeacademy/sc1/level2/directions';
import collecting from '../maps/xcodeacademy/sc1/level3/collecting';
import waypoints from '../maps/xcodeacademy/sc1/level4/waypoints';
import variableChallenge from '../maps/xcodeacademy/sc1/level5/variable';
import collectPotion from '../maps/xcodeacademy/sc1/level6/collect_the_diamond';
import twoGems from '../maps/xcodeacademy/sc1/level7/simple_conditions';
import threeGems from '../maps/xcodeacademy/sc1/level8/threecollectibles';

// Map lesson IDs to their corresponding level configurations
export const LESSON_MAPS: Record<number, LevelConfig> = {
  1: meetTheHero,
  2: directions,
  3: collecting,
  4: waypoints,
  5: variableChallenge,
  6: collectPotion,
  7: twoGems,
  8: threeGems,
  // Add more lesson maps as they are created
};

// Helper function to get lesson map by ID
export const getLessonMap = (lessonId: number): LevelConfig | null => {
  return LESSON_MAPS[lessonId] || null;
}; 