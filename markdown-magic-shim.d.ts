// Ambient shim for `markdown-magic`. Upstream ships `"types": "types/index.d.ts"`
// in package.json, but that barrel file is missing from the published tarball
// (verified against 4.10.5 and 4.11.0 — only `types/src/index.d.ts` exists) —
// this is a genuine upstream packaging bug, not something fixable from here.
// Signature mirrors `types/src/index.d.ts` (markdownMagic(globOrOpts, options)
// => Promise<MarkdownMagicResult>), loosened to unknown where upstream uses `any`.
declare module 'markdown-magic' {
  export function markdownMagic(
    globOrOpts?: string | string[] | Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<{
    errors: unknown[];
    filesChanged: string[];
    results: unknown[];
  }>;
}
