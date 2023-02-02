#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

/**
 * Checks for any dependencies that incorrectly use CodeArtifact instead of npm.
 */
const filename = path.resolve(__dirname, '..', 'package-lock.json');
const packageLock = JSON.parse(fs.readFileSync(filename));

if (packageLock.lockfileVersion !== 2) {
  throw new Error('package-lock.json must have "lockfileVersion": 2');
}

function checkDependencies(dependencyName, dependencies) {
  const dependency = dependencies[dependencyName];

  if (dependency && dependency.resolved && dependency.resolved.includes('codeartifact.us-west-2.amazonaws.com')) {
    throw Error('package-lock.json file contains a reference to CodeArtifact. Use regular npm to update the packages.');
  }
}

function removeDependencies(dependencyName, packages) {
  if (dependencyName.includes('@cloudscape-design/')) {
    delete packages[dependencyName];
  }
}

Object.keys(packageLock.packages).forEach(dependencyName => {
  removeDependencies(dependencyName, packageLock.packages);
  checkDependencies(dependencyName, packageLock.packages);
});

Object.keys(packageLock.dependencies).forEach(dependencyName => {
  removeDependencies(dependencyName, packageLock.packages);
  checkDependencies(dependencyName, packageLock.dependencies);
});

fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
console.log('Removed @cloudscape-design/ dependencies from package-lock file');
