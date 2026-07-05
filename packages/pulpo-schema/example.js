import path from 'path';
import Pulpo from 'pulpo';
import { markdownMagic } from 'markdown-magic';
import SCHEMA from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    SCHEMA: SCHEMA(
      new Pulpo({
        host: {
          description: 'Host for the server',
          type: 'string',
          default: 'localhost',
          argv: 'host',
        },
        port: {
          description: 'Port for dev server to run on',
          type: 'number',
          default: '3000',
          env: 'PORT',
        },
      }),
    ),
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
