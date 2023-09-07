// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');
const { last } = require('lodash');

function extractCurrentRunningShard() {
  const lastArg = last(process.argv);

  if (lastArg) {
    return lastArg.split('=')[1];
  }
  console.warn('No jest shard provided, could be running in local dev mode');
  return null;
}
module.exports = task('test:a11y', async () => {
  const shard = extractCurrentRunningShard();
  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.js'], {
    env: {
      NODE_ENV: 'development',
    },
  });
  await waitOn({ resources: ['http://localhost:8080'] });

  const files = glob.sync('src/**/__a11y__/**/*.test.ts');
  const commands = ['-c', 'jest.integ.config.js', ...files];
  if (shard) {
    commands.push(`--shard=${shard}`);
  }
  await execa('jest', commands, {
    stdio: 'inherit',
  });

  devServer.cancel();
});
