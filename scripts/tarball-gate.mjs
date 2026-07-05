import { execFileSync } from 'child_process';
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const ROOT = process.cwd();
const PACK_DIR = mkdtempSync(path.join(tmpdir(), 'mmp-pack-'));

console.log(`Packing all workspace packages into ${PACK_DIR}`);
execFileSync('pnpm', ['pack', '-r', '--pack-destination', PACK_DIR], {
  stdio: 'inherit',
  cwd: ROOT,
});

const tarballs = readdirSync(PACK_DIR).filter((f) => f.endsWith('.tgz'));
if (tarballs.length !== 11) {
  console.error(
    `Expected 11 tarballs, found ${tarballs.length}: ${tarballs.join(', ')}`,
  );
  process.exit(1);
}

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

    // 3. install + import smoke
    const installDir = mkdtempSync(path.join(tmpdir(), 'mmp-install-'));
    tempDirs.push(installDir);
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
  } finally {
    for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  }
}

rmSync(PACK_DIR, { recursive: true, force: true });

if (failed) {
  console.error('\nTarball gate FAILED');
  process.exit(1);
}
console.log('\nTarball gate passed for all 11 packages');
