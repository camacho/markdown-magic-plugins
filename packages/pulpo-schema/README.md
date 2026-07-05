# Schema plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-install-command --save-dev
```

## Adding the plugin

See `example.ts` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.ts) -->

```ts
import path from 'path';
import Pulpo from 'pulpo';
import { markdownMagic } from 'markdown-magic';
import SCHEMA from './index.ts';

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
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (SCHEMA) -->

- **host** (string) - Host for the server
  - _default_ - localhost
  - _argv_ - host
- **port** (number) - Port for dev server to run on
  - _default_ - 3000
  - _env_ - PORT

<!-- AUTO-GENERATED-CONTENT:END -->
