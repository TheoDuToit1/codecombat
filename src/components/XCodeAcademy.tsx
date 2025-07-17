// XCodeAcademy Component
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Code, Star, Clock, Award, CheckCircle, Lock, Play, Presentation } from 'lucide-react';
import { X_CODE_LESSONS, XCodeLesson, MENTOR_DATA, COURSE_STRUCTURE } from '../data/X_CODE_LESSONS';
import { ProgressService } from '../services/ProgressService';
import { CS1_QUIZZES } from '../data/cs1QuizData';
import ReactModal from 'react-modal';
import { CS1QuizModal } from './CS1QuizModal';
import { ACHIEVEMENT_BADGES } from '../data/achievements';
import { useParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from './CodeEditor';
import { GameGrid, GameGridHandle } from './GameGrid';
import { ExecutionLog } from './ExecutionLog';
import { GameStats } from './GameStats';
import { loadCharacterAnimations } from '../utils/loadCharacterAnimations';
import { AnimatedCharacter } from './AnimatedCharacter';
import { LessonBackground } from './LessonBackground';
// Import our new lesson controller
import { 
  onLessonStart, 
  onLessonSuccess, 
  checkLessonSuccess, 
  createSuccessConfetti 
} from '../utils/lessonController';
// Import our lesson animations CSS
import '../styles/lessonAnimations.css';
import LoadingScreen from './LoadingScreen';

// Add this at the top level, before any function/component usage
const SPIKE_TRAP_POS = { x: 6, y: 5 };

// CSS for the glowing animation
const glowingGreenButtonStyle = {
  animation: 'glowingGreen 2s ease-in-out infinite',
  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
  transition: 'all 0.3s ease',
  color: 'rgb(34, 197, 94)',
  borderColor: 'rgba(34, 197, 94, 0.3)'
};

// Add CSS keyframes for animations
const animationStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes zoomInOut {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .zoom-effect {
    animation: zoomInOut 1s ease;
    display: inline-block;
  }
  
  @keyframes flashingGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .flashing-orange-gradient {
    background: linear-gradient(45deg, #f97316, #fb923c, #fdba74, #fb923c, #f97316);
    background-size: 200% 200%;
    animation: flashingGradient 1.5s ease infinite;
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  /* Confetti animation */
  @keyframes confetti-fall {
    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
  }
  
  .confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    z-index: 1000;
    animation: confetti-fall 4s ease-out forwards;
  }
  
  /* Victory screen animations */
  @keyframes victory-background {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes victory-image-appear {
    0% { transform: translateY(100px) scale(0.5); opacity: 0; }
    40% { transform: translateY(-20px) scale(1.1); opacity: 1; }
    60% { transform: translateY(0) scale(1); opacity: 1; }
    80% { transform: translateY(-10px) scale(1.05); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  
  @keyframes victory-button-appear {
    0% { transform: translateY(50px); opacity: 0; }
    70% { transform: translateY(-10px); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  .victory-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: victory-background 0.5s ease-out forwards;
  }
  
  .victory-image {
    width: 350px;
    height: auto;
    animation: victory-image-appear 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 0.2s;
    opacity: 0;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
  }
  
  .victory-button {
    margin-top: 40px;
    animation: victory-button-appear 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 1s;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .victory-button:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
  
  .victory-stars {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: radial-gradient(circle, rgba(30,30,60,0) 0%, rgba(15,15,30,1) 100%);
    overflow: hidden;
  }
  
  .star {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: white;
    animation: twinkle 2s infinite alternate;
  }
  
  @keyframes twinkle {
    0% { opacity: 0.2; }
    100% { opacity: 1; }
  }
  
  /* Success message animation (legacy) */
  @keyframes success-appear {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .success-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    background: linear-gradient(45deg, #10b981, #059669);
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 100;
    animation: success-appear 0.8s ease-out forwards;
    text-align: center;
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    80% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  .victory-image {
    /* ...existing styles... */
    animation: bounceIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, victory-image-appear 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 0.1s, 0.2s;
    opacity: 0;
  }
  @keyframes confetti-fall {
    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
  }
  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    opacity: 0.8;
    animation: confetti-fall 2.5s linear forwards;
    z-index: 1100;
  }
  @keyframes button-pop {
    0% { transform: scale(0.8); }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  .victory-button {
    /* ...existing styles... */
    animation: button-pop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.2s both, victory-button-appear 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    box-shadow: 0 0 16px 2px rgba(255,255,255,0.2);
  }
  .victory-button:hover {
    transform: scale(1.12) rotate(-2deg);
    filter: brightness(1.2);
    box-shadow: 0 0 32px 4px rgba(255,255,255,0.3);
  }
  @keyframes text-pop {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .victory-text {
    font-size: 3rem;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 0 2px 8px #000, 0 0 32px #FFD700;
    animation: text-pop 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
    margin-bottom: 0.5rem;
    letter-spacing: 0.1em;
  }
  @keyframes star-bg-move {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  .victory-stars {
    /* ...existing styles... */
    animation: star-bg-move 20s linear infinite;
  }
`;

interface XCodeAcademyProps {
  onBack?: () => void;
  currentProgress?: number;
  showCoursesView?: boolean;
  onStartLessonLevel?: (lessonId: number) => void;
}

// Define weekly themes for better display
const WEEK_THEMES = {
  1: "First Steps",
  2: "Basic Loops",
  3: "Functions & Organization",
  4: "Basic Data Structures",
  5: "Review and Mastery"
};

// Helper to determine if a lesson is CS1
const isCS1Lesson = (lesson: XCodeLesson | any): lesson is XCodeLesson => {
  return lesson && typeof lesson.id === 'number' && typeof lesson.title === 'string';
};

// Simple lesson data
const LESSON_DATA = {
  1: {
    title: "Moving Your Hero",
    description: "Learn to move your hero with code",
    objectives: ["Understand character control and screen orientation"],
    hints: ["Use hero.moveRight() to move your hero to the right"],
    codeExample: "hero.moveRight()"
  }
};

// Helper function to highlight syntax
const highlightCode = (code: string) => {
  return code
    .replace(/hero\./g, '<span style="color: #93c5fd;">hero</span>.')
    .replace(/moveRight|moveLeft|moveUp|moveDown/g, match => 
      `<span style="color: #f87171;">${match}</span>`
    )
    .replace(/\((\d*)\)/g, '(<span style="color: #fbbf24;">$1</span>)');
};

// Add level goals data
const levelGoals = {
  1: [
    "Move your hero to the right side of the grid",
    "Learn to use basic movement commands",
    "Reach position (9,5) to complete the level"
  ]
};

// Helper function to create placeholder code with missing letters
const createPlaceholderWithMissingLetters = (code: string, lessonNumber: number): string => {
  if (!code) return '';
  
  // Split the code into lines
  const lines = code.split('\n');
  
  // Calculate difficulty factor based on lesson number (higher level = less help)
  // Lesson 1-5: Easier (more letters shown)
  // Lesson 6-10: Medium difficulty
  // Lesson 11+: Harder (fewer letters shown)
  const baseDifficulty = lessonNumber <= 5 ? 0.4 : 
                         lessonNumber <= 10 ? 0.6 : 0.75;
  
  // Process each line to remove some letters
  return lines.map(line => {
    // Skip empty lines
    if (line.trim() === '') return line;
    
    // For function/method calls like hero.moveUp(), remove letters from the method name
    return line.replace(/(\w+)\.(\w+)(\(\)|\(.*\))/g, (match, obj, method, parens) => {
      // Keep the first letter and remove varying percentage of the remaining letters
      const firstLetter = method[0];
      const restOfMethod = method.slice(1);
      
      // Create gaps with at least 2-3 missing letters
      const maskedRest = restOfMethod.split('').map((char: string, i: number) => {
        // Remove letters based on difficulty factor and position
        // Ensure at least 2-3 gaps for early levels, more for higher levels
        const shouldRemove = Math.random() < baseDifficulty || 
                            (i % 2 === 0 && i < restOfMethod.length - 1 && Math.random() < 0.5);
        return shouldRemove ? '_' : char;
      }).join('');
      
      return `${obj}.${firstLetter}${maskedRest}${parens}`;
    });
  }).join('\n');
};

// LESSON 11 GEM POSITIONS
const LESSON11_GEMS = [
  { x: 2, y: 3, color: 'blue' },
  { x: 7, y: 5, color: 'red' },
  { x: 12, y: 8, color: 'green' },
  { x: 4, y: 12, color: 'blue' },
  { x: 10, y: 2, color: 'red' },
  { x: 13, y: 13, color: 'green' },
  { x: 1, y: 10, color: 'blue' },
  { x: 8, y: 13, color: 'red' },
  { x: 6, y: 7, color: 'green' },
  { x: 11, y: 4, color: 'blue' }
];

// LESSON 12 GEM POSITION
const LESSON12_GEM = { x: 7, y: 7, color: 'blue' };

const XCodeAcademy: React.FC<XCodeAcademyProps> = ({ 
  onBack,
  currentProgress: initialProgress = 3, // Default to lesson 3 being completed
  showCoursesView = true, // Default to showing the courses view
  onStartLessonLevel
}) => {
  // Get lessonId from URL params
  const { lessonId } = useParams<{ lessonId: string }>();
  const lessonIdNum = lessonId ? parseInt(lessonId, 10) : 1;
  const navigate = useNavigate();
  
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [showAllCourses, setShowAllCourses] = useState<boolean>(showCoursesView);
  const [currentProgress, setCurrentProgress] = useState<number>(initialProgress);
  const [quizModalOpen, setQuizModalOpen] = useState<number | false>(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  
  // State for interactive lesson
  const [isLessonActive, setIsLessonActive] = useState<boolean>(false);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [code, setCode] = useState<string>('hero.moveRight()');
  const [codePlaceholder, setCodePlaceholder] = useState<string>('');
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Line highlighting removed
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showGoals, setShowGoals] = useState<boolean>(true);
  const [playVictorySound, setPlayVictorySound] = useState<boolean>(false);
  
  // State for character
  const [characterPosition, setCharacterPosition] = useState(() => {
    if (lessonIdNum === 9) {
      return { x: 10, y: 14 };
    }
    return { x: 1, y: 5 };
  });
  const characterPositionRef = useRef(characterPosition);
  useEffect(() => {
    characterPositionRef.current = characterPosition;
  }, [characterPosition]);
  const [characterDirection, setCharacterDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [characterState, setCharacterState] = useState<'idle' | 'walk' | 'attack'>('idle');
  
  // Add isDead state for death screen
  const [isDead, setIsDead] = useState<boolean>(false);
  const [deathMessage, setDeathMessage] = useState<string>('');
  
  // State for goal completion
  const [completedGoals, setCompletedGoals] = useState<{[key: string]: boolean}>({});
  
  // Track which directions have been executed (for lesson 2)
  const [directionsExecuted, setDirectionsExecuted] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  
  // Add this near the top of the component
  const mageSprites = loadCharacterAnimations('mage');
  const decoySprites = loadCharacterAnimations('assasin-wolf');
  const [decoyDirection, setDecoyDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [decoyState, setDecoyState] = useState<'idle' | 'walk'>('idle');
  const [decoyFrame, setDecoyFrame] = useState(0);
  // Add pixel position state for decoy smooth movement
  const [decoyPixelPos, setDecoyPixelPos] = useState({ x: 0, y: 0 });
  
  // Add an effect to animate the decoy frames
  useEffect(() => {
    if (activeLessonId === 10) {
      const frameInterval = setInterval(() => {
        setDecoyFrame(prev => (prev + 1) % 2);
      }, decoyState === 'idle' ? 500 : 250);
      
      return () => clearInterval(frameInterval);
    }
  }, [activeLessonId, decoyState]);
  
  // Add state to track moveUp executions for lesson 1
  const [lesson1MoveUpCount, setLesson1MoveUpCount] = useState(0);
  
  // Add state to track if the book has been collected
  const [bookCollected, setBookCollected] = useState(false);
  // Add state to track if the potion has been collected
  const [potionCollected, setPotionCollected] = useState(false);
  
  // Add state for gem collection in lesson 7
  const [blueGemCollected, setBlueGemCollected] = useState(false);
  const [redGemCollected, setRedGemCollected] = useState(false);
  
  // Add state for three gems in lesson 8
  const [blueGem8Collected, setBlueGem8Collected] = useState(false);
  const [redGem8Collected, setRedGem8Collected] = useState(false);
  const [greenGem8Collected, setGreenGem8Collected] = useState(false);
  
  // Add to component state:
  const [lastExecutedLine, setLastExecutedLine] = useState<number>(0);
  const [lastCodeSnapshot, setLastCodeSnapshot] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingGoals, setLoadingGoals] = useState<string[] | undefined>(undefined);
  const [loadingBg, setLoadingBg] = useState<string | undefined>(undefined);
  
  const gameGridRef = useRef<GameGridHandle>(null);
  
  // LESSON 11 GEM POSITIONS
  const [lesson11Collected, setLesson11Collected] = useState(Array(LESSON11_GEMS.length).fill(false));
  
  // In component state:
  const [lesson12Collected, setLesson12Collected] = useState(false);
  // Add state for lesson 12 gem collection
  const [lesson12GemCollected, setLesson12GemCollected] = useState(false);
  
  // Add state for tracking lesson 4 waypoints
  const [lesson4VisitedWaypoints, setLesson4VisitedWaypoints] = useState<{[key: string]: boolean}>({});
  
  // Reset moveUp counter when code or lesson changes
  useEffect(() => {
    // Reset the counter when code changes or lesson changes
    setLesson1MoveUpCount(0);
  }, [code, activeLessonId]);
  
  // Effect to check if we're in lesson mode from URL params
  useEffect(() => {
    console.log("lessonId param changed:", lessonId);
    
    if (lessonId) {
      const lessonIdNum = parseInt(lessonId, 10);
      console.log("Setting active lesson to:", lessonIdNum);
      
      // Reset states from previous lesson
      setIsSuccess(false);
      setPlayVictorySound(false);
      resetGame();
      
      // Set up new lesson
      setSelectedLesson(lessonIdNum);
      setIsLessonActive(true);
      setActiveLessonId(lessonIdNum);
      
      // Use our standardized lesson start handler
      const lessonData = X_CODE_LESSONS.find(l => l.id === lessonIdNum) || X_CODE_LESSONS[0];
      onLessonStart({
        lessonId: lessonIdNum,
        lessonData,
        onStateChange: (newState) => {
          // Apply state changes from the controller
          if (newState.characterPosition) {
            setCharacterPosition(newState.characterPosition);
          }
          if (newState.characterDirection) {
            setCharacterDirection(newState.characterDirection);
          }
          if (newState.characterState) {
            setCharacterState(newState.characterState);
          }
          if (newState.executionLogs) {
            setExecutionLogs(newState.executionLogs);
          }
          if (newState.code !== undefined) {
            setCode(newState.code);
          }
          if (newState.codePlaceholder !== undefined) {
            setCodePlaceholder(newState.codePlaceholder);
          }
          if (newState.isSuccess !== undefined) {
            setIsSuccess(newState.isSuccess);
          }
          if (newState.isRunning !== undefined) {
            setIsRunning(newState.isRunning);
          }
        }
      });
    }
  }, [lessonId, navigate]);

  // Load progress on component mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Try to load progress from Supabase first
        await ProgressService.loadProgressFromSupabase();
        
        // Then get the current progress from localStorage (which may have been updated by loadProgressFromSupabase)
        const savedProgress = ProgressService.getCurrentProgress();
        if (savedProgress > 0) {
          setCurrentProgress(savedProgress);
        }
      } catch (error: unknown) {
        console.error('Error loading progress:', error);
      }
    };
    
    loadProgress();
  }, []);

  // Effect to set code and placeholder when active lesson changes
  useEffect(() => {
    if (activeLessonId) {
      const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId);
      
      // Special handling for lesson 10
      if (activeLessonId === 10) {
        // Force empty code for lesson 10
        setCode('');
        // Set placeholder text for lesson 10 with the solution as a hint
        setCodePlaceholder("# Use the Decoy to distract the guards");
      } 
      else if (lessonData && lessonData.codeExample) {
        // Create placeholder with missing letters based on lesson number
        const placeholderCode = createPlaceholderWithMissingLetters(
          lessonData.codeExample, 
          lessonData.lessonNumber
        );
        
        // Set initial code to empty string so student has to type it
        setCode('');
        
        // Store the placeholder code for the textarea
        setCodePlaceholder(placeholderCode);
      }
      setIsSuccess(false);
    }
  }, [activeLessonId]);

  // Effect to auto-clear error messages after 2 seconds
  useEffect(() => {
    if (codeError) {
      const timer = setTimeout(() => {
        setCodeError(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [codeError]);

  // Filter lessons by week
  const weekLessons = X_CODE_LESSONS.filter(lesson => lesson.week === selectedWeek);
  const selectedLessonData = selectedLesson ? X_CODE_LESSONS.find(l => l.id === selectedLesson) : null;

  // Group lessons by week for the sidebar
  const weekGroups = Array.from(new Set(X_CODE_LESSONS.map(l => l.week))).sort((a, b) => a - b);
  
  // Create difficulty stars
  const renderDifficultyStars = (difficulty: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  // Helper to determine if a lesson is unlocked
  const isLessonUnlocked = (lessonId: number) => {
    // For testing - make all lessons unlocked
    return true;
  };

  // Helper to determine if a lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    // For testing - mark all lessons as NOT completed to show Start buttons
    return false;
  };

  // Get the current week theme
  const getWeekTheme = (week: number) => {
    return WEEK_THEMES[week as keyof typeof WEEK_THEMES] || `Week ${week}`;
  };

  // Handle lesson completion
  const handleCompleteLesson = (lessonId: number) => {
    ProgressService.completeLesson(lessonId);
    setCurrentProgress(prev => Math.max(prev, lessonId));
  };

  // Function to directly set player position
  const setPlayerPosition = (x: number, y: number) => {
    setCharacterPosition({ x, y });
    console.log(`Player position set to (${x}, ${y})`);
  };

  // Update the movement functions to move grid by grid
  const moveCharacter = async (direction: 'up' | 'down' | 'left' | 'right', steps: number = 1) => {
    setCharacterDirection(direction);
    let stepsRemaining = steps;
    return new Promise<void>(resolve => {
    const moveStep = () => {
        if (stepsRemaining <= 0) {
          setCharacterState('idle');
          setTimeout(resolve, 1000); // 1 second delay between commands
          return;
        }
      setCharacterState('walk');
      setCharacterPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        switch (direction) {
          case 'up':    newY = Math.max(0, prev.y - 1); break;
          case 'down':  newY = Math.min(14, prev.y + 1); break;
          case 'left':  newX = Math.max(0, prev.x - 1); break;
          case 'right': newX = Math.min(14, prev.x + 1); break;
        }
        return { x: newX, y: newY };
      });
      stepsRemaining--;
        setTimeout(moveStep, 300); // per-step animation delay
    };
    moveStep();
    });
  };
   // Smoothly animates the decoy's movement in the given direction by 1 tile (assumes 48px per tile)
   const animateDecoyMove = async (direction: 'up' | 'down' | 'left' | 'right') => {
    const tileSize = 48;
    let startPixelPos = { x: decoyPixelPos.x, y: decoyPixelPos.y };
    let endPixelPos = { ...startPixelPos };
    switch (direction) {
      case 'up': endPixelPos.y -= tileSize; break;
      case 'down': endPixelPos.y += tileSize; break;
      case 'left': endPixelPos.x -= tileSize; break;
      case 'right': endPixelPos.x += tileSize; break;
    }
    const duration = 300; // ms
    const startTime = performance.now();
    return new Promise<void>(resolve => {
      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const newX = startPixelPos.x + (endPixelPos.x - startPixelPos.x) * t;
        const newY = startPixelPos.y + (endPixelPos.y - startPixelPos.y) * t;
        setDecoyPixelPos({ x: newX, y: newY });
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          setDecoyPixelPos(endPixelPos);
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  };
  // Update the executeCode function to handle empty code
  const executeCode = async (code: string) => {
    if (isRunning) return;
    if (!code || code.trim() === '') {
      setExecutionLogs(['<span class="zoom-effect flashing-orange-gradient">Code first!</span>']);
      setTimeout(() => { setExecutionLogs([]); }, 2000);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setExecutionLogs([]);
    setCodeError(null);

    // --- LEVEL 10 DECOY LOGIC ---
    if (activeLessonId === 10) {
      if (/hero\s*\./.test(code)) {
        setExecutionLogs(["❌ Error: Use <b>decoy</b> instead of <b>hero</b> in this level. Example: <code>decoy.moveRight()</code>"]);
        setCodeError("Use decoy instead of hero in this level.");
        setIsRunning(false);
        return;
      }

      const decoy = {
        moveUp: async (steps = 1) => {
          setDecoyDirection('up');
          setDecoyState('walk');
          let stepsRemaining = steps;
          return new Promise<void>(resolve => {
            const moveStep = async () => {
              if (stepsRemaining <= 0) {
                setDecoyState('idle');
                setTimeout(resolve, 250);
                return;
              }
              await animateDecoyMove('up');
              // Update the decoy position on the grid
              setDecoyPosition(prev => ({
                x: prev.x,
                y: Math.max(0, prev.y - 1)
              }));
              stepsRemaining--;
              setTimeout(moveStep, 0);
            };
            moveStep();
          });
        },
        moveDown: async (steps = 1) => {
          setDecoyDirection('down');
          setDecoyState('walk');
          let stepsRemaining = steps;
          return new Promise<void>(resolve => {
            const moveStep = async () => {
              if (stepsRemaining <= 0) {
                setDecoyState('idle');
                setTimeout(resolve, 250);
                return;
              }
              await animateDecoyMove('down');
              // Update the decoy position on the grid
              setDecoyPosition(prev => ({
                x: prev.x,
                y: Math.min(14, prev.y + 1)
              }));
              stepsRemaining--;
              setTimeout(moveStep, 0);
            };
            moveStep();
          });
        },
        moveLeft: async (steps = 1) => {
          setDecoyDirection('left');
          setDecoyState('walk');
          let stepsRemaining = steps;
          return new Promise<void>(resolve => {
            const moveStep = async () => {
              if (stepsRemaining <= 0) {
                setDecoyState('idle');
                setTimeout(resolve, 250);
                return;
              }
              await animateDecoyMove('left');
              // Update the decoy position on the grid
              setDecoyPosition(prev => ({
                x: Math.max(0, prev.x - 1),
                y: prev.y
              }));
              stepsRemaining--;
              setTimeout(moveStep, 0);
            };
            moveStep();
          });
        },
        moveRight: async (steps = 1) => {
          setDecoyDirection('right');
          setDecoyState('walk');
          let stepsRemaining = steps;
          return new Promise<void>(resolve => {
            const moveStep = async () => {
              if (stepsRemaining <= 0) {
                setDecoyState('idle');
                setTimeout(resolve, 250);
                return;
              }
              await animateDecoyMove('right');
              // Update the decoy position on the grid
              setDecoyPosition(prev => ({
                x: Math.min(14, prev.x + 1),
                y: prev.y
              }));
              stepsRemaining--;
              setTimeout(moveStep, 0);
            };
            moveStep();
          });
        },
      };
      // Automatically insert await before decoy.move* calls
      const awaitedCode = code.replace(/(decoy\.(moveUp|moveDown|moveLeft|moveRight)\s*\([^)]*\))/g, 'await $1');
      try {
        setExecutionLogs(["Running your code..."]);
        const userFunction = new Function('decoy', `return (async () => {${awaitedCode}\n})()`);
        await userFunction(decoy);
        setExecutionLogs(prev => [...prev, "✅ Decoy code execution completed!"]);
        
        // After decoy code execution, automatically move the hero
        setExecutionLogs(prev => [...prev, "🚶 Hero is now moving automatically..."]);
        
        // Move up 9 times
        setCharacterDirection('up');
        setCharacterState('walk');
        for (let i = 0; i < 9; i++) {
          await new Promise(res => setTimeout(res, 300));
          setCharacterPosition(prev => {
            const newPos = { x: prev.x, y: Math.max(0, prev.y - 1) };
            // Check for collision with any enemy after moving
            if (!isDead) {
              for (const enemy of level10EnemiesRef.current) {
                if (
                  Math.floor(enemy.position.x) === newPos.x &&
                  Math.floor(enemy.position.y) === newPos.y
                ) {
                  setIsDead(true);
                  setDeathMessage('You were caught by the enemy!');
                  setIsRunning(false);
                  break;
                }
              }
            }
            return newPos;
          });
          if (isDead) break;
        }
        if (!isDead) {
          // Then move right 11 times
          setCharacterDirection('right');
          for (let i = 0; i < 11; i++) {
            await new Promise(res => setTimeout(res, 300));
            setCharacterPosition(prev => {
              const newPos = { x: Math.min(14, prev.x + 1), y: prev.y };
              // Check for collision with any enemy after moving
              if (!isDead) {
                for (const enemy of level10EnemiesRef.current) {
                  if (
                    Math.floor(enemy.position.x) === newPos.x &&
                    Math.floor(enemy.position.y) === newPos.y
                  ) {
                    setIsDead(true);
                    setDeathMessage('You were caught by the enemy!');
                    setIsRunning(false);
        break;
      }
    }
              }
              return newPos;
            });
            if (isDead) break;
          }
        }
        setCharacterState('idle');
        if (!isDead) {
          setExecutionLogs(prev => [...prev, "✅ Hero movement completed!"]);
          // Check if hero has reached the goal position (13,2)
          // Use a timeout to ensure we're checking the most current position after all movements
          setTimeout(() => {
            // Get the current character position directly from state
            const currentPos = characterPositionRef.current;
            if (currentPos.x === 13 && currentPos.y === 2) {
              setIsSuccess(true);
              setExecutionLogs(prev => [...prev, "🎉 Success! You've completed Lesson 10!"]);
              createSuccessConfetti();
            }
          }, 300);
        }
        
      } catch (error) {
        setExecutionLogs([`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        setCodeError("Code error, check and fix!");
        setIsRunning(false);
      } finally {
        setIsRunning(false);
        }
        return;
      }
    // --- END LEVEL 10 DECOY LOGIC ---

    // Track directions for lesson 2
    const directionsUsedThisRun = { up: false, down: false, left: false, right: false };
    if (activeLessonId === 2) {
      setDirectionsExecuted({ up: false, down: false, left: false, right: false });
    }
    // Track character position locally to avoid React state lag
    const localCharacterPosition = { ...characterPosition };
    // Define the hero object as before
      const hero = {
      moveUp: async (steps = 1) => {
          if (activeLessonId === 2) directionsUsedThisRun.up = true;
          if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, up: true }));
          if (activeLessonId === 1) {
          const newCount = lesson1MoveUpCount + steps;
            setLesson1MoveUpCount(newCount);
            if (newCount >= 4) {
              setTimeout(() => {
                setIsSuccess(true);
                setExecutionLogs(prev => [...prev, "🎉 Success! You've completed Lesson 1!"]);
                createSuccessConfetti();
                }, steps * 900 + 500);
            }
          }
          setIsMoving(true);
        if (activeLessonId !== null && activeLessonId >= 9 && gameGridRef.current) {
          await gameGridRef.current.movePlayerSmoothly('up', steps);
              } else {
          await moveCharacter('up', steps);
        }
            setIsMoving(false);
        },
      moveDown: async (steps = 1) => {
          if (activeLessonId === 2) directionsUsedThisRun.down = true;
          if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, down: true }));
          setIsMoving(true);
        if (activeLessonId !== null && activeLessonId >= 9 && gameGridRef.current) {
          await gameGridRef.current.movePlayerSmoothly('down', steps);
              } else {
          await moveCharacter('down', steps);
        }
            setIsMoving(false);
        },
      moveLeft: async (steps = 1) => {
          if (activeLessonId === 2) directionsUsedThisRun.left = true;
          if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, left: true }));
          setIsMoving(true);
        if (activeLessonId !== null && activeLessonId >= 9 && gameGridRef.current) {
          await gameGridRef.current.movePlayerSmoothly('left', steps);
            } else {
          await moveCharacter('left', steps);
        }
            setIsMoving(false);
        },
      moveRight: async (steps = 1) => {
          if (activeLessonId === 2) directionsUsedThisRun.right = true;
          if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, right: true }));
          setIsMoving(true);
        if (activeLessonId !== null && activeLessonId >= 9 && gameGridRef.current) {
          await gameGridRef.current.movePlayerSmoothly('right', steps);
            } else {
          await moveCharacter('right', steps);
            }
            setIsMoving(false);
        },
      moveXY: async (x: number, y: number) => {
          if (x === undefined || y === undefined) {
            setExecutionLogs(prev => [...prev, "❌ Error: moveXY requires x and y coordinates"]);
          setIsRunning(false);
            return;
          }
          if (typeof x !== 'number' || typeof y !== 'number') {
            setExecutionLogs(prev => [...prev, "❌ Error: moveXY requires x and y coordinates"]);
          setIsRunning(false);
            return;
          }
          const targetX = Math.max(0, Math.min(14, x));
          const targetY = Math.max(0, Math.min(14, y));
          setExecutionLogs(prev => [...prev, `🚶 Moving to position (${targetX}, ${targetY})`]);
          setIsMoving(true);
          setCharacterPosition({ x: targetX, y: targetY });
        await new Promise(res => setTimeout(res, 900));
            setIsMoving(false);
        },
        health: 50,
        usePotion: () => {
          setExecutionLogs(prev => [...prev, "🧪 Used a health potion! +25 health"]);
          hero.health += 25;
        },
        collect: () => {
          setExecutionLogs(prev => [...prev, "💎 Collected an item!"]);
      }
    };
    // Automatically insert await before hero.move* calls
    const awaitedCode = code.replace(/(hero\.(moveUp|moveDown|moveLeft|moveRight|moveXY)\s*\([^)]*\))/g, 'await $1');
    // Execute the entire code block
    try {
      setExecutionLogs(["Running your code..."]);
       
      const userFunction = new Function('hero', `return (async () => {${awaitedCode}\n})()`);
      await userFunction(hero);
      setExecutionLogs(prev => [...prev, "✅ Code execution completed!"]);
        // Check for lesson success using our standardized controller
        if (activeLessonId) {
          checkLessonSuccess(
            activeLessonId,
            {
              code,
            characterPosition: characterPositionRef.current,
              directionsUsed: directionsUsedThisRun
            }
          ).then(result => {
            if (result.success) {
              onLessonSuccess({
                lessonId: activeLessonId,
                successMessage: result.message,
                onStateChange: (stateOrFn) => {
                  if (typeof stateOrFn === 'function') {
                    const newState = stateOrFn({
                      executionLogs: executionLogs,
                      isSuccess: false,
                      isRunning: true
                    });
                    if (newState.executionLogs) {
                      setExecutionLogs(newState.executionLogs);
                    }
                    if (newState.isSuccess !== undefined) {
                      setIsSuccess(newState.isSuccess);
                    }
                    if (newState.isRunning !== undefined) {
                      setIsRunning(newState.isRunning);
                    }
              } else {
                    if (stateOrFn.executionLogs) {
                      setExecutionLogs(stateOrFn.executionLogs);
                    }
                    if (stateOrFn.isSuccess !== undefined) {
                      setIsSuccess(stateOrFn.isSuccess);
            }
                    if (stateOrFn.isRunning !== undefined) {
                      setIsRunning(stateOrFn.isRunning);
                    }
                  }
                },
                onComplete: handleCompleteLesson
              });
          setIsSuccess(true);
              createSuccessConfetti();
            } else {
            setExecutionLogs(["❌ Wrong. Try again!"]);
            }
          }).catch(error => {
          setExecutionLogs([`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
          setIsRunning(false);
        });
        }
      } catch (error) {
      setExecutionLogs([`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        setCodeError("Code error, check and fix!");
        setIsRunning(false);
    } finally {
        setIsRunning(false);
      }
  };
  
  // Reset function
  const resetGame = () => {
    // Reset code to empty string so student has to type it again
    setCode('');
    setExecutionLogs([]);
    setIsRunning(false);
    setCodeError(null);
    setIsSuccess(false);
    setBookCollected(false);
    setPotionCollected(false);
    setIsDead(false); // Reset death state
    setDeathMessage(''); // Reset death message
    
    // Reset the tracked directions
    setDirectionsExecuted({ up: false, down: false, left: false, right: false });
    
    // Reset waypoints for lesson 4
    setLesson4VisitedWaypoints({});
    
    // Reset gem collection states for lesson 12
    setLesson12GemCollected(false);
    
    // Reset gem collection states for lesson 11
    if (activeLessonId === 11) {
      setLesson11Collected(Array(LESSON11_GEMS.length).fill(false));
    }
    
    // Reset gem collection states for lesson 7 and 8
    setBlueGemCollected(false);
    setRedGemCollected(false);
    setBlueGem8Collected(false);
    setRedGem8Collected(false);
    setGreenGem8Collected(false);
    
    // Reset goal completion status for current lesson
    if (activeLessonId) {
      const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId);
      if (lessonData?.goals) {
        const newCompletedGoals = {...completedGoals};
        lessonData.goals.forEach((_, index) => {
          delete newCompletedGoals[`lesson-${activeLessonId}-goal-${index}`];
        });
        setCompletedGoals(newCompletedGoals);
      }
    }
    
    // Set position based on active lesson
    if (activeLessonId === 1) {
      setCharacterPosition({ x: 6, y: 14 });
    } else if (activeLessonId === 2) {
      setCharacterPosition({ x: 6, y: 10 });
    } else if (activeLessonId === 4) {
      setCharacterPosition({ x: 11, y: 11 }); // Updated starting position for lesson 4
    } else if (activeLessonId === 5) {
      setCharacterPosition({ x: 7, y: 3 }); // Starting position for lesson 5
    } else if (activeLessonId === 6) {
      setCharacterPosition({ x: 2, y: 8 }); // Starting position for lesson 6 (diamond adventure)
    } else if (activeLessonId === 7) {
      setCharacterPosition({ x: 5, y: 1 }); // Starting position for lesson 7 (diamond and key)
    } else if (activeLessonId === 8) {
      setCharacterPosition({ x: 11, y: 13 }); // Starting position for lesson 8
    } else if (activeLessonId === 9) {
      setCharacterPosition({ x: 10, y: 14 }); // Updated starting position for lesson 9 (hazard zones)
    } else if (activeLessonId === 10) {
      // Reset hero position for lesson 10
      setCharacterPosition({ x: 2, y: 11 });
      // Reset decoy position
      setDecoyPosition({ x: 11, y: 11 });
      // Reset enemy positions
      setLevel10Enemies([
        { position: { x: 7, y: 2 } },
        { position: { x: 8, y: 2 } }
      ]);
      // Reset animation states for lesson 10
      setDecoyDirection('down');
      setDecoyState('idle');
    setCharacterDirection('right');
    setCharacterState('idle');
    } else if (activeLessonId === 11) {
      setCharacterPosition({ x: 7, y: 14 });
    } else if (activeLessonId === 12) {
      setLesson12Collected(false);
      setCharacterPosition({ x: 7, y: 14 });
    }
  };
  
  // Show hint function
  const showHint = () => {
    const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId);
    if (lessonData && lessonData.hints && lessonData.hints.length > 0) {
      setExecutionLogs(prev => [...prev, `💡 Hint: ${lessonData.hints[0]}`]);
    }
  };
  
  // Show solution function
  const showSolution = () => {
    const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId);
    if (lessonData && lessonData.solution) {
      // Check if code already matches the solution (toggle behavior)
      if (code === lessonData.solution) {
        // If solution is already shown, clear the code
        setCode('');
      } else {
        // If solution is not shown, show it
        setCode(lessonData.solution);
      }
    } else {
      // Fallback toggle behavior
      if (code === 'hero.moveRight()') {
        setCode('');
      } else {
        setCode('hero.moveRight()');
      }
    }
  };

  // Handle opening lesson slides
  const handleOpenLessonSlides = () => {
    navigate('/lesson-slides/cs1');
  };
  
  // Handle opening fundamentals slides
  const handleOpenFundamentalsSlides = () => {
    navigate('/fundamentals-slides');
  };

  // Replace the createConfetti function with our standardized one
  const createConfetti = createSuccessConfetti;
  
  // Function to generate random star positions for victory screen
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 3 + 1}s`,
      };
      stars.push(<div key={`star-${i}`} className="star" style={style} />);
    }
    return stars;
  };

  // Handle navigation to the next lesson
  const handleNextLesson = () => {
    console.log("handleNextLesson called, active lesson:", activeLessonId);
    if (activeLessonId) {
      const nextLessonId = activeLessonId + 1;
      console.log("Navigating to next lesson:", nextLessonId);
      
      // Mark current lesson as completed
      handleCompleteLesson(activeLessonId);
      
      // First reset success and sound state to prevent replay
      setIsSuccess(false);
      setPlayVictorySound(false);
      setIsRunning(false);
      
      // Then navigate to the next lesson
      try {
        // Use direct window.location.href which will cause full page reload
        console.log("Navigating to:", `/lesson/${nextLessonId}`);
        window.location.href = `/lesson/${nextLessonId}`;
      } catch (err) {
        console.error("Navigation error:", err);
        alert("Navigation failed. Please try again.");
      }
    } else {
      console.log("No active lesson ID");
      alert("Error: No active lesson found");
    }
  };
  
  // Handle navigation back to lesson selection
  const handleBackToLessons = () => {
    // Reset states
    setIsSuccess(false);
    setPlayVictorySound(false);
    setIsLessonActive(false);
    setActiveLessonId(null);
    // Navigate back to course page
    if (onBack) onBack();
  };

  // Helper for lesson 2: check if all directions commands are present in code
  const checkAllDirectionsCommandsPresent = () => {
    if (activeLessonId !== 2) return false;
    const codeToCheck = code || '';
    return (
      /hero\.moveUp\s*\(/i.test(codeToCheck) &&
      /hero\.moveDown\s*\(/i.test(codeToCheck) &&
      /hero\.moveLeft\s*\(/i.test(codeToCheck) &&
      /hero\.moveRight\s*\(/i.test(codeToCheck)
    );
  };

  // In the code that handles character movement, add:
  useEffect(() => {
    if (activeLessonId === 5 && characterPosition.x === 7 && characterPosition.y === 12 && !bookCollected) {
      setBookCollected(true);
    }
  }, [activeLessonId, characterPosition, bookCollected]);

  // Effect to check if the potion has been collected in lesson 6
  useEffect(() => {
    if (activeLessonId === 6 && characterPosition.x === 10 && characterPosition.y === 8 && !potionCollected) {
      setPotionCollected(true);
      setExecutionLogs(prev => [...prev, "🧪 Collected the healing potion!"]);
      
      // Show success message and trigger confetti
      setTimeout(() => {
        setIsSuccess(true);
        setExecutionLogs(prev => [...prev, "🎉 Success! You've collected the healing potion!"]);
        createSuccessConfetti();
      }, 500);
    }
  }, [activeLessonId, characterPosition, potionCollected]);

  // Set correct starting position when lesson changes
  useEffect(() => {
    if (activeLessonId === 6) {
      setCharacterPosition({ x: 2, y: 8 });
      setCharacterDirection('right');
      setCharacterState('idle');
    }
  }, [activeLessonId]);

  // Add collectible logic for lesson 7 gems
  useEffect(() => {
    if (activeLessonId === 7) {
      if (characterPosition.x === 2 && characterPosition.y === 13 && !blueGemCollected) {
        setBlueGemCollected(true);
      }
      if (characterPosition.x === 11 && characterPosition.y === 13 && !redGemCollected) {
        setRedGemCollected(true);
      }
      // Show success when both gems are collected
      if (blueGemCollected && redGemCollected && !isSuccess) {
        setIsSuccess(true);
        setExecutionLogs(logs => [...logs, "🎉 Success! You've collected both gems!"]);
        createSuccessConfetti();
      }
    }
  }, [activeLessonId, characterPosition, blueGemCollected, redGemCollected, isSuccess]);

  // Add for lesson 8 spawn point
  useEffect(() => {
    if (activeLessonId === 8) {
      setCharacterPosition({ x: 11, y: 13 });
      setCharacterDirection('right');
      setCharacterState('idle');
    }
  }, [activeLessonId]);

  // Add collection logic for lesson 8 gems
useEffect(() => {
  if (activeLessonId === 8) {
    if (characterPosition.x === 2 && characterPosition.y === 13 && !blueGem8Collected) {
      setBlueGem8Collected(true);
    }
    if (characterPosition.x === 2 && characterPosition.y === 5 && !redGem8Collected) {
      setRedGem8Collected(true);
    }
    if (characterPosition.x === 9 && characterPosition.y === 5 && !greenGem8Collected) {
      setGreenGem8Collected(true);
    }
    // Show success when all three gems are collected
    if (blueGem8Collected && redGem8Collected && greenGem8Collected && !isSuccess) {
      setIsSuccess(true);
      setExecutionLogs(logs => [...logs, "🎉 Success! You've collected all three gems!"]);
      createSuccessConfetti();
    }
  }
}, [activeLessonId, characterPosition, blueGem8Collected, redGem8Collected, greenGem8Collected, isSuccess]);

// Add collection logic for lesson 12 gem
useEffect(() => {
  if (
    activeLessonId === 12 &&
    characterPosition.x === 4 &&
    characterPosition.y === 8 &&
    !lesson12GemCollected
  ) {
    setLesson12GemCollected(true);
    setExecutionLogs(logs => [...logs, "💎 You've collected the blue gem!"]);
  }

  // Check victory condition for lesson 12: gem collected AND at position (7,1)
  if (
    activeLessonId === 12 &&
    characterPosition.x === 7 &&
    characterPosition.y === 1 &&
    lesson12GemCollected &&
    !isSuccess
  ) {
    setIsSuccess(true);
    setExecutionLogs(logs => [...logs, "🎉 Success! You've collected the gem and reached the exit!"]);
    createSuccessConfetti();
  }
}, [activeLessonId, characterPosition, lesson12GemCollected, isSuccess]);
  
  // Add a useEffect to track visited waypoints in lesson 4 and check for victory
useEffect(() => {
  if (activeLessonId === 4) {
    // Define the waypoints
    const lesson4Waypoints = [
      { x: 11, y: 14 },
      { x: 8, y: 14 },
      { x: 8, y: 5 },
      { x: 12, y: 5 },
    ];

    // Check if player is on a waypoint
    const currentWaypoint = lesson4Waypoints.find(
      wp => wp.x === characterPosition.x && wp.y === characterPosition.y
    );

    if (currentWaypoint) {
      // Mark this waypoint as visited
      const waypointKey = `${currentWaypoint.x},${currentWaypoint.y}`;
      if (!lesson4VisitedWaypoints[waypointKey]) {
        setLesson4VisitedWaypoints(prev => ({
          ...prev,
          [waypointKey]: true
        }));
        setExecutionLogs(logs => [...logs, `⭐ Waypoint reached at (${currentWaypoint.x}, ${currentWaypoint.y})!`]);
      }
    }

    // Check if all waypoints have been visited
    const allWaypointsVisited = lesson4Waypoints.every(
      wp => lesson4VisitedWaypoints[`${wp.x},${wp.y}`]
    );

    if (allWaypointsVisited && !isSuccess) {
      setIsSuccess(true);
      setExecutionLogs(logs => [...logs, "🎉 Success! You've reached all waypoints!"]);
      createSuccessConfetti();
    }
  }
}, [activeLessonId, characterPosition, lesson4VisitedWaypoints, isSuccess]);

// Play victory sound when success state changes
useEffect(() => {
  if (isSuccess) {
    setPlayVictorySound(true);
  }
}, [isSuccess]);
  
  // Track goal completion for all lessons
  useEffect(() => {
    if (!activeLessonId) return;
    const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId);
    if (!lessonData?.goals) return;
    
    const newCompletedGoals = {...completedGoals};
    
    // Check lesson-specific goals
    switch (activeLessonId) {
      case 1: // Lesson 1: First Steps
        // Goal: Use moveUp command multiple times
        if (lesson1MoveUpCount >= 4) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        }
        break;
        
      case 2: // Lesson 2: All Directions
        // Goal: Use all four direction commands
        if (directionsExecuted.up) newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        if (directionsExecuted.down) newCompletedGoals[`lesson-${activeLessonId}-goal-1`] = true;
        if (directionsExecuted.left) newCompletedGoals[`lesson-${activeLessonId}-goal-2`] = true;
        if (directionsExecuted.right) newCompletedGoals[`lesson-${activeLessonId}-goal-3`] = true;
        break;
        
      case 6: // Lesson 6: Healing Potion
        // Goal: Collect the healing potion
        if (potionCollected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        }
        break;
        
      case 7: // Lesson 7: Two Gems
        // Goal: Collect blue gem
        if (blueGemCollected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        }
        // Goal: Collect red gem
        if (redGemCollected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-1`] = true;
        }
        break;
        
      case 8: // Lesson 8: Three Gems
        // Goal: Collect all three gems
        if (blueGem8Collected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        }
        if (redGem8Collected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-1`] = true;
        }
        if (greenGem8Collected) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-2`] = true;
        }
        break;
        
      case 11: // Lesson 11: Forgetful Gemsmith
        // Goal: Collect all gems
        if (lesson11Collected.every(collected => collected)) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-0`] = true;
        }
        // Goal: Reach the exit
        if (characterPosition.x === 7 && characterPosition.y === 2) {
          newCompletedGoals[`lesson-${activeLessonId}-goal-1`] = true;
        }
        break;
    }
    
    // Mark all goals as complete when lesson is successfully completed
    if (isSuccess && lessonData.goals) {
      lessonData.goals.forEach((_, index) => {
        newCompletedGoals[`lesson-${activeLessonId}-goal-${index}`] = true;
      });
    }
    
    setCompletedGoals(newCompletedGoals);
  }, [
    activeLessonId, 
    directionsExecuted,
    lesson1MoveUpCount,
    potionCollected, 
    blueGemCollected, 
    redGemCollected,
    blueGem8Collected,
    redGem8Collected,
    greenGem8Collected,
    isSuccess
    // completedGoals REMOVED
  ]);

  // Add collection logic for lesson 11 gems
  useEffect(() => {
    if (activeLessonId === 11) {
      // Check if the character is on any gem position
      LESSON11_GEMS.forEach((gem, index) => {
        if (characterPosition.x === gem.x && characterPosition.y === gem.y && !lesson11Collected[index]) {
          // Create a new array with the updated collection state
          const newCollected = [...lesson11Collected];
          newCollected[index] = true;
          setLesson11Collected(newCollected);
          setExecutionLogs(logs => [...logs, `💎 You've collected the ${gem.color} gem!`]);
        }
      });
      
      // Check if all gems are collected and the hero is at position (7,2)
      const allGemsCollected = lesson11Collected.every(collected => collected);
      if (allGemsCollected && characterPosition.x === 7 && characterPosition.y === 2 && !isSuccess) {
        setIsSuccess(true);
        setExecutionLogs(logs => [...logs, "🎉 Success! You've collected all gems and reached the exit!"]);
        createSuccessConfetti();
      }
    }
  }, [activeLessonId, characterPosition, lesson11Collected, isSuccess]);

  // Helper to handle lesson start with loading screen
  const handleStartLessonWithLoading = (lessonId: number) => {
    console.log('DEBUG: handleStartLessonWithLoading called, setting loading to true');
    // Store the lessonId for retrieval when loading completes
    localStorage.setItem('loadingLessonId', lessonId.toString());
    
    const lesson = X_CODE_LESSONS.find(l => l.id === lessonId);
    setLoadingGoals(lesson?.goals);
    // Generate loader image path
    let loaderPath = undefined;
    if (lesson) {
      // Example: /images/loader/CS1 Code Basics/week 1/week 2/Lesson 9 Hazard Zones.png
      const weekFolder = `week 1/week 2`;
      const fileName = `Lesson ${lesson.lessonNumber} ${lesson.title}.png`;
      loaderPath = `/images/loader/CS1 Code Basics/${weekFolder}/${fileName}`;
    }
    setLoadingBg(loaderPath);
    setLoading(true);
    setLoadingProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setLoadingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  // Handle loading screen animation complete
  const handleLoadingComplete = (lessonId: number) => {
    // Reset loading states
    setLoading(false);
    setLoadingProgress(0);
    setLoadingGoals(undefined);
    setLoadingBg(undefined);
    
    // Clear the stored lessonId
    localStorage.removeItem('loadingLessonId');
    
    // Start the lesson
    if (onStartLessonLevel) onStartLessonLevel(lessonId);
  };

  // Ensure player starts at (10, 14) for lesson 9 on lesson load
  useEffect(() => {
    if (activeLessonId === 9) {
      setCharacterPosition({ x: 10, y: 14 });
      setCharacterDirection('right');
      setCharacterState('idle');
    }
  }, [activeLessonId]);

  // Add enemy state for level 10
  const [level10Enemies, setLevel10Enemies] = useState<{position: {x: number, y: number}, isChasing?: boolean, target?: 'hero' | 'decoy'}[]>([
    { position: { x: 7, y: 2 } },
    { position: { x: 8, y: 2 } }
  ]);
  const level10EnemiesRef = useRef(level10Enemies);
  useEffect(() => { level10EnemiesRef.current = level10Enemies; }, [level10Enemies]);

  // Add decoy state for level 10
  const [decoyPosition, setDecoyPosition] = useState<{x: number, y: number}>({ x: 11, y: 11 });
  const decoyPositionRef = useRef(decoyPosition);
  useEffect(() => { decoyPositionRef.current = decoyPosition; }, [decoyPosition]);

  // This might be in a useEffect or initialization function
  useEffect(() => {
    if (activeLessonId === 10) {
      setCharacterPosition({ x: 2, y: 11 });
      setDecoyPosition({ x: 11, y: 11 }); // Keep decoy at its position
    }
    // ... existing code ...
  }, [activeLessonId]);

  // Fix the enemy detection and chasing logic for lesson 10
  useEffect(() => {
    if (activeLessonId === 10) {
      // Only run this effect in lesson 10
      const enemyDetectionInterval = setInterval(() => {
        // Update each enemy based on proximity to hero or decoy
        const updatedEnemies = level10Enemies.map(enemy => {
          // Calculate distance to hero and decoy
          const distToHero = Math.sqrt(
            Math.pow(enemy.position.x - characterPosition.x, 2) + 
            Math.pow(enemy.position.y - characterPosition.y, 2)
          );
          
          const distToDecoy = Math.sqrt(
            Math.pow(enemy.position.x - decoyPosition.x, 2) + 
            Math.pow(enemy.position.y - decoyPosition.y, 2)
          );
          
          // Determine if enemy should chase and what target
          let newPosition = {...enemy.position};
          let isChasing = false;
          let target: 'hero' | 'decoy' | undefined = undefined;
          
          // Check if hero or decoy is within detection range (4 grid cells)
          if (distToHero <= 4 || distToDecoy <= 4) {
            isChasing = true;
            
            // Chase the closest target
            if (distToHero <= distToDecoy) {
              target = 'hero';
            } else {
              target = 'decoy';
            }
            
            // Move towards the actual position based on target type
            const targetPosition = target === 'hero' ? characterPosition : decoyPosition;
            
            // Move towards target (faster movement)
            if (targetPosition.x > newPosition.x) newPosition.x += 0.5;
            else if (targetPosition.x < newPosition.x) newPosition.x -= 0.5;
            
            if (targetPosition.y > newPosition.y) newPosition.y += 0.5;
            else if (targetPosition.y < newPosition.y) newPosition.y -= 0.5;
            
            // Ensure enemies stay on the grid (between 0 and 14)
            newPosition.x = Math.max(0, Math.min(14, newPosition.x));
            newPosition.y = Math.max(0, Math.min(14, newPosition.y));
            
            // GRID-BASED COLLISION: If enemy and hero are on the same grid cell, trigger death
            if (
              target === 'hero' &&
              Math.floor(newPosition.x) === characterPosition.x &&
              Math.floor(newPosition.y) === characterPosition.y &&
              !isDead && !isSuccess
            ) {
              setIsDead(true);
              setDeathMessage('You were caught by the enemy!');
              setIsRunning(false);
            }
          }
          
          // Log enemy positions for debugging
          console.log(`Enemy at (${newPosition.x.toFixed(1)}, ${newPosition.y.toFixed(1)}) ${isChasing ? 'chasing ' + target : 'idle'}`);
          
          // Return updated enemy
          return {
            ...enemy,
            position: newPosition,
            isChasing,
            target
          };
        });
        
        // Update enemies state
        setLevel10Enemies(updatedEnemies);
        level10EnemiesRef.current = updatedEnemies;
      }, 150); // Update every 150ms for faster reactions
      
      return () => clearInterval(enemyDetectionInterval);
    }
  }, [activeLessonId, characterPosition, decoyPosition, level10Enemies, isDead, isSuccess]);

  // We removed the second useEffect for Lesson 10 to ensure the editor starts completely empty

  // Return the interactive lesson view if in lesson mode
  if (isLessonActive && activeLessonId) {
    const lessonData = X_CODE_LESSONS.find(l => l.id === activeLessonId) || X_CODE_LESSONS[0];
    
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Add style tag for animations */}
        <style>{animationStyles}</style>
        
        {/* Header */}
        <div className="bg-blue-600 py-4">
          <div className="container mx-auto px-4 flex items-center">
            <button 
              onClick={() => {
                setIsLessonActive(false);
                setActiveLessonId(null);
                if (onBack) onBack();
              }}
              className="mr-4 text-white hover:text-blue-200"
              title="Back to lesson selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Lesson {lessonData.lessonNumber}: {lessonData.title}</h1>
              </div>
              <p className="text-sm text-blue-200">{lessonData.description}</p>
          </div>
          </div>
        </div>
        
        {/* Goals dropdown section - moved higher up */}
        <div className="relative z-50">
          <div className="absolute top-0 left-0 mt-1">
                          <div 
                className={`bg-gray-800 bg-opacity-90 border-r border-y border-gray-700 transition-all duration-500 rounded-r-lg shadow-lg ${
                  showGoals ? 'w-64' : 'w-44'
                }`}
                  style={{
                  boxShadow: showGoals ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                }}
            >
              <button 
                onClick={() => setShowGoals(!showGoals)}
                className={`w-full py-1 px-4 flex items-center justify-between text-white rounded-r-lg ${
                  showGoals ? 'bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                } transition-colors duration-300`}
              >
                <div className="flex items-center overflow-hidden">
                  <span className={`mr-2 transition-all duration-300 ${showGoals ? 'scale-110' : ''}`}>🎯</span>
                  <span className={`font-medium transition-all duration-300 ${
                    showGoals ? 'text-white scale-105 font-bold' : 'text-gray-200'
                  }`}>Level Goals</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-all duration-500 ${
                    showGoals ? 'transform rotate-180 text-white' : 'text-blue-300'
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Animated collapsible content */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showGoals ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 py-2 bg-gray-800 rounded-b-lg">
                  <ul className="space-y-2">
                    {lessonData.goals?.map((goal, index) => {
                      const goalKey = `lesson-${lessonData.id}-goal-${index}`;
                      const isCompleted = completedGoals[goalKey] || false;
                      
                      return (
                        <li 
                          key={index} 
                          className={`text-sm flex items-start ${isCompleted ? 'text-green-300' : 'text-gray-300'}`}
                          style={{ 
                            animation: showGoals ? `fadeInRight ${0.3 + index * 0.1}s ease-out` : 'none'
                  }}
                  onClick={() => {
                            // Toggle goal completion status for demo purposes
                            setCompletedGoals(prev => ({
                              ...prev,
                              [goalKey]: !prev[goalKey]
                            }));
                          }}
                        >
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
                            isCompleted ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {isCompleted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span> 
                          <span className={isCompleted ? 'line-through opacity-80' : ''}>
                            {goal}
                          </span>
                        </li>
                      );
                    }) || (
                      <li className="text-sm text-gray-300 animate-fadeIn">
                        <span className="text-green-400 mr-2">•</span> Complete the level objectives
                      </li>
                    )}
                  </ul>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Add animation keyframes */}
        <style>{`
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>

        {/* Main content area - Make it full height */}
        <div className="h-[calc(100vh-76px)]">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left panel - Game grid with background */}
            <div className="w-full md:w-2/3 p-4 flex flex-col h-full">
              {/* Game grid container with background */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-700">
                {/* Background image - use custom for lesson 10 */}
                {activeLessonId === 10 ? (
                  <img
                    src="/images/img-6.png"
                    alt="Map 10 Background"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0
                    }}
                  />
                ) : activeLessonId === 11 ? (
                  <img
                    src="/images/img7.png"
                    alt="Map 11 Background"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // Always show the whole image
                      zIndex: 0,
                      transform: 'scale(1.2)', // No zoom, just fit
                      transformOrigin: 'center center',
                      background: '#222' // Optional: see the empty space
                    }}
                  />
                ) : activeLessonId === 12 ? (
                  <img
                    src="/images/img8.png"
                    alt="Map 12 Background"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      zIndex: 0,
                      background: '#222',
                      transform: 'scale(1.6)', // Zoom in
                      transformOrigin: 'center center',
                    }}
                  />
                ) : (
                <LessonBackground lessonNumber={lessonData.lessonNumber} />
                )}
                
                {/* Semi-transparent overlay to ensure grid visibility */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-30 z-1">
                  {/* Game grid with coordinates */}
                  <div className="absolute inset-0 z-2" style={{ width: '100%', height: '100%' }}>
                    {/* Grid rendering with enhanced highlighting */}
                    {Array.from({ length: 15 }, (_, y: number) => (
                      <div key={`row-${y}`} style={{ display: 'flex', width: '100%', height: '6.66%' }}>
                        {Array.from({ length: 15 }, (_, x: number) => {
                          const isCurrentCell = characterPosition.x === x && characterPosition.y === y;
                          // Waypoints for lesson 4
                          const lesson4Waypoints = [
                            { x: 11, y: 14 },
                            { x: 8, y: 14 },
                            { x: 8, y: 5 },
                            { x: 12, y: 5 },
                          ];
                          const isLesson4Waypoint = activeLessonId === 4 && lesson4Waypoints.some(pt => pt.x === x && pt.y === y);
                          
                          // Show X mark at (10,3) for lesson 10
                          if (activeLessonId === 10 && x === 10 && y === 3) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  backgroundColor: 'transparent',
                                  zIndex: 10,
                                }}
                              >
                                <div style={{
                                  fontSize: '36px',
                                  fontWeight: 'bold',
                                  color: 'black',
                                  textShadow: '0 0 5px white',
                                  zIndex: 10,
                                }}>X</div>
                              </div>
                            );
                          }
                          
                          // Show X mark at (7,2) for lesson 11
                          if (activeLessonId === 11 && x === 7 && y === 2) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  backgroundColor: 'transparent',
                                  zIndex: 10,
                                }}
                              >
                                <div style={{
                                  fontSize: '36px',
                                  fontWeight: 'bold',
                                  color: 'black',
                                  textShadow: '0 0 5px white',
                                  zIndex: 10,
                                }}>X</div>
                              </div>
                            );
                          }
                          // Show book image at (7,13) for lesson 5
                          if (activeLessonId === 5 && x === 7 && y === 13 && !bookCollected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Book
                                </div>
                                <img
                                  src="/images/book.png"
                                  alt="Book"
                                  style={{ width: '80%', height: '80%', objectFit: 'contain', pointerEvents: 'none', zIndex: 1 }}
                                />
                              </div>
                            );
                          }
                          // Show diamond image at (10,8) for lesson 6
                          if (activeLessonId === 6 && x === 10 && y === 8) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Potion
                                </div>
                                <img
                                  src="/images/potions/health-potion.png"
                                  alt="Potion"
                                  style={{ width: '80%', height: '80%', objectFit: 'contain', pointerEvents: 'none', zIndex: 1 }}
                                />
                              </div>
                            );
                          }
                          // Show diamond images at (2,13) and (11,13) for lesson 7
                          if (activeLessonId === 7 && x === 2 && y === 13 && !blueGemCollected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Blue Gem
                                </div>
                                <img src="/images/gem-blue.png" alt="Blue Gem" style={{ width: 40, height: 40, zIndex: 1 }} />
                              </div>
                            );
                          }
                          if (activeLessonId === 7 && x === 11 && y === 13 && !redGemCollected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Red Gem
                                </div>
                                <img src="/images/gem-red.png" alt="Red Gem" style={{ width: 40, height: 40, zIndex: 1 }} />
                              </div>
                            );
                          }
                          if (activeLessonId === 8 && x === 2 && y === 13 && !blueGem8Collected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Blue Gem
                                </div>
                                <img src="/images/gem-blue.png" alt="Blue Gem" style={{ width: 40, height: 40, zIndex: 1 }} />
                              </div>
                            );
                          }
                          if (activeLessonId === 8 && x === 2 && y === 5 && !redGem8Collected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Red Gem
                                </div>
                                <img src="/images/gem-red.png" alt="Red Gem" style={{ width: 40, height: 40, zIndex: 1 }} />
                              </div>
                            );
                          }
                          if (activeLessonId === 8 && x === 9 && y === 5 && !greenGem8Collected) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Green Gem
                                </div>
                                <img src="/images/gem-green.png" alt="Green Gem" style={{ width: 40, height: 40, zIndex: 1 }} />
                              </div>
                            );
                          }
                          // Show spike-trap image at (6,5) for lesson 9
                          if (activeLessonId === 9 && x === 7 && y === 13) {
                            return (
                              <div
                                key={`cell-${x}-${y}`}
                                style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Spike Trap
                                </div>
                                <img
                                  src="/images/Spike_Trap.webp"
                                  alt="Spike Trap"
                                  style={{ width: 40, height: 40, zIndex: 1 }}
                                />
                              </div>
                            );
                          }
                          // Inside the grid rendering loop, after defining isCurrentCell, add:
                          const isEnemy = activeLessonId === 10 && level10Enemies.some(e => 
                            Math.floor(e.position.x) === x && 
                            Math.floor(e.position.y) === y
                          );
                          const isDecoy = activeLessonId === 10 && decoyPosition.x === x && decoyPosition.y === y;
                          if (activeLessonId === 11) {
                            const gemIdx = LESSON11_GEMS.findIndex(gem => gem.x === x && gem.y === y);
                            if (gemIdx !== -1 && !lesson11Collected[gemIdx]) {
                              const gem = LESSON11_GEMS[gemIdx];
                              const imgSrc = gem.color === 'blue'
                                ? '/images/gem-blue.png'
                                : gem.color === 'red'
                                ? '/images/gem-red.png'
                                : '/images/gem-green.png';
                              return (
                                <div key={`cell-${x}-${y}`} style={{
                                  width: '6.66%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  background: 'transparent',
                                  flexDirection: 'column',
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(30,30,40,0.95)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    padding: '2px 10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    border: '1.5px solid #fbbf24',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    whiteSpace: 'nowrap'
                                  }}>{gem.color.charAt(0).toUpperCase() + gem.color.slice(1)} Gem</div>
                                  <img src={imgSrc} alt={`${gem.color} Gem`} style={{ width: 28, height: 28, zIndex: 1 }} />
                                </div>
                              );
                            }
                          }

                          if (activeLessonId === 12 && x === 4 && y === 8 && !lesson12GemCollected) {
                            return (
                              <div key={`cell-${x}-${y}`} style={{
                                width: '6.66%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                background: 'transparent',
                                flexDirection: 'column',
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  top: '-18px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: 'rgba(30,30,40,0.95)',
                                  color: '#fbbf24',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  padding: '2px 10px',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                  border: '1.5px solid #fbbf24',
                                  pointerEvents: 'none',
                                  zIndex: 20,
                                  whiteSpace: 'nowrap'
                                }}>Blue Gem</div>
                                <img src="/images/gem-blue.png" alt="Blue Gem" style={{ width: 28, height: 28, zIndex: 1 }} />
                              </div>
                            );
                          }
                          return (
                            <div
                              key={`cell-${x}-${y}`}
                              style={{
                                width: '6.66%',
                                height: '100%',
                                border: isCurrentCell 
                                  ? '2px solid rgba(59, 130, 246, 0.8)' 
                                  : '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                fontSize: '10px',
                                color: isCurrentCell ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                                backgroundColor: isCurrentCell 
                                  ? 'rgba(37, 99, 235, 0.4)' 
                                  : isLesson4Waypoint
                                    ? 'rgba(251, 191, 36, 0.45)'
                                    : 'transparent',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {/* Render enemy for level 10 */}
                              {isEnemy && (
                                <span
                                  style={{
                                    fontSize: '2.2rem',
                                    background: level10Enemies.find(e => 
                                      Math.floor(e.position.x) === x && 
                                      Math.floor(e.position.y) === y
                                    )?.isChasing 
                                      ? 'rgba(255,0,0,0.95)' 
                                      : 'rgba(255,0,0,0.85)',
                                    border: level10Enemies.find(e => 
                                      Math.floor(e.position.x) === x && 
                                      Math.floor(e.position.y) === y
                                    )?.isChasing 
                                      ? '3px solid white' 
                                      : '3px solid yellow',
                                    borderRadius: '8px',
                                    boxShadow: level10Enemies.find(e => 
                                      Math.floor(e.position.x) === x && 
                                      Math.floor(e.position.y) === y
                                    )?.isChasing 
                                      ? '0 0 16px 8px white' 
                                      : '0 0 16px 8px yellow',
                                    padding: '2px 8px',
                                    zIndex: 10,
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                  }}
                                  title={level10Enemies.find(e => 
                                    Math.floor(e.position.x) === x && 
                                    Math.floor(e.position.y) === y
                                  )?.isChasing 
                                    ? `Enemy chasing ${level10Enemies.find(e => 
                                        Math.floor(e.position.x) === x && 
                                        Math.floor(e.position.y) === y
                                      )?.target}` 
                                    : "Enemy"}
                                >
                                  {level10Enemies.find(e => 
                                    Math.floor(e.position.x) === x && 
                                    Math.floor(e.position.y) === y
                                  )?.isChasing ? '😡' : '👹'}
                                </span>
                              )}
                              {isDecoy && (
                                <div style={{
                                  position: 'absolute',
                                  left: decoyPixelPos.x,
                                  top: decoyPixelPos.y,
                                  zIndex: 1000,
                                  width: '120px',
                                  height: '80px',
                                  overflow: 'visible',
                                  pointerEvents: 'none',
                                  transition: 'none',
                                }}>
                                  <img 
                                    src={`/assets/characters/assasin-wolf/${decoyState === 'idle' ? 'Idle' : 'Walk'}_${
                                      decoyDirection.charAt(0).toUpperCase() + decoyDirection.slice(1)
                                    }/00${decoyFrame}.png`}
                                    alt={`Decoy ${decoyState} ${decoyDirection}`}
                                    style={{
                                      width: '90px',
                                      height: '80px',
                                      imageRendering: 'pixelated',
                                      objectFit: 'fill',
                                    }}
                                  />
                                </div>
                              )}
                              {x}.{y}
                              {/* Lesson 4 waypoint marker */}
                              {isLesson4Waypoint && (
                                <span style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  fontSize: '2.2rem',
                                  color: '#fbbf24',
                                  zIndex: 30,
                                  pointerEvents: 'none',
                                  filter: 'drop-shadow(0 0 6px #fbbf24cc)'
                                }} title="Waypoint">
                                  ★
                                </span>
                              )}
                              {/* Always show left arrow at (3,12) in lesson 2 */}
                              {activeLessonId === 2 && x === 3 && y === 12 && (
                                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '54px', color: '#38bdf8', zIndex: 20 }} title="Try walking here!">
                                  &#8592;
                                </span>
                              )}
                              {activeLessonId === 2 && x === 1 && y === 9 && (
                                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '54px', color: '#38bdf8', zIndex: 20 }} title="Try walking up here!">
                                  &#8593;
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>

                {/* Character - on top of everything */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '80px',
                    height: '80px',
                    zIndex: 9,
                    transition: 'all 0.5s ease',
                    left: `calc(${characterPosition.x * 6.66}% + 35px)`, // move right by 3px more
                    top: `calc(${characterPosition.y * 6.66}% + 32px)`, // keep down offset
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AnimatedCharacter
                    direction={characterDirection}
                    state={characterState}
                    sprites={mageSprites}
                    size={80}
                  />
                </div>
                
                {/* Position display */}
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-mono z-10">
                  Position: ({characterPosition.x}, {characterPosition.y})
                </div>

                {/* Hidden audio for victory sound */}
                {playVictorySound && (
                  <audio 
                    src="/audio/win.mp3" 
                    autoPlay 
                    onEnded={() => setPlayVictorySound(false)} 
                  />
                )}
                
                {/* Victory screen overlay */}
                {isSuccess && (
                  <div className="victory-overlay">
                    <div className="victory-stars">
                      {generateStars()}
                    </div>
                    {/* Confetti */}
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="confetti-piece"
                        style={{
                          left: `${Math.random() * 100}%`,
                          background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                          animationDelay: `${Math.random() * 1.5}s`,
                        }}
                      />
                    ))}
                    <div className="victory-text">VICTORY!</div>
                    <img 
                      src="/victory.png" 
                      alt="Victory!" 
                      className="victory-image"
                      onLoad={() => setPlayVictorySound(true)}
                      onError={(e) => {
                        const imgElement = e.currentTarget;
                        // Fallback text if image doesn't load
                        imgElement.style.width = "350px";
                        imgElement.style.height = "200px";
                        imgElement.style.background = "linear-gradient(45deg, #FFD700, #FFA500)";
                        imgElement.style.display = "flex";
                        imgElement.style.alignItems = "center";
                        imgElement.style.justifyContent = "center";
                        imgElement.style.borderRadius = "20px";
                        imgElement.style.fontSize = "48px";
                        imgElement.style.fontWeight = "bold";
                        imgElement.style.textShadow = "0px 2px 5px rgba(0,0,0,0.5)";
                        imgElement.style.boxShadow = "0px 0px 30px rgba(255, 215, 0, 0.5)";
                        imgElement.insertAdjacentHTML('beforeend', '<div style="text-align:center">🏆<br>VICTORY!</div>');
                      }}
                    />
                    <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => {
                          console.log("Next lesson button clicked");
                          handleNextLesson();
                        }}
                        className="victory-button px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xl font-bold rounded-full transition-all shadow-lg"
                    >
                      Next Lesson →
                    </button>
                      <button
                        onClick={handleBackToLessons}
                        className="victory-button px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl font-bold rounded-full transition-all shadow-lg"
                      >
                        Back to Lessons
                      </button>
                      <button
                        onClick={resetGame}
                        className="victory-button px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xl font-bold rounded-full transition-all shadow-lg"
                      >
                        Play Again
                    </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel - Code editor and execution log */}
            <div className="w-full md:w-1/3 p-4 flex flex-col h-full">
              {/* Code editor section - larger height */}
              <div className="flex-1 mb-4" style={{ height: '70%', minHeight: '400px' }}>
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onRun={() => executeCode(code)}
                  onReset={resetGame}
                  onShowHint={showHint}
                  onShowSolution={showSolution}
                  isRunning={isRunning}
                  level={activeLessonId || 1}
                  placeholder={codePlaceholder}
                  />
                
                {/* Button to move player to position (6, 7) */}
                {activeLessonId === 9 && (
                  <div className="mt-4 flex space-x-2">
                    {/* Debug buttons removed as requested */}
                  </div>
                )}
                </div>
                
              {/* Execution log section - smaller height */}
              <div className="bg-gray-800 rounded-lg p-3" style={{ maxHeight: '150px' }}>
                  <h3 className="text-sm font-medium text-white mb-2">Execution Log</h3>
                <div className="overflow-y-auto" style={{ maxHeight: '120px' }}>
                  {executionLogs.length === 0 ? (
                    <p className="text-gray-400 text-sm">Run your code to see execution logs</p>
                  ) : (
                    <div className="space-y-1">
                      {executionLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className="text-sm text-gray-300 font-mono"
                          dangerouslySetInnerHTML={{ __html: log }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation buttons when success */}
              {isSuccess && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleBackToLessons}
                    className="w-1/2 px-4 py-3 rounded-lg text-md font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Lessons
                  </button>
                  <button 
                    onClick={() => {
                      setIsSuccess(false);
                      setPlayVictorySound(false);
                      resetGame();
                    }}
                    className="w-1/2 px-4 py-3 rounded-lg text-md font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                  >
                    Try Again
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header with back button */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
              title="Back to main menu"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" /> 
                X-Code Crew Academy
              </h1>
              <p className="text-blue-100">Your 160-lesson coding adventure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenFundamentalsSlides}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors flex items-center"
            >
              <Presentation className="mr-2 h-4 w-4" />
              Programming Fundamentals
            </button>
            <div className="text-right">
              <div className="text-sm opacity-75">Progress</div>
              <div className="text-lg font-bold">{currentProgress}/160</div>
              <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-1">
                <div 
                  className="bg-white h-2 rounded-full" 
                  style={{ width: `${(currentProgress/160)*100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {showAllCourses ? (
          /* All Courses View */
          <div>
            <h2 className="text-2xl font-bold mb-6">All X-Code Academy Courses</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* CS1 Course Card */}
              <div 
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setShowAllCourses(false)}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{MENTOR_DATA.sage.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">CS1: Code Basics</h3>
                    <p className="text-blue-200">with {MENTOR_DATA.sage.name}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">Master the fundamentals of programming through interactive challenges.</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-500 bg-opacity-30 text-xs px-2 py-1 rounded-full">Current</span>
                  <span className="text-sm">{currentProgress}/40 lessons</span>
                </div>
              </div>
              
              {/* CS2 Course Card */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl opacity-75">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{MENTOR_DATA.rex.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">CS2: {COURSE_STRUCTURE.cs2.title}</h3>
                    <p className="text-red-200">with {MENTOR_DATA.rex.name}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">Master function-based programming and logical operations.</p>
                <div className="flex justify-between items-center">
                  <span className="bg-red-500 bg-opacity-30 text-xs px-2 py-1 rounded-full flex items-center">
                    <Lock size={12} className="mr-1" /> Locked
                  </span>
                  <span className="text-sm">0/40 lessons</span>
                </div>
              </div>
              
              {/* CS3 Course Card */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl opacity-75">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{MENTOR_DATA.arrow.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">CS3: {COURSE_STRUCTURE.cs3.title}</h3>
                    <p className="text-green-200">with {MENTOR_DATA.arrow.name}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">Learn object-oriented programming and advanced patterns.</p>
                <div className="flex justify-between items-center">
                  <span className="bg-green-500 bg-opacity-30 text-xs px-2 py-1 rounded-full flex items-center">
                    <Lock size={12} className="mr-1" /> Locked
                  </span>
                  <span className="text-sm">0/40 lessons</span>
                </div>
              </div>
              
              {/* CS4 Course Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl opacity-75">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{MENTOR_DATA.luna.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">CS4: {COURSE_STRUCTURE.cs4.title}</h3>
                    <p className="text-purple-200">with {MENTOR_DATA.luna.name}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">Master advanced programming techniques and professional patterns.</p>
                <div className="flex justify-between items-center">
                  <span className="bg-purple-500 bg-opacity-30 text-xs px-2 py-1 rounded-full flex items-center">
                    <Lock size={12} className="mr-1" /> Locked
                  </span>
                  <span className="text-sm">0/40 lessons</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar - Course Structure */}
            <div className="w-1/4 bg-gray-800 rounded-xl p-4 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Code className="mr-2" /> Course Outline
              </h2>
              
              {/* Current Course Info */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{MENTOR_DATA.sage.icon}</span>
                  <div>
                    <h3 className="font-bold">CS1: Code Basics</h3>
                    <p className="text-sm text-blue-200">with {MENTOR_DATA.sage.name}</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100 mb-2">Master the fundamentals of programming through interactive challenges.</p>
                <div className="text-xs text-blue-300">
                  {COURSE_STRUCTURE.cs1.mainConcepts.join(' • ')}
                </div>
              </div>
              
              {/* Week Selection */}
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">SELECT WEEK</h3>
                <div className="grid grid-cols-5 gap-2">
                  {weekGroups.map(week => (
                    <button
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className={`p-2 rounded-lg text-center ${
                        selectedWeek === week 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {week}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Week Title */}
              <h3 className="font-medium text-lg mb-3">
                Week {selectedWeek}: {getWeekTheme(selectedWeek)}
              </h3>
              
              {/* Mentor Quote */}
              <div className="bg-gray-700 rounded-lg p-3 mb-6 border-l-4 border-blue-500">
                <p className="italic text-sm text-gray-300">"{MENTOR_DATA.sage.quote}"</p>
                <p className="text-right text-xs text-gray-400 mt-1">— {MENTOR_DATA.sage.name}</p>
              </div>
              
              {/* Additional Navigation */}
              <div className="space-y-2 mt-4">
                <button 
                  onClick={() => setShowAllCourses(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-left px-4 py-2 rounded-lg flex items-center justify-between text-sm border border-transparent"
                  style={glowingGreenButtonStyle}
                >
                  <span>All Courses</span>
                  <ChevronRight size={16} />
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-left px-4 py-2 rounded-lg flex items-center justify-between text-sm" onClick={() => setAchievementsModalOpen(true)}>
                  <span>View Achievements</span>
                  <Award size={16} />
                </button>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {selectedLessonData ? (
                /* Lesson Detail View */
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  {/* Lesson Header */}
                  <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Lesson {selectedLessonData.lessonNumber}: {selectedLessonData.title}
                        </h2>
                        <p className="text-blue-200">{selectedLessonData.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-300 mb-1">Difficulty</p>
                          <div className="flex">
                            {renderDifficultyStars(selectedLessonData.difficulty)}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-300 mb-1">Time</p>
                          <p className="flex items-center">
                            <Clock size={14} className="mr-1" /> 
                            <span>{selectedLessonData.estimatedTime}m</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex mt-4">
                      <span className="bg-blue-500 bg-opacity-30 text-blue-200 text-xs px-3 py-1 rounded-full">
                        {selectedLessonData.concept}
                      </span>
                    </div>
                  </div>
                  
                  {/* Your Quest Section (CS1 only) */}
                  {selectedLessonData && isCS1Lesson(selectedLessonData) && (() => {
                    // Instead of getting story data separately, use the fields directly from selectedLessonData
                    return (
                      <div className="bg-blue-900 bg-opacity-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center mb-2">
                          <BookOpen className="mr-2 text-blue-300" size={18} />
                          <div className="text-sm font-semibold text-blue-300">Quest Update</div>
                        </div>
                        <div className="font-medium text-blue-200">{selectedLessonData.title}</div>
                        <div className="text-xs leading-relaxed text-blue-100">{selectedLessonData.questUpdate}</div>
                        <div className="text-xs text-blue-300"><strong>Setting:</strong> {selectedLessonData.setting}</div>
                      </div>
                    );
                  })()}
                  
                  {/* Lesson Content */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-blue-400 mb-2">Goals</h3>
                      <ul className="space-y-2">
                        {selectedLessonData.goals.map((goal: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedLessonData.codeExample && (
                      <div>
                        <h3 className="text-lg font-medium text-blue-400 mb-2">Example Code</h3>
                        <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300">
                          <pre>{selectedLessonData.codeExample}</pre>
                        </div>
                      </div>
                    )}
                    
                    {selectedLessonData.hints && (
                      <div>
                        <h3 className="text-lg font-medium text-blue-400 mb-2">Hints & Tips</h3>
                        <ul className="space-y-2">
                          {selectedLessonData.hints.map((hint: string, index: number) => (
                            <li key={index} className="flex items-start text-gray-300">
                              <span className="font-bold text-yellow-500 mr-2">•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedLessonData.unlocks && (
                      <div className="bg-purple-900 bg-opacity-30 border border-purple-500 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-purple-300 mb-1">Unlocks</h3>
                        <p>{selectedLessonData.unlocks}</p>
                      </div>
                    )}
                    
                    {/* Lesson Actions */}
                    <div className="flex justify-between pt-4">
                      <button 
                        onClick={() => setSelectedLesson(null)} 
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                      >
                        Back to Lessons
                      </button>
                      
                      {selectedLessonData.id === 1 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleStartLessonWithLoading(selectedLessonData.id)}
                          className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center font-medium"
                        >
                          <Play size={16} className="mr-2" /> Start
                        </button>
                        </div>
                      ) : isLessonCompleted(selectedLessonData.id) ? (
                        <button 
                          className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center font-medium"
                        >
                          <CheckCircle size={16} className="mr-2" /> Completed
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartLessonWithLoading(selectedLessonData.id)}
                          className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center font-medium"
                        >
                          <Play size={16} className="mr-2" /> Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Lesson List View */
                <div className="space-y-6">
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">
                      Week {selectedWeek} Lessons: {getWeekTheme(selectedWeek)}
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {weekLessons.map(lesson => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isUnlocked = isLessonUnlocked(lesson.id);
                        const isActive = lesson.id === currentProgress + 1;
                        
                        return (
                          <div
                            key={lesson.id}
                            className={`
                              p-4 rounded-lg border-l-4 
                              ${isCompleted 
                                ? 'bg-green-900 bg-opacity-20 border-green-500' 
                                : isActive
                                  ? 'bg-blue-900 bg-opacity-20 border-blue-500 animate-pulse'
                                  : 'bg-gray-700 border-gray-600'}
                            `}
                          >
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                {isCompleted ? (
                                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                                    <CheckCircle size={16} />
                                  </div>
                                ) : isUnlocked ? (
                                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                                    {lesson.lessonNumber}
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                    <Lock size={14} />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  <p className="text-sm text-gray-400">{lesson.concept}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="flex mb-1">
                                  {renderDifficultyStars(lesson.difficulty)}
                                </div>
                                <div className="text-xs text-gray-400 flex items-center">
                                  <Clock size={12} className="mr-1" /> {lesson.estimatedTime}m
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-between items-center">
                              <p className="text-sm text-gray-300 line-clamp-1">
                                {lesson.description}
                              </p>
                              <button
                                onClick={() => isUnlocked && setSelectedLesson(lesson.id)}
                                disabled={!isUnlocked}
                                className={`
                                  px-4 py-1.5 rounded-lg text-sm flex items-center
                                  ${isUnlocked 
                                    ? 'bg-blue-600 hover:bg-blue-500' 
                                    : 'bg-gray-600 cursor-not-allowed text-gray-400'}
                                `}
                              >
                                {isCompleted ? 'Review' : isUnlocked ? 'Start' : 'Locked'}
                                <ChevronRight size={16} className="ml-1" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Week Overview Section */}
                  {selectedWeek === 1 && (
                    <>
                      <div className="bg-gray-800 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-2">About Week 1: First Steps</h2>
                        <p className="text-gray-300 mb-4">
                          Begin your journey into programming with the fundamental building blocks of code. Week 1 introduces you to the core concepts that form the foundation of all programming languages.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 text-blue-300">Key Skills</h3>
                            <ul className="text-sm space-y-1 text-gray-300">
                              <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Variables and data types
                              </li>
                              <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Basic operations and expressions
                              </li>
                              <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Simple conditionals (if/else)
                              </li>
                              <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Console output and debugging
                              </li>
                            </ul>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 text-blue-300">Sage's Tips</h3>
                            <p className="text-sm text-gray-300 italic">
                              "Every great journey begins with a single step. In coding, your first variables and conditionals are that step. Don't worry about perfection - focus on understanding the core concepts, and the rest will follow as you practice!"
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedWeek === 2 && (
                    <div className="bg-gray-800 p-6 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">About Week 2: Basic Loops</h2>
                      <p className="text-gray-300 mb-4">
                        Learn to automate repetitive tasks with different types of loops. Week 2 builds on the fundamental concepts from Week 1 and introduces you to powerful loop patterns that let your code repeat actions efficiently.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Key Skills</h3>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              For loop creation and control
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              While loops for condition-based repetition
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Nested loop structures
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Loop optimization techniques
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Sage's Tips</h3>
                          <p className="text-sm text-gray-300 italic">
                            "A loop is like a spell that repeats itself until the conditions are right to stop. Master loops, and you'll save yourself countless lines of repetitive code. Pay special attention to your loop conditions to avoid infinite loops!"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedWeek === 3 && (
                    <div className="bg-gray-800 p-6 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">About Week 3: Functions & Organization</h2>
                      <p className="text-gray-300 mb-4">
                        Discover the power of functions to organize and reuse your code. Week 3 teaches you how to break down complex problems into manageable, reusable pieces that make your code more efficient and readable.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Key Skills</h3>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Function creation and calling
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Working with parameters and arguments
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Array fundamentals and manipulation
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Code organization principles
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Arrow's Tips</h3>
                          <p className="text-sm text-gray-300 italic">
                            "In chaos, the prepared mind finds order. Functions are your way to bring order to complex code. Think of each function as a specialized tool in your arsenal - the right tool for the right job makes any challenge manageable!"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedWeek === 4 && (
                    <div className="bg-gray-800 p-6 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">About Week 4: Basic Data Structures</h2>
                      <p className="text-gray-300 mb-4">
                        Learn how to organize and structure your data effectively. Week 4 introduces you to objects, advanced string operations, and error handling techniques that will elevate your programming skills to new heights.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Key Skills</h3>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Object creation and property access
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              String manipulation techniques
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Error handling with try/catch
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Advanced array operations
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Luna's Tips</h3>
                          <p className="text-sm text-gray-300 italic">
                            "A true leader organizes not just their own actions, but creates systems that others can follow and understand! Well-structured data is the foundation of elegant code. When you master objects and data structures, you begin to think like a true architect of code."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedWeek === 5 && (
                    <div className="bg-gray-800 p-6 rounded-xl">
                      <h2 className="text-xl font-bold mb-2">About Week 5: Review and Mastery</h2>
                      <p className="text-gray-300 mb-4">
                        Consolidate everything you've learned and prepare for the final challenge. Week 5 focuses on mastery through comprehensive review, optimization techniques, and solving complex problems that integrate all the concepts from CS1.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Key Skills</h3>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Algorithmic thinking and problem solving
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Code review and optimization
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Pattern recognition in code
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-400 mr-2">✓</span>
                              Comprehensive application of all CS1 concepts
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-blue-300">Sage's Tips</h3>
                          <p className="text-sm text-gray-300 italic">
                            "The greatest coders don't just write code - they think in code, dream in algorithms, and solve problems like living computers! True mastery comes not from memorizing syntax, but from seeing the patterns that connect everything you've learned."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ReactModal
        isOpen={achievementsModalOpen}
        onRequestClose={() => setAchievementsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-40"
        ariaHideApp={false}
      >
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-2xl relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            onClick={() => setAchievementsModalOpen(false)}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">Achievements & Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {ACHIEVEMENT_BADGES.map(badge => (
              <div key={badge.id} className="relative group flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-2 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <span dangerouslySetInnerHTML={{ __html: badge.svg }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-2xl">🔒</div>
                  </div>
                </div>
                <div className="font-semibold text-gray-200 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-gray-400 truncate w-24" title={badge.description}>{badge.description}</div>
                <div className="hidden group-hover:block absolute z-50 left-1/2 -translate-x-1/2 top-20 bg-gray-800 text-gray-100 text-xs rounded-lg shadow-lg px-3 py-2 w-48 border border-yellow-400">
                  <div className="font-bold text-yellow-300 mb-1">{badge.name}</div>
                  <div>{badge.description}</div>
                  <div className="mt-2 text-yellow-200">How to unlock: <span className="font-semibold">{badge.unlockCriteria}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReactModal>
      <LoadingScreen 
        progress={loadingProgress} 
        visible={loading} 
        goals={loadingGoals} 
        backgroundImage={loadingBg} 
        onLoadingComplete={() => {
          // Extract the lessonId from the stored selectedLessonData or use a more reliable approach
          // Get the lessonId directly from the URL or from a state variable that we set when starting the loading
          const storedLessonId = localStorage.getItem('loadingLessonId');
          const lessonId = storedLessonId ? parseInt(storedLessonId) : undefined;
          
          console.log("Loading complete for lesson:", lessonId);
          if (lessonId) {
            handleLoadingComplete(lessonId);
          } else {
            console.error("Could not determine lesson ID for loading completion");
            // Fallback: if we can't determine the lesson ID, at least hide the loading screen
            setLoading(false);
          }
        }}
      />
      {/* In the grid rendering section for level 10, add enemy rendering */}
      {activeLessonId === 10 && level10Enemies.map((enemy, index) => (
        <div
          key={`enemy-${index}`}
          style={{
            position: 'absolute',
            left: `calc(${enemy.position.x * 6.66}% + 35px)`,
            top: `calc(${enemy.position.y * 6.66}% + 32px)`,
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 0, 0, 0.85)',
            border: '4px solid yellow',
            borderRadius: '8px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -100%)',
            fontWeight: 'bold',
            boxShadow: '0 0 16px 4px #FFD700',
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: 'white', fontSize: '40px', textShadow: '2px 2px 8px #000' }}>👹</div>
        </div>
      ))}

      {/* Death screen overlay - positioned over the entire viewport */}
      {isDead && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center">
          <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-red-600 max-w-md">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-white mb-6">{deathMessage}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      )}
      {activeLessonId === 11 && LESSON11_GEMS.map((gem, index) => (
        <div
          key={`gem-${index}`}
          style={{
            position: 'absolute',
            left: `calc(${gem.x * 6.66}% + 35px)`,
            top: `calc(${gem.y * 6.66}% + 32px)`,
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '4px solid yellow',
            borderRadius: '8px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -100%)',
            fontWeight: 'bold',
            boxShadow: '0 0 16px 4px #FFD700',
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: 'white', fontSize: '40px', textShadow: '2px 2px 8px #000' }}>💎</div>
        </div>
      ))}
      {/* When lesson 12 is activated, set the player start position to (7, 14) */}
      {activeLessonId === 12 && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${characterPosition.x * 6.66}% + 35px)`,
            top: `calc(${characterPosition.y * 6.66}% + 32px)`,
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '4px solid yellow',
            borderRadius: '8px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -100%)',
            fontWeight: 'bold',
            boxShadow: '0 0 16px 4px #FFD700',
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: 'white', fontSize: '40px', textShadow: '2px 2px 8px #000' }}>💎</div>
        </div>
      )}
      {/* Add collection logic for lesson 12 gem */}
      {activeLessonId === 12 && characterPosition.x === 4 && characterPosition.y === 8 && !lesson12GemCollected && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${characterPosition.x * 6.66}% + 35px)`,
            top: `calc(${characterPosition.y * 6.66}% + 32px)`,
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '4px solid yellow',
            borderRadius: '8px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -100%)',
            fontWeight: 'bold',
            boxShadow: '0 0 16px 4px #FFD700',
            pointerEvents: 'none',
          }}
        >
          <div style={{ color: 'white', fontSize: '40px', textShadow: '2px 2px 8px #000' }}>💎</div>
        </div>
      )}
    </div>
  );
};

export default XCodeAcademy;
