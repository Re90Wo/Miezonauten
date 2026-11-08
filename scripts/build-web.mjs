import { mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const webFiles = [
  'index.html',
  'style.css',
  'game.js',
  'manifest.json',
  'icon.svg',
  'sw.js',
];

const outputDirectory = 'www';
await mkdir(outputDirectory, { recursive: true });

for (const file of webFiles) {
  await copyFile(file, join(outputDirectory, file));
}
