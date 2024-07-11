#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: install-peer-dependency.js <package-name>:<target-branch>');
  process.exit(1);
}
const [packageName, targetBranch] = args[0].split(':');
const targetRepository = `https://github.com/cloudscape-design/${packageName}.git`;
const nodeModulesPackagePath = path.join(__dirname, '..', 'node_modules', '@cloudscape-design', packageName);
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
console.log(`Removing existing ${packageName} from node_modules...`);
execCommand(`rm -rf ${nodeModulesPackagePath}`);

// Copy built peer dependency to node_modules
console.log(`Copying built ${targetRepository} to node_modules...`);
execCommand(`mkdir -p ${nodeModulesPackagePath}`);
execCommand(`cp -R ${tempDir}/lib/* ${nodeModulesPackagePath}`);

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
