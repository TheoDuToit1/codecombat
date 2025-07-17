// CS1 Quiz Data - Grouped by every 8 lessons

export interface CS1QuizQuestion {
  type: 'multiple-choice' | 'true-false' | 'code-fill' | 'short-answer';
  question: string;
  options?: string[]; // For multiple-choice
  answer: string | boolean;
  explanation?: string;
}

export interface CS1Quiz {
  quizNumber: number;
  lessonRange: [number, number];
  questions: CS1QuizQuestion[];
}

export const CS1_QUIZZES: CS1Quiz[] = [
  {
    quizNumber: 1,
    lessonRange: [1, 8],
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which command moves your hero to the right?',
        options: ['hero.moveLeft()', 'hero.moveRight()', 'hero.moveUp()', 'hero.jump()'],
        answer: 'hero.moveRight()',
        explanation: 'hero.moveRight() moves the hero to the right.'
      },
      {
        type: 'true-false',
        question: 'A for-loop can be used to repeat a command multiple times.',
        answer: true,
        explanation: 'For-loops are used for repeating actions.'
      },
      {
        type: 'code-fill',
        question: 'Fill in the blank to collect a gem when your hero is on it: if (hero.isOnGem()) { _____; }',
        answer: 'hero.collect()',
        explanation: 'hero.collect() picks up the gem.'
      },
      {
        type: 'multiple-choice',
        question: 'What is the purpose of a variable in programming?',
        options: ['To store values', 'To move the hero', 'To draw graphics', 'To play music'],
        answer: 'To store values',
        explanation: 'Variables store and reuse values in code.'
      },
      {
        type: 'true-false',
        question: 'if-statements allow your code to make decisions.',
        answer: true,
        explanation: 'if-statements are used for decision-making.'
      },
      {
        type: 'short-answer',
        question: 'Name one command you can use to move your hero.',
        answer: 'hero.moveUp(), hero.moveDown(), hero.moveLeft(), hero.moveRight()',
        explanation: 'Any of the movement commands are correct.'
      },
      {
        type: 'multiple-choice',
        question: 'Which of these is NOT a direction command?',
        options: ['hero.moveUp()', 'hero.moveDown()', 'hero.moveLeft()', 'hero.collect()'],
        answer: 'hero.collect()',
        explanation: 'hero.collect() is for collecting, not moving.'
      },
      {
        type: 'code-fill',
        question: 'Write a for-loop that moves the hero right 3 times.',
        answer: 'for (let i = 0; i < 3; i++) hero.moveRight();',
        explanation: 'This loop repeats the moveRight command 3 times.'
      }
    ]
  },
  {
    quizNumber: 2,
    lessonRange: [9, 16],
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which command is used to attack an enemy?',
        options: ['hero.collect()', 'hero.attack()', 'hero.moveRight()', 'hero.heal()'],
        answer: 'hero.attack()',
        explanation: 'hero.attack() is used for combat.'
      },
      {
        type: 'true-false',
        question: 'A while-loop repeats as long as its condition is true.',
        answer: true,
        explanation: 'While-loops continue until the condition is false.'
      },
      {
        type: 'code-fill',
        question: 'Fill in the blank: if (!tile.isHazard) { _____; }',
        answer: 'hero.move()',
        explanation: 'Move only if the tile is not a hazard.'
      },
      {
        type: 'multiple-choice',
        question: 'What does hero.health < 50 check?',
        options: ['If health is more than 50', 'If health is less than 50', 'If health is exactly 50', 'If hero is dead'],
        answer: 'If health is less than 50',
        explanation: 'The < operator checks for less than.'
      },
      {
        type: 'true-false',
        question: 'You can use if-statements to avoid traps.',
        answer: true,
        explanation: 'if-statements help avoid hazards.'
      },
      {
        type: 'short-answer',
        question: 'What command would you use to pick up an item?',
        answer: 'hero.collect()',
        explanation: 'hero.collect() is for picking up items.'
      },
      {
        type: 'multiple-choice',
        question: 'Which loop repeats until a goal is met?',
        options: ['for-loop', 'while-loop', 'do-while', 'repeat-loop'],
        answer: 'while-loop',
        explanation: 'while-loops repeat until a condition is met.'
      },
      {
        type: 'code-fill',
        question: 'Write a while-loop that moves the hero right until at the exit.',
        answer: 'while (!hero.atExit()) { hero.moveRight(); }',
        explanation: 'This loop continues until the hero reaches the exit.'
      }
    ]
  },
  {
    quizNumber: 3,
    lessonRange: [17, 24],
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which command lets you switch your hero character?',
        options: ['hero.switch()', 'hero.changeClass()', 'hero.setType()', 'hero.transform()'],
        answer: 'hero.switch()',
        explanation: 'hero.switch() is used to change your hero.'
      },
      {
        type: 'true-false',
        question: 'Functions help you organize and reuse code.',
        answer: true,
        explanation: 'Functions are for code organization and reuse.'
      },
      {
        type: 'code-fill',
        question: 'Fill in the blank: function greet() { _____ }',
        answer: 'console.log("Hello!")',
        explanation: 'console.log prints a message.'
      },
      {
        type: 'multiple-choice',
        question: 'What is an argument in a function?',
        options: ['A variable', 'A value you pass to a function', 'A loop', 'A class'],
        answer: 'A value you pass to a function',
        explanation: 'Arguments are values passed to functions.'
      },
      {
        type: 'true-false',
        question: 'Arrays can store multiple values.',
        answer: true,
        explanation: 'Arrays are collections of values.'
      },
      {
        type: 'short-answer',
        question: 'Name a command to print something to the console.',
        answer: 'console.log()',
        explanation: 'console.log() outputs to the console.'
      },
      {
        type: 'multiple-choice',
        question: 'Which of these is NOT a function?',
        options: ['moveHero()', 'collectGem()', 'ifStatement', 'attackEnemy()'],
        answer: 'ifStatement',
        explanation: 'ifStatement is a conditional, not a function.'
      },
      {
        type: 'code-fill',
        question: 'Write a function that returns 5.',
        answer: 'function giveFive() { return 5; }',
        explanation: 'This function returns the number 5.'
      }
    ]
  },
  {
    quizNumber: 4,
    lessonRange: [25, 32],
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which command creates an object?',
        options: ['let obj = {}', 'let obj = []', 'let obj = "object"', 'let obj = 0'],
        answer: 'let obj = {}',
        explanation: 'Curly braces create an object.'
      },
      {
        type: 'true-false',
        question: 'Objects can have properties and methods.',
        answer: true,
        explanation: 'Objects store data and functions.'
      },
      {
        type: 'code-fill',
        question: 'Fill in the blank: let arr = [1, 2, 3]; arr._____(4);',
        answer: 'push',
        explanation: 'arr.push(4) adds 4 to the array.'
      },
      {
        type: 'multiple-choice',
        question: 'What does error handling help with?',
        options: ['Making code faster', 'Catching mistakes', 'Drawing graphics', 'Moving the hero'],
        answer: 'Catching mistakes',
        explanation: 'Error handling catches and manages mistakes.'
      },
      {
        type: 'true-false',
        question: 'You can use try/catch to handle errors.',
        answer: true,
        explanation: 'try/catch is for error handling.'
      },
      {
        type: 'short-answer',
        question: 'Name a property you might find on a hero object.',
        answer: 'health, name, class, level',
        explanation: 'Common properties for a hero object.'
      },
      {
        type: 'multiple-choice',
        question: 'Which of these is an array method?',
        options: ['push', 'move', 'attack', 'switch'],
        answer: 'push',
        explanation: 'push is an array method.'
      },
      {
        type: 'code-fill',
        question: 'Write a try/catch block that catches an error.',
        answer: 'try { /* code */ } catch (e) { /* handle error */ }',
        explanation: 'try/catch is used for error handling.'
      }
    ]
  },
  {
    quizNumber: 5,
    lessonRange: [33, 40],
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which command helps you repeat code until a condition is met?',
        options: ['for-loop', 'while-loop', 'if-statement', 'switch'],
        answer: 'while-loop',
        explanation: 'while-loops repeat until a condition is false.'
      },
      {
        type: 'true-false',
        question: 'Pattern recognition helps you solve problems faster.',
        answer: true,
        explanation: 'Recognizing patterns is key to coding.'
      },
      {
        type: 'code-fill',
        question: 'Fill in the blank: if (score > highScore) { highScore = _____; }',
        answer: 'score',
        explanation: 'Assign the new high score.'
      },
      {
        type: 'multiple-choice',
        question: 'What is code optimization?',
        options: ['Making code run faster', 'Making code look pretty', 'Adding more comments', 'Making code longer'],
        answer: 'Making code run faster',
        explanation: 'Optimization improves performance.'
      },
      {
        type: 'true-false',
        question: 'You should always test your code after making changes.',
        answer: true,
        explanation: 'Testing ensures your code works.'
      },
      {
        type: 'short-answer',
        question: 'Name a way to debug your code.',
        answer: 'console.log, breakpoints, step-through',
        explanation: 'These are common debugging techniques.'
      },
      {
        type: 'multiple-choice',
        question: 'Which of these is NOT a good coding practice?',
        options: ['Testing code', 'Using clear names', 'Ignoring errors', 'Organizing code'],
        answer: 'Ignoring errors',
        explanation: 'Ignoring errors is not a good practice.'
      },
      {
        type: 'code-fill',
        question: 'Write a for-loop that counts from 1 to 5.',
        answer: 'for (let i = 1; i <= 5; i++) { /* code */ }',
        explanation: 'This loop counts from 1 to 5.'
      }
    ]
  }
]; 