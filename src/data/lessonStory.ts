// 🎮 X-Code Quest: CS1 – Quest for the Ultimate Code
// Simple, focused story system for CS1 lessons

export interface LessonStory {
  lessonId: number;
  title: string;
  questUpdate: string; // 1-2 line quest update
  characters: string[];
  npcs: string[];
  setting: string;
  assets: string[];
}

// 🌍 CS1 STORY OVERVIEW
export const CS1_STORY_OVERVIEW = {
  title: "X-Code Quest: CS1 – Quest for the Ultimate Code",
  mentor: "🧙 Sage the Wizard",
  world: "Codeverse, Realm 1 – The Logic Meadows",
  overview: `In the sacred halls of the Academy of Syntaxia, hidden deep within the emerald hills of the Logic Meadows, you awaken. The Codeverse is crumbling—entire functions collapsing into recursive madness, errors spreading like mist. The ancient X-Code Crew have vanished, leaving behind scrolls of fragmented syntax and scattered gems of knowledge.

You, a young apprentice, are chosen to restore balance. Under the guidance of Sage the Wizard, you must embark on a journey across wild meadows, cryptic forests, crystal caves, and forgotten code ruins to master the language of the ancients.

Each lesson not only teaches a concept—but unlocks your power as a true defender of the Codeverse. Beware: corrupted goblins lurk, rogue scripts roam, and at the heart of this land lies a dormant Generator Stone humming with dark recursion.`
};

// 🧙‍♂️ CS1: THE AWAKENING SAGA (Lessons 1-40) - Sage the Wizard
export const CS1_STORY: LessonStory[] = [
  // Setting 1: Syntaxia Courtyard (Lessons 1 & 2)
  {
    lessonId: 1,
    title: "Meet Your Hero",
    questUpdate: "Cross the Syntaxia Courtyard and reach the sparkling fountain. Learn to move your hero with Sage's guidance.",
    characters: ["Hero", "Sage the Wizard"],
    npcs: ["Villager child waving"],
    setting: "A bright, welcoming medieval castle courtyard in top-down 2D pixel art. Features: a grand stone entrance labeled 'SYNTAXIA', a central fountain with water, yellow-tiled paths forming a cross, trimmed green grass, bushes, banners, and castle walls with towers. The scene is peaceful and open, perfect for a hero's first steps and exploring corners.",
    assets: ["Lamp posts", "scroll crates", "sparkly effect when walking"]
  },
  {
    lessonId: 2,
    title: "Directions and Movement",
    questUpdate: "Visit the four corners of the Syntaxia Courtyard. Master all four movement directions.",
    characters: ["Hero"],
    npcs: ["Old woman sweeping"],
    setting: "A bright, welcoming medieval castle courtyard in top-down 2D pixel art. Features: a grand stone entrance labeled 'SYNTAXIA', a central fountain with water, yellow-tiled paths forming a cross, trimmed green grass, bushes, banners, and castle walls with towers. The scene is peaceful and open, perfect for a hero's first steps and exploring corners.",
    assets: ["Direction signposts", "barrels", "wooden fences"]
  },
  // Setting 2: Side Streets of Syntaxia (Lessons 3 & 4)
  {
    lessonId: 3,
    title: "Collecting Coins",
    questUpdate: "Collect all the coins in the side streets of Syntaxia. Your pet owl leads you to shiny coins scattered along the street.",
    characters: ["Hero"],
    npcs: ["Pet owl (flies near coins)"],
    setting: "A winding, narrow medieval town street in top-down 2D pixel art. Features: cobblestone paths, small houses with red roofs, wooden crates, barrels, lamp posts, and a few market stalls. The street has twists and turns, with some hidden corners and a friendly gnome or pet owl visible. The atmosphere is lively but safe for beginners.",
    assets: ["Floating coins", "crates", "market stalls"]
  },
  {
    lessonId: 4,
    title: "Counting Steps",
    questUpdate: "Follow the path to the alley's end in the side streets. A friendly gnome walks ahead. Can you follow his steps?",
    characters: ["Hero"],
    npcs: ["Gnome pacing in pattern"],
    setting: "A winding, narrow medieval town street in top-down 2D pixel art. Features: cobblestone paths, small houses with red roofs, wooden crates, barrels, lamp posts, and a few market stalls. The street has twists and turns, with some hidden corners and a friendly gnome or pet owl visible. The atmosphere is lively but safe for beginners.",
    assets: ["Loop circles", "path counter animation"]
  },
  {
    lessonId: 5,
    title: "What is a Variable?",
    questUpdate: "Enter the Hall of Knowledge to learn about variables from a helpful code sprite.",
    characters: ["Hero"],
    npcs: ["Code sprite explaining variable"],
    setting: "Hall of Knowledge (indoors)",
    assets: ["Floating symbols", "bookshelves"]
  },
  {
    lessonId: 6,
    title: "Check Health",
    questUpdate: "Visit the medic hut to learn about health management from a healing monk.",
    characters: ["Hero"],
    npcs: ["Healing monk"],
    setting: "Medic hut",
    assets: ["Health bar UI", "potion stand"]
  },
  {
    lessonId: 7,
    title: "Simple Conditions",
    questUpdate: "Navigate the forest edge, learning to make decisions while avoiding the goblin hiding in the bush.",
    characters: ["Hero"],
    npcs: ["Goblin hiding in bush"],
    setting: "Forest edge",
    assets: ["Traps", "bush effects", "whispering warning text"]
  },
  {
    lessonId: 8,
    title: "Puzzle Level: Move, Collect, Decide",
    questUpdate: "Complete your first trial at the mini shrine, combining all your skills with Sage's guidance.",
    characters: ["Hero"],
    npcs: ["Sage appears mid-level"],
    setting: "Mini shrine with 3 branching paths",
    assets: ["Decision signs", "glowing tiles"]
  },

  // Week 2: The Emberwood Forest
  {
    lessonId: 9,
    title: "Hazard Zones",
    questUpdate: "Navigate the fungal forest, learning to identify and avoid dangerous hazard zones.",
    characters: ["Hero"],
    npcs: ["Mushroom merchant"],
    setting: "Fungal forest",
    assets: ["Glowing red floor", "status alerts"]
  },
  {
    lessonId: 10,
    title: "Meet Rex the Warrior",
    questUpdate: "Arrive at the Warrior's Camp to meet Rex and learn the ways of strength and combat.",
    characters: ["Hero", "Rex"],
    npcs: ["Beast watching from shadows"],
    setting: "Warrior's Camp",
    assets: ["Sword rack", "fire pit"]
  },
  {
    lessonId: 11,
    title: "Basic Combat",
    questUpdate: "Engage in your first combat training in the forest clearing against a basic goblin.",
    characters: ["Hero", "Enemy (basic goblin)"],
    npcs: [],
    setting: "Forest clearing",
    assets: ["Combat slash effect", "enemy HP bar"]
  },
  {
    lessonId: 12,
    title: "While Loops",
    questUpdate: "Master while loops in the spiral grove with guidance from a loop sprite.",
    characters: ["Hero"],
    npcs: ["Loop sprite"],
    setting: "Spiral grove",
    assets: ["Tree ring pattern path"]
  },
  {
    lessonId: 13,
    title: "Grab the Loot!",
    questUpdate: "Explore the treasure cave to collect loot efficiently with help from a talking chest.",
    characters: ["Hero"],
    npcs: ["Talking chest"],
    setting: "Treasure cave",
    assets: ["Coins", "bags", "auto-collect animation"]
  },
  {
    lessonId: 14,
    title: "Keys & Doors",
    questUpdate: "Navigate the enchanted gate hallway, learning to use keys to unlock doors.",
    characters: ["Hero"],
    npcs: ["Locked gate spirit"],
    setting: "Enchanted gate hallway",
    assets: ["Key UI", "lock status UI"]
  },
  {
    lessonId: 15,
    title: "Meet Arrow the Elf",
    questUpdate: "Discover Arrow's secret forest base and learn the art of precision and strategy.",
    characters: ["Hero", "Arrow the Elf"],
    npcs: [],
    setting: "Arrow's secret forest base",
    assets: ["Light bridges", "puzzle map"]
  },
  {
    lessonId: 16,
    title: "Decision Paths",
    questUpdate: "Navigate the forking paths zone, making strategic decisions with guidance from a direction statue.",
    characters: ["Hero"],
    npcs: ["Direction statue"],
    setting: "Forking paths zone",
    assets: ["Animated fork sign", "fog of war"]
  },

  // Week 3: The Bug Swamp
  {
    lessonId: 17,
    title: "Multi-Enemy Combat",
    questUpdate: "Face multiple goblins in the mud arena, learning to handle multiple threats simultaneously.",
    characters: ["Hero", "3 goblins"],
    npcs: [],
    setting: "Mud arena",
    assets: ["Target lock", "HP spread UI"]
  },
  {
    lessonId: 18,
    title: "Track Health Points",
    questUpdate: "Visit the swamp outpost to master health tracking with the swamp healer's guidance.",
    characters: ["Hero"],
    npcs: ["Swamp healer"],
    setting: "Swamp outpost",
    assets: ["Health HUD", "heart pickups"]
  },
  {
    lessonId: 19,
    title: "Nested Ifs",
    questUpdate: "Learn nested logic at the Code Circle Stones, dealing with a dual-behavior slime.",
    characters: ["Hero"],
    npcs: ["Dual-behavior slime"],
    setting: "Code Circle Stones",
    assets: ["Multi-color logic gates"]
  },
  {
    lessonId: 20,
    title: "Create Functions",
    questUpdate: "Enter the Function Grove to learn function creation with the Echo Fox as your guide.",
    characters: ["Hero"],
    npcs: ["Echo Fox"],
    setting: "Function Grove",
    assets: ["Glowing syntax trees"]
  },
  {
    lessonId: 21,
    title: "Functions with Inputs",
    questUpdate: "Learn to create flexible functions at the custom rune table with a rune scribe.",
    characters: ["Hero"],
    npcs: ["Rune scribe"],
    setting: "Custom rune table",
    assets: ["Input console", "value crystals"]
  },
  {
    lessonId: 22,
    title: "For Loops",
    questUpdate: "Master for loops on the forest loop trail with a loop elemental as your teacher.",
    characters: ["Hero"],
    npcs: ["Loop elemental"],
    setting: "Forest loop trail",
    assets: ["Step counters"]
  },
  {
    lessonId: 23,
    title: "Arrays",
    questUpdate: "Learn array management in the storage room with the chest keeper's guidance.",
    characters: ["Hero"],
    npcs: ["Chest keeper"],
    setting: "Storage room",
    assets: ["Item list", "item shelf"]
  },
  {
    lessonId: 24,
    title: "Puzzle Level: Survival Gauntlet",
    questUpdate: "Survive the arena ring challenge, facing waves of enemies with strategic thinking.",
    characters: ["Hero"],
    npcs: ["Enemy wave announcer"],
    setting: "Arena ring",
    assets: ["Wave spawner", "countdown"]
  },

  // Week 4: The Crystal Caves
  {
    lessonId: 25,
    title: "Meet Luna the Valkyrie",
    questUpdate: "Enter the Valkyrie forge to meet Luna and learn the highest arts of code organization.",
    characters: ["Hero", "Luna"],
    npcs: [],
    setting: "Valkyrie forge",
    assets: ["Planning table", "strategy charts"]
  },
  {
    lessonId: 26,
    title: "Coordinate Systems",
    questUpdate: "Master coordinate systems in the grid cave with glowing XY markers and a grid ghost.",
    characters: ["Hero"],
    npcs: ["Grid ghost"],
    setting: "Grid cave with glowing XY markers",
    assets: ["Overlay grid UI"]
  },
  {
    lessonId: 27,
    title: "Game Events",
    questUpdate: "Learn event-driven programming in the trap corridor with trigger crystals.",
    characters: ["Hero"],
    npcs: ["Trigger crystal"],
    setting: "Trap corridor",
    assets: ["Event sparkles"]
  },
  {
    lessonId: 28,
    title: "Debugging Basics",
    questUpdate: "Enter the error zone to learn debugging with the guidance of an error bat.",
    characters: ["Hero"],
    npcs: ["Error bat"],
    setting: "Error zone",
    assets: ["Red flickers", "console hints"]
  },
  {
    lessonId: 29,
    title: "Combat Challenge",
    questUpdate: "Face waves of goblins in the dungeon node, testing your combat mastery.",
    characters: ["Hero vs goblin waves"],
    npcs: [],
    setting: "Dungeon node",
    assets: ["Combat HUD"]
  },
  {
    lessonId: 30,
    title: "Build Your Arena",
    questUpdate: "Create your own arena in the editor zone with Luna's guidance and drag/drop tools.",
    characters: ["Hero"],
    npcs: ["Luna"],
    setting: "Editor zone",
    assets: ["Drag/drop tools"]
  },
  {
    lessonId: 31,
    title: "Object Properties",
    questUpdate: "Learn object analysis in the analysis chamber with an analyzer totem.",
    characters: ["Hero"],
    npcs: ["Analyzer totem"],
    setting: "Analysis chamber",
    assets: ["Inspect overlay"]
  },
  {
    lessonId: 32,
    title: "Puzzle Level: Guard the Crystals!",
    questUpdate: "Defend the crystal node zone from enemy waves, protecting the sacred crystals.",
    characters: ["Hero"],
    npcs: ["Enemy waves"],
    setting: "Crystal node zone",
    assets: ["Barrier tiles", "guard animation"]
  },

  // Week 5: The Generator Chamber
  {
    lessonId: 33,
    title: "Spawning & Generators",
    questUpdate: "Enter the generator ruin to learn about spawning mechanics from a spawner core.",
    characters: ["Hero", "Spawner Core"],
    npcs: [],
    setting: "Generator ruin",
    assets: ["Repeating spawner orb"]
  },
  {
    lessonId: 34,
    title: "Timed Health Loss",
    questUpdate: "Navigate the pressure zone, managing timed health loss with a timekeeper spirit.",
    characters: ["Hero"],
    npcs: ["Timekeeper spirit"],
    setting: "Pressure zone",
    assets: ["HP timer bar"]
  },
  {
    lessonId: 35,
    title: "Level Timers",
    questUpdate: "Race against time in the escape tunnel, mastering level timer mechanics.",
    characters: ["Hero"],
    npcs: [],
    setting: "Escape tunnel",
    assets: ["Countdown HUD"]
  },
  {
    lessonId: 36,
    title: "Use Potions!",
    questUpdate: "Visit the supply base to learn potion crafting and inventory management.",
    characters: ["Hero"],
    npcs: ["Potion crafter"],
    setting: "Supply base",
    assets: ["Inventory UI", "potion glow"]
  },
  {
    lessonId: 37,
    title: "Final Review",
    questUpdate: "Return to the Syntaxia Hall for a comprehensive review with Sage and flashback portals.",
    characters: ["Hero", "Sage"],
    npcs: [],
    setting: "Syntaxia Hall",
    assets: ["Flashback portal"]
  },
  {
    lessonId: 38,
    title: "Custom Level Build",
    questUpdate: "Enter the Logic Forge to create your own custom level with build tools and validation.",
    characters: ["Hero"],
    npcs: [],
    setting: "Logic Forge",
    assets: ["Build menu", "validation UI"]
  },
  {
    lessonId: 39,
    title: "Boss Fight",
    questUpdate: "Face the ultimate challenge against the Codebeast in the broken logic node.",
    characters: ["Hero vs Codebeast"],
    npcs: [],
    setting: "Broken logic node",
    assets: ["Boss bar", "glitchy effects"]
  },
  {
    lessonId: 40,
    title: "CS1 Graduation: Gauntlet Unlocked",
    questUpdate: "Graduate from CS1 at the Crystal Gate, unlocking the Gauntlet Realm with all mentors present.",
    characters: ["Hero", "All mentors"],
    npcs: [],
    setting: "Crystal Gate to Gauntlet Realm",
    assets: ["Graduation badge", "glowing portal"]
  }
];

// Helper function to get quest update for a specific lesson
export const getQuestUpdate = (lessonId: number): string | null => {
  const storyData = CS1_STORY.find(story => story.lessonId === lessonId);
  return storyData ? storyData.questUpdate : null;
};

// Helper function to get full story data for a specific lesson
export const getStoryData = (lessonId: number): LessonStory | null => {
  return CS1_STORY.find(story => story.lessonId === lessonId) || null;
};