// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const path = require('path');
const fs = require('fs');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');

const BASELINE_WORKTREE = '/tmp/visual-baseline';
const BASELINE_OUTPUT = path.resolve('pages/lib/static-visual-baseline');
const TEST_OUTPUT = path.resolve('pages/lib/static-default');

// Port assignments:
//   8080 — test build (PR / local changes)
//   8081 — baseline build (main branch)
const TEST_PORT = 8080;
const BASELINE_PORT = 8081;

/**
 * Serves a pre-built static directory using webpack-dev-server in static mode.
 */
function serveStatic(dir, port) {
  return execa(
    'node_modules/.bin/webpack',
    ['serve', '--config', 'pages/webpack.config.integ.cjs', '--port', String(port), '--static', dir, '--no-hot'],
    { env: { ...process.env, NODE_ENV: 'development' } }
  );
}

/**
 * Builds the dev pages from the source tree at `cwd` into `outputPath`.
 * Uses the node_modules present in `cwd`.
 */
async function buildPages(cwd, outputPath) {
  await execa('npx', ['gulp', 'quick-build'], {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  await execa(
    path.join(cwd, 'node_modules/.bin/webpack'),
    ['--config', 'pages/webpack.config.integ.cjs', '--output-path', outputPath],
    { stdio: 'inherit', cwd, env: { ...process.env, NODE_ENV: 'production' } }
  );
}

module.exports = task('test:visual', async () => {
  const options = {
    shard: { type: 'string' },
    // Pass --skip-build to skip the build steps when artifacts are already present.
    skipBuild: { type: 'boolean' },
  };
  const { shard, skipBuild } = parseArgs({ options, strict: false }).values;

  const cwd = process.cwd();

  if (!skipBuild) {
    // ── 1. Build the test (PR) pages ────────────────────────────────────────
    console.log('Building test pages (current branch)…');
    await buildPages(cwd, TEST_OUTPUT);

    // ── 2. Build the baseline (main) pages ──────────────────────────────────
    // Create a worktree for origin/main so it gets its own node_modules.
    // This correctly handles PRs that change package-lock.json: each side
    // installs from its own lockfile.
    console.log('Setting up baseline worktree from origin/main…');
    if (fs.existsSync(BASELINE_WORKTREE)) {
      await execa('git', ['worktree', 'remove', '--force', BASELINE_WORKTREE]);
    }
    await execa('git', ['worktree', 'add', BASELINE_WORKTREE, 'origin/main']);

    try {
      console.log('Installing baseline dependencies…');
      await execa('npm', ['ci'], { stdio: 'inherit', cwd: BASELINE_WORKTREE });

      console.log('Building baseline pages (origin/main)…');
      await buildPages(BASELINE_WORKTREE, BASELINE_OUTPUT);
    } finally {
      await execa('git', ['worktree', 'remove', '--force', BASELINE_WORKTREE]);
    }
  }

  // ── 3. Start both static servers ──────────────────────────────────────────
  console.log(`Starting test server on :${TEST_PORT} (${TEST_OUTPUT})…`);
  const testServer = serveStatic(TEST_OUTPUT, TEST_PORT);

  console.log(`Starting baseline server on :${BASELINE_PORT} (${BASELINE_OUTPUT})…`);
  const baselineServer = serveStatic(BASELINE_OUTPUT, BASELINE_PORT);

  try {
    await waitOn({ resources: [`http://localhost:${TEST_PORT}`, `http://localhost:${BASELINE_PORT}`] });

    // ── 4. Run visual tests ──────────────────────────────────────────────────
    const jestArgs = ['-c', 'jest.visual.config.js'];
    if (shard) {
      jestArgs.push(`--shard=${shard}`);
    }
    await execa('jest', jestArgs, {
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
    });
  } finally {
    testServer.cancel();
    baselineServer.cancel();
  }
});
