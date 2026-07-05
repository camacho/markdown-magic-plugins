// Ambient shim for `sort-scripts`. Upstream ships no type declarations and
// no `@types/sort-scripts` package exists — smallest correct local
// declaration for the single default export actually used here (verified
// against node_modules/sort-scripts@1.0.1/index.js: takes a scripts map,
// returns `[name, script]` pairs sorted with pre/post ordering).
declare module 'sort-scripts' {
  export default function sortScripts(
    scripts: Record<string, string>,
  ): Array<[string, string]>;
}
