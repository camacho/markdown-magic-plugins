// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract), plus
// this package's own options.
export interface TransformOptions {
  pkg?: string;
  production?: string;
  dev?: string;
  optional?: string;
  peers?: string;
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}
