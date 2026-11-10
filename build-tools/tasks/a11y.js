// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const { startDevPagesServer } = require('../utils/dev-pages-server.js');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');

module.exports = task('test:a11y', async () => {
  const options = {
    shard: {
      type: 'string',
    },
  };
  const shard = parseArgs({ options, strict: false }).values.shard;
  const devServer = await startDevPagesServer();

  const files = glob.sync('src/**/__a11y__/**/*.test.ts');
  const commands = ['-c', 'jest.integ.config.js', ...files];
  if (shard) {
    commands.push(`--shard=${shard}`);
  }
  await execa('jest', commands, {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
  });

  devServer.cancel();
});
