import { describe, expect, it } from 'vitest';
import format from './index.ts';

function wrapCode(code: string, header = '```js', footer = '```'): string {
  return [header, code, footer].join('\n');
}

describe('markdown-magic-prettier', () => {
  it('formats code blocks', async () => {
    const code = 'console.log("hello world")';
    expect(
      await format({ content: wrapCode(code), options: {}, srcPath: '' }),
    ).toMatchSnapshot();
  });

  it('returns original content if codeblock is not found', async () => {
    expect(
      await format({ content: 'foo bar', options: {}, srcPath: '' }),
    ).toMatchSnapshot();
    expect(
      await format({ content: '```', options: {}, srcPath: '' }),
    ).toMatchSnapshot();
  });

  it('adds a closing tag if it is forgotten', async () => {
    const code = 'console.log("hello world")';
    expect(
      await format({
        content: wrapCode(code, '```', ''),
        options: {},
        srcPath: '',
      }),
    ).toMatchSnapshot();
  });
});
