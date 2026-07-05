import path from 'path';
import { describe, expect, it } from 'vitest';
import factory from './index.ts';

const srcPath = path.join(import.meta.dirname, 'README.md');

describe('markdown-magic-template', () => {
  it('renders a lodash template with factory-supplied data', () => {
    const format = factory({ name: 'world' });

    expect(
      format({
        content: 'foo',
        options: { src: './template.md' },
        srcPath,
      }),
    ).toBe('## hello world!\n');
  });

  it('throws when options.src is missing', () => {
    const format = factory({ name: 'world' });

    expect(() =>
      format({ content: 'untouched', options: {}, srcPath }),
    ).toThrow('markdown-magic-template: options.src is required');
  });
});
