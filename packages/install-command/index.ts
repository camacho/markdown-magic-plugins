import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { findUpSync } from 'find-up';
import type { Client, TransformArgs, TransformOptions } from './types.ts';

export type { Client, TransformArgs, TransformOptions } from './types.ts';

const defaults = {
  flags: '["--save"]',
  peers: true,
  exact: false,
};

const installMappings: Record<string, Record<Client, string>> = {
  '--global': { npm: '--global', yarn: '', pnpm: '--global', bun: '--global' },
  '--save': { npm: '--save', yarn: '', pnpm: '', bun: '' },
  '--save-exact': {
    npm: '--save-exact',
    yarn: '--exact',
    pnpm: '--save-exact',
    bun: '--exact',
  },
  '--save-optional': {
    npm: '--save-optional',
    yarn: '--optional',
    pnpm: '--save-optional',
    bun: '--optional',
  },
  '--save-dev': {
    npm: '--save-dev',
    yarn: '--dev',
    pnpm: '--save-dev',
    bun: '--dev',
  },
};

function quoteSpacesInDep(dep: string): string {
  return dep.includes(' ') ? `"${dep}"` : dep;
}

function filterFalseyAndJoin(array: unknown[], join = ' '): string {
  return array.filter((v) => !!v).join(join);
}

function findPkg(dir: string): string {
  const pkgPath = findUpSync('package.json', { cwd: dir });

  if (!pkgPath) {
    throw new Error('No package.json file found');
  }

  return pkgPath;
}

function pickClient(dir: string): Client {
  if (
    existsSync(path.join(dir, 'bun.lock')) ||
    existsSync(path.join(dir, 'bun.lockb'))
  ) {
    return 'bun';
  }

  if (existsSync(path.join(dir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (existsSync(path.join(dir, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}

function buildDeps(
  pkg: {
    name: string;
    version: string;
    peerDependencies?: Record<string, string>;
  },
  exactFlag?: boolean,
  peersFlag?: boolean,
): string {
  const mainDep = filterFalseyAndJoin(
    [pkg.name, exactFlag ? pkg.version : ''],
    '@',
  );

  if (!peersFlag) return mainDep;

  const pkgPeers = pkg.peerDependencies;
  if (!pkgPeers) return mainDep;

  const peers = Object.keys(pkgPeers).map(buildDep(pkgPeers));

  return filterFalseyAndJoin([mainDep, ...peers]);
}

const buildDep =
  (obj: Record<string, string>) =>
  (key: string): string =>
    quoteSpacesInDep([key, obj[key]].join('@'));

function buildInstallCmd(client: Client, isGlobal: boolean): string {
  return `${client}${isGlobal && client === 'yarn' ? ' global' : ''} add`;
}

function buildCmdFlags(client: Client, flags: string[]): string {
  return filterFalseyAndJoin(
    flags.map((flag) => installMappings[flag]?.[client] ?? flag),
  );
}

export default function INSTALLCMD({
  content: _content,
  options: _options = {},
  srcPath,
}: TransformArgs): string {
  const options: TransformOptions = Object.assign({}, defaults, _options);
  const flags: string[] = JSON.parse(options.flags as unknown as string);

  let pkgPath: string;

  if (options.pkg) {
    pkgPath = path.resolve(path.dirname(srcPath), options.pkg);
  } else {
    pkgPath = findPkg(path.dirname(srcPath));
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const client = options.client || pickClient(path.dirname(pkgPath));

  const cmd = filterFalseyAndJoin([
    buildInstallCmd(client, flags.includes('--global')),
    buildCmdFlags(client, flags),
    buildDeps(pkg, options.exact, options.peers !== 'false'),
  ]);

  return `\`\`\`sh\n${cmd}\n\`\`\``;
}
