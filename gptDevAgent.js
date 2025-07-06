import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable
const API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Read the project summary and structure
const projectSummary = fs.readFileSync('PROJECT_SUMMARY.md', 'utf-8');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main function to run the GPT Dev Agent
async function runGptDevAgent() {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error('❌ Error: No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.');
      console.log('You can create a .env file in the root directory with:');
      console.log('OPENAI_API_KEY=your_api_key_here');
      rl.close();
      return;
    }

    // Get the feature description from the user
    const featureDescription = await askQuestion('🚀 Describe the feature you want to build (be detailed):\n');
    
    console.log('\n📊 Analyzing project structure...');
    
    // Get the project structure
    const projectStructure = await analyzeProjectStructure();
    
    console.log('🧠 Planning implementation strategy...');
    
    // Plan the implementation strategy
    const implementationPlan = await planImplementation(featureDescription, projectStructure);
    
    console.log('\n📝 Implementation Plan:');
    console.log(implementationPlan.plan);
    
    if (!await confirmQuestion('\n✅ Proceed with this implementation plan? (y/n): ')) {
      console.log('🛑 Implementation cancelled.');
      rl.close();
      return;
    }
    
    console.log('\n🔨 Generating code...');
    
    // Generate and save files
    for (const file of implementationPlan.files) {
      console.log(`\n📄 Generating ${file.path}...`);
      
      // Generate the file content
      const fileContent = await generateFileContent(
        featureDescription, 
        file.path, 
        file.description, 
        projectStructure
      );
      
      // Create directory if it doesn't exist
      const directory = path.dirname(file.path);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      
      // Save the file
      fs.writeFileSync(file.path, fileContent);
      console.log(`✅ Saved ${file.path}`);
    }
    
    console.log('\n🎉 Feature implementation complete!');
    console.log('\n🔍 Files created:');
    implementationPlan.files.forEach(file => {
      console.log(`  - ${file.path}`);
    });
    
    console.log('\n📚 Next steps:');
    console.log('  1. Review the generated code');
    console.log('  2. Run the development server with `npm run dev`');
    console.log('  3. Test the new feature');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
  } finally {
    rl.close();
  }
}

// Function to ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to confirm with the user
function confirmQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Function to analyze the project structure
async function analyzeProjectStructure() {
  // Get a list of important files to understand the project structure
  const importantPaths = [
    'src/components',
    'src/utils',
    'src/types',
    'src/data',
    'src/lib',
    'src/enemies'
  ];
  
  let projectStructure = {};
  
  for (const dirPath of importantPaths) {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      projectStructure[dirPath] = files;
    }
  }
  
  // Read the game types to understand the data structures
  if (fs.existsSync('src/types/game.ts')) {
    projectStructure.gameTypes = fs.readFileSync('src/types/game.ts', 'utf-8');
  }
  
  return projectStructure;
}

// Function to plan the implementation strategy
async function planImplementation(featureDescription, projectStructure) {
  console.log('Sending planning request to OpenAI...');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a senior game developer specializing in TypeScript/React game development. 
        You're working on a Gauntlet-style dungeon game. Your task is to plan the implementation of a new feature.
        
        Project summary:
        ${projectSummary}
        
        Project structure:
        ${JSON.stringify(projectStructure, null, 2)}
        
        Provide a detailed implementation plan that includes:
        1. A step-by-step plan for implementing the feature
        2. A list of files to create or modify
        3. A brief description of each file's purpose
        
        Format your response as a JSON object with the following structure:
        {
          "plan": "Detailed implementation plan as markdown text",
          "files": [
            {
              "path": "path/to/file.ts",
              "description": "Purpose of this file"
            }
          ]
        }`
      },
      {
        role: 'user',
        content: `I need to implement the following feature in the game:
        
        ${featureDescription}
        
        Please provide a detailed implementation plan.`
      }
    ],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content);
}

// Function to generate file content
async function generateFileContent(featureDescription, filePath, fileDescription, projectStructure) {
  console.log('Generating file content...');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a senior game developer specializing in TypeScript/React game development. 
        You're working on a Gauntlet-style dungeon game. Your task is to write code for a specific file.
        
        Project summary:
        ${projectSummary}
        
        Project structure:
        ${JSON.stringify(projectStructure, null, 2)}
        
        Write the complete content for the file. Follow these guidelines:
        1. Use TypeScript with proper typing
        2. Follow React best practices if it's a component
        3. Include all necessary imports
        4. Add helpful comments for complex logic
        5. Ensure the code integrates well with the existing codebase`
      },
      {
        role: 'user',
        content: `I need you to write the code for the file ${filePath} as part of implementing this feature:
        
        ${featureDescription}
        
        The purpose of this file is: ${fileDescription}
        
        Please provide the complete file content.`
      }
    ]
  });
  
  return response.choices[0].message.content;
}

// Run the GPT Dev Agent
runGptDevAgent();
