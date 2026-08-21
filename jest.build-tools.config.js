// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js'],
  reporters: ['default', 'github-actions'],
  // themes-persistence.test.js spawns real `gulp quick-build` processes and mutates the real
  // lib/ output (~60s) — too heavy/risky to run on every `npm test`/PR. Run it explicitly:
  //   npx jest -c jest.build-tools.config.js --testPathIgnorePatterns='/node_modules/' themes-persistence
  testPathIgnorePatterns: ['/node_modules/', 'themes-persistence.test.js'],
};
