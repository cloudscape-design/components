#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: install-peer-dependency.js <package-name>');
  process.exit(1);
}
const packageName = args[0];
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const packagePath = path.join(nodeModulesPath, '@cloudscape-design', packageName);
const tempDir = path.join(os.tmpdir(), `temp-${packageName}`);

// Ensure the package is installed
if (!fs.existsSync(packagePath)) {
  console.error(`${packageName} is not installed in node_modules.`);
  process.exit(1);
}

// Ensure temp directory is clean
if (fs.existsSync(tempDir)) {
  fs.rmdirSync(tempDir, { recursive: true });
}

// Copy package to temp directory
console.log(`Copying ${packageName} to temporary directory...`);
execCommand(`cp -R ${packagePath} ${tempDir}`);

// Change to temp directory
process.chdir(tempDir);

// Install dependencies and build in the temp directory
console.log(`Installing dependencies and building ${packageName}...`);
execCommand('npm install', { stdio: 'inherit' });
execCommand('npm run build', { stdio: 'inherit' });

// Remove existing package in node_modules
console.log(`Removing existing ${packageName} from node_modules...`);
execCommand(`rm -rf ${packagePath}`);

// Copy built package back to node_modules
console.log(`Copying built ${packageName} back to node_modules...`);
fs.mkdirSync(packagePath, { recursive: true });
execCommand(`cp -R ${path.join(tempDir, 'lib')}/* ${packagePath}`);

// Clean up
console.log('Cleaning up...');
execCommand(`rm -rf ${tempDir}`);

console.log(`${packageName} has been successfully built and copied back to node_modules!`);

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
