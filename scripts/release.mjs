import { execFileSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

// npm OIDC trusted-publishing credentials are minted per exchange; a single
// `pnpm publish -r` run reuses its first credential and fails on the second
// package (ENEEDAUTH). Publishing each package in its own pnpm invocation
// gives every publish a fresh exchange, and the registry pre-check makes
// re-runs idempotent.

const ROOT = process.cwd();
const packagesDir = path.join(ROOT, 'packages');

const failures = [];

for (const dir of readdirSync(packagesDir)) {
  let pkg;
  try {
    pkg = JSON.parse(
      readFileSync(path.join(packagesDir, dir, 'package.json'), 'utf8'),
    );
  } catch {
    continue;
  }
  if (pkg.private) continue;

  const spec = `${pkg.name}@${pkg.version}`;
  let published = false;
  try {
    execFileSync('npm', ['view', spec, 'version'], { stdio: 'ignore' });
    published = true;
  } catch {
    // not on the registry yet
  }
  if (published) {
    console.log(`SKIP ${spec} (already on registry)`);
    continue;
  }

  console.log(`PUBLISH ${spec}`);
  try {
    execFileSync('pnpm', ['--filter', pkg.name, 'publish', '--no-git-checks'], {
      stdio: 'inherit',
      cwd: ROOT,
    });
  } catch {
    failures.push(spec);
    console.error(`FAILED ${spec}`);
  }
}

if (failures.length > 0) {
  console.error(`\nRelease incomplete, failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\nAll packages published or already current');
