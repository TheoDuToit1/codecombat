// 🎮 X-Code Crew Academy: Complete 160 Lesson Plan
// Structure: 4 Courses × 40 Lessons Each = 160 Total Lessons

export interface Lesson {
  id: number;
  courseId: string;
  lessonNumber: number; // 1-40 within each course
  name: string;
  concept: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easiest, 5=hardest
  mentor: 'Sage' | 'Rex' | 'Arrow' | 'Luna';
  description: string;
  objectives: string[];
  newConcepts: string[];
  practiceSkills: string[];
  codeExample: string;
  hints: string[];
  estimatedTime: number; // minutes
  unlocks?: string; // Special unlocks
}

export interface Course {
  id: string;
  name: string;
  description: string;
  mentor: 'Sage' | 'Rex' | 'Arrow' | 'Luna';
  totalLessons: 40;
  concepts: string[];
  unlockRequirement: string;
  completionReward: string;
}

// 🎯 COURSE STRUCTURE
export const COURSES: Course[] = [
  {
    id: 'cs1',
    name: 'Code Basics',
    description: 'Learn the fundamentals with Sage the Wizard',
    mentor: 'Sage',
    totalLessons: 40,
    concepts: ['Variables', 'Basic Movement', 'Simple Commands', 'Basic Logic'],
    unlockRequirement: 'Start here!',
    completionReward: '🏰 Unlocks Gauntlet + Rex the Warrior'
  },
  {
    id: 'cs2', 
    name: 'Code Warriors',
    description: 'Master loops and repetition with Rex the Warrior',
    mentor: 'Rex',
    totalLessons: 40,
    concepts: ['Loops', 'While Loops', 'For Loops', 'Advanced Movement'],
    unlockRequirement: 'Complete CS1 (40 lessons)',
    completionReward: '🏹 Unlocks Arrow the Elf'
  },
  {
    id: 'cs3',
    name: 'Code Masters', 
    description: 'Learn logic and decisions with Arrow the Elf',
    mentor: 'Arrow',
    totalLessons: 40,
    concepts: ['If Statements', 'Complex Logic', 'Functions', 'Problem Solving'],
    unlockRequirement: 'Complete CS2 (80 lessons total)',
    completionReward: '👑 Unlocks Luna the Valkyrie'
  },
  {
    id: 'cs4',
    name: 'Code Legends',
    description: 'Advanced programming with Luna the Valkyrie', 
    mentor: 'Luna',
    totalLessons: 40,
    concepts: ['Advanced Functions', 'Objects', 'Arrays', 'Game Development'],
    unlockRequirement: 'Complete CS3 (120 lessons total)',
    completionReward: '🎖️ Master Programmer Certificate'
  }
];

// 📚 COMPLETE 160 LESSON PLAN
export const LESSON_PLAN: Lesson[] = [
  
  // 🧙‍♂️ CS1: CODE BASICS (Lessons 1-40) - Sage the Wizard
  // Setting 1: Syntaxia Courtyard (Lessons 1 & 2)
  {
    id: 1, courseId: 'cs1', lessonNumber: 1, name: 'Meet Your Hero', concept: 'Movement',
    difficulty: 1, mentor: 'Sage', estimatedTime: 10,
    description: 'Cross the Syntaxia Courtyard and reach the sparkling fountain.',
    objectives: ['Move your hero up twice to reach the fountain', 'Understand grid movement', 'Complete your first quest'],
    newConcepts: ['hero.move_up()'],
    practiceSkills: ['Basic movement', 'Following instructions'],
    codeExample: 'hero.move_up()\nhero.move_up()',
    hints: ['Each move_up() command moves your hero one space up.', 'The fountain is above your starting point.', 'Use the Run button to see your hero move.']
  },
  {
    id: 2, courseId: 'cs1', lessonNumber: 2, name: 'Directions and Movement', concept: 'Movement',
    difficulty: 1, mentor: 'Sage', estimatedTime: 10,
    description: 'Visit the four corners of the Syntaxia Courtyard.',
    objectives: ['Move in all four directions', 'Explore the courtyard corners', 'Practice path planning'],
    newConcepts: ['hero.move_up()', 'hero.move_left()', 'hero.move_down()', 'hero.move_right()'],
    practiceSkills: ['Directional movement', 'Exploration'],
    codeExample: 'hero.move_left()\nhero.move_down()\nhero.move_right()\nhero.move_up()',
    hints: ['Try each direction command once.', 'Plan your path to visit each corner.', 'You can use the commands in any order.']
  },
  // Setting 2: Side Streets of Syntaxia (Lessons 3 & 4)
  {
    id: 3, courseId: 'cs1', lessonNumber: 3, name: 'Collecting Coins', concept: 'Collecting',
    difficulty: 1, mentor: 'Sage', estimatedTime: 12,
    description: 'Collect all the coins in the side streets of Syntaxia.',
    objectives: ['Move right to collect coins', 'Use if statements to check for coins', 'Collect every coin you find'],
    newConcepts: ['for i in range()', 'hero.move_right()', 'hero.is_on_coin()', 'hero.collect()'],
    practiceSkills: ['Loops', 'Conditional collection'],
    codeExample: 'for i in range(3):\n    hero.move_right()\n    if hero.is_on_coin():\n        hero.collect()',
    hints: ['Use a loop to move right three times.', 'Check for a coin at each step.', 'Collect the coin if you are on it.']
  },
  {
    id: 4, courseId: 'cs1', lessonNumber: 4, name: 'Counting Steps', concept: 'Loops',
    difficulty: 2, mentor: 'Sage', estimatedTime: 12,
    description: 'Follow the path to the alley\'s end in the side streets.',
    objectives: ['Use a loop to move right five times', 'Move up to reach the alley\'s end'],
    newConcepts: ['for i in range()', 'hero.move_right()', 'hero.move_up()'],
    practiceSkills: ['Loops', 'Path following'],
    codeExample: 'for i in range(5):\n    hero.move_right()\nhero.move_up()',
    hints: ['Use a for loop for repeated movement.', 'After moving right, move up once to finish.', 'Loops make your code shorter and easier to read.']
  },
  {
    id: 5, courseId: 'cs1', lessonNumber: 5, name: 'Variables Basics', concept: 'Variables',
    difficulty: 2, mentor: 'Sage', estimatedTime: 25,
    description: 'Store information in variables!',
    objectives: ['Create your first variable', 'Use variables in commands', 'Understand data storage'],
    newConcepts: ['var steps = 3;', 'Variable assignment', 'Using variables'],
    practiceSkills: ['Data storage', 'Variable usage', 'Code organization'],
    codeExample: 'var steps = 3;\nhero.moveRight(steps);\nvar direction = "right";',
    hints: ['Variables store information', 'Use descriptive names', 'Variables can change']
  },
  {
    id: 6, courseId: 'cs1', lessonNumber: 6, name: 'Collect the Diamond', concept: 'Movement',
    difficulty: 1, mentor: 'Sage', estimatedTime: 10,
    description: 'Move your hero right to collect a diamond!',
    objectives: ['Use hero.moveRight() command', 'Learn how to move multiple steps', 'Collect your first treasure'],
    newConcepts: ['hero.moveRight()', 'Multi-step movement'],
    practiceSkills: ['Direction control', 'Planning steps', 'Distance estimation'],
    codeExample: '',
    hints: ['Use hero.moveRight() with a number to move multiple steps', 'Count how many steps to reach the diamond', 'The diamond is 8 steps to the right']
  },
  {
    id: 7, courseId: 'cs1', lessonNumber: 7, name: 'Treasure Adventure: Diamond and Key', concept: 'Multi-Direction',
    difficulty: 1, mentor: 'Sage', estimatedTime: 15,
    description: 'Move your hero in two directions to collect both a diamond and a key!',
    objectives: ['Use hero.moveUp() and hero.moveDown()', 'Collect two different treasures', 'Plan a multi-step path'],
    newConcepts: ['hero.moveUp()', 'hero.moveDown()', 'Multi-direction movement'],
    practiceSkills: ['Vertical movement', 'Path planning', 'Sequential actions'],
    codeExample: 'hero.moveUp(3);\nhero.moveDown(5);',
    hints: ['First go up to get the diamond', 'Then go down past your starting point to find the key', 'Use two movement commands with the right numbers']
  },
  {
    id: 8, courseId: 'cs1', lessonNumber: 8, name: 'Treasure Adventure: The Great Hunt', concept: 'Complex Movement',
    difficulty: 2, mentor: 'Sage', estimatedTime: 20,
    description: 'Become a master treasure hunter by collecting three treasures in different locations!',
    objectives: ['Use all four direction commands', 'Collect three different treasures', 'Create a complex movement plan'],
    newConcepts: ['hero.moveLeft()', 'Complete movement control', 'Complex path planning'],
    practiceSkills: ['Four-direction movement', 'Complex path execution', 'Sequential planning'],
    codeExample: 'hero.moveUp(3);\nhero.moveDown(3);\nhero.moveRight(3);\nhero.moveLeft(6);\nhero.moveDown(3);',
    hints: ['Plan your complete path before writing code', 'You need to use all four directions', 'Remember to return to your starting point between treasures']
  },

  // Week 2: Building Skills (Lessons 9-16)
  {
    id: 9, courseId: 'cs1', lessonNumber: 9, name: 'Dangerous Obstacles', concept: 'Hazards',
    difficulty: 2, mentor: 'Sage', estimatedTime: 20,
    description: 'Learn to avoid spikes and traps!',
    objectives: ['Identify dangerous obstacles', 'Plan safe paths', 'Avoid taking damage'],
    newConcepts: ['Obstacle types', 'Damage mechanics', 'Safe navigation'],
    practiceSkills: ['Risk assessment', 'Path planning', 'Safety awareness'],
    codeExample: '// Avoid the spikes!\nhero.moveRight();\nhero.moveUp(); // Safe path\nhero.moveRight();',
    hints: ['Red obstacles are dangerous', 'Plan around hazards', 'Sometimes the long way is safer']
  },
  {
    id: 10, courseId: 'cs1', lessonNumber: 10, name: 'Meet Rex the Warrior', concept: 'Character Introduction',
    difficulty: 1, mentor: 'Rex', estimatedTime: 15,
    description: 'Rex teaches you about strength and repetition!',
    objectives: ['Meet your second mentor', 'Learn about different hero types', 'Understand specializations'],
    newConcepts: ['Hero mentors', 'Specializations', 'Learning paths'],
    practiceSkills: ['Character understanding', 'Mentor relationships'],
    codeExample: '// Rex says: "Strength comes from repetition!"\nhero.moveRight(5);',
    hints: ['Each mentor teaches different skills', 'Rex loves loops and repetition', 'Warriors are strong and persistent'],
    unlocks: 'Rex the Warrior unlocked'
  },
  {
    id: 11, courseId: 'cs1', lessonNumber: 11, name: 'Basic Combat', concept: 'Fighting',
    difficulty: 2, mentor: 'Sage', estimatedTime: 25,
    description: 'Learn to fight your first enemy!',
    objectives: ['Use hero.attack()', 'Defeat an enemy', 'Understand combat basics'],
    newConcepts: ['hero.attack()', 'Enemy health', 'Combat mechanics'],
    practiceSkills: ['Combat basics', 'Timing', 'Strategy'],
    codeExample: 'hero.moveRight(2);\nhero.attack();\nhero.attack();',
    hints: ['Get close to enemies to attack', 'Enemies have health bars', 'Keep attacking until they\'re defeated']
  },
  {
    id: 12, courseId: 'cs1', lessonNumber: 12, name: 'While Loop Basics', concept: 'While Loops',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Your first loop! Repeat until done.',
    objectives: ['Use while loops', 'Understand loop conditions', 'Repeat actions automatically'],
    newConcepts: ['while (condition)', 'Loop conditions', 'Automatic repetition'],
    practiceSkills: ['Loop logic', 'Condition checking', 'Repetition'],
    codeExample: 'while (hero.isEnemyNear()) {\n  hero.attack();\n}',
    hints: ['While loops repeat while condition is true', 'Check the condition each time', 'Be careful not to loop forever']
  },
  {
    id: 13, courseId: 'cs1', lessonNumber: 13, name: 'Collecting Everything', concept: 'Loops + Collection',
    difficulty: 3, mentor: 'Sage', estimatedTime: 25,
    description: 'Use loops to collect all items efficiently!',
    objectives: ['Combine loops with movement', 'Collect multiple items', 'Write efficient collection code'],
    newConcepts: ['Loop + movement patterns', 'Efficient collection'],
    practiceSkills: ['Pattern recognition', 'Efficiency', 'Loop application'],
    codeExample: 'while (hero.gems < 5) {\n  hero.moveRight();\n  // Collect gems automatically\n}',
    hints: ['Loops can help collect everything', 'Check your progress in the loop', 'Move and collect in patterns']
  },
  {
    id: 14, courseId: 'cs1', lessonNumber: 14, name: 'Keys and Doors', concept: 'Requirements',
    difficulty: 2, mentor: 'Sage', estimatedTime: 20,
    description: 'Learn about keys and locked exits!',
    objectives: ['Collect keys', 'Understand requirements', 'Plan multi-step objectives'],
    newConcepts: ['hero.hasKey', 'Requirements', 'Multi-step objectives'],
    practiceSkills: ['Requirement planning', 'Sequential objectives'],
    codeExample: 'hero.moveRight(3); // Get key\nif (hero.hasKey) {\n  hero.moveDown(2); // Go to exit\n}',
    hints: ['Some exits need keys', 'Check hero.hasKey', 'Get requirements first, then complete objective']
  },
  {
    id: 15, courseId: 'cs1', lessonNumber: 15, name: 'Meet Arrow the Elf', concept: 'Character Introduction',
    difficulty: 1, mentor: 'Arrow', estimatedTime: 15,
    description: 'Arrow teaches precision and smart decisions!',
    objectives: ['Meet your logic mentor', 'Learn about precision', 'Understand smart planning'],
    newConcepts: ['Logic specialization', 'Precision thinking', 'Smart decisions'],
    practiceSkills: ['Logical thinking', 'Precision', 'Planning'],
    codeExample: '// Arrow says: "Think before you act!"\nif (hero.health > 80) {\n  hero.moveRight();\n}',
    hints: ['Arrow loves logical thinking', 'Elves are precise and smart', 'Plan your moves carefully'],
    unlocks: 'Arrow the Elf preview'
  },
  {
    id: 16, courseId: 'cs1', lessonNumber: 16, name: 'Smart Movement', concept: 'Conditional Movement',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Move based on conditions and status!',
    objectives: ['Combine if statements with movement', 'Make smart decisions', 'Adapt to situations'],
    newConcepts: ['Conditional movement', 'Adaptive behavior', 'Smart decisions'],
    practiceSkills: ['Adaptive thinking', 'Conditional logic', 'Smart planning'],
    codeExample: 'if (hero.health < 50) {\n  hero.moveUp(); // Go to health potion\n} else {\n  hero.moveRight(); // Continue forward\n}',
    hints: ['Check conditions before moving', 'Adapt to your situation', 'Different conditions need different actions']
  },

  // Week 3: Intermediate Concepts (Lessons 17-24)
  {
    id: 17, courseId: 'cs1', lessonNumber: 17, name: 'Multiple Enemies', concept: 'Complex Combat',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Fight multiple enemies strategically!',
    objectives: ['Defeat multiple enemies', 'Use loops in combat', 'Plan combat strategy'],
    newConcepts: ['Multiple targets', 'Combat strategy', 'Loop-based fighting'],
    practiceSkills: ['Strategic thinking', 'Combat planning', 'Multi-target management'],
    codeExample: 'while (hero.isEnemyNear()) {\n  hero.attack();\n}\nhero.moveRight();\nwhile (hero.isEnemyNear()) {\n  hero.attack();\n}',
    hints: ['Fight one enemy at a time', 'Use loops for each enemy', 'Move between enemy positions']
  },
  {
    id: 18, courseId: 'cs1', lessonNumber: 18, name: 'Health Management', concept: 'Resource Management',
    difficulty: 3, mentor: 'Sage', estimatedTime: 25,
    description: 'Manage your health wisely!',
    objectives: ['Monitor health status', 'Collect health potions', 'Make health-based decisions'],
    newConcepts: ['Resource management', 'Health monitoring', 'Recovery items'],
    practiceSkills: ['Resource awareness', 'Health management', 'Risk assessment'],
    codeExample: 'if (hero.health < 30) {\n  hero.moveUp(); // Get health potion\n  hero.moveDown();\n}',
    hints: ['Watch your health bar', 'Collect hearts when needed', 'Don\'t fight when health is low']
  },
  {
    id: 19, courseId: 'cs1', lessonNumber: 19, name: 'Nested Conditions', concept: 'Complex Logic',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Use if statements inside other if statements!',
    objectives: ['Use nested if statements', 'Handle complex conditions', 'Make multi-level decisions'],
    newConcepts: ['Nested conditions', 'Complex decision trees', 'Multi-level logic'],
    practiceSkills: ['Complex logic', 'Decision trees', 'Nested thinking'],
    codeExample: 'if (hero.health > 50) {\n  if (hero.gems < 3) {\n    hero.moveRight(); // Get gems\n  } else {\n    hero.moveDown(); // Go to exit\n  }\n}',
    hints: ['You can put if statements inside other if statements', 'Think about multiple conditions', 'Plan your decision tree']
  },
  {
    id: 20, courseId: 'cs1', lessonNumber: 20, name: 'Functions Introduction', concept: 'Functions',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Create your first function!',
    objectives: ['Define a simple function', 'Call functions', 'Understand code organization'],
    newConcepts: ['function definition', 'Function calls', 'Code organization'],
    practiceSkills: ['Function creation', 'Code organization', 'Reusability'],
    codeExample: 'function moveToGem() {\n  hero.moveRight();\n  hero.moveDown();\n}\nmoveToGem();',
    hints: ['Functions group code together', 'Define once, use many times', 'Give functions descriptive names']
  },
  {
    id: 21, courseId: 'cs1', lessonNumber: 21, name: 'Function Parameters', concept: 'Parameters',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Make functions more flexible with parameters!',
    objectives: ['Use function parameters', 'Pass values to functions', 'Create flexible functions'],
    newConcepts: ['Function parameters', 'Parameter passing', 'Function flexibility'],
    practiceSkills: ['Parameter usage', 'Function design', 'Flexibility'],
    codeExample: 'function moveSteps(direction, steps) {\n  for (var i = 0; i < steps; i++) {\n    hero.move(direction);\n  }\n}',
    hints: ['Parameters make functions flexible', 'Pass different values each time', 'Think about what might change']
  },
  {
    id: 22, courseId: 'cs1', lessonNumber: 22, name: 'For Loop Basics', concept: 'For Loops',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Learn the powerful for loop!',
    objectives: ['Use for loops', 'Understand loop counters', 'Repeat exact numbers of times'],
    newConcepts: ['for (var i = 0; i < 5; i++)', 'Loop counters', 'Exact repetition'],
    practiceSkills: ['Counting loops', 'Exact repetition', 'Loop control'],
    codeExample: 'for (var i = 0; i < 3; i++) {\n  hero.moveRight();\n  hero.attack();\n}',
    hints: ['For loops repeat an exact number of times', 'i counts from 0 upward', 'Use when you know how many times to repeat']
  },
  {
    id: 23, courseId: 'cs1', lessonNumber: 23, name: 'Arrays Introduction', concept: 'Arrays',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Store multiple values in arrays!',
    objectives: ['Create arrays', 'Access array elements', 'Use arrays with loops'],
    newConcepts: ['var items = ["gem", "key", "heart"]', 'Array indexing', 'Array iteration'],
    practiceSkills: ['Data structures', 'Array usage', 'List management'],
    codeExample: 'var directions = ["right", "down", "left"];\nfor (var i = 0; i < directions.length; i++) {\n  hero.move(directions[i]);\n}',
    hints: ['Arrays store multiple values', 'Use [0], [1], [2] to access items', 'Combine arrays with loops']
  },
  {
    id: 24, courseId: 'cs1', lessonNumber: 24, name: 'Mid-Course Challenge', concept: 'Integration',
    difficulty: 4, mentor: 'Sage', estimatedTime: 40,
    description: 'Combine all your skills in a big challenge!',
    objectives: ['Use multiple concepts together', 'Solve complex problems', 'Demonstrate mastery'],
    newConcepts: ['Problem integration', 'Complex solutions'],
    practiceSkills: ['Integration', 'Problem solving', 'Skill combination'],
    codeExample: '// Use functions, loops, conditions, and arrays together!',
    hints: ['Break the problem into smaller parts', 'Use all your tools', 'Plan before coding']
  },

  // Week 4: Advanced Basics (Lessons 25-32)
  {
    id: 25, courseId: 'cs1', lessonNumber: 25, name: 'Meet Luna the Valkyrie', concept: 'Character Introduction',
    difficulty: 1, mentor: 'Luna', estimatedTime: 15,
    description: 'Luna teaches advanced organization and teamwork!',
    objectives: ['Meet your advanced mentor', 'Learn about organization', 'Understand advanced concepts'],
    newConcepts: ['Advanced mentorship', 'Code organization', 'Team concepts'],
    practiceSkills: ['Advanced thinking', 'Organization', 'Leadership'],
    codeExample: '// Luna says: "Organization is the key to mastery!"\nfunction organizedAttack() {\n  // Organized code is powerful code\n}',
    hints: ['Luna teaches advanced concepts', 'Valkyries are organized leaders', 'Good organization makes code powerful'],
    unlocks: 'Luna the Valkyrie preview'
  },
  {
    id: 26, courseId: 'cs1', lessonNumber: 26, name: 'Object Basics', concept: 'Objects',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Group related data in objects!',
    objectives: ['Create simple objects', 'Access object properties', 'Understand data grouping'],
    newConcepts: ['var hero = {health: 100, gems: 5}', 'Object properties', 'Data grouping'],
    practiceSkills: ['Object creation', 'Property access', 'Data organization'],
    codeExample: 'var player = {\n  health: 100,\n  gems: 0,\n  hasKey: false\n};\nif (player.health > 50) {\n  hero.moveRight();\n}',
    hints: ['Objects group related information', 'Use dot notation to access properties', 'Objects organize data logically']
  },
  {
    id: 27, courseId: 'cs1', lessonNumber: 27, name: 'String Manipulation', concept: 'Strings',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Work with text and messages!',
    objectives: ['Use string variables', 'Combine strings', 'Display messages'],
    newConcepts: ['String concatenation', 'String variables', 'Text manipulation'],
    practiceSkills: ['String handling', 'Text processing', 'Message creation'],
    codeExample: 'var message = "Hero has " + hero.gems + " gems!";\nhero.say(message);',
    hints: ['Strings hold text', 'Use + to combine strings', 'Strings can include variables']
  },
  {
    id: 28, courseId: 'cs1', lessonNumber: 28, name: 'Error Handling', concept: 'Debugging',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Learn to find and fix code errors!',
    objectives: ['Identify common errors', 'Debug code problems', 'Write error-free code'],
    newConcepts: ['Syntax errors', 'Logic errors', 'Debugging techniques'],
    practiceSkills: ['Error identification', 'Debugging', 'Problem solving'],
    codeExample: '// Common error: missing semicolon\nhero.moveRight(); // Correct\n// hero.moveRight()  // Error!',
    hints: ['Read error messages carefully', 'Check for missing semicolons', 'Test your code step by step']
  },
  {
    id: 29, courseId: 'cs1', lessonNumber: 29, name: 'Advanced Combat', concept: 'Combat Strategy',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Master advanced fighting techniques!',
    objectives: ['Use strategic combat', 'Manage multiple threats', 'Optimize fighting efficiency'],
    newConcepts: ['Combat optimization', 'Threat assessment', 'Fighting efficiency'],
    practiceSkills: ['Strategic thinking', 'Combat optimization', 'Threat management'],
    codeExample: 'function smartFight() {\n  while (hero.isEnemyNear() && hero.health > 20) {\n    hero.attack();\n  }\n}',
    hints: ['Consider your health before fighting', 'Fight efficiently', 'Retreat when necessary']
  },
  {
    id: 30, courseId: 'cs1', lessonNumber: 30, name: 'Code Optimization', concept: 'Efficiency',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Write faster, cleaner code!',
    objectives: ['Optimize code performance', 'Reduce code repetition', 'Write efficient solutions'],
    newConcepts: ['Code efficiency', 'Performance optimization', 'Clean code'],
    practiceSkills: ['Optimization', 'Efficiency', 'Clean coding'],
    codeExample: '// Instead of:\n// hero.moveRight(); hero.moveRight(); hero.moveRight();\n// Use:\nhero.moveRight(3);',
    hints: ['Look for repeated code', 'Use loops instead of repetition', 'Shorter code is often better']
  },
  {
    id: 31, courseId: 'cs1', lessonNumber: 31, name: 'Team Coordination', concept: 'Coordination',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Coordinate multiple actions effectively!',
    objectives: ['Coordinate complex actions', 'Plan multi-step strategies', 'Execute coordinated plans'],
    newConcepts: ['Action coordination', 'Multi-step planning', 'Strategic execution'],
    practiceSkills: ['Coordination', 'Strategic planning', 'Execution'],
    codeExample: 'function coordinatedPlan() {\n  collectGems();\n  fightEnemies();\n  findKey();\n  exitLevel();\n}',
    hints: ['Plan your actions in order', 'Break complex tasks into steps', 'Execute plans systematically']
  },
  {
    id: 32, courseId: 'cs1', lessonNumber: 32, name: 'Final Preparation', concept: 'Review',
    difficulty: 4, mentor: 'Sage', estimatedTime: 40,
    description: 'Prepare for your final challenges!',
    objectives: ['Review all concepts', 'Practice integration', 'Prepare for advanced courses'],
    newConcepts: ['Concept integration', 'Advanced preparation'],
    practiceSkills: ['Review', 'Integration', 'Preparation'],
    codeExample: '// Combine everything you\'ve learned!\nfunction masterSolution() {\n  // Your complete solution here\n}',
    hints: ['Review all your skills', 'Practice combining concepts', 'Prepare for new challenges']
  },

  // Week 5: Mastery & Gauntlet Prep (Lessons 33-40)
  {
    id: 33, courseId: 'cs1', lessonNumber: 33, name: 'Algorithm Thinking', concept: 'Algorithms',
    difficulty: 5, mentor: 'Sage', estimatedTime: 40,
    description: 'Think like a computer scientist!',
    objectives: ['Understand algorithms', 'Design step-by-step solutions', 'Think systematically'],
    newConcepts: ['Algorithm design', 'Systematic thinking', 'Problem decomposition'],
    practiceSkills: ['Algorithmic thinking', 'Problem decomposition', 'Systematic approach'],
    codeExample: '// Algorithm: Find the shortest path\nfunction findShortestPath() {\n  // Step 1: Analyze the grid\n  // Step 2: Plan the route\n  // Step 3: Execute the plan\n}',
    hints: ['Break problems into clear steps', 'Think about the most efficient approach', 'Plan before coding']
  },
  {
    id: 34, courseId: 'cs1', lessonNumber: 34, name: 'Pattern Recognition', concept: 'Patterns',
    difficulty: 5, mentor: 'Sage', estimatedTime: 40,
    description: 'Recognize and use patterns in code!',
    objectives: ['Identify code patterns', 'Use patterns to solve problems', 'Create reusable solutions'],
    newConcepts: ['Pattern recognition', 'Pattern application', 'Reusable solutions'],
    practiceSkills: ['Pattern recognition', 'Pattern application', 'Solution reuse'],
    codeExample: '// Pattern: Move and collect\nfunction moveAndCollect(direction, steps) {\n  for (var i = 0; i < steps; i++) {\n    hero.move(direction);\n    // Collect items automatically\n  }\n}',
    hints: ['Look for repeating patterns', 'Turn patterns into functions', 'Reuse successful patterns']
  },
  {
    id: 35, courseId: 'cs1', lessonNumber: 35, name: 'Complex Problem Solving', concept: 'Problem Solving',
    difficulty: 5, mentor: 'Sage', estimatedTime: 45,
    description: 'Solve the most challenging puzzles!',
    objectives: ['Solve complex problems', 'Use all available tools', 'Demonstrate mastery'],
    newConcepts: ['Complex problem solving', 'Tool integration', 'Mastery demonstration'],
    practiceSkills: ['Complex problem solving', 'Tool integration', 'Mastery'],
    codeExample: '// Complex solution using all concepts\nfunction masterSolution() {\n  // Variables, loops, conditions, functions, arrays, objects\n}',
    hints: ['Use all your tools together', 'Break complex problems into parts', 'Test each part separately']
  },
  {
    id: 36, courseId: 'cs1', lessonNumber: 36, name: 'Code Review', concept: 'Code Quality',
    difficulty: 4, mentor: 'Sage', estimatedTime: 35,
    description: 'Learn to review and improve code!',
    objectives: ['Review code quality', 'Identify improvements', 'Write better code'],
    newConcepts: ['Code review', 'Quality assessment', 'Code improvement'],
    practiceSkills: ['Code review', 'Quality assessment', 'Improvement'],
    codeExample: '// Good code is:\n// - Easy to read\n// - Well organized\n// - Efficient\n// - Error-free',
    hints: ['Good code is easy to read', 'Use clear variable names', 'Organize code logically']
  },
  {
    id: 37, courseId: 'cs1', lessonNumber: 37, name: 'Performance Optimization', concept: 'Performance',
    difficulty: 5, mentor: 'Sage', estimatedTime: 40,
    description: 'Make your code run faster and better!',
    objectives: ['Optimize code performance', 'Reduce unnecessary operations', 'Write efficient algorithms'],
    newConcepts: ['Performance optimization', 'Efficiency analysis', 'Algorithm efficiency'],
    practiceSkills: ['Performance optimization', 'Efficiency analysis', 'Algorithm design'],
    codeExample: '// Efficient: O(1) - constant time\nvar result = array[0];\n\n// Less efficient: O(n) - linear time\nfor (var i = 0; i < array.length; i++) {\n  // Process each item\n}',
    hints: ['Avoid unnecessary loops', 'Use efficient algorithms', 'Think about performance']
  },
  {
    id: 38, courseId: 'cs1', lessonNumber: 38, name: 'Gauntlet Preview', concept: 'Gauntlet Introduction',
    difficulty: 3, mentor: 'Sage', estimatedTime: 30,
    description: 'Get ready for the Great Gauntlet!',
    objectives: ['Learn about the Gauntlet', 'Understand Gauntlet rules', 'Prepare for adventure'],
    newConcepts: ['Gauntlet system', 'Adventure mode', 'Challenge levels'],
    practiceSkills: ['Gauntlet preparation', 'Adventure readiness'],
    codeExample: '// The Gauntlet awaits!\n// 100 levels of epic adventure\n// Use all your skills to succeed!',
    hints: ['The Gauntlet has 100 levels', 'You\'ll need all your skills', 'Adventure awaits!'],
    unlocks: 'Gauntlet preview access'
  },
  {
    id: 39, courseId: 'cs1', lessonNumber: 39, name: 'Final Challenge', concept: 'Final Assessment',
    difficulty: 5, mentor: 'Sage', estimatedTime: 45,
    description: 'Your ultimate CS1 challenge!',
    objectives: ['Complete the final challenge', 'Demonstrate all skills', 'Prove your mastery'],
    newConcepts: ['Final assessment', 'Skill demonstration', 'Mastery proof'],
    practiceSkills: ['Final assessment', 'Skill demonstration', 'Mastery'],
    codeExample: '// Your final challenge - use everything!\nfunction finalSolution() {\n  // Show your mastery here\n}',
    hints: ['Use everything you\'ve learned', 'Take your time', 'You\'ve got this!']
  },
  {
    id: 40, courseId: 'cs1', lessonNumber: 40, name: 'CS1 Graduation', concept: 'Graduation',
    difficulty: 1, mentor: 'Sage', estimatedTime: 20,
    description: 'Congratulations! You\'ve completed CS1!',
    objectives: ['Celebrate your achievement', 'Unlock new content', 'Prepare for CS2'],
    newConcepts: ['Course completion', 'Achievement unlocks', 'Progression'],
    practiceSkills: ['Achievement', 'Progression', 'Celebration'],
    codeExample: '// Congratulations, Code Warrior!\n// You\'ve mastered the basics!\n// Ready for CS2 with Rex the Warrior?',
    hints: ['You\'ve learned so much!', 'The Gauntlet is now unlocked!', 'Rex the Warrior awaits!'],
    unlocks: '🏰 Gauntlet Unlocked! 🎉 Rex the Warrior Unlocked!'
  },

  // 💪 CS2: CODE WARRIORS (Lessons 41-80) - Rex the Warrior
  // [Continue with CS2 lessons 41-80...]
  {
    id: 41, courseId: 'cs2', lessonNumber: 1, name: 'Welcome, Code Warrior!', concept: 'Course Introduction',
    difficulty: 1, mentor: 'Rex', estimatedTime: 15,
    description: 'Rex the Warrior teaches you the power of loops!',
    objectives: ['Meet Rex the Warrior', 'Learn about warrior strength', 'Understand loop power'],
    newConcepts: ['Warrior mentality', 'Loop mastery', 'Strength through repetition'],
    practiceSkills: ['Warrior mindset', 'Loop thinking', 'Strength building'],
    codeExample: '// Rex says: "Strength comes from repetition!"\nfor (var i = 0; i < 10; i++) {\n  hero.attack(); // Build strength!\n}',
    hints: ['Warriors love repetition', 'Loops make you stronger', 'Practice builds mastery']
  },
  {
    id: 42, courseId: 'cs2', lessonNumber: 2, name: 'Power Loops', concept: 'Advanced For Loops',
    difficulty: 2, mentor: 'Rex', estimatedTime: 25,
    description: 'Master the warrior\'s favorite tool - the for loop!',
    objectives: ['Master for loop syntax', 'Use loops for combat', 'Build loop strength'],
    newConcepts: ['Advanced for loops', 'Loop variables', 'Loop control'],
    practiceSkills: ['Loop mastery', 'Combat loops', 'Repetition control'],
    codeExample: 'for (var attacks = 0; attacks < 5; attacks++) {\n  hero.attack();\n  hero.say("Attack " + (attacks + 1));\n}',
    hints: ['For loops are perfect for exact repetition', 'Count your attacks', 'Warriors love precision']
  },
  // [Continue with remaining CS2 lessons...]

  // 🏹 CS3: CODE MASTERS (Lessons 81-120) - Arrow the Elf
  // [Continue with CS3 lessons 81-120...]

  // 👑 CS4: CODE LEGENDS (Lessons 121-160) - Luna the Valkyrie
  // [Continue with CS4 lessons 121-160...]
];

// 🎯 LESSON PROGRESSION SYSTEM
export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number; // minutes
  completedAt?: Date;
  bestScore?: number;
}

export interface CourseProgress {
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
  timeSpent: number;
  completed: boolean;
  completedAt?: Date;
}

// 🏆 ACHIEVEMENT SYSTEM
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlockCondition: (progress: LessonProgress[]) => boolean;
  reward: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson!',
    icon: '👶',
    requirement: 'Complete lesson 1',
    unlockCondition: (progress) => progress.some(p => p.lessonId === 1 && p.completed),
    reward: 'Confidence boost!'
  },
  {
    id: 'loop_master',
    name: 'Loop Master',
    description: 'Master the power of loops!',
    icon: '🔄',
    requirement: 'Complete 10 loop-based lessons',
    unlockCondition: (progress) => progress.filter(p => p.completed && p.lessonId >= 12 && p.lessonId <= 50).length >= 10,
    reward: 'Rex the Warrior respect!'
  },
  {
    id: 'gauntlet_ready',
    name: 'Gauntlet Ready',
    description: 'Complete CS1 and unlock the Gauntlet!',
    icon: '🏰',
    requirement: 'Complete all 40 CS1 lessons',
    unlockCondition: (progress) => progress.filter(p => p.completed && p.lessonId <= 40).length === 40,
    reward: 'Gauntlet access + Rex unlocked!'
  },
  {
    id: 'code_warrior',
    name: 'Code Warrior',
    description: 'Complete CS2 with Rex!',
    icon: '⚔️',
    requirement: 'Complete all CS2 lessons',
    unlockCondition: (progress) => progress.filter(p => p.completed && p.lessonId >= 41 && p.lessonId <= 80).length === 40,
    reward: 'Arrow the Elf unlocked!'
  },
  {
    id: 'logic_master',
    name: 'Logic Master', 
    description: 'Complete CS3 with Arrow!',
    icon: '🎯',
    requirement: 'Complete all CS3 lessons',
    unlockCondition: (progress) => progress.filter(p => p.completed && p.lessonId >= 81 && p.lessonId <= 120).length === 40,
    reward: 'Luna the Valkyrie unlocked!'
  },
  {
    id: 'code_legend',
    name: 'Code Legend',
    description: 'Complete all 160 lessons!',
    icon: '👑',
    requirement: 'Complete all courses',
    unlockCondition: (progress) => progress.filter(p => p.completed).length === 160,
    reward: 'Master Programmer Certificate!'
  }
];

export const LESSON_PLAN_SUMMARY = {
  totalLessons: 160,
  courses: 4,
  mentors: 4,
  concepts: 20,
  estimatedHours: 80, // 30 minutes average per lesson
  structure: '4 courses × 40 lessons = 160 total lessons'
};