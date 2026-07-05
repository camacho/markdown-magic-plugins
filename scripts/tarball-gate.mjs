import { execFileSync } from 'child_process';
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const ROOT = process.cwd();
const TSC = path.join(ROOT, 'node_modules', '.bin', 'tsc');
const PACK_DIR = mkdtempSync(path.join(tmpdir(), 'mmp-pack-'));

console.log(`Packing all workspace packages into ${PACK_DIR}`);
execFileSync('pnpm', ['pack', '-r', '--pack-destination', PACK_DIR], {
  stdio: 'inherit',
  cwd: ROOT,
});

const expectedCount = readdirSync(path.join(ROOT, 'packages')).filter((dir) => {
  try {
    const pkg = JSON.parse(
      readFileSync(path.join(ROOT, 'packages', dir, 'package.json'), 'utf8'),
    );
    return !pkg.private;
  } catch {
    return false;
  }
}).length;

const tarballs = readdirSync(PACK_DIR).filter((f) => f.endsWith('.tgz'));
if (tarballs.length !== expectedCount) {
  console.error(
    `Expected ${expectedCount} tarballs (publishable workspace packages), found ${tarballs.length}: ${tarballs.join(', ')}`,
  );
  process.exit(1);
}

// Consumer-typecheck snippets: each must IMPORT the package's public
// surface AND EXERCISE it (call the transform / factory) so a broken
// shipped signature fails compilation, not just a missing module.
const CONSUMER_SNIPPETS = {
  default: (name) => `
    import DEFAULT_TRANSFORM, { TransformArgs } from '${name}';
    const args: TransformArgs = { content: '', options: {}, srcPath: '' };
    const result: string = DEFAULT_TRANSFORM(args);
    void result;
  `,
  // template exports a FACTORY, not a transform directly: call it with the
  // factory data first, then exercise the returned transform with
  // TransformArgs. This gate is compile-only (tsc --noEmit) — options.src is
  // never read at this point, so any string value typechecks here even
  // though the transform reads that path from disk at runtime.
  'markdown-magic-template': (name) => `
    import factory, { TransformArgs } from '${name}';
    const transform = factory({ name: 'x' });
    const args: TransformArgs = { content: '', options: { src: './x.md' }, srcPath: '' };
    const result: string = transform(args);
    void result;
  `,
  'markdown-magic-prettier': (name) => `
    import DEFAULT_TRANSFORM, { TransformArgs } from '${name}';
    const args: TransformArgs = { content: '', options: {}, srcPath: '' };
    const result: Promise<string> = DEFAULT_TRANSFORM(args);
    void result;
  `,
};

let failed = false;

for (const tgz of tarballs) {
  const tgzPath = path.join(PACK_DIR, tgz);
  console.log(`\n=== ${tgz} ===`);

  const tempDirs = [];
  try {
    const extractDir = mkdtempSync(path.join(tmpdir(), 'mmp-extract-'));
    tempDirs.push(extractDir);
    execFileSync('tar', ['-xzf', tgzPath, '-C', extractDir]);
    const pkgDir = path.join(extractDir, 'package');

    // 1. protocol-leak gate
    const pkgJsonRaw = readFileSync(path.join(pkgDir, 'package.json'), 'utf8');
    if (/catalog:|workspace:/.test(pkgJsonRaw)) {
      console.error(
        `FAIL protocol-leak: ${tgz} package.json still contains catalog:/workspace: protocol`,
      );
      failed = true;
      continue;
    }
    console.log('OK protocol-leak: no catalog:/workspace: strings');

    // 2. contents match files field — both directions: nothing extra, nothing missing
    const pkgJson = JSON.parse(pkgJsonRaw);
    const filesField = pkgJson.files || [];
    const alwaysIncluded = ['package.json', 'README.md', 'LICENSE'];
    const expected = new Set([...filesField, ...alwaysIncluded]);
    const actualFiles = readdirSync(pkgDir);
    const unexpected = actualFiles.filter((f) => !expected.has(f));
    const missing = filesField.filter(
      (f) => !f.includes('*') && !actualFiles.includes(f),
    );
    if (unexpected.length > 0 || missing.length > 0) {
      if (unexpected.length > 0)
        console.error(
          `FAIL contents: ${tgz} shipped unexpected files: ${unexpected.join(', ')}`,
        );
      if (missing.length > 0)
        console.error(
          `FAIL contents: ${tgz} missing declared files: ${missing.join(', ')}`,
        );
      failed = true;
      continue;
    }
    console.log(
      `OK contents: shipped files match files field (${actualFiles.join(', ')})`,
    );

    const isDistPackaged = filesField.includes('dist');

    // 2b. dist-internals assertion — packages shipping compiled dist/ must
    // ship both the runtime entry and its type declarations.
    if (isDistPackaged) {
      const distIndexJs = path.join(pkgDir, 'dist', 'index.js');
      const distIndexDts = path.join(pkgDir, 'dist', 'index.d.ts');
      const missingDist = [distIndexJs, distIndexDts].filter(
        (f) => !existsSync(f),
      );
      if (missingDist.length > 0) {
        console.error(
          `FAIL dist-internals: ${tgz} missing ${missingDist.map((f) => path.relative(pkgDir, f)).join(', ')}`,
        );
        failed = true;
        continue;
      }
      console.log(
        'OK dist-internals: dist/index.js and dist/index.d.ts present',
      );
    }

    // 3. install + import smoke
    const installDir = mkdtempSync(path.join(tmpdir(), 'mmp-install-'));
    tempDirs.push(installDir);
    try {
      execFileSync('npm', ['init', '-y'], { cwd: installDir, stdio: 'ignore' });
      execFileSync('npm', ['install', tgzPath], {
        cwd: installDir,
        stdio: 'inherit',
      });

      const smokeScript = `
        import mod from '${pkgJson.name}';
        if (typeof mod !== 'function') {
          console.error('default export is not a function, got: ' + typeof mod);
          process.exit(1);
        }
        console.log('OK import smoke: default export is a function');
      `;
      const smokePath = path.join(installDir, 'smoke.mjs');
      writeFileSync(smokePath, smokeScript);
      execFileSync('node', [smokePath], { cwd: installDir, stdio: 'inherit' });
    } catch (err) {
      console.error(`FAIL import smoke: ${tgz}: ${err.message}`);
      failed = true;
      continue;
    }

    // 4. consumer typecheck — the only gate that catches type-reference
    // leaks and missing/broken .d.ts; only meaningful for dist-packaged
    // (converted) packages, since still-JS packages ship no types yet.
    // The snippet MUST call the transform with TransformArgs — resolving
    // the import alone passes even when the shipped signature is wrong.
    // Packages whose public shape differs from the sync default-transform
    // contract register a custom snippet here (wave-A: prettier is async,
    // template/pulpo-schema export factories).
    if (isDistPackaged) {
      const consumerSnippet =
        CONSUMER_SNIPPETS[pkgJson.name] ?? CONSUMER_SNIPPETS.default;
      const consumerScript = consumerSnippet(pkgJson.name);
      const consumerPath = path.join(installDir, 'consumer.ts');
      writeFileSync(consumerPath, consumerScript);
      try {
        execFileSync(
          TSC,
          [
            '--noEmit',
            '--strict',
            '--module',
            'nodenext',
            '--moduleResolution',
            'nodenext',
            'consumer.ts',
          ],
          { cwd: installDir, stdio: 'inherit' },
        );
      } catch (err) {
        console.error(`FAIL consumer typecheck: ${tgz}: ${err.message}`);
        failed = true;
        continue;
      }
      console.log(
        'OK consumer typecheck: transform accepts TransformArgs and returns its declared type',
      );
    } else {
      console.log(
        `SKIP consumer typecheck: ${tgz} not yet converted to TypeScript (no dist/)`,
      );
    }
  } finally {
    for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  }
}

rmSync(PACK_DIR, { recursive: true, force: true });

if (failed) {
  console.error('\nTarball gate FAILED');
  process.exit(1);
}
console.log(`\nTarball gate passed for all ${expectedCount} packages`);
