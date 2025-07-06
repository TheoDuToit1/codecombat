const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

function askUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (input) => resolve(input));
  });
}

async function generateFeature(promptText) {
  const systemMessage = {
    role: "system",
    content: `You are an expert React + TypeScript game developer. Automatically generate code based on the user's prompt for a Gauntlet-style dungeon crawler.

- Classify the type of feature (enemy, item, mechanic, UI)
- Create a file name and location (e.g., src/enemies/BossWraith.ts)
- Use correct imports and clean modular logic
- Save to the proper directory automatically
- Do NOT inject into game loop or live logic unless asked
- Summarize what you created at the end`
  };

  const userMessage = {
    role: "user",
    content: promptText
  };

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [systemMessage, userMessage]
  });

  const generatedCode = response.data.choices[0].message.content;
  const fileName = `Feature_${Date.now()}.ts`;
  const outputDir = path.join(__dirname, "src", "auto");
  const outputPath = path.join(outputDir, fileName);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, generatedCode);

  console.log(`✅ Feature saved to: ${outputPath}`);
  rl.close();
}

async function main() {
  const prompt = await askUser("\n🧠 What feature do you want to build?\n> ");
  await generateFeature(prompt);
}

main(); 