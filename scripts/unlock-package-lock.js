#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

/**
 * Remove specific @cloudscape-design/* packages where we should always use the latest minor release.
 */
const filename = path.resolve(__dirname, '..', 'package-lock.json');
const packageLock = JSON.parse(fs.readFileSync(filename));

function removeDependencies(dependencyName, packages) {
  if (dependencyName.includes('@cloudscape-design/')) {
    delete packages[dependencyName];
  }
}

Object.keys(packageLock.packages).forEach(dependencyName => {
  removeDependencies(dependencyName, packageLock.packages);
});

Object.keys(packageLock.dependencies).forEach(dependencyName => {
  removeDependencies(dependencyName, packageLock.dependencies);
});

fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
console.log('Removed @cloudscape-design/ dependencies from package-lock file');
