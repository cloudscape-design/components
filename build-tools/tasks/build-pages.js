// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { promisify } = require('util');
const webpack = require('webpack');
const { parallel } = require('gulp');
const { execSync } = require('child_process');
const path = require('path');
const { mkdirSync, existsSync } = require('fs');
const createConfig = require('../../pages/webpack.config');
const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');

const asyncWebpack = promisify(webpack);

async function buildPagesStatic() {
  const stats = await asyncWebpack(createConfig());

  console.log(stats.toString({ colors: true }));
  if (stats.hasErrors()) {
    throw new Error('Error while running webpack');
  }
}

function buildPagesSource() {
  const targetPath = path.join(workspace.targetPath, 'dev-pages');

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath);
  }
  execSync(`cp -R pages ${targetPath}`, { stdio: 'inherit' });
  return Promise.resolve();
}

module.exports = task('build-pages', parallel(buildPagesStatic, buildPagesSource));
