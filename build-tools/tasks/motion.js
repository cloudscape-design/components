// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const { startDevPagesServer } = require('../utils/dev-pages-server.js');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');

module.exports = task('test:motion', async () => {
  const options = {
    reactVersion: { type: 'string' },
  };
  const { reactVersion = '16' } = parseArgs({ options, strict: false }).values;
  const devServer = await startDevPagesServer({ reactVersion });

  const files = glob.sync('src/**/__motion__/**/*.test.ts');
  await execa('jest', ['-c', 'jest.motion.config.js', ...files], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
  });

  devServer.cancel();
});
