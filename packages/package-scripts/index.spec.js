import path from 'path';
import { describe, expect, it } from 'vitest';
import format from './index.js';

const srcPath = path.join(import.meta.dirname, 'README.md');

describe('markdown-magic-package-scripts', () => {
  it('renders a table of scripts from the nearest package.json', () => {
    expect(format({ content: '', options: {}, srcPath })).toMatchSnapshot();
  });

  it('preserves existing descriptions from the current table content', () => {
    const content = [
      '| Script | Description |',
      '|--------|-------------|',
      '| `build` | compile the project |',
    ].join('\n');

    expect(
      format({
        content,
        options: { pkg: './__fixtures__/with-scripts/package.json' },
        srcPath,
      }),
    ).toBe(
      [
        '| Script | Description |',
        '|--------|-------------|',
        '| `build` | compile the project |',
        '| `test` | `vitest run` |',
      ].join('\n'),
    );
  });

  it('returns original content when package.json has no scripts field', () => {
    expect(
      format({
        content: 'untouched',
        options: { pkg: './__fixtures__/no-scripts/package.json' },
        srcPath,
      }),
    ).toBe('untouched');
  });
});
