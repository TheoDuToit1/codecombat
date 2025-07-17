import fs from 'fs';
import path from 'path';

const EXCLUDE_FOLDERS = ['node_modules', '.git', 'dist', 'build'];
const ROOT_DIR = process.cwd();
const summaryLines = [];

function walk(dir, depth = 0) {
  const indent = '  '.repeat(depth);
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!EXCLUDE_FOLDERS.includes(file)) {
        summaryLines.push(`${indent}- 📁 ${file}`);
        walk(fullPath, depth + 1);
      }
    } else {
      summaryLines.push(`${indent}- 📄 ${file}`);
    }
  }
}

walk(ROOT_DIR);
fs.writeFileSync('PROJECT_SUMMARY.md', summaryLines.join('\n'), 'utf-8');

console.log('✅ Project summary written to PROJECT_SUMMARY.md'); 