// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');
const { getReactVersion } = require('../../pages/webpack.react-versions.cjs');

module.exports = task('test:a11y', async () => {
  const options = {
    shard: { type: 'string' },
    reactVersion: { type: 'string' },
  };
  const { shard, reactVersion: reactVersionArg } = parseArgs({ options, strict: false }).values;
  const reactVersion = getReactVersion(reactVersionArg).version;
  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.cjs'], {
    env: {
      NODE_ENV: 'development',
      REACT_VERSION: reactVersion,
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
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules', REACT_VERSION: reactVersion },
  });

  devServer.cancel();
});
