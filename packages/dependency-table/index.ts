import fs from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';
import semver from 'semver';
import type { TransformArgs, TransformOptions } from './types.ts';

export type { TransformArgs, TransformOptions } from './types.ts';

interface PackageManifest {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  description?: string;
  homepage?: string;
  version?: string;
  repository?: string | { url?: string };
  license?: string;
  bugs?: string | { url?: string };
}

interface DependencyEntry {
  name: string;
  semver: string;
  version: string;
  description: string;
  url: string;
  license: string;
  dependencyType: string;
}

const defaults = {
  optional: 'false',
  dev: 'false',
  peers: 'false',
  production: 'false',
};

function findPkg(dir: string): string {
  const pkgPath = findUpSync('package.json', { cwd: dir });
  if (!pkgPath) throw new Error('No package.json file found');
  return pkgPath;
}

function sanitizeSemver(
  version: string,
  maxLength = 10,
  truncateStr = '...',
): string {
  if (semver.valid(version)) return version;
  return version.length > maxLength - truncateStr.length
    ? `${version.substr(0, maxLength - truncateStr.length)}${truncateStr}`
    : version;
}

function convertRepositoryToUrl(
  repository: string | { url?: string },
  name?: string,
): string {
  let repo = ((repository as { url?: string }).url || repository) as string;
  repo = repo.replace('.git', '');

  if (repo.startsWith('http')) {
    return repo;
  } else if (repo.startsWith('git://')) {
    return repo.replace('git://', 'https://');
  } else if (repo.startsWith('git+ssh')) {
    const [full, url] = repo.match(/^git\+ssh\:\/\/git\@(.*)$/) as string[];
    return [`https://`, url].join('');
  } else if (repo.startsWith('git@')) {
    return repo.replace('git@', 'https://').replace(':', '/');
  } else {
    return ['https://github.com/', repo].join('');
  }

  return repo;
}

function getPkgUrl(pkg: Partial<PackageManifest>): string {
  const { name, repository, homepage, bugs } = pkg;

  if (homepage) return homepage;
  if (repository) return convertRepositoryToUrl(repository, name);
  if (bugs) return ((bugs as { url?: string }).url || bugs) as string;

  return `https://npmjs.org/package/${name}`;
}

const readDependencies =
  (pkg: PackageManifest, pkgDir: string) =>
  (
    manifest: DependencyEntry[],
    dependencyType = 'production',
  ): DependencyEntry[] => {
    let dependencies: Record<string, string> | undefined;

    if (dependencyType === 'production') {
      dependencies = pkg.dependencies;
    } else {
      dependencies = (pkg as Record<string, Record<string, string>>)[
        `${dependencyType}Dependencies`
      ];
    }

    return manifest.concat(
      Object.keys(dependencies || {}).map((name) => {
        const localPkgPath = findUpSync(
          path.join('node_modules', name, 'package.json'),
          { cwd: pkgDir },
        );

        if (!localPkgPath) {
          return {
            name,
            semver: sanitizeSemver(dependencies![name]),
            version: '-',
            description: '-',
            url: getPkgUrl({ name }),
            license: '-',
            dependencyType,
          };
        }

        const localPkg: PackageManifest = JSON.parse(
          fs.readFileSync(localPkgPath, 'utf8'),
        );
        const { description, homepage, version, repository, license } =
          localPkg;

        return {
          name,
          semver: sanitizeSemver(dependencies![name]),
          version: version ?? '',
          description: description ?? '',
          url: getPkgUrl(localPkg),
          license: license ?? 'UNLICENSED',
          dependencyType,
        };
      }),
    );
  };

function renderDependencies(dependency: DependencyEntry): string {
  const { name, semver, version, license, description, url, dependencyType } =
    dependency;
  return [
    '',
    `[${[name, semver].join('@')}](${url})`,
    description,
    version,
    license,
    dependencyType,
    '',
  ].join(' | ');
}

export default function DEPENDENCYTABLE({
  content,
  options = {},
  srcPath,
}: TransformArgs): string {
  const opts: TransformOptions & typeof defaults = Object.assign(
    {},
    defaults,
    options,
  );

  let pkgPath: string;

  if (opts.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), opts.pkg);
  } else {
    pkgPath = findPkg(srcPath);
  }

  const pkg: PackageManifest = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const headers = [
    '| **Dependency** | **Description** | **Version** | **License** | **Type** |',
    '| -------------- | --------------- | ----------- | ----------- | -------- |',
  ];

  const types = ['production', 'peer', 'optional', 'dev'];

  // the public option is `peers`; the internal type key is `peer`
  const declaredTypes = types.filter(
    (type) => opts[type === 'peer' ? 'peers' : type] === 'true',
  );

  const deps = (declaredTypes.length ? declaredTypes : types)
    .reduce(readDependencies(pkg, path.dirname(pkgPath)), [])
    .map(renderDependencies);

  return headers.concat(deps).join('\n');
}
