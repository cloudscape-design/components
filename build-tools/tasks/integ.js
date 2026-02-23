// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');

module.exports = task('test:integ', async () => {
  const options = {
    shard: { type: 'string' },
    reactVersion: { type: 'string' },
    // Use 'dev' for on-demand compilation (faster local iteration)
    // Use 'preview' for pre-built static files (more reliable in CI)
    mode: { type: 'string' },
  };
  const { shard, reactVersion = '16', mode } = parseArgs({ options, strict: false }).values;

  // Default to 'preview' mode in CI, 'dev' mode locally
  const serverMode = mode ?? (process.env.CI ? 'preview' : 'dev');
  let server;

  if (serverMode === 'preview') {
    // Build the pages first, then serve with Vite preview
    console.log('Building pages for integration tests...');
    await execa('vite', ['build', '--config', 'vite.config.integ.js'], {
      stdio: 'inherit',
      env: {
        NODE_ENV: 'production',
        REACT_VERSION: reactVersion,
      },
    });

    console.log('Starting Vite preview server...');
    server = execa('vite', ['preview', '--config', 'vite.config.integ.js', '--port', '8080'], {
      env: {
        REACT_VERSION: reactVersion,
      },
    });
  } else {
    // Use Vite dev server for on-demand compilation
    console.log('Starting Vite dev server...');
    server = execa('vite', ['--config', 'vite.config.integ.js'], {
      env: {
        NODE_ENV: 'development',
        REACT_VERSION: reactVersion,
      },
    });
  }

  await waitOn({ resources: ['http://localhost:8080'] });

  const files = glob.sync('src/**/__integ__/**/*.test.ts');
  const commands = ['-c', 'jest.integ.config.js', ...files];
  if (shard) {
    commands.push(`--shard=${shard}`);
  }
  await execa('jest', commands, {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules', REACT_VERSION: reactVersion },
  });

  server.cancel();
});
