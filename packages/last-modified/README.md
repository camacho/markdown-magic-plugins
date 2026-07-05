# Install command plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-last-modified --save-dev
```

## Adding the plugin

See `example.ts` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.ts) -->

```ts
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import LASTMODIFIED from './index.ts';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    LASTMODIFIED,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (LASTMODIFIED) -->

**packages/last-modified/README.md** last modified Sun Jul 5 09:09:00 2026 +0200
<!-- AUTO-GENERATED-CONTENT:END -->

## Options

- **file** (current file by default) - file to get last modified date from (relative to the Markdown file)
