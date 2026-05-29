// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const os = require('os');

module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.integ.json',
      },
    ],
  },
  reporters: ['default', 'github-actions'],
  testTimeout: 120_000, // 2min — pages can be tall and slow to capture
  maxWorkers: os.cpus().length * (process.env.GITHUB_ACTION ? 3 : 1),
  globalSetup: '<rootDir>/build-tools/visual/global-setup.js',
  globalTeardown: '<rootDir>/build-tools/visual/global-teardown.js',
  setupFilesAfterEnv: [path.join(__dirname, 'build-tools', 'visual', 'setup.js')],
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/test/visual/**/*.test.ts'],
};
