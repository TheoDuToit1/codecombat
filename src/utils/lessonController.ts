import { CS1Lesson } from '../data/cs1LessonData';
import { SuccessCriteria } from '../types/XCodeLevelTypes';

// Define a type that matches the actual lesson data structure
interface LessonData {
  id: number;
  lessonNumber: number;
  title: string;
  description: string;
  goals?: string[]; // This exists in the actual data
  objectives?: string[]; // This is in the interface
  concept: string;
  difficulty: number;
  estimatedTime: number;
  mentor: {
    name: string;
    icon: string;
  };
  week: number;
  codeExample?: string;
  hints?: string[];
  unlocks?: string;
}

interface LessonState {
  isActive: boolean;
  isRunning: boolean;
  isSuccess: boolean;
  executionLogs: string[];
  code: string;
  codePlaceholder: string;
  currentExecutingLine: number;
  codeLines: string[];
  characterPosition: { x: number; y: number };
  characterDirection: 'up' | 'down' | 'left' | 'right';
  characterState: 'idle' | 'walk' | 'attack';
}

interface LessonStartParams {
  lessonId: number;
  lessonData: LessonData;
  onStateChange: (state: Partial<LessonState>) => void;
}

interface LessonSuccessParams {
  lessonId: number;
  onStateChange: (state: Partial<LessonState> | ((prevState: Partial<LessonState>) => Partial<LessonState>)) => void;
  onComplete?: (lessonId: number) => void;
  successMessage?: string;
}

// Cache for level configs to avoid repeated imports
const levelConfigCache: Record<number, any> = {};

/**
 * Get the level config for a specific lesson
 */
const getLevelConfig = async (lessonId: number) => {
  if (levelConfigCache[lessonId]) {
    return levelConfigCache[lessonId];
  }
  
  try {
    let config;
    switch (lessonId) {
      // case 1:
      //   config = (await import('../maps/xcodeacademy/sc1/level1/meetthehero')).default;
      //   break;
      // case 2:
      //   config = (await import('../maps/xcodeacademy/sc1/level2/directions')).default;
      //   break;
      // case 3:
      //   config = (await import('../maps/xcodeacademy/sc1/level3/collecting')).default;
      //   break;
      // case 4:
      //   config = (await import('../maps/xcodeacademy/sc1/level4/waypoints')).default;
      //   break;
      // case 5:
      //   config = (await import('../maps/xcodeacademy/sc1/level5/variable')).default;
      //   break;
      // case 6:
      //   config = (await import('../maps/xcodeacademy/sc1/level6/collect_the_diamond')).default;
      //   break;
      // case 7:
      //   config = (await import('../maps/xcodeacademy/sc1/level7/simple_conditions')).default;
      //   break;
      // case 8:
      //   config = (await import('../maps/xcodeacademy/sc1/level8/threecollectibles')).default;
      //   break;
      default:
        return null;
    }
    
    levelConfigCache[lessonId] = config;
    return config;
  } catch (error) {
    console.error(`Failed to load level config for lesson ${lessonId}:`, error);
    return null;
  }
};

/**
 * Standard behavior to execute when a lesson starts
 */
export const onLessonStart = async ({ lessonId, lessonData, onStateChange }: LessonStartParams) => {
  // Get starting position based on lesson ID
  const startPosition = await getLessonStartPosition(lessonId);
  
  // Get code placeholder based on lesson
  const placeholder = lessonData.codeExample || '';
  
  // Reset all lesson state
  onStateChange({
    isActive: true,
    isRunning: false,
    isSuccess: false,
    executionLogs: ['Ready to start coding!'],
    code: '',
    codePlaceholder: placeholder,
    currentExecutingLine: -1,
    codeLines: [],
    characterPosition: startPosition,
    characterDirection: 'right',
    characterState: 'idle'
  });
  
  // Log lesson start
  console.log(`Lesson ${lessonId} started: ${lessonData.title}`);
};

/**
 * Standard behavior to execute when a lesson is completed successfully
 */
export const onLessonSuccess = ({ lessonId, onStateChange, onComplete, successMessage }: LessonSuccessParams) => {
  // Update state to show success
  onStateChange((prevState) => ({
    ...prevState,
    isSuccess: true,
    isRunning: false,
    executionLogs: [...(prevState.executionLogs || []), successMessage || "🎉 Congratulations! You've completed this lesson!"]
  }));
  
  // Mark lesson as completed if callback provided
  if (onComplete) {
    onComplete(lessonId);
  }
  
  // Log lesson completion
  console.log(`Lesson ${lessonId} completed successfully`);
};

// Change getLessonStartPosition to async and use dynamic import
export const getLessonStartPosition = async (lessonId: number): Promise<{ x: number; y: number }> => {
  try {
    let config;
    switch (lessonId) {
      // case 1:
      //   config = (await import('../maps/xcodeacademy/sc1/level1/meetthehero')).default;
      //   break;
      // case 2:
      //   config = (await import('../maps/xcodeacademy/sc1/level2/directions')).default;
      //   break;
      // case 3:
      //   config = (await import('../maps/xcodeacademy/sc1/level3/collecting')).default;
      //   break;
      // case 4:
      //   config = (await import('../maps/xcodeacademy/sc1/level4/waypoints')).default;
      //   break;
      // case 5:
      //   config = (await import('../maps/xcodeacademy/sc1/level5/variable')).default;
      //   break;
      // case 6:
      //   config = (await import('../maps/xcodeacademy/sc1/level6/collect_the_diamond')).default;
      //   break;
      // case 7:
      //   config = (await import('../maps/xcodeacademy/sc1/level7/simple_conditions')).default;
      //   break;
      // case 8:
      //   config = (await import('../maps/xcodeacademy/sc1/level8/threecollectibles')).default;
      //   break;
      default:
        config = null;
    }
    // No external config, always use fallback below
  } catch (e) {
    // Ignore errors and fall back to defaults
  }
  // Fallbacks for legacy lessons or if config is missing
  switch (lessonId) {
    case 1:
      return { x: 6, y: 14 };
    case 2:
      return { x: 6, y: 10 };
    case 3:
      return { x: 5, y: 0 };
    case 4:
      return { x: 11, y: 11 };
    case 5:
      return { x: 7, y: 3 };
    case 7:
      return { x: 5, y: 1 };
    case 8:
      return { x: 5, y: 5 };
    default:
      return { x: 5, y: 5 };
  }
};

/**
 * Check if a lesson is completed based on specific success criteria
 */
export const checkLessonSuccess = async (
  lessonId: number,
  state: {
    code: string;
    characterPosition: { x: number; y: number };
    directionsUsed?: { up: boolean; down: boolean; left: boolean; right: boolean };
    waypointsVisited?: { x: number; y: number }[];
  }
): Promise<{ success: boolean; message?: string }> => {
  const { code, characterPosition, directionsUsed, waypointsVisited } = state;
  
  // Try to get level config for more specific success criteria
  const levelConfig = await getLevelConfig(lessonId);
  const successCriteria = levelConfig?.successCriteria as SuccessCriteria | undefined;
  
  if (successCriteria) {
    // Use success criteria from level config
    switch (successCriteria.type) {
      case 'position':
        if (successCriteria.position && 
            characterPosition.x === successCriteria.position.x && 
            characterPosition.y === successCriteria.position.y) {
          return { success: true, message: successCriteria.message };
        }
        break;
        
      case 'allDirections':
        if (directionsUsed?.up && directionsUsed?.down && 
            directionsUsed?.left && directionsUsed?.right) {
          return { success: true, message: successCriteria.message };
        }
        break;
        
      case 'multiStep':
        if (/hero\.move(Up|Down|Left|Right)\s*\(\s*\d+\s*\)/.test(code)) {
          return { success: true, message: successCriteria.message };
        }
        break;
        
      case 'waypoints':
        // For waypoints, we need to check if the final waypoint is reached and command count
        if (successCriteria.waypoints && successCriteria.waypoints.length > 0) {
          const finalWaypoint = successCriteria.waypoints[successCriteria.waypoints.length - 1];
          const commandCount = code.split('\n').filter(line => 
            /hero\.move(Up|Down|Left|Right)\s*\(\s*\d+\s*\)/.test(line)
          ).length;
          
          if (characterPosition.x === finalWaypoint.x && 
              characterPosition.y === finalWaypoint.y &&
              (!successCriteria.commandCount || commandCount === successCriteria.commandCount)) {
            return { success: true, message: successCriteria.message };
          }
        }
        break;
        
      case 'variable':
        // For variable lesson (book collection)
        if (successCriteria.position && 
            characterPosition.x === successCriteria.position.x && 
            characterPosition.y === successCriteria.position.y) {
          
          // Check if we're using variables
          const hasVariableDeclaration = /let\s+\w+\s*=/.test(code) || 
                                       /const\s+\w+\s*=/.test(code) || 
                                       /var\s+\w+\s*=/.test(code);
          
          // Check command count if specified
          const commandCount = code.split('\n').filter(line => 
            /hero\.move(Up|Down|Left|Right)/.test(line)
          ).length;
          
          if (hasVariableDeclaration && 
              (!successCriteria.commandCount || commandCount === successCriteria.commandCount)) {
            return { success: true, message: successCriteria.message };
          }
        }
        break;
        
      // Add other success criteria types as needed
    }
    
    // Not successful with level config criteria
    return { success: false };
  }
  
  // Specific lesson success checks
  switch (lessonId) {
    case 1: // Meet Your Hero
      // Success when character reaches position (6, 10) OR when the code has multiple moveUp commands
      if (characterPosition.x === 6 && characterPosition.y === 10) {
        return { success: true, message: "🎉 Success! You've reached the fountain!" };
      }
      
      // Alternative success condition: check if they've submitted the right code pattern
      const moveUpCount = (code.match(/hero\.moveUp\(\)/g) || []).length;
      if (moveUpCount >= 4) {
        return { success: true, message: "🎉 Success! You've written the correct commands to reach the fountain!" };
      }
      break;
      
    case 2: // Directions and Movement
      // Success when all four directions are used
      if (directionsUsed?.up && directionsUsed?.down && 
          directionsUsed?.left && directionsUsed?.right) {
        return { success: true, message: "🎉 Success! You've used all four directions and completed the objective!" };
      }
      break;
      
    case 3: // Move Multiple Steps
      // Success when a number is used in brackets
      if (/hero\.move(Up|Down|Left|Right)\s*\(\s*\d+\s*\)/.test(code)) {
        return { success: true, message: "🎉 Success! You used a number in the brackets to move multiple steps!" };
      }
      break;
      
    case 4: // Waypoint Challenge
      // Success when all waypoints are visited in order with 4 commands
      if (characterPosition.x === 7 && characterPosition.y === 3) {
        return { success: true, message: "🎉 Success! You've completed the waypoint challenge!" };
      }
      break;
      
    case 5: // What is a Variable?
      // Success when returned to start position with only 2 lines of code
      const codeLines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
      if (characterPosition.x === 7 && characterPosition.y === 3 && codeLines.length <= 2) {
        return { success: true, message: "🎉 Success! You've collected the book and returned using only 2 lines of code!" };
      }
      break;
      
    case 6: // Check Health
      // Success when health is checked and potion is used
      if (/if\s*\(\s*hero\.health/.test(code) && 
          /hero\.usePotion\(\)/.test(code)) {
        return { success: true, message: "🎉 Success! You've checked health and used a potion!" };
      }
      break;
      
    case 7: // Collect Two Gems
      // Success when character reaches the final gem position
      if (characterPosition.x === 11 && characterPosition.y === 13) {
        return { success: true, message: "🎉 Success! You've collected both gems!" };
      }
      break;
      
    case 8: // Puzzle Level: Move, Collect, Decide
      // Success when movement, collection, and decision-making are combined
      if (/hero\.move(Up|Down|Left|Right)/.test(code) && 
          /hero\.collect\(\)/.test(code) && 
          /if\s*\(/.test(code)) {
        return { success: true, message: "🎉 Success! You've combined movement, collection, and decision-making!" };
      }
      break;
      
    // Lesson 9: Hazard Zones
    case 9:
      // Success if they've moved to the goal position (7, 12)
      if (characterPosition.x === 7 && characterPosition.y === 12) {
        return { success: true, message: "🎉 Great job! You've reached the goal!" };
      }
      break;
  }
  
  // Not successful
  return { success: false };
};

/**
 * Create confetti animation for lesson success
 */
export const createSuccessConfetti = () => {
  // Clear any existing confetti
  const existingConfetti = document.querySelectorAll('.confetti');
  existingConfetti.forEach(element => element.remove());
  
  // Create new confetti pieces
  const colors = ['#ff5252', '#ffeb3b', '#2196f3', '#4caf50', '#e040fb', '#ff9800'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.opacity = `${Math.random() + 0.5}`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}; 