import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { emojis } from './emojis.js';

const resolve = (...args) => path.resolve(__dirname, '../public', ...args);

const cleanup = async dir => {
  try {
    const stat = await fs.stat(dir);
    if (stat.isDirectory()) {
      await fs.rm(dir, { recursive: true, force: true });
    }
  } catch (e) {}
};

const run = async () => {
  const dir = resolve('images');

  await cleanup(dir);

  await fs.mkdir(dir);
};

run();
