import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable or use a fallback
// IMPORTANT: Set OPENAI_API_KEY in your environment or .env file
const API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Read the project summary before asking the question
const projectSummary = fs.readFileSync('PROJECT_SUMMARY.md', 'utf-8');
const introMessage = {
  role: 'system',
  content: `You are coding inside a Gauntlet-style dungeon game. Here's the full project summary:\n\n${projectSummary}`,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Check if API key is available
if (!API_KEY) {
  console.error('❌ Error: No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.');
  console.log('You can create a .env file in the root directory with:');
  console.log('OPENAI_API_KEY=your_api_key_here');
  rl.close();
} else {
  rl.question('What code should I generate?\n', async (yourRequest) => {
    try {
      console.log('Sending request to OpenAI...');
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          introMessage,
          { role: 'user', content: yourRequest },
        ],
      });

      const code = response.choices[0].message.content;
      console.log('\nCode generated successfully!');

      rl.question('Which file should I write it to? (example: src/enemies/AngryPea.ts)\n', (filePath) => {
        try {
          // Create directory structure if it doesn't exist
          const directory = filePath.substring(0, filePath.lastIndexOf('/'));
          if (directory && !fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }
          
          fs.writeFileSync(filePath, code);
          console.log(`✅ Code saved to ${filePath}`);
        } catch (error) {
          console.error(`❌ Error saving file: ${error.message}`);
        } finally {
          rl.close();
        }
      });
    } catch (error) {
      console.error(`❌ Error generating code: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data: ${JSON.stringify(error.response.data)}`);
      }
      rl.close();
    }
  });
}
 