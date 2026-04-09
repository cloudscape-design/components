// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { cpSync } = require('node:fs');
const { build } = require('vite');
const { parallel } = require('gulp');
const path = require('path');
const { mkdirSync, existsSync } = require('fs');
const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');

async function buildPagesStatic() {
  try {
    await build({
      configFile: path.resolve(__dirname, '../../vite.config.js'),
      mode: 'production',
    });
  } catch (error) {
    console.error('Error while running vite build:', error);
    throw error;
  }
}

function buildPagesSource() {
  const targetPath = path.join(workspace.targetPath, 'dev-pages', 'pages');

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath);
  }
  cpSync('pages', targetPath, { recursive: true });
  return Promise.resolve();
}

module.exports = task('build-pages', parallel(buildPagesStatic, buildPagesSource));
