// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const del = require('del');
const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');

module.exports = task('clean', () =>
  del([
    'src/index.ts',
    'src/test-utils/dom/index.ts',
    `${workspace.npmModulesTarget}/**`,
    `${workspace.targetPath}/**`,
    `${workspace.staticSitePath}/**`,
    `${workspace.generatedTestUtils}/**`,
    `node_modules/.cache`,
  ])
);
