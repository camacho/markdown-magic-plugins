// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract).
export interface TransformOptions {
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}
