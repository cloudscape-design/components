// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { cpSync } = require('node:fs');
const execa = require('execa');
const { parallel } = require('gulp');
const path = require('path');
const { mkdirSync, existsSync } = require('fs');
const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');

async function buildPagesStatic() {
  const { build } = await import('vite');
  const { createConfig } = await import('../../pages/vite.config.mjs');
  await build({ ...createConfig(), configFile: false });
}

// Vite only transpiles the pages, they are type-checked separately
async function typecheckPages() {
  // The custom icons page has a separate project for its module augmentation
  for (const [project, buildInfo] of [
    ['pages/tsconfig.json', 'pages.tsbuildinfo'],
    ['pages/icon-provider/custom-icons/tsconfig.json', 'pages-custom-icons.tsbuildinfo'],
  ]) {
    await execa(
      'tsc',
      ['-p', project, '--noEmit', '--skipLibCheck', '--tsBuildInfoFile', path.join(workspace.targetPath, buildInfo)],
      { stdio: 'inherit' }
    );
  }
}

function buildPagesSource() {
  const targetPath = path.join(workspace.targetPath, 'dev-pages', 'pages');

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath);
  }
  // pages/lib contains build outputs
  cpSync('pages', targetPath, {
    recursive: true,
    filter: source => path.resolve(source) !== path.resolve('pages/lib'),
  });
  return Promise.resolve();
}

module.exports = task('build-pages', parallel(buildPagesStatic, typecheckPages, buildPagesSource));
