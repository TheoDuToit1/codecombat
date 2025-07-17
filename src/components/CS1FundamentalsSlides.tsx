import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Code, BookOpen, Info, CheckCircle, Lightbulb, Target } from 'lucide-react';

// Define the programming fundamentals content
const PROGRAMMING_FUNDAMENTALS = [
  {
    id: 1,
    title: "Algorithms",
    description: "Step-by-step instructions to solve problems",
    explanation: "An algorithm is like a recipe for your computer to follow. Just like when you bake cookies, you follow steps in order: mix ingredients, shape the dough, bake in the oven. Computers follow your coding recipe exactly as written!",
    example: "// Algorithm for making a sandwich\n1. Get two slices of bread\n2. Spread peanut butter on one slice\n3. Spread jelly on the other slice\n4. Put the slices together\n5. Enjoy your sandwich!",
    image: "algorithm_steps.png",
    color: "from-blue-500 to-blue-700"
  },
  {
    id: 2,
    title: "Syntax",
    description: "The rules for writing correct code",
    explanation: "Syntax is like the grammar rules of coding. Just like you need to use periods and capital letters when writing sentences, code has special symbols and rules. If you make a syntax mistake, the computer gets confused!",
    example: "// Correct syntax\nhero.moveRight();\n\n// Wrong syntax\nhero.moveRight;  // Missing parentheses\nHero.moveright();  // Wrong capitalization",
    image: "syntax_example.png",
    color: "from-purple-500 to-purple-700"
  },
  {
    id: 3,
    title: "Sequences",
    description: "Executing commands in order",
    explanation: "A sequence is a series of actions that happen in order, one after another. Computers follow your code from top to bottom, just like you read a book from top to bottom. The order of your code matters!",
    example: "// This sequence matters!\nhero.moveRight();\nhero.moveRight();\nhero.attack();",
    image: "sequence_steps.png",
    color: "from-green-500 to-green-700"
  },
  {
    id: 4,
    title: "Loops",
    description: "Repeating actions multiple times",
    explanation: "Loops are like a merry-go-round for your code. Instead of writing the same instruction over and over, you can tell the computer to repeat it a certain number of times. This saves time and makes your code shorter!",
    example: "// Instead of writing this:\nhero.moveRight();\nhero.moveRight();\nhero.moveRight();\n\n// Use a loop:\nfor (let i = 0; i < 3; i++) {\n  hero.moveRight();\n}",
    image: "loop_example.png",
    color: "from-yellow-500 to-yellow-700"
  },
  {
    id: 5,
    title: "Variables",
    description: "Storing and reusing values",
    explanation: "Variables are like labeled boxes where you can store things to use later. You can put a number, word, or other information in the box, and then use the label to get it back whenever you need it!",
    example: "// Creating a variable to store a number\nlet steps = 3;\n\n// Using the variable\nfor (let i = 0; i < steps; i++) {\n  hero.moveRight();\n}",
    image: "variable_box.png",
    color: "from-red-500 to-red-700"
  },
  {
    id: 6,
    title: "Functions",
    description: "Grouping code into reusable blocks",
    explanation: "Functions are like special machines that do a specific job. You build the machine once, give it a name, and then you can use it over and over again just by calling its name. Functions help keep your code organized!",
    example: "// Creating a function\nfunction moveAndAttack() {\n  hero.moveRight();\n  hero.attack();\n}\n\n// Using the function\nmoveAndAttack();\nmoveAndAttack();",
    image: "function_machine.png",
    color: "from-indigo-500 to-indigo-700"
  },
  {
    id: 7,
    title: "Arguments",
    description: "Passing information to functions",
    explanation: "Arguments are like special instructions you give to a function. Imagine asking a robot to get you a drink - you need to tell it WHICH drink! Arguments let you customize how a function works each time you use it.",
    example: "// Function with an argument\nfunction move(direction) {\n  if (direction === 'right') {\n    hero.moveRight();\n  } else if (direction === 'left') {\n    hero.moveLeft();\n  }\n}\n\n// Using arguments\nmove('right');\nmove('left');",
    image: "function_arguments.png",
    color: "from-pink-500 to-pink-700"
  },
  {
    id: 8,
    title: "Properties",
    description: "Accessing information about objects",
    explanation: "Properties are like special facts about an object. Just like you have properties (height, hair color, age), objects in code have properties too! You can check these properties to make smart decisions in your code.",
    example: "// Checking the hero's health property\nif (hero.health < 50) {\n  hero.moveToPotion();\n}\n\n// Other examples of properties\nhero.pos.x  // The hero's x position\nhero.name   // The hero's name",
    image: "object_properties.png",
    color: "from-teal-500 to-teal-700"
  }
];

interface CS1FundamentalsSlidesProps {
  onClose?: () => void;
}

export const CS1FundamentalsSlides: React.FC<CS1FundamentalsSlidesProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev' | ''>('');
  
  const goToNextSlide = () => {
    if (currentSlideIndex < PROGRAMMING_FUNDAMENTALS.length - 1) {
      setAnimationDirection('next');
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  
  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setAnimationDirection('prev');
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, onClose]);
  
  const currentSlide = PROGRAMMING_FUNDAMENTALS[currentSlideIndex];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Navigation controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-4">
        <button 
          onClick={goToPrevSlide}
          disabled={currentSlideIndex === 0}
          className={`p-3 rounded-full ${
            currentSlideIndex === 0 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-900 hover:bg-gray-200'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="text-white text-sm">
          {currentSlideIndex + 1} / {PROGRAMMING_FUNDAMENTALS.length}
        </div>
        
        <button 
          onClick={goToNextSlide}
          disabled={currentSlideIndex === PROGRAMMING_FUNDAMENTALS.length - 1}
          className={`p-3 rounded-full ${
            currentSlideIndex === PROGRAMMING_FUNDAMENTALS.length - 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-900 hover:bg-gray-200'
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Slide content */}
      <div 
        className={`w-full max-w-6xl max-h-[90vh] overflow-hidden relative ${
          animationDirection === 'next' 
            ? 'animate-slide-left' 
            : animationDirection === 'prev' 
              ? 'animate-slide-right' 
              : ''
        }`}
        onAnimationEnd={() => setAnimationDirection('')}
      >
        {/* Title slide */}
        {currentSlideIndex === 0 ? (
          <div className={`bg-gradient-to-br ${currentSlide.color} text-white p-16 rounded-2xl shadow-2xl`}>
            <h1 className="text-5xl font-bold mb-6">Programming Fundamentals</h1>
            <p className="text-2xl opacity-90 mb-8">
              Let's learn the building blocks of coding!
            </p>
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white bg-opacity-20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">What We'll Learn</h3>
                <ul className="space-y-2">
                  {PROGRAMMING_FUNDAMENTALS.map(concept => (
                    <li key={concept.id} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                      <span>{concept.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Why This Matters</h3>
                <p className="text-lg">
                  Understanding these fundamentals will help you solve problems, create games, and build amazing things with code! 
                </p>
                <p className="text-lg mt-4">
                  These are the same concepts used by professional programmers every day!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Concept header */}
            <div className={`bg-gradient-to-r ${currentSlide.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-80">Fundamental #{currentSlide.id}</h2>
                  <h1 className="text-3xl font-bold">{currentSlide.title}</h1>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {currentSlide.description}
                </div>
              </div>
            </div>
            
            {/* Concept content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Explanation */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center text-blue-600 mb-2">
                      <Info className="w-5 h-5 mr-2" />
                      <h3 className="font-medium">What Is It?</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {currentSlide.explanation}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-green-600 mb-2">
                      <Target className="w-5 h-5 mr-2" />
                      <h3 className="font-medium">Why It's Important</h3>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">
                          {currentSlide.title === "Algorithms" && "Helps you break down big problems into smaller steps"}
                          {currentSlide.title === "Syntax" && "Helps the computer understand what you want it to do"}
                          {currentSlide.title === "Sequences" && "Makes your code predictable and logical"}
                          {currentSlide.title === "Loops" && "Saves time and makes your code shorter and cleaner"}
                          {currentSlide.title === "Variables" && "Lets you store information to use later in your code"}
                          {currentSlide.title === "Functions" && "Makes your code organized and reusable"}
                          {currentSlide.title === "Arguments" && "Makes your functions flexible and more powerful"}
                          {currentSlide.title === "Properties" && "Helps you make smart decisions based on information"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">
                          {currentSlide.title === "Algorithms" && "Makes complex tasks manageable"}
                          {currentSlide.title === "Syntax" && "Prevents errors in your code"}
                          {currentSlide.title === "Sequences" && "Ensures your code runs in the correct order"}
                          {currentSlide.title === "Loops" && "Helps when you need to repeat actions many times"}
                          {currentSlide.title === "Variables" && "Makes your code more flexible and dynamic"}
                          {currentSlide.title === "Functions" && "Lets you avoid repeating the same code"}
                          {currentSlide.title === "Arguments" && "Lets one function do many different things"}
                          {currentSlide.title === "Properties" && "Gives you important information about game objects"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-amber-600 mb-2">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      <h3 className="font-medium">Remember This</h3>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-gray-700">
                      {currentSlide.title === "Algorithms" && "Think of algorithms as step-by-step recipes for your computer to follow!"}
                      {currentSlide.title === "Syntax" && "Just like spelling matters in words, syntax matters in code!"}
                      {currentSlide.title === "Sequences" && "Order matters! The computer follows your instructions from top to bottom."}
                      {currentSlide.title === "Loops" && "Loops are like saying 'do this X times' instead of writing the same code over and over."}
                      {currentSlide.title === "Variables" && "Variables are like labeled boxes that store information for later use."}
                      {currentSlide.title === "Functions" && "Functions are like mini-programs you can call whenever you need them."}
                      {currentSlide.title === "Arguments" && "Arguments are like giving specific instructions to your functions."}
                      {currentSlide.title === "Properties" && "Properties tell you important information about objects in your game."}
                    </div>
                  </div>
                </div>
                
                {/* Right column - Code example */}
                <div>
                  <div className="flex items-center text-purple-600 mb-2">
                    <Code className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Code Example</h3>
                  </div>
                  <div className="bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-96">
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {currentSlide.example}
                    </pre>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center text-blue-700 mb-2">
                      <BookOpen className="w-5 h-5 mr-2" />
                      <h3 className="font-medium">Try It Yourself!</h3>
                    </div>
                    <div className="text-gray-700">
                      {currentSlide.title === "Algorithms" && "Think about the steps to make a peanut butter and jelly sandwich. Can you write them down in order?"}
                      {currentSlide.title === "Syntax" && "Try to spot what's wrong with this code: hero.moveright)"}
                      {currentSlide.title === "Sequences" && "What would happen if you switched the order of these commands? hero.attack(); hero.moveRight();"}
                      {currentSlide.title === "Loops" && "How would you use a loop to move the hero right 5 times?"}
                      {currentSlide.title === "Variables" && "Create a variable called 'enemyCount' and set it to 3"}
                      {currentSlide.title === "Functions" && "Can you create a function called 'jumpThreeTimes' that makes the hero jump three times?"}
                      {currentSlide.title === "Arguments" && "How would you modify a 'move' function to accept a direction and number of steps?"}
                      {currentSlide.title === "Properties" && "What hero properties might be useful to check during a game? (Think: health, position, etc.)"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 