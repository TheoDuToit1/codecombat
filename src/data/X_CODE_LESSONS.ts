// X-Code Academy: Combined Lesson and Story Data (1-160)

export interface XCodeLesson {
  id: number;
  lessonNumber: number;
  title: string;
  description: string;
  codeExample: string;
  solution: string;
  goals: string[];
  concept: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  hints: string[];
  unlocks: string;
  week: number;
  mentor: { name: string; icon: string };
  questUpdate: string;
  characters: string[];
  npcs: string[];
  setting: string;
  assets: string[];
  enemies?: {
    count: number;
    positions: { x: number; y: number }[];
    types: string[];
  };
}

// Mentor data for all courses
export const MENTOR_DATA = {
  sage: {
    name: "Sage the Wizard",
    icon: "🧙",
    quote: "The journey of a thousand lines of code begins with a single function. Take your time to understand each concept, and you'll build wonders!"
  },
  rex: {
    name: "Rex the Warrior",
    icon: "⚔️",
    quote: "Programming is like combat training - practice makes perfect. Face each challenge head-on!"
  },
  arrow: {
    name: "Arrow the Ranger",
    icon: "🏹",
    quote: "Sometimes the solution is right in front of you, you just need to look at it from a different angle."
  },
  luna: {
    name: "Luna the Alchemist",
    icon: "🧪",
    quote: "Mix concepts together, experiment freely, and discover the magic of programming!"
  }
};

// Course structure data
export const COURSE_STRUCTURE = {
  cs1: {
    title: "Code Basics",
    mainConcepts: ["Variables", "Conditions", "Loops", "Basic Logic", "Problem Solving"]
  },
  cs2: {
    title: "Code Adventures",
    mainConcepts: ["Functions", "Arrays", "Objects", "Advanced Logic", "Game Mechanics"]
  },
  cs3: {
    title: "Code Mastery",
    mainConcepts: ["Classes", "Inheritance", "Algorithms", "Data Structures", "Project Planning"]
  },
  cs4: {
    title: "Code Wizardry",
    mainConcepts: ["Advanced Algorithms", "Optimization", "Design Patterns", "Full Projects", "Creative Coding"]
  }
};

export const X_CODE_LESSONS = [
  // Lesson 1
  {
    id: 1,
    lessonNumber: 1,
    title: "Meet Your Hero",
    description: "Cross the Syntaxia Courtyard and reach the sparkling fountain.",
    codeExample: "hero.moveUp()\nhero.moveUp()",
    solution: "hero.moveUp()\nhero.moveUp()",
    goals: ["Move your hero to reach the fountain", "Understand grid movement", "Complete your first quest"],
    concept: "Movement",
    difficulty: 1,
    estimatedTime: 10,
    hints: [
      "Each moveUp() command moves your hero one space up.",
      "The fountain is above your starting point.",
      "Use the Run button to see your hero move."
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Cross the Syntaxia Courtyard and reach the sparkling fountain. Learn to move your hero with Sage's guidance.",
    characters: ["Hero", "Sage the Wizard"],
    npcs: ["Villager child waving"],
    setting: "A bright, welcoming medieval castle courtyard in top-down 2D pixel art. Features: a grand stone entrance labeled 'SYNTAXIA', a central fountain with water, yellow-tiled paths forming a cross, trimmed green grass, bushes, banners, and castle walls with towers. The scene is peaceful and open, perfect for a hero's first steps and exploring corners.",
    assets: ["Lamp posts", "scroll crates", "sparkly effect when walking"]
  },
  // Lesson 2
  {
    id: 2,
    lessonNumber: 2,
    title: "Directions and Movement",
    description: "Visit the four corners of the Syntaxia Courtyard.",
    codeExample: "hero.moveLeft()\nhero.moveDown()\nhero.moveRight()\nhero.moveUp()",
    solution: "hero.moveLeft()\nhero.moveDown()\nhero.moveRight()\nhero.moveUp()",
    goals: ["Move in all four directions", "Explore the courtyard corners", "Practice path planning"],
    concept: "Movement",
    difficulty: 1,
    estimatedTime: 10,
    hints: [
      "Try each direction command once.",
      "Plan your path to visit each corner.",
      "You can use the commands in any order."
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Visit the four corners of the Syntaxia Courtyard. Master all four movement directions.",
    characters: ["Hero"],
    npcs: ["Old woman sweeping"],
    setting: "A bright, welcoming medieval castle courtyard in top-down 2D pixel art. Features: a grand stone entrance labeled 'SYNTAXIA', a central fountain with water, yellow-tiled paths forming a cross, trimmed green grass, bushes, banners, and castle walls with towers. The scene is peaceful and open, perfect for a hero's first steps and exploring corners.",
    assets: ["Direction signposts", "barrels", "wooden fences"]
  },
  // Lesson 3
  {
    id: 3,
    lessonNumber: 3,
    title: "Move Multiple Steps",
    description: "Learn how to move your hero several spaces at once by adding a number in the brackets.",
    codeExample: "hero.moveDown(3)",
    solution: "hero.moveDown(3)",
    goals: ["Move your hero multiple spaces in one command", "Use numbers as parameters", "Practice efficient movement"],
    concept: "Function Parameters",
    difficulty: 1,
    estimatedTime: 10,
    hints: [
      "Add a number in the brackets to move more than one space, e.g., hero.moveDown(3)",
      "Try different numbers to see how far your hero moves!",
      "You can use any direction with a number: moveUp(n), moveDown(n), moveLeft(n), or moveRight(n)"
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Collect all the coins in the side streets of Syntaxia. Your pet owl leads you to shiny coins scattered along the street.",
    characters: ["Hero"],
    npcs: ["Pet owl (flies near coins)"],
    setting: "A winding, narrow medieval town street in top-down 2D pixel art. Features: cobblestone paths, small houses with red roofs, wooden crates, barrels, lamp posts, and a few market stalls. The street has twists and turns, with some hidden corners and a friendly gnome or pet owl visible. The atmosphere is lively but safe for beginners.",
    assets: ["Floating coins", "crates", "market stalls"]
  },
  // Lesson 4
  {
    id: 4,
    lessonNumber: 4,
    title: "Waypoint Challenge",
    description: "Visit all four star waypoints using multi-step movement. Each move must use a number in the brackets.",
    codeExample: "hero.moveDown(3)\nhero.moveLeft(3)\nhero.moveUp(9)\nhero.moveRight(4)",
    solution: "hero.moveDown(3)\nhero.moveLeft(3)\nhero.moveUp(9)\nhero.moveRight(4)",
    goals: [
      "Reach all four waypoints (visit all 4 stars)",
      "Use exactly 4 movement commands, each with a number in the brackets."
    ],
    concept: "Movement",
    difficulty: 2,
    estimatedTime: 12,
    hints: [
      "Use hero.moveUp(n), hero.moveDown(n), hero.moveLeft(n), or hero.moveRight(n) with a number to move multiple spaces.",
      "You must use exactly 4 movement commands to visit all star waypoints.",
      "Try to plan your path before coding - any path that visits all stars is valid!"
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Follow the path to the alley's end in the side streets. A friendly gnome walks ahead. Can you follow his steps?",
    characters: ["Hero"],
    npcs: ["Gnome pacing in pattern"],
    setting: "A winding, narrow medieval town street in top-down 2D pixel art. Features: cobblestone paths, small houses with red roofs, wooden crates, barrels, lamp posts, and a few market stalls. The street has twists and turns, with some hidden corners and a friendly gnome or pet owl visible. The atmosphere is lively but safe for beginners.",
    assets: ["Loop circles", "path counter animation"]
  },
  // Lesson 5
  {
    id: 5,
    lessonNumber: 5,
    title: "What is a Variable?",
    description: "Collect and return to starting point in only 2 code lines.",
    codeExample: "hero.moveDown(10)\nhero.moveUp(10)",
    solution: "hero.moveDown(10)\nhero.moveUp(10)",
    goals: [
      "Understand variables and how they store values.",
      "Use variables in movement commands.",
      "Collect a book and return to the start position."
    ],
    concept: "Variables",
    difficulty: 1,
    estimatedTime: 10,
    hints: [
      "Try changing the value of your variable to see how it affects your code!",
      "The book is 10 steps down from your starting position.",
      "Use the same variable for both commands to keep your code simple."
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Enter the Hall of Knowledge to learn about variables from a helpful code sprite.",
    characters: ["Hero"],
    npcs: ["Code sprite explaining variable"],
    setting: "Hall of Knowledge (indoors)",
    assets: ["Floating symbols", "bookshelves"]
  },
  // Lesson 6
  {
    id: 6,
    lessonNumber: 6,
    title: "Collect the Potion",
    description: "Move your hero to collect the healing potion!",
    codeExample: "hero.moveRight(8)",
    solution: "hero.moveRight(8)",
    goals: ["Use hero.moveRight() command", "Move multiple steps at once", "Collect your first potion"],
    concept: "Movement",
    difficulty: 1,
    estimatedTime: 10,
    hints: [
      "Use hero.moveRight() with a number to move multiple steps",
      "Count how many steps to reach the potion",
      "The potion is 8 steps to the right"
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Visit the medic hut to learn about health management from a healing monk.",
    characters: ["Hero"],
    npcs: ["Healing monk"],
    setting: "Medic hut",
    assets: ["Health bar UI", "potion stand"]
  },
  // Lesson 7
  {
    id: 7,
    lessonNumber: 7,
    title: "Collect Two Gems",
    description: "Move your hero to collect two special gems!",
    codeExample: "hero.moveD__n(12)\nhero.move_ef_(3)\nhero.move_i_ht(9)",
    solution: "hero.moveD__n(12)\nhero.move_ef_(3)\nhero.move_i_ht(9)",
    goals: ["Move in multiple directions", "Collect two different gems", "Plan a multi-step path"],
    concept: "Multi-Direction",
    difficulty: 1,
    estimatedTime: 15,
    hints: [
      "First go up to get the blue gem",
      "Then go right to get the red gem",
      "Use two movement commands with the right numbers"
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Navigate the forest edge, learning to make decisions while avoiding the goblin hiding in the bush.",
    characters: ["Hero"],
    npcs: ["Goblin hiding in bush"],
    setting: "Forest edge",
    assets: ["Traps", "bush effects", "whispering warning text"]
  },
  // Lesson 8
  {
    id: 8,
    lessonNumber: 8,
    title: "Treasure Hunt: Three Gems",
    description: "Collect all three gems in this exciting treasure hunt!",
    codeExample: "hero.moveLeft(9)\nhero.moveUp(8)\nhero.moveRight(7)",
    solution: "hero.moveLeft(9)\nhero.moveUp(8)\nhero.moveRight(7)",
    goals: ["Use all four direction commands", "Collect three different gems", "Create a complete treasure hunt path"],
    concept: "Complex Movement",
    difficulty: 2,
    estimatedTime: 20,
    hints: [
      "Plan your complete path before writing code",
      "Remember to return to your starting point between gems",
      "You need to use all four directions"
    ],
    unlocks: "",
    week: 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Complete your first trial at the mini shrine, combining all your skills with Sage's guidance.",
    characters: ["Hero"],
    npcs: ["Sage appears mid-level"],
    setting: "Mini shrine with 3 branching paths",
    assets: ["Decision signs", "glowing tiles"]
  },
  // Lesson 9
  {
    id: 9,
    lessonNumber: 9,
    title: "Enemy Mine",
    description: "Tread carefully. Danger is afoot! The path ahead is filled with hidden dangers, and you must navigate it with precision to reach your goal safely.",
    codeExample: "# Use arguments with move statements to move farther.\nhero.moveRight(3)",
    solution: "# Use arguments with move statements to move farther.\nhero.moveRight(3)\n\n# Use arguments with move statements to move farther.\nhero.moveRight(3)\nhero.moveUp()\nhero.moveRight()\nhero.moveDown(3)\nhero.moveRight(2)",
    goals: [
      "Avoid the spikes.",
      "Go to grid 7.12."
    ],
    concept: "Movement",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "You can pass a number as an argument to hero.moveRight() or hero.moveDown() to move multiple steps at once.",
      "Plan your moves to avoid unnecessary steps and potential dangers."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Navigate the dangerous path using move arguments.",
    characters: ["Hero"],
    npcs: [],
    setting: "Minefield path",
    assets: ["Mine tiles", "Path tiles"]
  },
  {
    id: 10,
    lessonNumber: 10,
    title: "Illusory Interruption",
    description: "Distract the guards, then escape.",
    codeExample: "# Use the Decoy to distract the guards by stepping on the X.\ndecoy.moveUp(9)\ndecoy.moveLeft()\ndecoy.moveRight()\ndecoy.moveDown(11)", 
    solution: "# Use the Decoy to distract the guards by stepping on the X.\n\ndecoy.moveUp(9)\ndecoy.moveLeft()\ndecoy.moveRight()\ndecoy.moveDown(11)",
    goals: [
      "Distract the guards.",
      "Escape safely."
    ],
    concept: "Movement",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Step on the X to use the Decoy.",
      "Plan your moves to avoid the guards."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Distract the guards and escape using the Decoy.",
    characters: ["Hero"],
    npcs: ["Guards"],
    setting: "Guarded hallway",
    assets: ["Decoy", "X tile", "Guards"],
    enemies: {
      count: 2,
      positions: [
        { x: 4, y: 5 },
        { x: 6, y: 5 }
      ],
      types: ["grunt"]
    }
  },
  {
    id: 11,
    lessonNumber: 11,
    playerStart: { x: 7, y: 13 },
    title: "Forgetful Gemsmith",
    description: "There are gems scattered all over the dungeons in Kithgard!",
    codeExample: `# Use hero.moveRight(), 
hero.moveDown(), 
hero.moveLeft(), 
hero.moveUp() 
collect ALL gems then move to the X mark.`,

    solution: `hero.moveRight(3)
hero.moveUp(4)
hero.moveRight(2)
hero.moveUp(5)
hero.moveLeft(3)
hero.moveUp()
hero.moveLeft(7)
hero.moveDown(5)
hero.moveRight(4)
hero.moveUp(3)
hero.moveRight()
hero.moveDown(7)
hero.moveLeft(3)
hero.moveRight(4)
hero.moveUp(10)`, 
    goals: [
      "Collect all gems.",
      "Reach the exit."
    ],
    concept: "Movement",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Plan your path to collect every gem.",
      "Use movement commands to reach the exit."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Collect all gems and reach the exit.",
    characters: ["Hero"],
    npcs: [],
    setting: "Kithgard Dungeon",
    assets: ["Gems", "Exit"]
  },
  {
    id: 12,
    lessonNumber: 12,
    title: "Long Steps",
    description: "Using movement commands with arguments.",
    codeExample: "# This is a concept challenge level about arguments.\n# Grab the gems and go to the exit.\n# Your code should have no more than 7 commands.\n# Use movement commands with arguments.\n\n",
    solution: "hero.moveLeft(3)\nhero.moveUp(6)\nhero.moveRight(3)\nhero.moveUp(7)",
    goals: [
      "Use arguments in movement.",
      "Collect all gems.",
      "Reach the exit."
    ],
    concept: "Movement",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Use numbers as arguments to move farther in one command.",
      "Try to use no more than 7 commands."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Use arguments to move efficiently and collect all gems.",
    characters: ["Hero"],
    npcs: [],
    setting: "Gem-filled dungeon",
    assets: ["Gems", "Exit"]
  },
  {
    id: 13,
    lessonNumber: 13,
    title: "True Names",
    description: "Learn an enemy's true name to defeat it.",
    codeExample: "# Defend against \"Brak\" and \"Treg\"!\n# You must attack small ogres twice.\n\nhero.moveRight()\nhero.attack(\"Brak\")\nhero.attack(\"Brak\")",
    solution: "# Defend against \"Brak\" and \"Treg\"!\n# You must attack small ogres twice.\n\nhero.moveRight()\nhero.attack(\"Brak\")\nhero.attack(\"Brak\")\nhero.moveRight()\nhero.attack(\"Treg\")\nhero.attack(\"Treg\")",
    goals: [
      "Defeat Brak and Treg.",
      "Attack each ogre twice."
    ],
    concept: "Combat",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Use the correct enemy names in attack().",
      "Each ogre needs two attacks."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Defeat the ogres by using their true names.",
    characters: ["Hero"],
    npcs: ["Brak", "Treg"],
    setting: "Dungeon corridor",
    assets: ["Ogres", "Sword"]
  },
  {
    id: 14,
    lessonNumber: 14,
    title: "Favorable Odds",
    description: "Two ogres bar your passage out of the dungeon.",
    codeExample: "# Attack both ogres and grab the gem.\nhero.moveRight()\nhero.attack(\"Krug\")\nhero.attack(\"Krug\")",
    solution: "# Attack both ogres and grab the gem.\nhero.moveRight()\nhero.attack(\"Krug\")\nhero.attack(\"Krug\")\nhero.moveRight()\nhero.moveUp()\nhero.attack(\"Grump\")\nhero.attack(\"Grump\")\nhero.moveLeft()\nhero.moveLeft()",
    goals: [
      "Defeat both ogres.",
      "Collect the gem."
    ],
    concept: "Combat",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Attack each ogre twice.",
      "Move to the gem after defeating the ogres."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Defeat the ogres and collect the gem.",
    characters: ["Hero"],
    npcs: ["Krug", "Grump"],
    setting: "Dungeon exit",
    assets: ["Ogres", "Gem"]
  },
  {
    id: 15,
    lessonNumber: 15,
    title: "The Raised Sword",
    description: "Learn to equip yourself for combat.",
    codeExample: "# Defeat the ogres.\n# Remember that they each take two hits.\n\n",
    solution: "# Defeat the ogres.\n# Remember that they each take two hits.\n\nhero.attack(\"Rig\")\nhero.attack(\"Rig\")\n\nhero.attack(\"Gurt\")\nhero.attack(\"Gurt\")\n\nhero.attack(\"Ack\")\nhero.attack(\"Ack\")",
    goals: [
      "Defeat all ogres.",
      "Attack each ogre twice."
    ],
    concept: "Combat",
    difficulty: 2,
    estimatedTime: 10,
    hints: [
      "Each ogre needs two attacks.",
      "Attack them in order."
    ],
    unlocks: "",
    week: 2,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "Defeat all ogres with your sword.",
    characters: ["Hero"],
    npcs: ["Rig", "Gurt", "Ack"],
    setting: "Combat arena",
    assets: ["Ogres", "Sword"]
  },
  // Lessons 17-160: Dummy data
  ...Array.from({ length: 144 }, (_, i) => ({
    id: i + 17,
    lessonNumber: i + 17,
    title: `Lesson ${i + 17}`,
    description: "This is a placeholder for lesson content.",
    codeExample: "// Example code",
    solution: "// Solution code",
    goals: ["Goal 1", "Goal 2"],
    concept: "Concept",
    difficulty: 1,
    estimatedTime: 10,
    hints: ["Hint 1", "Hint 2"],
    unlocks: "",
    week: Math.floor((i + 17 - 1) / 8) + 1,
    mentor: { name: "Sage the Wizard", icon: "🧙" },
    questUpdate: "This is a placeholder quest update.",
    characters: ["Hero"],
    npcs: ["NPC"],
    setting: "Placeholder setting.",
    assets: ["Asset 1", "Asset 2"]
  }))
] as XCodeLesson[]; 