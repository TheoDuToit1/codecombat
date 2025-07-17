// X-Code Crew: Simple Names & Clear Structure
export interface CrewMember {
  id: string;
  name: string; // Simple, kid-friendly names
  gauntletClass: 'warrior' | 'valkyrie' | 'wizard' | 'elf';
  codingSkill: string; // What they teach
  description: string; // Simple explanation
  stats: {
    strength: number;    // 1-10 scale
    magic: number;       // 1-10 scale  
    speed: number;       // 1-10 scale
    wisdom: number;      // 1-10 scale
  };
  unlockLevel: number; // Which lesson unlocks them
}

export const XCODE_CREW: CrewMember[] = [
  {
    id: 'warrior',
    name: 'Rex',
    gauntletClass: 'warrior',
    codingSkill: 'Loops',
    description: 'The strong warrior who teaches you to repeat code like a champion!',
    stats: {
      strength: 10,
      magic: 3,
      speed: 6,
      wisdom: 5
    },
    unlockLevel: 10
  },
  {
    id: 'valkyrie', 
    name: 'Luna',
    gauntletClass: 'valkyrie',
    codingSkill: 'Functions',
    description: 'The swift fighter who shows you how to organize your code!',
    stats: {
      strength: 7,
      magic: 6,
      speed: 10,
      wisdom: 8
    },
    unlockLevel: 25
  },
  {
    id: 'wizard',
    name: 'Sage',
    gauntletClass: 'wizard', 
    codingSkill: 'Variables',
    description: 'The wise wizard who teaches you to store and use information!',
    stats: {
      strength: 4,
      magic: 10,
      speed: 5,
      wisdom: 10
    },
    unlockLevel: 1
  },
  {
    id: 'elf',
    name: 'Arrow',
    gauntletClass: 'elf',
    codingSkill: 'Logic',
    description: 'The smart archer who helps you make decisions in code!',
    stats: {
      strength: 6,
      magic: 7,
      speed: 9,
      wisdom: 9
    },
    unlockLevel: 15
  }
];

// Course Structure: 160 Lessons (CodeCombat Style)
export interface CourseLevel {
  id: number;
  name: string;
  concept: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  mentor: string; // Which crew member teaches this
  unlocks?: string; // What this level unlocks
}

export const COURSE_STRUCTURE = {
  // CS1: Programming Basics (40 levels)
  cs1: {
    name: "Code Basics",
    levels: 40,
    concepts: ["Variables", "Basic Movement", "Simple Loops", "Basic Logic"],
    mentor: "Sage" // Wizard teaches fundamentals
  },
  
  // CS2: Intermediate Programming (40 levels) 
  cs2: {
    name: "Code Warriors",
    levels: 40,
    concepts: ["Advanced Loops", "Functions", "Arrays", "Objects"],
    mentor: "Rex" // Warrior teaches loops & strength
  },
  
  // CS3: Advanced Programming (40 levels)
  cs3: {
    name: "Code Masters", 
    levels: 40,
    concepts: ["Complex Logic", "Algorithms", "Data Structures", "Problem Solving"],
    mentor: "Arrow" // Elf teaches precision & logic
  },
  
  // CS4: Expert Programming (40 levels)
  cs4: {
    name: "Code Legends",
    levels: 40, 
    concepts: ["Advanced Functions", "Recursion", "Optimization", "Game Development"],
    mentor: "Luna" // Valkyrie teaches advanced organization
  }
};

export const PROGRESSION_SYSTEM = {
  lessons: {
    total: 160,
    structure: "4 courses × 40 lessons each",
    unlocks: "Gauntlet access after CS1 completion"
  },
  gauntlet: {
    total: 100,
    structure: "4 floors × 25 levels each", 
    requirement: "Complete 40 lesson goals first"
  },
  rewards: {
    lessonCompletion: "XP, badges, crew member unlocks",
    gauntletProgress: "Gold, gems, special items, leaderboards"
  }
};