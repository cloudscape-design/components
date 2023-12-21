// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const os = require('os');

module.exports = {
  verbose: true,
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.integ.json',
    },
  },
  reporters: ['default', 'github-actions'],
  testTimeout: 60_000, // 1min
  maxWorkers: os.cpus().length * (process.env.GITHUB_ACTION ? 3 : 1),
  globalSetup: '<rootDir>/build-tools/integ/global-setup.js',
  globalTeardown: '<rootDir>/build-tools/integ/global-teardown.js',
  setupFilesAfterEnv: [path.join(__dirname, 'build-tools', 'integ', 'setup.motion.js')],
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '(/(__motion__|__integ__)/.*(\\.|/)test)\\.[jt]sx?$',
  preset: 'ts-jest',
};
