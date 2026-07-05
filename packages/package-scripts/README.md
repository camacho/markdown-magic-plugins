# `package.json` scripts

Add a table of scripts from `package.json` to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
yarn add -D markdown-magic markdown-magic-package-scripts
```

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->

```js
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import SCRIPTS from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    SCRIPTS,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (SCRIPTS) -->

| Script   | Description                      |
| -------- | -------------------------------- |
| `docs`   | generate docs                    |
| `empty`  | `echo "this is just an example"` |
| `format` | format code                      |
| `test`   | `vitest run`                     |

<!-- AUTO-GENERATED-CONTENT:END -->
