# `package.json` scripts

Add a table of scripts from `package.json` to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
yarn add -D markdown-magic markdown-magic-package-scripts
```

## Adding the plugin

See `example.ts` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.ts) -->

```ts
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
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (SCRIPTS) -->

| Script     | Description                         |
| ---------- | ----------------------------------- |
| `prebuild` | `rm -rf dist`                       |
| `build`    | `tsc --project tsconfig.build.json` |
| `docs`     | generate docs                       |
| `empty`    | `echo "this is just an example"`    |
| `format`   | format code                         |
| `prepack`  | `pnpm build`                        |
| `test`     | `vitest run`                        |

<!-- AUTO-GENERATED-CONTENT:END -->
