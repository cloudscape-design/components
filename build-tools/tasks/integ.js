// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');

module.exports = task('test:integ', async () => {
  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.js'], {
    env: {
      NODE_ENV: 'development',
    },
  });
  await waitOn({ resources: ['http://localhost:8080'] });

  // const files = glob.sync('src/**/__integ__/**/*.test.ts');
  const files = glob.sync('src/mixed-line-bar-chart/__integ__/mixed-line-bar-chart.test.ts');
  await execa('jest', ['-c', 'jest.integ.config.js', ...files], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
  });

  devServer.cancel();
});
