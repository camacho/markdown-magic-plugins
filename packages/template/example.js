import path from 'path';
import { markdownMagic } from 'markdown-magic';
import TEMPLATE from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    TEMPLATE: TEMPLATE({ name: 'world' }),
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
