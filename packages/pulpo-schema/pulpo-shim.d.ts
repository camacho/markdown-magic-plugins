// Ambient shim for `pulpo`. Upstream ships `"typings": "lib/index"` in
// package.json, but `lib/index.d.ts` is only a triple-slash reference to a
// non-existent `../typings/index.d.ts` — the file has no exports, so
// consumers hit TS2306 ("is not a module") on `import Pulpo from 'pulpo'`.
// Verified against 1.4.2 — a genuine upstream packaging bug, not something
// fixable from here (root skipLibCheck does not suppress this class of
// resolution error). This shim narrowly types the constructor + `document()`
// surface this package actually touches; consumers of this package type the
// schema themselves against the local `PulpoSchema` interface in ./types.ts.
declare module 'pulpo' {
  export interface PulpoPropertyDefinition {
    type: string;
    description: string;
    [key: string]: unknown;
  }

  export default class Pulpo {
    constructor(rawDefinition: Record<string, PulpoPropertyDefinition>);
    document(): Record<string, PulpoPropertyDefinition>;
  }
}
