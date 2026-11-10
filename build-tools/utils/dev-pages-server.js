// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const waitOn = require('wait-on');

/**
 * Builds the pages in development mode and serves them at http://localhost:8080 for the browser tests.
 * The tests open many browser sessions, which load a bundled build much faster than the dev server,
 * which serves every module separately.
 *
 * Returns a handle to stop the server.
 */
async function startDevPagesServer({ reactVersion = '16' } = {}) {
  const config = ['--config', 'pages/vite.config.integ.mjs'];
  const env = { NODE_ENV: 'development', REACT_VERSION: reactVersion };
  await execa('vite', ['build', ...config, '--mode', 'development', '--logLevel', 'warn'], { env, stdio: 'inherit' });

  const server = execa('vite', ['preview', ...config], { env, stdio: 'inherit' });
  const serverExit = server.then(
    () => Promise.reject(new Error('The preview server exited unexpectedly')),
    error => Promise.reject(error)
  );
  await Promise.race([waitOn({ resources: ['http://localhost:8080'], timeout: 60_000 }), serverExit]);
  // The server process is a promise itself, wrap it to not wait for its exit when awaiting the result
  return { cancel: () => server.cancel() };
}

module.exports = { startDevPagesServer };
