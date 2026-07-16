#!/usr/bin/env node

// Wrapper script to allow: npm process <image-name>
// This passes all arguments after "process" to the main script
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all arguments (skip node and script name)
const args = process.argv.slice(2);

// Spawn the main process.js with all arguments
const child = spawn('node', [join(__dirname, 'process.js'), ...args], {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
