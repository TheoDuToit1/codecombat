// CS3 Lesson Data Structure - Objects & Complexity
// With Arrow the Elf

import { CS1Lesson } from './cs1LessonData';

export interface CS3Lesson extends CS1Lesson {}

// Mentor data for CS3
export const CS3_MENTOR_DATA = {
  arrow: {
    name: "Arrow the Elf",
    icon: "🧝‍♂️",
    quote: "In the world of programming, objects are like the trees of a forest - each with their own properties and behaviors, working together to create something complex and beautiful."
  }
};

export const COURSE_STRUCTURE_CS3 = {
  mainConcepts: [
    "Objects", 
    "Properties", 
    "Methods", 
    "Classes", 
    "Inheritance", 
    "Data Structures"
  ]
};

export const CS3_LESSONS: CS3Lesson[] = [
  // Week 1: Object Basics
  {
    id: 201,
    lessonNumber: 1,
    title: "Introduction to Objects",
    description: "Learn about objects, the building blocks of complex programs.",
    concept: "Object Basics",
    objectives: [
      "Understand what objects are",
      "Create your first object",
      "Access object properties"
    ],
    difficulty: 3,
    estimatedTime: 25,
    mentor: {
      name: "Arrow the Elf",
      icon: "🧝‍♂️"
    },
    week: 1,
    codeExample: "// Create an object\nconst character = {\n  name: 'Elwyn',\n  class: 'Ranger',\n  health: 100,\n  skills: ['Archery', 'Tracking']\n};\n\n// Access properties\nconsole.log(character.name); // 'Elwyn'\nconsole.log(character.skills[0]); // 'Archery'",
    hints: [
      "Objects group related data and functionality together",
      "Use dot notation (object.property) to access properties",
      "Objects can contain strings, numbers, arrays, and even other objects"
    ]
  },
  {
    id: 202,
    lessonNumber: 2,
    title: "Object Methods",
    description: "Add behavior to your objects with methods.",
    concept: "Object Methods",
    objectives: [
      "Create methods inside objects",
      "Call object methods",
      "Use 'this' keyword in methods"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Arrow the Elf",
      icon: "🧝‍♂️"
    },
    week: 1,
    codeExample: "const elf = {\n  name: 'Lindir',\n  mana: 100,\n  // Method with 'this'\n  castSpell: function(spellName, manaCost) {\n    if (this.mana >= manaCost) {\n      this.mana -= manaCost;\n      return `${this.name} casts ${spellName}!`;\n    } else {\n      return 'Not enough mana!';\n    }\n  }\n};\n\nconsole.log(elf.castSpell('Moonbeam', 30));",
    hints: [
      "Methods are functions that belong to an object",
      "The 'this' keyword refers to the object the method belongs to",
      "Methods let objects perform actions related to their data"
    ]
  },
  {
    id: 203,
    lessonNumber: 3,
    title: "Object Construction",
    description: "Create multiple objects with the same structure.",
    concept: "Object Constructors",
    objectives: [
      "Use constructor functions",
      "Create object instances",
      "Initialize object properties"
    ],
    difficulty: 3,
    estimatedTime: 35,
    mentor: {
      name: "Arrow the Elf",
      icon: "🧝‍♂️"
    },
    week: 1,
    codeExample: "// Constructor function\nfunction Creature(name, type, health) {\n  this.name = name;\n  this.type = type;\n  this.health = health;\n  this.describe = function() {\n    return `${this.name} is a ${this.type} with ${this.health} health.`;\n  };\n}\n\n// Create instances\nconst wolf = new Creature('Shadowfang', 'wolf', 60);\nconst deer = new Creature('Swiftleaf', 'deer', 30);\n\nconsole.log(wolf.describe());",
    hints: [
      "Constructor functions let you create multiple objects with the same structure",
      "Use the 'new' keyword to create a new instance",
      "Each instance gets its own copy of the properties and methods"
    ]
  },
  {
    id: 204,
    lessonNumber: 4,
    title: "Advanced Object Properties",
    description: "Work with dynamic properties and property descriptors.",
    concept: "Object Properties",
    objectives: [
      "Use computed property names",
      "Add properties dynamically",
      "Learn about property descriptors"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Arrow the Elf",
      icon: "🧝‍♂️"
    },
    week: 1,
    codeExample: "// Dynamic properties\nconst propertyName = 'magicPower';\nconst wizard = {\n  name: 'Elindra',\n  [propertyName]: 85  // Computed property name\n};\n\n// Adding properties dynamically\nwizard.element = 'fire';\n\nconsole.log(wizard.magicPower); // 85\nconsole.log(wizard.element); // 'fire'",
    hints: [
      "Use square brackets with dynamic property names",
      "You can add or modify properties anytime after creation",
      "Properties can be strings, numbers, arrays, objects, or functions"
    ]
  },
  {
    id: 81,
    lessonNumber: 1,
    title: "Welcome to CS3",
    description: "Meet Arrow the Elf and begin learning about objects and more complex programming patterns.",
    concept: "Introduction",
    objectives: [
      "Meet your new mentor Arrow",
      "Understand CS3 course structure",
      "Review CS1 and CS2 concepts"
    ],
    difficulty: 3,
    estimatedTime: 25,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Welcome to CS3: Objects & Complexity!\n// With Arrow the Elf, master of precision and structure\nclass Greeting {\n  constructor(name) {\n    this.name = name;\n  }\n  sayHello() {\n    console.log(`Greetings, ${this.name}! Arrow welcomes you.`);\n  }\n}\n\nconst greeting = new Greeting('adventurer');\ngreeting.sayHello();",
    hints: [
      "CS3 introduces object-oriented programming concepts",
      "Think about how to model real-world things in code"
    ]
  },
  {
    id: 82,
    lessonNumber: 2,
    title: "Objects as Data",
    description: "Learn to create and use objects to represent complex data.",
    concept: "Object Literals",
    objectives: [
      "Create object literals",
      "Access object properties",
      "Modify object data"
    ],
    difficulty: 3,
    estimatedTime: 30,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Creating an object\nconst player = {\n  name: \"Elf Ranger\",\n  health: 120,\n  skills: [\"archery\", \"stealth\", \"tracking\"],\n  equipment: {\n    weapon: \"longbow\",\n    armor: \"leather\"\n  }\n};\n\n// Accessing data\nconsole.log(player.name); // \"Elf Ranger\"\nconsole.log(player.skills[0]); // \"archery\"\n\n// Modifying data\nplayer.health -= 10;\nplayer.equipment.weapon = \"enchanted bow\";",
    hints: [
      "Objects group related data together",
      "Use dot notation (object.property) to access properties"
    ]
  },
  {
    id: 83,
    lessonNumber: 3,
    title: "Object Prototypes",
    description: "Understand JavaScript's prototype-based inheritance.",
    concept: "Prototype Chain",
    objectives: [
      "Learn about object prototypes",
      "Extend object functionality",
      "Share methods between objects"
    ],
    difficulty: 4,
    estimatedTime: 40,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Constructor function\nfunction Character(name, className) {\n  this.name = name;\n  this.className = className;\n  this.level = 1;\n}\n\n// Adding methods to the prototype\nCharacter.prototype.levelUp = function() {\n  this.level++;\n  console.log(`${this.name} is now level ${this.level}!`);\n};\n\n// Creating instances\nconst hero = new Character(\"Elyndra\", \"Ranger\");\nconst companion = new Character(\"Thorn\", \"Druid\");\n\n// Both can use the levelUp method\nhero.levelUp();\ncompanion.levelUp();",
    hints: [
      "Prototypes allow objects to inherit properties and methods",
      "All instances share the same prototype methods, saving memory"
    ]
  },
  {
    id: 85,
    lessonNumber: 5,
    title: "Classes in JavaScript",
    description: "Use modern JavaScript class syntax for object-oriented programming.",
    concept: "Classes",
    objectives: [
      "Create classes using class syntax",
      "Instantiate objects from classes",
      "Add constructors and methods"
    ],
    difficulty: 3,
    estimatedTime: 40,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Modern class definition\nclass Player {\n  constructor(name, role) {\n    this.name = name;\n    this.role = role;\n    this.health = 100;\n    this.inventory = [];\n  }\n  \n  attack(target) {\n    console.log(`${this.name} attacks ${target}!`);\n  }\n  \n  addItem(item) {\n    this.inventory.push(item);\n    console.log(`${this.name} picked up ${item}`);\n  }\n}\n\nconst ranger = new Player(\"Sylvan\", \"Ranger\");\nranger.attack(\"goblin\");\nranger.addItem(\"magic arrow\");",
    hints: [
      "Classes provide a cleaner syntax for creating objects",
      "The constructor method runs when new objects are created"
    ]
  },
  {
    id: 86,
    lessonNumber: 6,
    title: "Class Inheritance",
    description: "Extend class functionality through inheritance.",
    concept: "Inheritance",
    objectives: [
      "Create child classes",
      "Override parent methods",
      "Use super to access parent functionality"
    ],
    difficulty: 4,
    estimatedTime: 45,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Parent class\nclass Character {\n  constructor(name) {\n    this.name = name;\n    this.health = 100;\n  }\n  \n  attack() {\n    return 10; // Base damage\n  }\n}\n\n// Child class\nclass Archer extends Character {\n  constructor(name) {\n    super(name); // Call parent constructor\n    this.arrows = 20;\n  }\n  \n  attack() {\n    if (this.arrows > 0) {\n      this.arrows--;\n      return super.attack() + 15; // Add bonus to parent attack\n    }\n    return super.attack();\n  }\n  \n  reload() {\n    this.arrows += 5;\n  }\n}\n\nconst elf = new Archer(\"Legolas\");\nconsole.log(`${elf.name} deals ${elf.attack()} damage!`);",
    hints: [
      "Child classes inherit all properties and methods from their parent",
      "super refers to the parent class"
    ]
  },
  {
    id: 87,
    lessonNumber: 7,
    title: "Object Composition",
    description: "Learn a powerful alternative to inheritance for building complex objects.",
    concept: "Composition",
    objectives: [
      "Build objects from smaller parts",
      "Create flexible object structures",
      "Compare composition vs inheritance"
    ],
    difficulty: 4,
    estimatedTime: 50,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Object composition with mixins\n// Small, focused behavior objects\nconst walker = {\n  walk() {\n    console.log(`${this.name} walks`);\n  }\n};\n\nconst swimmer = {\n  swim() {\n    console.log(`${this.name} swims`);\n  }\n};\n\nconst attacker = {\n  attack(target) {\n    console.log(`${this.name} attacks ${target}`);\n  }\n};\n\n// Create complex objects by combining behaviors\nfunction createElf(name) {\n  return Object.assign(\n    { name, health: 120 },\n    walker,\n    attacker\n  );\n}\n\nfunction createMerfolk(name) {\n  return Object.assign(\n    { name, health: 100 },\n    swimmer,\n    attacker\n  );\n}\n\nconst elf = createElf(\"Thranduil\");\nelf.walk();\nelf.attack(\"orc\");",
    hints: [
      "Composition follows the principle 'favor composition over inheritance'",
      "It creates more flexible code by combining smaller pieces"
    ]
  },
  {
    id: 88,
    lessonNumber: 8,
    title: "Object Challenge",
    description: "Build a complete game inventory system using object-oriented techniques.",
    concept: "Object Design",
    objectives: [
      "Design a flexible inventory system",
      "Implement item interactions",
      "Apply object-oriented principles"
    ],
    difficulty: 5,
    estimatedTime: 60,
    mentor: {
      name: "Arrow the Elf",
      icon: "🏹"
    },
    week: 1,
    codeExample: "// Create an inventory system!\nclass Item {\n  constructor(name, weight, value) {\n    this.name = name;\n    this.weight = weight;\n    this.value = value;\n  }\n  \n  use() {\n    console.log(`Using ${this.name}...`);\n  }\n}\n\nclass Weapon extends Item {\n  constructor(name, damage, weight, value) {\n    super(name, weight, value);\n    this.damage = damage;\n  }\n  \n  use() {\n    console.log(`Attacking with ${this.name} for ${this.damage} damage!`);\n  }\n}\n\nclass Inventory {\n  constructor(capacity) {\n    this.items = [];\n    this.capacity = capacity;\n    this.currentWeight = 0;\n  }\n  \n  addItem(item) {\n    if (this.currentWeight + item.weight <= this.capacity) {\n      this.items.push(item);\n      this.currentWeight += item.weight;\n      return true;\n    }\n    return false;\n  }\n  \n  useItem(index) {\n    if (index >= 0 && index < this.items.length) {\n      this.items[index].use();\n    }\n  }\n}\n\n// Challenge: Add more item types and inventory functions!",
    hints: [
      "Think about how different items might behave",
      "Create clear relationships between your classes"
    ],
    unlocks: "Week 2 Content"
  }

  // More weeks would be added here...
];

// Export lessons grouped by weeks for easier filtering
export const CS3_LESSONS_BY_WEEK = CS3_LESSONS.reduce((acc, lesson) => {
  if (!acc[lesson.week]) {
    acc[lesson.week] = [];
  }
  acc[lesson.week].push(lesson);
  return acc;
}, {} as Record<number, CS3Lesson[]>);

export default CS3_LESSONS; 