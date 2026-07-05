import { readFileSync } from 'fs';
import path from 'path';
import template from 'lodash.template';
import type { TransformArgs } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

export default function factory(data: Record<string, unknown>) {
  return function TEMPLATE({
    content: _content,
    options = {},
    srcPath,
  }: TransformArgs): string {
    if (!options.src) {
      throw new Error('markdown-magic-template: options.src is required');
    }

    const filepath = path.resolve(path.dirname(srcPath), options.src);
    const compiled = template(readFileSync(filepath, 'utf8'));

    return compiled(data);
  };
}
