import { execFileSync } from 'child_process';
import path from 'path';
import type { TransformArgs } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

export default function LASTMODIFIED({
  content,
  options = {},
  srcPath,
}: TransformArgs): string {
  let filePath: string;

  if (options.file) {
    filePath = path.resolve(path.dirname(srcPath), options.file);
  } else {
    filePath = path.resolve(srcPath);
  }

  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
  }).trim();

  const relativeFilePath = path.relative(root, filePath);
  const lastModified = execFileSync(
    'git',
    ['log', '-1', '--format=%ad', '--', filePath],
    { encoding: 'utf8' },
  ).trim();

  if (!lastModified) return content;

  return `**${relativeFilePath}** last modified ${lastModified}`;
}
