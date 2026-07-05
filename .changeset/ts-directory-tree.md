---
'markdown-magic-directory-tree': minor
---

TypeScript: ship type declarations

Also adds `dist` to the default ignore list so build artifacts never render in the generated tree (this package self-demos DIRTREE on its own README; a docs regen with a locally-built `dist/` present would otherwise diverge from CI, which regenerates before `pnpm -r build` runs).
