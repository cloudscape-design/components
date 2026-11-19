// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { series } = require('gulp');
const glob = require('glob');
const execa = require('execa');
const { task } = require('../utils/gulp-utils.js');

function runJest(name, configFile, testPattern, envOverride) {
  return task(`jest:${name}`, async () => {
    // Jest's file matching logic is different than usual globs: https://github.com/facebook/jest/issues/7108
    // We use glob module to provide specific files
    const files = glob.sync(testPattern);
    await execa('jest', ['-c', configFile, ...files], { stdio: 'inherit', env: { ...process.env, ...envOverride } });
  });
}

// jest has parallellization built-in, no need for concurrency there
module.exports = series(
  runJest('build-tools', 'jest.build-tools.config.js', 'build-tools/**/__tests__/*.test.js', {
    // stylelint rules require ESM
    // https://stylelint.io/migration-guide/to-16#jest-preset-stylelint
    NODE_OPTIONS: '--experimental-vm-modules',
  }),
  runJest('unit', 'jest.unit.config.js', 'src/**/__tests__/**/*.test.{ts,tsx}')
);
