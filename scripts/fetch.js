import { emojis } from './emojis.js';
import fs from 'fs/promises';
import path from 'path';
import download from 'download';
import got from 'got';
import { fileURLToPath } from 'url';
import { getHeapCodeStatistics } from 'v8';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolve = (...args) => path.resolve(__dirname, ...args);
const getEmojiUrl = emoji => `http://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u${emoji}.svg`;
const getMixedEmojiUrl = (emoji1, emoji2) =>
  `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${emoji1}/u${emoji1}_u${emoji2}.png`;

const head = got.extend({
  method: 'HEAD',
});

const fetch = async (emoji1, emoji2) => {
  try {
    await head(getMixedEmojiUrl(emoji1, emoji2));
    return emoji2;
  } catch (e) {
    return null;
  }
};

const run = async () => {
  const last = Date.now();
  const result = {};

  const slice = 20;
  let start = 0;
  while (start < emojis.length) {
    console.log('index: ', start);
    await Promise.all(
      emojis.slice(start, start + slice).map(async emoji1 => {
        const res = await Promise.all(emojis.map(async emoji2 => fetch(emoji1, emoji2)));
        result[emoji1] = res.filter(Boolean);
        return undefined;
      }),
    );
    start += slice;
  }

  await fs.writeFile(resolve('./result.json'), JSON.stringify(result), 'utf-8');
  console.log('time cost: ', Date.now() - last, 'ms');
};

run();
