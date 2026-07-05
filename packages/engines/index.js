import { readFileSync } from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';

function findPkg(dir) {
  const pkgPath = findUpSync('package.json', { cwd: dir });

  if (!pkgPath) {
    throw new Error('No package.json file found');
  }

  return pkgPath;
}

export default function ENGINES({ content, options = {}, srcPath }) {
  let pkgPath;

  if (options && options.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), options.pkg);
  } else {
    pkgPath = findPkg(path.dirname(srcPath));
  }

  const { engines } = JSON.parse(readFileSync(pkgPath, 'utf8'));

  if (!engines) return content;

  return Object.entries(engines)
    .map(([name, version]) => `- **${name}**: ${version}`)
    .join('\n');
}
