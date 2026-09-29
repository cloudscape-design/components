// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const { series } = require('gulp');

const { task } = require('../utils/gulp-utils');
const generateTestDefinitionsIndex = require('./generate-test-definitions-index');

const compile = task('test-definitions:compile', () =>
  execa('tsc', ['-p', 'tsconfig.test-definitions.json'], { stdio: 'inherit' })
);

// Compile the definitions, then generate the barrel index (lib/test-definitions/index.js)
// from the files in test/definitions/visual so it does not need to be maintained by hand.
module.exports = series(compile, generateTestDefinitionsIndex);
