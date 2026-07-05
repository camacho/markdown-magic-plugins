import { readFileSync } from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';
import sortScripts from 'sort-scripts';
import type { TransformArgs } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

function findPkg(dir: string): string {
  const pkgPath = findUpSync('package.json', { cwd: dir });

  if (!pkgPath) {
    throw new Error('No package.json file found');
  }

  return pkgPath;
}

export default function SCRIPTS({
  content,
  options = {},
  srcPath,
}: TransformArgs): string {
  let pkgPath: string;

  if (options && options.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), options.pkg);
  } else {
    pkgPath = findPkg(path.dirname(srcPath));
  }

  const { scripts } = JSON.parse(readFileSync(pkgPath, 'utf8'));

  if (!scripts) return content;

  const rows = content
    .trim()
    .split('\n')
    .map((s) => s.trim());
  const headerIndex = rows.findIndex((row) => row.startsWith('|-'));

  const details: Record<string, string | undefined> = (
    headerIndex !== -1 ? rows.slice(headerIndex + 1) : rows
  )
    .map((row) =>
      row
        .split('|')
        .map((s) => s.trim())
        .filter((s) => !!s),
    )
    .filter(([script]) => !!script)
    .reduce(
      (obj: Record<string, string | undefined>, [script, description]) => {
        obj[script.replace(/`/g, '')] = description;
        return obj;
      },
      {},
    );

  return ['| Script | Description |', '|--------|-------------|']
    .concat(
      sortScripts(scripts).map(([name, script]) => {
        const description = details[name] ?? `\`${script}\``;
        const label = `\`${name}\``;
        return `| ${label} | ${description} |`;
      }),
    )
    .join('\n');
}
