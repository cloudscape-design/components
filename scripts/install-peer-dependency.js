#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

// Settings
const targetRepository = 'collection-hooks';
const targetRepositoryUrl = `https://github.com/cloudscape-design/${targetRepository}.git`;
const targetBranch = 'property-filter-token-groups'; // 'main';
const tempDir = path.join(os.tmpdir(), `temp-${targetRepository}`);
const componentsDir = __dirname;
const nodeModulesDir = path.join(componentsDir, 'node_modules', '@cloudscape-design', targetRepository);

// Clone the repository and checkout the branch
console.log(`Cloning ${targetRepository} repository...`);
execCommand(`git clone ${targetRepositoryUrl} ${tempDir}`);
process.chdir(tempDir);
execCommand(`git checkout ${targetBranch}`);

// Install dependencies and build
console.log(`Installing dependencies and building ${targetRepository}...`);
execCommand('npm install');
execCommand('npm run build');

// Remove existing peer dependency in node_modules
console.log(`Removing existing ${targetRepository} from node_modules...`);
execCommand(`rm -rf ${nodeModulesDir}`);

// Copy built peer dependency to node_modules
console.log(`Copying built ${targetRepository} to node_modules...`);
execCommand(`mkdir -p ${nodeModulesDir}`);
execCommand(`cp -R ${tempDir}/lib/* ${nodeModulesDir}`);

// Clean up
console.log('Cleaning up...');
execCommand(`rm -rf ${tempDir}`);

console.log(`${targetRepository} has been successfully installed and built!`);

// Helper function to execute shell commands and log output
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
