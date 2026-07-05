import Pulpo from 'pulpo';
import { describe, expect, it } from 'vitest';
import factory from './index.js';

describe('markdown-magic-pulpo-schema', () => {
  it('renders documentation for a pulpo schema', () => {
    const SCHEMA = factory(
      new Pulpo({
        host: {
          description: 'Host for the server',
          type: 'string',
          default: 'localhost',
          argv: 'host',
        },
        port: {
          description: 'Port for dev server to run on',
          type: 'number',
          default: '3000',
          env: 'PORT',
        },
      }),
    );

    expect(SCHEMA({ content: 'original' })).toBe(
      [
        '* **host** (string) - Host for the server',
        '  * *default* - localhost',
        '  * *argv* - host',
        '* **port** (number) - Port for dev server to run on',
        '  * *default* - 3000',
        '  * *env* - PORT',
      ].join('\n'),
    );
  });

  it('returns original content when the schema has no properties', () => {
    const SCHEMA = factory(new Pulpo({}));

    expect(SCHEMA({ content: 'untouched' })).toBe('untouched');
  });
});
