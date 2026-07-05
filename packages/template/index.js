import { readFileSync } from 'fs';
import path from 'path';
import template from 'lodash.template';

export default function factory(data) {
  return function TEMPLATE({ content, options = {}, srcPath }) {
    if (!options.src) {
      throw new Error('markdown-magic-template: options.src is required');
    }

    const filepath = path.resolve(path.dirname(srcPath), options.src);
    const compiled = template(readFileSync(filepath, 'utf8'));

    return compiled(data);
  };
}
