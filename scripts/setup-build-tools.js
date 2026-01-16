#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Can be used in postinstall script like so:
// "postinstall": "node ./scripts/install-peer-dependency.js collection-hooks:property-filter-token-groups"
// where "collection-hooks" is the package to fetch and "property-filter-token-groups" is the branch name in GitHub.

import { execSync } from 'child_process';
import process from 'node:process';
import path from 'path';

const branch = 'add-test-pages-util-permutation-view';
const packageName = 'build-tools';
const targetRepository = `https://github.com/cloudscape-design/${packageName}.git`;
const copyBuildToolsPath = path.join(process.cwd(), 'shared', 'build-tools');
execCommand(`mkdir -p ${copyBuildToolsPath}`);
execCommand(`rm -rf ${copyBuildToolsPath}`);
execCommand(`git clone --branch ${branch} --single-branch ${targetRepository} ${copyBuildToolsPath}`);

console.log(`build-tools has been successfully installed!`);

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
