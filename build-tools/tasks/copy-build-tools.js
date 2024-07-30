// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { cpSync } = require('node:fs');
const path = require('path');
const { mkdirSync, existsSync } = require('fs');
const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');

function copyBuildTools() {
  const targetPath = path.join(workspace.targetPath, 'build-tools', 'scripts');

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath);
  }
  cpSync('build-tools/scripts', targetPath, { recursive: true });
  return Promise.resolve();
}

module.exports = task('copy-build-tools', copyBuildTools);
