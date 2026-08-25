// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const { task } = require('../utils/gulp-utils');
const generateVisualTests = require('./generate-visual-tests');

module.exports = task('test-definitions', async () => {
  // Generate the test/visual runner files from the definitions before type-checking,
  // so both the generated runners and the definitions are validated together.
  await generateVisualTests();
  await execa('tsc', ['-p', 'tsconfig.test-definitions.json'], { stdio: 'inherit' });
});
