// Ambient shim for `lodash.template`. No `@types/lodash.template` typings are
// referenced here on purpose: DefinitelyTyped's version pulls in the full
// `@types/lodash` dependency for a single-call use site — the smallest
// correct option is a local declaration scoped to the one signature this
// package actually calls (`template(source)` -> `(data) => string`).
declare module 'lodash.template' {
  export default function template(
    string: string,
  ): (data?: Record<string, unknown>) => string;
}
