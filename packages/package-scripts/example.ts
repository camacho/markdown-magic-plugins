import path from 'path';
import { markdownMagic } from 'markdown-magic';
import SCRIPTS from './index.ts';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    SCRIPTS,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
