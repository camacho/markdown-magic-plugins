import path from 'path';
import { describe, expect, it } from 'vitest';
import format from './index.ts';

const srcPath = path.join(import.meta.dirname, 'README.md');

describe('markdown-magic-engines', () => {
  it('renders engines from nearest package.json', () => {
    expect(format({ content: 'foo', options: {}, srcPath })).toMatchSnapshot();
  });

  it('returns original content when package.json has no engines field', () => {
    expect(
      format({
        content: 'untouched',
        options: { pkg: './__fixtures__/no-engines/package.json' },
        srcPath,
      }),
    ).toBe('untouched');
  });

  it('resolves options.pkg relative to the dirname of srcPath and renders one line per engines entry, in key order', () => {
    expect(
      format({
        content: 'foo',
        options: { pkg: './__fixtures__/with-engines/package.json' },
        srcPath,
      }),
    ).toBe('- **npm**: >=10.0.0\n- **node**: >=20.0.0\n- **yarn**: >=4.0.0');
  });

  it('walks up from a nested srcPath to find package.json', () => {
    const nestedSrcPath = path.join(
      import.meta.dirname,
      '__fixtures__/nested-pkg/deep/nested/dir/README.md',
    );

    expect(
      format({ content: 'foo', options: {}, srcPath: nestedSrcPath }),
    ).toBe('- **node**: >=16.0.0');
  });

  it('throws when no package.json is found walking up from srcPath', () => {
    const unreachableSrcPath = path.join(
      '/private/tmp/claude-501',
      'README.md',
    );

    expect(() =>
      format({ content: 'foo', options: {}, srcPath: unreachableSrcPath }),
    ).toThrow('No package.json file found');
  });
});
