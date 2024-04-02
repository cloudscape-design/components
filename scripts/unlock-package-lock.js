#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');

const lockfiles = [
  'package-lock.json',
  'backstop/package-lock.json',
  '.github/workflows/bundle-size/package-lock.json',
];

for (const filename of lockfiles) {
  unlock(filename);
}

/**
 * Remove specific @cloudscape-design/* packages where we should always use the latest minor release.
 */
function unlock(filename) {
  const packageLock = JSON.parse(fs.readFileSync(filename));
  if (packageLock.lockfileVersion !== 3) {
    throw Error('package-lock.json file is not version 3. Use regular npm to update the packages.');
  }

  Object.keys(packageLock.packages).forEach(dependencyName => {
    removeDependencies(dependencyName, packageLock.packages);
  });

  fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
  console.log(`Removed @cloudscape-design/ dependencies from ${filename} file`);
}

function removeDependencies(dependencyName, packages) {
  if (dependencyName.includes('@cloudscape-design/')) {
    delete packages[dependencyName];
  }
}
