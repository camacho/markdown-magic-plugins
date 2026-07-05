import path from 'path';
import archy from 'archy';
import dirTree from 'directory-tree';
import type { TransformArgs, TransformOptions } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

interface Defaults {
  depth: number;
  dir: string;
  onlyDirs: boolean;
}

const defaults: Defaults = {
  depth: Infinity,
  dir: '.',
  onlyDirs: false,
};

type DirNode = ReturnType<typeof dirTree>;

const sortEntries = (a: DirNode, b: DirNode): number => {
  if (a.type === 'directory' && b.type !== 'directory') return -1;
  if (a.type !== 'directory' && b.type === 'directory') return 1;
  return a.name.localeCompare(b.name);
};

const processNode = (
  node: DirNode,
  ignore: string[],
  options: Defaults & TransformOptions,
  depth = 0,
): archy.Data | undefined => {
  if (
    ignore.includes(node.name) ||
    depth > options.depth ||
    (options.onlyDirs && node.type !== 'directory')
  )
    return;

  const response: archy.Data = {
    label: `${node.name}${node.type === 'directory' ? '/' : ''}`,
  };

  if (node.type === 'directory' && depth < options.depth) {
    depth++;
    response.nodes = (node.children ?? [])
      .sort(sortEntries)
      .map((child) => processNode(child, ignore, options, depth))
      .filter((child): child is archy.Data => !!child);
  }

  return response;
};

export default function DIRTREE({
  content: _content,
  options = {},
  srcPath,
}: TransformArgs): string {
  const opts: Defaults & TransformOptions = { ...defaults, ...options };
  const dir = path.resolve(path.dirname(srcPath), opts.dir);
  const ignore = opts.ignore || [
    '.git',
    '.gitkeep',
    '.gitignore',
    'node_modules',
    '.DS_Store',
  ];
  // directory-tree@3 only returns `name`/`path` (+`children`) unless the
  // caller opts in to extra attributes; `type` is required for our
  // directory-vs-file logic (attributes docs: https://github.com/mihneadb/node-directory-tree#options)
  const tree = archy(
    processNode(dirTree(dir, { attributes: ['type'] }), ignore, opts)!,
  );

  return ['```', tree.trim(), '```'].join('\n');
}
