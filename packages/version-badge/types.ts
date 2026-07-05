// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract), plus
// this package's own `pkg`/`prefix`/`link`/`color` options.
export interface TransformOptions {
  pkg?: string;
  prefix?: string;
  link?: string;
  color?: string;
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}
