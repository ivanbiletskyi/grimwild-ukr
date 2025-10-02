import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to copy markdown files to public directory
function copyMarkdownFiles() {
  const sourceDir = path.join(__dirname, '..');
  const publicDir = path.join(__dirname, 'public');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy player directory
  const playerDir = path.join(sourceDir, 'player');
  const publicPlayerDir = path.join(publicDir, 'player');
  if (fs.existsSync(playerDir)) {
    copyDirRecursive(playerDir, publicPlayerDir);
  }

  // Copy GM directory
  const gmDir = path.join(sourceDir, 'GM');
  const publicGmDir = path.join(publicDir, 'GM');
  if (fs.existsSync(gmDir)) {
    copyDirRecursive(gmDir, publicGmDir);
  }

  // Copy glossary
  const glossaryFile = path.join(sourceDir, 'glossary.md');
  const publicGlossaryFile = path.join(publicDir, 'glossary.md');
  if (fs.existsSync(glossaryFile)) {
    fs.copyFileSync(glossaryFile, publicGlossaryFile);
  }

  console.log('Markdown files copied to public directory');
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg') || entry.name.endsWith('.gif') || entry.name.endsWith('.svg'))) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run the copy function
copyMarkdownFiles();

// Check if --watch flag is passed
const shouldWatch = process.argv.includes('--watch');

if (shouldWatch) {
  // Watch for changes in markdown files (but exclude the website directory)
  const sourceDir = path.join(__dirname, '..');
  let isProcessing = false;

  const watcher = fs.watch(sourceDir, { recursive: true }, (eventType, filename) => {
    // Ignore if already processing or if file is in website directory
    if (isProcessing || !filename || filename.startsWith('website')) {
      return;
    }

    // Only process .md and image files
    if (filename.endsWith('.md') || filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.gif') || filename.endsWith('.svg')) {
      console.log(`File changed: ${filename}`);
      isProcessing = true;
      
      // Debounce: wait a bit before copying to avoid multiple rapid triggers
      setTimeout(() => {
        copyMarkdownFiles();
        isProcessing = false;
      }, 100);
    }
  });

  console.log('Watching for markdown file changes...');

  // Keep the script running
  process.on('SIGINT', () => {
    console.log('Stopping markdown file watcher...');
    watcher.close();
    process.exit(0);
  });
}
