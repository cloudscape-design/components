// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');

module.exports = task('test:motion', async () => {
  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.js'], {
    env: {
      NODE_ENV: 'development',
    },
  });
  await waitOn({ resources: ['http://localhost:8080'] });

  const files = glob.sync('src/**/__motion__/**/*.test.ts');
  await execa('jest', ['-c', 'jest.motion.config.js', ...files], { stdio: 'inherit' });

  devServer.cancel();
});
