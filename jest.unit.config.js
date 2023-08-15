// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const merge = require('lodash/merge');
const tsPreset = require('ts-jest/jest-preset');
const cloudscapePreset = require('@cloudscape-design/jest-preset/jest-preset');

module.exports = merge({}, tsPreset, cloudscapePreset, {
  verbose: true,
  testEnvironment: 'jsdom',
  reporters: ['default', 'github-actions'],
  collectCoverage: true, // process.env.CI === 'true',
  coveragePathIgnorePatterns: [
    '__tests__',
    '__integ__',
    '/design-tokens/',
    '/node_modules/',
    'styles.css.js$',
    'styles.scoped.css$',
    'styles.selectors.js$',
    'icons.js$',
    'environment.js$',
    '/internal\\/vendor/',
    '<rootDir>/pages',
  ],
  coverageThreshold: {
    global: {
      branches: 82,
      functions: 88,
      lines: 90,
      statements: 90,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.unit.json',
    },
  },
  transform: {
    '(?!node_modules).*/lib/(components|design-tokens)/.*\\.js$': require.resolve(
      '@cloudscape-design/jest-preset/js-transformer'
    ),
    '(?!node_modules).*/lib/components/.*\\.css$': require.resolve('@cloudscape-design/jest-preset/css-transformer'),
  },
  setupFilesAfterEnv: [path.join(__dirname, 'build-tools', 'jest', 'setup.js')],
  testRegex: '(/__tests__/.*(\\.|/)test)\\.[jt]sx?$',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'd.ts'],
});
