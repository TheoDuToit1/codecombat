// CS4 Lesson Data Structure - Advanced Concepts
// With Luna the Valkyrie

import { CS1Lesson } from './cs1LessonData';

export interface CS4Lesson extends CS1Lesson {}

// Mentor data for CS4
export const CS4_MENTOR_DATA = {
  luna: {
    name: "Luna the Valkyrie",
    icon: "⚔️",
    quote: "A true coding master knows that power comes not just from writing code, but from writing code that others can understand, maintain, and build upon. We aim for elegance in our solutions."
  }
};

export const COURSE_STRUCTURE_CS4 = {
  mainConcepts: [
    "Async Programming", 
    "Code Organization", 
    "Design Patterns", 
    "Advanced Algorithms", 
    "Performance", 
    "Error Handling"
  ]
};

export const CS4_LESSONS: CS4Lesson[] = [
  // Week 1: Asynchronous Programming
  {
    id: 301,
    lessonNumber: 1,
    title: "Introduction to Asynchronous Code",
    description: "Learn how to handle operations that take time to complete.",
    concept: "Asynchronous Basics",
    objectives: [
      "Understand synchronous vs asynchronous execution",
      "Learn about callbacks and their limitations",
      "Handle time-based operations"
    ],
    difficulty: 4,
    estimatedTime: 35,
    mentor: {
      name: "Luna the Valkyrie",
      icon: "⚔️"
    },
    week: 1,
    codeExample: "// Synchronous code\nconsole.log('Starting...');\n\n// Asynchronous operation with callback\nsetTimeout(() => {\n  console.log('This happens later!');\n}, 2000);\n\nconsole.log('This happens first!');",
    hints: [
      "Asynchronous code doesn't block execution of the program",
      "Callbacks are functions passed to other functions to be called later",
      "The event loop manages when async code executes"
    ]
  },
  {
    id: 302,
    lessonNumber: 2,
    title: "Promises",
    description: "Master the Promise pattern for handling asynchronous operations.",
    concept: "Promises",
    objectives: [
      "Create and use Promises",
      "Handle success and failure states",
      "Chain multiple asynchronous operations"
    ],
    difficulty: 4,
    estimatedTime: 40,
    mentor: {
      name: "Luna the Valkyrie",
      icon: "⚔️"
    },
    week: 1,
    codeExample: "// Creating a Promise\nconst treasureHunt = new Promise((resolve, reject) => {\n  const foundTreasure = Math.random() > 0.5;\n  \n  setTimeout(() => {\n    if (foundTreasure) {\n      resolve('You found the ancient artifact!');\n    } else {\n      reject('The treasure chest was empty...');\n    }\n  }, 1500);\n});\n\n// Using the Promise\ntreasureHunt\n  .then(result => console.log(result))\n  .catch(error => console.log(error));",
    hints: [
      "Promises represent an operation that will complete in the future",
      "A Promise can be in one of three states: pending, fulfilled, or rejected",
      "Use .then() for success and .catch() for errors"
    ]
  },
  {
    id: 303,
    lessonNumber: 3,
    title: "Async/Await",
    description: "Write asynchronous code that looks and behaves like synchronous code.",
    concept: "Async/Await",
    objectives: [
      "Use the async and await keywords",
      "Convert Promise chains to async/await",
      "Handle errors with try/catch"
    ],
    difficulty: 4,
    estimatedTime: 35,
    mentor: {
      name: "Luna the Valkyrie",
      icon: "⚔️"
    },
    week: 1,
    codeExample: "// Function that returns a Promise\nasync function searchDungeon() {\n  try {\n    console.log('Entering the dungeon...');\n    \n    // await pauses execution until promise resolves\n    const weapon = await findWeapon();\n    console.log(`Found weapon: ${weapon}`);\n    \n    const treasure = await findTreasure();\n    console.log(`Found treasure: ${treasure}`);\n    \n    return `Mission complete: ${weapon} and ${treasure} acquired!`;\n  } catch (error) {\n    console.log(`Mission failed: ${error}`);\n    throw error;\n  }\n}\n\n// Call the async function\nsearchDungeon().then(result => console.log(result));",
    hints: [
      "async/await is syntactic sugar over Promises",
      "await can only be used inside async functions",
      "try/catch blocks handle errors in async/await code"
    ]
  },
  {
    id: 304,
    lessonNumber: 4,
    title: "Error Handling Strategies",
    description: "Learn to handle errors gracefully in your applications.",
    concept: "Error Management",
    objectives: [
      "Create and throw custom errors",
      "Implement error handling patterns",
      "Use try/catch blocks effectively"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Luna the Valkyrie",
      icon: "⚔️"
    },
    week: 1,
    codeExample: "// Custom error class\nclass QuestError extends Error {\n  constructor(message, questId) {\n    super(message);\n    this.name = 'QuestError';\n    this.questId = questId;\n    this.timestamp = new Date();\n  }\n}\n\n// Using custom errors\nfunction completeQuest(questId) {\n  try {\n    if (!questId) {\n      throw new QuestError('Quest ID is required', null);\n    }\n    \n    if (questId === 404) {\n      throw new QuestError('Quest not found', questId);\n    }\n    \n    // Quest logic here...\n    return 'Quest completed successfully!';\n  } catch (error) {\n    if (error instanceof QuestError) {\n      console.log(`${error.name}: ${error.message} (Quest: ${error.questId})`);\n    } else {\n      console.log('Unknown error:', error);\n    }\n  }\n}",
    hints: [
      "Custom error classes help categorize different error types",
      "Try/catch blocks prevent your program from crashing",
      "Always provide meaningful error messages"
    ]
  }
  // More lessons to be added later
];

export default CS4_LESSONS;

// Export lessons grouped by weeks for easier filtering
export const CS4_LESSONS_BY_WEEK = CS4_LESSONS.reduce((acc, lesson) => {
  if (!acc[lesson.week]) {
    acc[lesson.week] = [];
  }
  acc[lesson.week].push(lesson);
  return acc;
}, {} as Record<number, CS4Lesson[]>); 