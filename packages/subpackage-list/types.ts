// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract), plus
// this package's own `dir`/`verbose`/`bullet` options.
export interface TransformOptions {
  dir?: string;
  verbose?: boolean | string;
  bullet?: string;
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}

// Minimal shape of a package.json manifest as read from disk for each
// discovered subpackage.
export interface PackageManifest {
  name: string;
  description?: string;
}
