// CS1 Lesson Data Structure
// Based on the content from docs/guide2.md

export interface CS1Lesson {
  id: number;
  lessonNumber: number;
  title: string;
  description: string;
  objectives: string[];
  concept: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number; // in minutes
  mentor: {
    name: string;
    icon: string;
  };
  week: number;
  codeExample?: string;
  hints?: string[];
  unlocks?: string;
}

export const CS1_LESSONS: CS1Lesson[] = [
  // Week 1: First Steps
  {
    id: 1,
    lessonNumber: 1,
    title: "Meet Your Hero",
    description: "Learn to control your character and make your first moves in the coding world.",
    concept: "Basic Movement",
    objectives: [
      "Understand the game controls",
      "Move your character across the screen",
      "Complete your first objective"
    ],
    difficulty: 1,
    estimatedTime: 10,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "moveRight();\nmoveDown();\n// This is your first code!",
    hints: [
      "Use arrow keys or click where you want to go",
      "Try to explore all areas of the map"
    ]
  },
  {
    id: 2,
    lessonNumber: 2,
    title: "Four Directions",
    description: "Learn how to move in all four directions to navigate the world.",
    concept: "Directional Movement",
    objectives: [
      "Move in all four directions",
      "Navigate around obstacles",
      "Reach the checkpoint"
    ],
    difficulty: 1,
    estimatedTime: 15,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "moveUp();\nmoveRight();\nmoveDown();\nmoveLeft();\n// You've gone in a circle!",
    hints: [
      "Different terrain may slow down or speed up movement",
      "Plan your route before moving"
    ]
  },
  {
    id: 3,
    lessonNumber: 3,
    title: "Collecting Gems",
    description: "Learn to collect gems and complete automatic objectives.",
    concept: "Interaction",
    objectives: [
      "Collect all gems on the map",
      "Learn how to interact with objects",
      "Follow objective markers"
    ],
    difficulty: 1,
    estimatedTime: 15,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "moveRight();\ncollect();\nmoveLeft();\n// You collected a gem!",
    hints: [
      "You must be next to an item to collect it",
      "Some gems may be hidden - explore thoroughly"
    ]
  },
  {
    id: 4,
    lessonNumber: 4,
    title: "Counting Steps",
    description: "Learn about bracket notation basics and how to count steps.",
    concept: "Variables",
    objectives: [
      "Understand step counting",
      "Use variables to store counts",
      "Complete a path with minimum steps"
    ],
    difficulty: 2,
    estimatedTime: 20,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "let steps = 0;\nsteps = steps + 1;\nmoveRight();\n// You've taken one step!",
    hints: [
      "Variables can be updated throughout your code",
      "Try to minimize your steps for bonus points"
    ]
  },
  {
    id: 5,
    lessonNumber: 5,
    title: "Variables Basics",
    description: "Learn to store and retrieve data with variables.",
    concept: "Variables",
    objectives: [
      "Create your first variable",
      "Modify variable values",
      "Use variables to track game state"
    ],
    difficulty: 2,
    estimatedTime: 20,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "let gemCount = 0;\ngemCount = gemCount + 1;\n// Now you're tracking gems!",
    hints: [
      "Variables can hold numbers, text, or other data",
      "Use descriptive names for your variables"
    ]
  },
  {
    id: 6,
    lessonNumber: 6,
    title: "Health and Status",
    description: "Monitor health conditions and status effects in the game.",
    concept: "State Monitoring",
    objectives: [
      "Track health points",
      "Understand status effects",
      "Maintain positive health"
    ],
    difficulty: 2,
    estimatedTime: 20,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "if (health < 50) {\n  useHealthPotion();\n}\n// You've learned to react to status!",
    hints: [
      "Keep an eye on your health bar at all times",
      "Different enemies cause different status effects"
    ]
  },
  {
    id: 7,
    lessonNumber: 7,
    title: "Simple Conditions",
    description: "Learn basic if/then logic to make decisions.",
    concept: "Conditional Logic",
    objectives: [
      "Use your first if statement",
      "Make decisions based on game state",
      "Handle multiple scenarios"
    ],
    difficulty: 2,
    estimatedTime: 25,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "if (enemyNearby) {\n  retreat();\n} else {\n  moveForward();\n}\n// Now you're thinking!",
    hints: [
      "Conditions help your code make smart decisions",
      "You can nest conditions inside each other"
    ]
  },
  {
    id: 8,
    lessonNumber: 8,
    title: "First Challenge",
    description: "Put everything together in your first puzzle test.",
    concept: "Integration",
    objectives: [
      "Navigate a complex map",
      "Collect all required items",
      "Reach the exit within time limit"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Sage the Wizard",
      icon: "🧙‍♂️"
    },
    week: 1,
    codeExample: "// This challenge requires all your skills!\nlet gems = 0;\nif (pathBlocked) {\n  findAlternatePath();\n}\nmoveToExit();",
    hints: [
      "Plan your route before starting",
      "Use what you've learned about variables and conditions"
    ],
    unlocks: "Week 2 Content"
  },
  
  // Additional lessons would continue here in the same format
  // Week 2, Week 3, etc.
];

// Mentor data
export const MENTOR_DATA = {
  sage: {
    name: "Sage the Wizard",
    icon: "🧙‍♂️",
    color: "blue",
    specialty: "Fundamentals",
    quote: "The path of code begins with a single function."
  },
  rex: {
    name: "Rex the Warrior",
    icon: "⚔️",
    color: "red",
    specialty: "Loops & Repetition",
    quote: "Strength comes from doing the same thing perfectly, over and over."
  },
  arrow: {
    name: "Arrow the Elf",
    icon: "🏹",
    color: "green",
    specialty: "Logic & Decisions",
    quote: "Choose your path wisely, for each branch leads to different outcomes."
  },
  luna: {
    name: "Luna the Valkyrie",
    icon: "👑",
    color: "purple",
    specialty: "Organization & Architecture",
    quote: "True mastery is bringing order to chaos through structure."
  }
};

// Course structure overview
export const COURSE_STRUCTURE = {
  cs1: {
    id: "cs1",
    title: "Code Basics",
    description: "Learn the fundamentals with Sage the Wizard",
    mentor: MENTOR_DATA.sage,
    weeks: 5,
    totalLessons: 40,
    mainConcepts: ["Variables", "Basic Movement", "Simple Commands", "Basic Logic"]
  }
}; 