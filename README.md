# markdown-magic-plugins

A pnpm monorepo of transform plugins for [markdown-magic](https://github.com/DavidWells/markdown-magic).

This README is itself generated with `markdown-magic` and the `markdown-magic-subpackage-list`
plugin — see `example.js`.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->

```js
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import SUBPACKAGELIST from 'markdown-magic-subpackage-list';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    SUBPACKAGELIST,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Packages

<!-- AUTO-GENERATED-CONTENT:START (SUBPACKAGELIST:verbose=true) -->

- [markdown-magic-dependency-table](packages/dependency-table) - Generate table of information about dependencies automatically in markdown
- [markdown-magic-directory-tree](packages/directory-tree) - Print an archy tree for markdown file
- [markdown-magic-engines](packages/engines) - Render engine requirements in Markdown files via Markdown Magic
- [markdown-magic-install-command](packages/install-command) - Print install command for markdown file
- [markdown-magic-last-modified](packages/last-modified) - Print the last modified date using git for a given file
- [markdown-magic-package-scripts](packages/package-scripts) - Print list of scripts in package.json with descriptions
- [markdown-magic-prettier](packages/prettier) - Prettify JS blocks
- [markdown-magic-pulpo-schema](packages/pulpo-schema) - Document configurations built with Pulpo
- [markdown-magic-subpackage-list](packages/subpackage-list) - Print a list of subpackages for markdown file
- [markdown-magic-template](packages/template) - Lodash template support via Markdown Magic
- [markdown-magic-version-badge](packages/version-badge) - Version badge via Markdown Magic

<!-- AUTO-GENERATED-CONTENT:END -->

## Development

```
pnpm install
pnpm test
pnpm run docs
```

## License

MIT
