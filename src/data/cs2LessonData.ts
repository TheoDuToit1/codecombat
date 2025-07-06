// CS2 Lesson Data Structure - Functions & Logic
// With Rex the Warrior

import { CS1Lesson } from './cs1LessonData';

export interface CS2Lesson extends CS1Lesson {}

// Mentor data for CS2
export const CS2_MENTOR_DATA = {
  rex: {
    name: "Rex the Warrior",
    icon: "🦖",
    quote: "Functions are the building blocks of your code arsenal. Master them, and you can conquer any coding challenge with strength and precision!"
  }
};

export const COURSE_STRUCTURE_CS2 = {
  mainConcepts: [
    "Functions", 
    "Parameters", 
    "Return Values", 
    "Scope", 
    "Advanced Logic", 
    "Modular Design"
  ]
};

export const CS2_LESSONS: CS2Lesson[] = [
  // Week 1: Function Basics
  {
    id: 101,
    lessonNumber: 1,
    title: "Introduction to Functions",
    description: "Learn to create reusable blocks of code to organize your programs.",
    concept: "Function Basics",
    objectives: [
      "Understand what functions are",
      "Create your first function",
      "Call functions in your code"
    ],
    difficulty: 2,
    estimatedTime: 20,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 1,
    codeExample: "function greetWarrior() {\n  console.log('Welcome to the arena!');\n}\n\n// Call your function\ngreetWarrior();",
    hints: [
      "Functions help you avoid repeating code",
      "Think of functions as commands you define yourself",
      "Functions can be called multiple times"
    ]
  },
  {
    id: 102,
    lessonNumber: 2,
    title: "Parameters and Arguments",
    description: "Pass data to your functions to make them more versatile.",
    concept: "Function Parameters",
    objectives: [
      "Add parameters to functions",
      "Pass arguments when calling functions",
      "Use parameters inside function logic"
    ],
    difficulty: 2,
    estimatedTime: 25,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 1,
    codeExample: "function attackEnemy(enemyName, damage) {\n  console.log(`You attack ${enemyName} for ${damage} damage!`);\n}\n\n// Call with arguments\nattackEnemy('Goblin', 25);",
    hints: [
      "Parameters are like variables inside your function",
      "Arguments are the actual values you pass to the function",
      "You can have multiple parameters separated by commas"
    ]
  },
  {
    id: 103,
    lessonNumber: 3,
    title: "Return Values",
    description: "Make your functions give back useful results.",
    concept: "Return Values",
    objectives: [
      "Return values from functions",
      "Capture and use returned values",
      "Chain functions together"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 1,
    codeExample: "function calculateDamage(strength, weaponPower) {\n  return strength * weaponPower;\n}\n\n// Use the returned value\nlet damage = calculateDamage(10, 5);\nconsole.log(`You deal ${damage} damage!`);",
    hints: [
      "The return keyword sends a value back from your function",
      "A function stops executing when it hits a return statement",
      "You can store returned values in variables"
    ]
  },
  {
    id: 104,
    lessonNumber: 4,
    title: "Default Parameters",
    description: "Set fallback values for function parameters.",
    concept: "Default Parameters",
    objectives: [
      "Define default parameters",
      "Understand when defaults are used",
      "Override defaults with arguments"
    ],
    difficulty: 2,
    estimatedTime: 25,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 1,
    codeExample: "function healCharacter(name, amount = 20) {\n  console.log(`${name} heals for ${amount} health!`);\n}\n\n// Using default\nhealCharacter('Warrior');\n\n// Overriding default\nhealCharacter('Warrior', 50);",
    hints: [
      "Default parameters are used when no argument is provided",
      "You can mix parameters with and without defaults",
      "Parameters with defaults typically come last in the parameter list"
    ]
  },
  {
    id: 105,
    lessonNumber: 5,
    title: "Function Scope",
    description: "Learn about variable visibility and lifetime inside functions.",
    concept: "Variable Scope",
    objectives: [
      "Understand local variables in functions",
      "Work with global variables",
      "Recognize scope limitations"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 1,
    codeExample: "// Global variable\nlet playerHealth = 100;\n\nfunction takeDamage(amount) {\n  // Local variable\n  let message = 'Ouch!';\n  playerHealth -= amount;\n  console.log(message);\n  console.log(`Health: ${playerHealth}`);\n}",
    hints: [
      "Local variables only exist inside the function",
      "Global variables can be accessed anywhere",
      "Use local variables when possible to avoid conflicts"
    ]
  },
  // Week 2: More Functions
  {
    id: 106,
    lessonNumber: 6,
    title: "Functions as Values",
    description: "Learn to treat functions as data that can be stored in variables.",
    concept: "Function Expressions",
    objectives: [
      "Assign functions to variables",
      "Pass functions as arguments",
      "Use anonymous functions"
    ],
    difficulty: 3,
    estimatedTime: 35,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 2,
    codeExample: "// Function expression\nconst fireArrow = function(target) {\n  console.log(`Firing arrow at ${target}!`);\n};\n\n// Use the function variable\nfireArrow('Target Dummy');",
    hints: [
      "Functions can be treated like any other value in JavaScript",
      "Anonymous functions don't need a name when assigned to a variable",
      "Function expressions end with a semicolon"
    ]
  },
  {
    id: 107,
    lessonNumber: 7,
    title: "Arrow Functions",
    description: "Use the modern, concise arrow function syntax.",
    concept: "Arrow Functions",
    objectives: [
      "Create arrow functions",
      "Convert traditional functions to arrow syntax",
      "Use implicit returns"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 2,
    codeExample: "// Arrow function with parameters\nconst calculateDamage = (strength, weapon) => {\n  return strength * weapon;\n};\n\n// Arrow function with implicit return\nconst doubleAttack = damage => damage * 2;",
    hints: [
      "Arrow functions are more concise than traditional functions",
      "Parentheses can be omitted with a single parameter",
      "Curly braces can be omitted for simple one-line returns"
    ]
  },
  {
    id: 108,
    lessonNumber: 8,
    title: "Advanced Logic",
    description: "Combine conditions for complex decision making.",
    concept: "Logical Operators",
    objectives: [
      "Use AND, OR, and NOT operators",
      "Chain multiple conditions",
      "Create complex decision trees"
    ],
    difficulty: 3,
    estimatedTime: 35,
    mentor: {
      name: "Rex the Warrior",
      icon: "🦖"
    },
    week: 2,
    codeExample: "function attackStrategy(health, mana, enemies) {\n  if (health < 30 && mana > 20) {\n    return 'Cast healing spell';\n  } else if (enemies > 3 || health < 50) {\n    return 'Use area attack';\n  } else {\n    return 'Single target attack';\n  }\n}",
    hints: [
      "&& is the AND operator - both conditions must be true",
      "|| is the OR operator - either condition can be true",
      "! is the NOT operator - it inverts a boolean value"
    ]
  }
  // More weeks to be added later
];

export default CS2_LESSONS;

// Export lessons grouped by weeks for easier filtering
export const CS2_LESSONS_BY_WEEK = CS2_LESSONS.reduce((acc, lesson) => {
  if (!acc[lesson.week]) {
    acc[lesson.week] = [];
  }
  acc[lesson.week].push(lesson);
  return acc;
}, {} as Record<number, CS2Lesson[]>); 