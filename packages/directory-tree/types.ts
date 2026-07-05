// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract), plus
// this package's own directory-tree options.
export interface TransformOptions {
  depth?: number;
  dir?: string;
  ignore?: string[];
  onlyDirs?: boolean;
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}
