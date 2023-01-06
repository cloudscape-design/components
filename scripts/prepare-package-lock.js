#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

/**
 * Remove specific @cloudscape-design/* packages where we should always use the latest minor release.
 * Also checks for any dependencies that incorrectly use CodeArtifact instead of npm.
 */
const filename = require.resolve('../package-lock.json');
const packageLock = require(filename);

if (packageLock.lockfileVersion !== 2) {
  throw new Error('package-lock.json must have "lockfileVersion": 2');
}

function unlock(packages) {
  Object.keys(packages).forEach(dependencyName => {
    const dependency = packages[dependencyName];

    if (dependencyName.includes('@cloudscape-design/')) {
      delete packages[dependencyName];
    } else if (dependency.resolved && dependency.resolved.includes('codeartifact.us-west-2.amazonaws.com')) {
      throw Error(
        'package-lock.json file contains a reference to CodeArtifact. Use regular npm to update the packages.'
      );
    }
  });

  return packages;
}

packageLock.packages = unlock(packageLock.packages);
packageLock.dependencies = unlock(packageLock.dependencies);

fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
console.log('Removed @cloudscape-design/ dependencies from package-lock file');
