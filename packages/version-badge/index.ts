import path from 'path';
import { readFileSync } from 'fs';
import { findUpSync } from 'find-up';
import semver from 'semver';
import type { TransformArgs, TransformOptions } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

function encode(value: string): string {
  return value.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_');
}

function findPkg(dir: string): string {
  const pkgPath = findUpSync('package.json', { cwd: dir });

  if (!pkgPath) {
    throw new Error('No package.json file found');
  }

  return pkgPath;
}

function getPackage(
  options: TransformOptions,
  srcPath: string,
): { name: string; version: string } {
  let pkgPath: string;

  if (options?.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), options.pkg);
  } else {
    pkgPath = findPkg(path.dirname(srcPath));
  }

  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function getPrefix(options: TransformOptions): string {
  return options?.prefix || 'npm';
}

function renderBadge(
  prefix: string,
  name: string,
  version: string,
  { color: _color }: TransformOptions = {},
): string {
  let color: string;

  if (_color) {
    color = _color;
  } else if (semver.prerelease(version)) {
    color = 'orange';
  } else {
    color = 'green';
  }

  const url = [prefix, `v${version}`, color]
    .map(encode)
    .join('-')
    .concat('.svg');
  const img = `https://img.shields.io/badge/${url}`;

  return `![${prefix}](${img})`;
}

function linkify(name: string, img: string, options: TransformOptions): string {
  if (options?.link === 'false') return img;
  const url = options?.link || `https://www.npmjs.com/package/${name}`;
  return `[${img}](${url})`;
}

export default function VERSIONBADGE({
  content: _content,
  options = {},
  srcPath,
}: TransformArgs): string {
  const { name, version } = getPackage(options, srcPath);
  const prefix = getPrefix(options);
  const img = renderBadge(prefix, name, version, options);
  return linkify(name, img, options);
}
