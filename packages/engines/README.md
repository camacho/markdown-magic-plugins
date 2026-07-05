# markdown-magic-engines

Print engine requirements from `package.json` via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
yarn add -D markdown-magic markdown-magic-engines
```

**Note:** [`markdown-magic`](https://github.com/DavidWells/markdown-magic) is a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies) and must be installed separately from this module

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->

```js
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import ENGINES from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    ENGINES,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->

- **node**: >=22.18.0

<!-- AUTO-GENERATED-CONTENT:END -->
