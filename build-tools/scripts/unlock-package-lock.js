#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');

console.log('[unlock-package-lock] Running');

const lockfiles = glob.sync('./**/package-lock.json');
console.log('[unlock-package-lock] Found lock files', lockfiles);

for (const filename of lockfiles) {
  if (!fs.existsSync(filename)) {
    console.log(`[unlock-package-lock] Skipping ${filename} as it does not exist`);
    continue;
  }

  unlock(filename);
}

/**
 * Remove specific @cloudscape-design/* packages where we should always use the latest minor release.
 */
function unlock(filename) {
  const relativeFilename = path.resolve(filename);
  const packageLock = JSON.parse(fs.readFileSync(relativeFilename));
  if (packageLock.lockfileVersion !== 3) {
    throw Error(
      '[unlock-package-lock] package-lock.json file is not version 3. Use regular npm to update the packages.'
    );
  }

  Object.keys(packageLock.packages).forEach(dependencyName => {
    removeDependencies(dependencyName, packageLock.packages);
  });

  fs.writeFileSync(relativeFilename, JSON.stringify(packageLock, null, 2) + '\n');
  console.log(`[unlock-package-lock] Removed @cloudscape-design/ dependencies from ${filename} file`);
}

function removeDependencies(dependencyName, packages) {
  if (dependencyName.includes('@cloudscape-design/')) {
    delete packages[dependencyName];
  }
}
