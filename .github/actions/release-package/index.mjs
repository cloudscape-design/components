import path from 'path';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const inputs = {
  path: process.env.INPUT_PATH,
  suffix: process.env.INPUT_SUFFIX,
};

// The main packags should publish to next, and dev forks to next-dev
const branchName = process.env.GITHUB_REF_TYPE === 'branch' ? process.env.GITHUB_REF_NAME : '';
const publishTag = branchName.startsWith('dev-v3-') ? branchName : 'next';

const subPackages = {
  'components': [
    'lib/components',
    'lib/style-dictionary',
    'lib/components-themeable',
    'lib/dev-pages',
    'lib/components-definitions',
  ],
  'theming-core': ['lib/node', 'lib/browser'],
  'test-utils': ['packages/core', 'packages/converter'],
};

function releasePackage(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');

  // Update version in the package.json file
  const packageJson = JSON.parse(readFileSync(packageJsonPath));
  packageJson.version += inputs.suffix;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Publish to CodeArtifact
  console.info(`Publishing package ${packageJson.name} version ${packageJson.version} to dist-tag ${publishTag}`);

  try {
    execSync(`npm publish --tag ${publishTag}`, { stdio: 'inherit', cwd: packagePath });
  } catch (e) {
    console.error('Error while publishing:', e.stderr.toString());
  }
}

function main() {
  const basePath = inputs.path;

  if (!basePath && !existsSync(basePath)) {
    console.error(`Invalid path: ${basePath}`);
    process.exit(1);
  }

  if (!inputs.suffix) {
    console.error('No version suffix provided.');
    process.exit(1);
  }

  const repositoryName = path.basename(basePath);
  if (subPackages[repositoryName]) {
    subPackages[repositoryName].forEach(subpath => {
      releasePackage(path.join(basePath, subpath));
    });
  } else {
    releasePackage(basePath);
  }
}

main();
