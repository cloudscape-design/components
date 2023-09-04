// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');

module.exports = task('test:a11y', async () => {
  const shard = process.argv[process.argv.length - 1].split('=')[1];
  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.js'], {
    env: {
      NODE_ENV: 'development',
    },
  });
  await waitOn({ resources: ['http://localhost:8080'] });

  const files = glob.sync('src/**/__a11y__/**/*.test.ts');
  await execa(
    'jest',
    ['-c', 'jest.integ.config.js', ...files, `--shard=${shard}`, '--passWithNoTests', '--runInBand'],
    {
      stdio: 'inherit',
    }
  );

  devServer.cancel();
});
