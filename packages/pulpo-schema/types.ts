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

// pulpo@1.4.2 ships a broken .d.ts (lib/index.d.ts triple-slash-references a
// non-existent ../typings/index.d.ts). Rather than importing pulpo's types,
// this is a minimal local interface for the slice of Schema/Property this
// package actually touches: `schema.document()` and the property fields read
// off of it (`type`, `description`, plus arbitrary extra keys rendered as
// bullet lines).
export interface PulpoSchemaProperty {
  type: string;
  description: string;
  [key: string]: unknown;
}

export interface PulpoSchema {
  document(): Record<string, PulpoSchemaProperty>;
}
