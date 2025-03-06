#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Can be used in postinstall script like so:
// "postinstall": "node ./scripts/install-peer-dependency.js collection-hooks:property-filter-token-groups"
// where "collection-hooks" is the package to fetch and "property-filter-token-groups" is the branch name in GitHub.

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

const getModules = packageName => {
  switch (packageName) {
    case 'components':
      return ['components', 'design-tokens'];
    case 'theming-core':
      return ['theming-build', 'theming-runtime'];
    default:
      return [packageName];
  }
};

const getArtifactPath = moduleName => {
  switch (moduleName) {
    case 'components':
      return '/lib/components/*';
    case 'design-tokens':
      return '/lib/design-tokens/*';
    case 'board-components':
      return '/lib/components/*';
    case 'theming-build':
      return '/lib/node/*';
    case 'theming-runtime':
      return '/lib/browser/*';
    default:
      return '/lib/*';
  }
};

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: install-peer-dependency.js <package-name>:<target-branch>');
  process.exit(1);
}
const [packageName, targetBranch] = args[0].split(':');
const targetRepository = `https://github.com/cloudscape-design/${packageName}.git`;
const nodeModulesPath = path.join(process.cwd(), 'node_modules', '@cloudscape-design');
const tempDir = path.join(os.tmpdir(), `temp-${packageName}`);

// Clone the repository and checkout the branch
console.log(`Cloning ${packageName}:${targetBranch}...`);
execCommand(`git clone ${targetRepository} ${tempDir}`);
process.chdir(tempDir);
execCommand(`git checkout ${targetBranch}`);

// Install dependencies and build
console.log(`Installing dependencies and building ${packageName}...`);
execCommand('npm install');
execCommand('npm run build');

// Remove existing peer dependency in node_modules
for (const moduleName of getModules(packageName)) {
  const modulePath = path.join(nodeModulesPath, moduleName);
  const artifactPath = getArtifactPath(moduleName);

  console.log(`Removing existing ${moduleName} from node_modules...`, modulePath);
  execCommand(`rm -rf ${modulePath}`);

  // Copy built peer dependency to node_modules
  console.log(`Copying built ${moduleName} to node_modules...`, modulePath, `${tempDir}${artifactPath}`);
  execCommand(`mkdir -p ${modulePath}`);
  execCommand(`cp -R ${tempDir}${artifactPath} ${modulePath}`);
}

// Clean up
console.log('Cleaning up...');
execCommand(`rm -rf ${tempDir}`);

console.log(`${packageName} has been successfully installed from branch ${targetBranch}!`);

function execCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Stdout: ${error.stdout && error.stdout.toString()}`);
    console.error(`Stderr: ${error.stderr && error.stderr.toString()}`);
    throw error;
  }
}
