// Transform interface shared by markdown-magic plugins. Adapted from
// format-package's scripts/markdown-transformers.ts TransformArgs/TransformOptions
// (content: unknown -> content: string, the plugins' actual contract), plus
// this package's own `pkg`/`client`/`flags`/`peers`/`exact` options.
export type Client = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface TransformOptions {
  pkg?: string;
  client?: Client;
  flags?: string;
  peers?: boolean | string;
  exact?: boolean;
  [key: string]: unknown;
}

export interface TransformArgs {
  content: string;
  options: TransformOptions;
  srcPath: string;
}
