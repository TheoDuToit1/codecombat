// XCodeAcademy Component
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Code, Star, Clock, Award, CheckCircle, Lock, Play, Presentation } from 'lucide-react';
import { CS1_LESSONS, MENTOR_DATA, COURSE_STRUCTURE, CS1Lesson } from '../data/cs1LessonData';
// Import the other course data for "All Courses" functionality
import { CS2_LESSONS } from '../data/cs2LessonData';
import { CS3_LESSONS } from '../data/cs3LessonData';
import { CS4_LESSONS } from '../data/cs4LessonData';
import { ProgressService } from '../services/ProgressService';
import { CS1_QUIZZES } from '../data/cs1QuizData';
import ReactModal from 'react-modal';
import { CS1QuizModal } from './CS1QuizModal';
import { ACHIEVEMENT_BADGES } from '../data/achievements';
import { getStoryData } from '../data/lessonStory';
import { useParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from './CodeEditor';
import { GameGrid } from './GameGrid';
import { ExecutionLog } from './ExecutionLog';
import { GameStats } from './GameStats';
import { loadCharacterAnimations } from '../utils/loadCharacterAnimations';
import { AnimatedCharacter } from './AnimatedCharacter';
import { LessonBackground } from './LessonBackground';

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
  
  /* Success message animation */
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
const isCS1Lesson = (lesson: any) => {
  // If courseId exists, use it
  if (lesson.courseId) return lesson.courseId === 'cs1';
  // Otherwise, use mentor or week as fallback
  return lesson.mentor?.name === 'Sage' || (lesson.week && lesson.week <= 8);
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
  const [currentExecutingLine, setCurrentExecutingLine] = useState<number>(-1);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  // State for character
  const [characterPosition, setCharacterPosition] = useState({ x: 1, y: 5 });
  const [characterDirection, setCharacterDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [characterState, setCharacterState] = useState<'idle' | 'walk' | 'attack'>('idle');
  
  // Track which directions have been executed (for lesson 2)
  const [directionsExecuted, setDirectionsExecuted] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  
  // Add this near the top of the component
  const mageSprites = loadCharacterAnimations('mage');
  
  // Effect to check if we're in lesson mode from URL params
  useEffect(() => {
    if (lessonId) {
      const lessonIdNum = parseInt(lessonId, 10);
      setActiveLessonId(lessonIdNum);
      setIsLessonActive(true);
      
      // Find the lesson data
      const lessonData = CS1_LESSONS.find(l => l.id === lessonIdNum);
      if (lessonData && lessonData.codeExample) {
        setCode(lessonData.codeExample);
      }
      
      // Set initial character position based on lesson
      if (lessonIdNum === 1) {
        setCharacterPosition({ x: 6, y: 14 });
      } else if (lessonIdNum === 2) {
        setCharacterPosition({ x: 6, y: 10 });
      } else if (lessonIdNum === 4) {
        setCharacterPosition({ x: 11, y: 11 }); // Updated starting position for lesson 4
      }
    }
  }, [lessonId]);

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
      const lessonData = CS1_LESSONS.find(l => l.id === activeLessonId);
      if (lessonData && lessonData.codeExample) {
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
  const weekLessons = CS1_LESSONS.filter(lesson => lesson.week === selectedWeek);
  const selectedLessonData = selectedLesson ? CS1_LESSONS.find(l => l.id === selectedLesson) : null;

  // Group lessons by week for the sidebar
  const weekGroups = Array.from(new Set(CS1_LESSONS.map(l => l.week))).sort((a, b) => a - b);
  
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

  // Update the movement functions to move grid by grid
  const moveCharacter = (direction: 'up' | 'down' | 'left' | 'right', steps: number = 1) => {
    // Set the direction first
    setCharacterDirection(direction);
    
    // Move step by step with visible animation
    let stepsRemaining = steps;
    const moveStep = () => {
      if (stepsRemaining <= 0) return;
      
      setCharacterState('walk');
      
      // Move one step in the specified direction
      setCharacterPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        switch (direction) {
          case 'up':
            newY = Math.max(0, prev.y - 1);
            break;
          case 'down':
            newY = Math.min(14, prev.y + 1);
            break;
          case 'left':
            newX = Math.max(0, prev.x - 1);
            break;
          case 'right':
            newX = Math.min(14, prev.x + 1);
            break;
        }
        
        // Add to execution log only on the first step
        if (stepsRemaining === steps) {
          setExecutionLogs(logs => [
            ...logs,
            `Character moving ${direction} ${steps} step(s)`
          ]);
        }
        
        // Store final position for logging
        const finalPos = { x: newX, y: newY };
        
        // If this is the last step, log the final position
        if (stepsRemaining === 1) {
          setTimeout(() => {
            setExecutionLogs(logs => [
              ...logs,
              `Character arrived at position (${finalPos.x},${finalPos.y})`
            ]);
          }, 400);
        }
        
        return finalPos;
      });
      
      // Decrement steps remaining
      stepsRemaining--;
      
      // Set back to idle briefly between steps
      setTimeout(() => {
        setCharacterState('idle');
        
        // If more steps remain, continue after a short delay
        if (stepsRemaining > 0) {
          setTimeout(moveStep, 300);
        }
      }, 300);
    };
    
    // Start the step-by-step movement
    moveStep();
  };

  // Update the executeCode function to handle empty code
  const executeCode = (code: string) => {
    if (isRunning) return;
    // Check if code is empty
    if (!code || code.trim() === '') {
      setExecutionLogs(['<span class="zoom-effect flashing-orange-gradient">Code first!</span>']);
      setTimeout(() => { setExecutionLogs([]); }, 2000);
      return;
    }
    setIsRunning(true);
    setExecutionLogs([]);
    // Local tracking for lesson 2 directions
    let directionsUsedThisRun = { up: false, down: false, left: false, right: false };
    if (activeLessonId === 2) {
      setDirectionsExecuted({ up: false, down: false, left: false, right: false });
    }
    try {
      // Parse the code into separate lines/commands
      const lines = code.split('\n').filter(line => 
        line.trim() && !line.trim().startsWith('//') // Skip empty lines and comments
      );
      let currentLineIndex = 0;
      const executeNextCommand = () => {
        if (currentLineIndex >= lines.length) {
          setIsRunning(false);
          // For lesson 2, check for success after running code
          if (activeLessonId === 2) {
            if (directionsUsedThisRun.up && directionsUsedThisRun.down && directionsUsedThisRun.left && directionsUsedThisRun.right) {
              setIsSuccess(true);
              createConfetti();
              setExecutionLogs(["🎉 Success! You've used all four directions and completed the objective!"]);
            } else {
              setIsSuccess(false);
              setExecutionLogs(["Try using all four directions: up, down, left, right!"]);
            }
          } else if (
            activeLessonId === 3 &&
            lines.some(line => /hero\.move(Up|Down|Left|Right)\s*\(\s*\d+\s*\)/.test(line))
          ) {
            setIsSuccess(true);
            createConfetti();
            setExecutionLogs(["🎉 Success! You used a number in the brackets to move multiple steps!"]);
          } else if (
            activeLessonId === 1 &&
            characterPosition.x === 6 &&
            characterPosition.y === 10
          ) {
            setIsSuccess(true);
            createConfetti();
            setExecutionLogs(["🎉 Success! You've completed the objective!"]);
          } else if (
            activeLessonId === 4
          ) {
            setIsSuccess(true);
            createConfetti();
            setExecutionLogs(["🎉 Success! (Forced for demonstration)"]);
          } else {
            setExecutionLogs(["Great job! Code executed successfully!"]);
          }
          return;
        }
        const currentLine = lines[currentLineIndex].trim();
        if (currentLineIndex === 0) {
          setExecutionLogs(["Running your code..."]);
        }
        // Create a hero object with movement methods
        const hero = {
          moveUp: (steps = 1) => {
            if (activeLessonId === 2) directionsUsedThisRun.up = true;
            if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, up: true }));
            setIsMoving(true);
            moveCharacter('up', steps);
            setTimeout(() => {
              setIsMoving(false);
              currentLineIndex++;
              executeNextCommand();
            }, steps * 700);
          },
          moveDown: (steps = 1) => {
            if (activeLessonId === 2) directionsUsedThisRun.down = true;
            if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, down: true }));
            setIsMoving(true);
            moveCharacter('down', steps);
            setTimeout(() => {
              setIsMoving(false);
              currentLineIndex++;
              executeNextCommand();
            }, steps * 700);
          },
          moveLeft: (steps = 1) => {
            if (activeLessonId === 2) directionsUsedThisRun.left = true;
            if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, left: true }));
            setIsMoving(true);
            moveCharacter('left', steps);
            setTimeout(() => {
              setIsMoving(false);
              currentLineIndex++;
              executeNextCommand();
            }, steps * 700);
          },
          moveRight: (steps = 1) => {
            if (activeLessonId === 2) directionsUsedThisRun.right = true;
            if (activeLessonId === 2) setDirectionsExecuted(prev => ({ ...prev, right: true }));
            setIsMoving(true);
            moveCharacter('right', steps);
            setTimeout(() => {
              setIsMoving(false);
              currentLineIndex++;
              executeNextCommand();
            }, steps * 700);
          }
        };
        try {
          const executeFunction = new Function('hero', `
            try {
              ${currentLine}
              return true;
            } catch (error) {
              return error;
            }
          `);
          const result = executeFunction(hero);
          if (result !== true) {
            setCodeError("Code error, check and fix!");
            setIsRunning(false);
          }
        } catch (error) {
          setCodeError("Code error, check and fix!");
          setIsRunning(false);
        }
      };
      executeNextCommand();
    } catch (error) {
      setCodeError("Code error, check and fix!");
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
    // Set position based on active lesson
    if (activeLessonId === 1) {
      setCharacterPosition({ x: 6, y: 14 });
    } else if (activeLessonId === 2) {
      setCharacterPosition({ x: 6, y: 10 });
    } else if (activeLessonId === 4) {
      setCharacterPosition({ x: 11, y: 11 }); // Updated starting position for lesson 4
    } else {
      setCharacterPosition({ x: 1, y: 5 });
    }
    setCharacterDirection('right');
    setCharacterState('idle');
  };
  
  // Show hint function
  const showHint = () => {
    const lessonData = CS1_LESSONS.find(l => l.id === activeLessonId);
    if (lessonData && lessonData.hints && lessonData.hints.length > 0) {
      setExecutionLogs(prev => [...prev, `💡 Hint: ${lessonData.hints[0]}`]);
    }
  };
  
  // Show solution function
  const showSolution = () => {
    if (activeLessonId === 4) {
      setCode('hero.moveDown(3)\nhero.moveLeft(3)\nhero.moveUp(9)\nhero.moveRight(4)');
      setExecutionLogs(prev => [...prev, '🔍 Solution: Use the exact sequence to visit all waypoints in order.']);
    } else {
    setCode('hero.moveRight()');
    setExecutionLogs(prev => [...prev, '🔍 Solution: Use hero.moveRight() to move your character to the right.']);
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

  // Function to create confetti
  const createConfetti = () => {
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
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  };

  // Handle navigation to the next lesson
  const handleNextLesson = () => {
    if (activeLessonId) {
      const nextLessonId = activeLessonId + 1;
      // Mark current lesson as completed
      handleCompleteLesson(activeLessonId);
      // Navigate to the next lesson
      navigate(`/lesson/${nextLessonId}`);
      // Reset success state
      setIsSuccess(false);
    }
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

  // Return the interactive lesson view if in lesson mode
  if (isLessonActive && activeLessonId) {
    const lessonData = CS1_LESSONS.find(l => l.id === activeLessonId) || CS1_LESSONS[0];
    
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Add style tag for animations */}
        <style>{animationStyles}</style>
        
        {/* Header */}
        <div className="bg-blue-600 py-4">
          <div className="container mx-auto px-4 flex items-center">
            <button onClick={onBack} className="mr-4 text-white hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Lesson {lessonData.lessonNumber}: {lessonData.title}</h1>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'white',
                    color: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  onClick={() => {
                    setIsLessonActive(false);
                    setActiveLessonId(null);
                    if (onBack) onBack();
                  }}
                  title="Back to lesson overview"
                >
                  T2
              </div>
            </div>
              <p className="text-sm text-blue-200">{lessonData.description}</p>
          </div>
          </div>
        </div>

        {/* Main content area - Make it full height */}
        <div className="h-[calc(100vh-76px)]">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left panel - Game grid with background */}
            <div className="w-full md:w-2/3 p-4 flex flex-col h-full">
              {/* Game grid container with background */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-700">
                {/* Background image - using LessonBackground component */}
                <LessonBackground lessonNumber={lessonData.lessonNumber} />
                
                {/* Semi-transparent overlay to ensure grid visibility */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-30 z-1">
                  {/* Game grid with coordinates */}
                  <div className="absolute inset-0 z-2" style={{ width: '100%', height: '100%' }}>
                    {/* Grid rendering with enhanced highlighting */}
                    {Array.from({ length: 15 }, (_, y) => (
                      <div key={`row-${y}`} style={{ display: 'flex', width: '100%', height: '6.66%' }}>
                        {Array.from({ length: 15 }, (_, x) => {
                          const isCurrentCell = characterPosition.x === x && characterPosition.y === y;
                          // Waypoints for lesson 4
                          const lesson4Waypoints = [
                            { x: 11, y: 14 },
                            { x: 8, y: 14 },
                            { x: 8, y: 5 },
                            { x: 12, y: 5 },
                          ];
                          const isLesson4Waypoint = activeLessonId === 4 && lesson4Waypoints.some(pt => pt.x === x && pt.y === y);
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
                    zIndex: 10,
                    transition: 'all 0.5s ease',
                    left: `${characterPosition.x * 6.66}%`,
                    top: `${characterPosition.y * 6.66}%`,
                    transform: 'translate(-50%, -50%)',
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

                {/* Success message */}
                {isSuccess && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2000,
                    background: 'rgba(34,197,94,0.95)',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    padding: '32px 64px',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}>
                    SUCCESS!
                  </div>
                )}
              </div>
            </div>

            {/* Right panel - Code editor and execution log */}
            <div className="w-full md:w-1/3 p-4 flex flex-col space-y-4 h-full">
              {/* Goals section */}
              <div className="bg-gray-800 rounded-md border border-gray-700 p-3">
                <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                  <span className="mr-2">🎯</span> Level Goals
                </h3>
                <ul className="space-y-1">
                  {lessonData.goals?.map((goal, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start">
                      <span className="text-green-400 mr-1">•</span> {goal}
                    </li>
                  )) || (
                    <li className="text-xs text-gray-300">
                      <span className="text-green-400 mr-1">•</span> Complete the level objectives
                    </li>
                  )}
                </ul>
              </div>

              {/* Code editor - Make it properly editable and smaller */}
              <div className="flex-1 flex flex-col" style={{ maxHeight: '40%' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">Level {lessonData.lessonNumber} - Code Editor</span>
                  </div>
              </div>

                <div className="border border-gray-700 rounded-md overflow-hidden flex-1 bg-gray-900 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-gray-900 text-white p-4 font-mono text-base focus:outline-none resize-none"
                    placeholder={codePlaceholder || "Type your code here..."}
                    spellCheck="false"
                  />
                </div>
                
                <div className="flex flex-col items-center space-y-2 mt-3">
                  {codeError && (
                    <div className="w-full flashing-orange-gradient">
                      {codeError}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 w-full">
                    <button
                      onClick={() => executeCode(code)}
                      disabled={isRunning || isSuccess}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isRunning || isSuccess
                          ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Reset
                    </button>
                    {isSuccess && (
                      <button
                        onClick={handleNextLesson}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                      >
                        Next Lesson
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Execution log */}
              <div className="flex-1">
                <div className="bg-gray-900 border border-gray-700 rounded-md p-3 h-full overflow-auto">
                  <h3 className="text-sm font-medium text-white mb-2">Execution Log</h3>
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
              onClick={onBack} 
              className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
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
                    const storyData = getStoryData(selectedLessonData.id);
                    return storyData ? (
                      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-lg p-4 mb-4 shadow-md">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <span className="mr-2">⚔️</span> Your Quest
                        </h4>
                        <div className="text-sm text-blue-100 space-y-2">
                          <div className="font-medium text-blue-200">{storyData.title}</div>
                          <div className="text-xs leading-relaxed text-blue-100">{storyData.questUpdate}</div>
                          <div className="text-xs text-blue-300"><strong>Setting:</strong> {storyData.setting}</div>
                        </div>
                      </div>
                    ) : null;
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
                          <div 
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'white',
                              color: '#222',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '1.2rem',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                            onClick={() => onStartLessonLevel && onStartLessonLevel(selectedLessonData.id)}
                            title="Go to lesson"
                          >
                            T1
                          </div>
                        <button 
                          onClick={() => onStartLessonLevel && onStartLessonLevel(selectedLessonData.id)}
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
                          onClick={() => onStartLessonLevel && onStartLessonLevel(selectedLessonData.id)}
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
                    <svg width="48" height="48" className="absolute"><circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.3)" /></svg>
                    <svg width="24" height="24" className="text-gray-400"><g><circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" /><text x="12" y="18" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🔒</text></g></svg>
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
    </div>
  );
};

export default XCodeAcademy;
