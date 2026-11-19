// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const { task } = require('../utils/gulp-utils');

module.exports = task('bundle-vendor-files', () => {
  return execa('rollup', ['-c', 'vendor/rollup.config.mjs'], { stdio: 'inherit' });
});
