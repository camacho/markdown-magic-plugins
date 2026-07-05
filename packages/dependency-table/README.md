# Dependency table

Add a table of dependencies to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-dependency-table --save-dev
```

## Adding the plugin

See `example.ts` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.ts) -->

```ts
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import DEPENDENCYTABLE from './index.ts';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    DEPENDENCYTABLE,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (DEPENDENCYTABLE) -->

| **Dependency**                                                                                      | **Description**                                                        | **Version** | **License** | **Type**   |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- | ----------- | ---------- |
| [find-up@^8.0.0](https://github.com/sindresorhus/find-up)                                           | Find a file or directory by walking up parent directories              | 8.0.0       | MIT         | production |
| [semver@^7.0.0](https://github.com/git+https://github.com/npm/node-semver)                          | The semantic version parser used by npm.                               | 7.8.5       | ISC         | production |
| [markdown-magic@^4](https://github.com/DavidWells/markdown-magic#readme)                            | Automatically update markdown files with content from external sources | 4.10.5      | MIT         | peer       |
| [@types/node@^24.13....](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node) | TypeScript definitions for node                                        | 24.13.2     | MIT         | dev        |
| [@types/semver@^7.7.1](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/semver) | TypeScript definitions for semver                                      | 7.7.1       | MIT         | dev        |
| [markdown-magic@^4.0.0](https://github.com/DavidWells/markdown-magic#readme)                        | Automatically update markdown files with content from external sources | 4.10.5      | MIT         | dev        |
| [prettier@^3.0.0](https://prettier.io)                                                              | Prettier is an opinionated code formatter                              | 3.9.1       | MIT         | dev        |
| [typescript@^6.0.3](https://www.typescriptlang.org/)                                                | TypeScript is a language for application scale JavaScript development  | 6.0.3       | Apache-2.0  | dev        |
| [vitest@^4.0.0](https://vitest.dev)                                                                 | Next generation testing framework powered by Vite                      | 4.1.9       | MIT         | dev        |

<!-- AUTO-GENERATED-CONTENT:END -->

## Options

- production (false) - include production dependencies
- dev (false) - include development dependencies
- optional (false) - include optional dependencies
- peer (false) - include peer dependencies
