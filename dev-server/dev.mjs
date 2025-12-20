// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Development startup script that:
 * 1. Starts the build watcher (gulp watch)
 * 2. Waits for the initial build to complete
 * 3. Starts the demo server
 * 4. Handles graceful shutdown
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Track child processes for cleanup
const childProcesses = [];

/**
 * Spawns a child process and tracks it for cleanup
 */
function spawnProcess(command, args, options = {}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: rootDir,
    ...options,
  });

  childProcesses.push(proc);

  proc.on('error', err => {
    console.error(`Error starting ${command}:`, err.message);
  });

  return proc;
}

/**
 * Gracefully shuts down all child processes
 */
function shutdown() {
  console.log('\nShutting down...');

  for (const proc of childProcesses) {
    if (proc && !proc.killed) {
      proc.kill('SIGTERM');
    }
  }

  // Force exit after a timeout if processes don't terminate
  setTimeout(() => {
    console.log('Force exiting...');
    // eslint-disable-next-line no-undef
    process.exit(0);
  }, 3000);
}

/**
 * Waits for the lib/components directory to exist (initial build complete)
 */
async function waitForBuild() {
  const { existsSync } = await import('node:fs');
  const componentsPath = path.resolve(rootDir, 'lib/components');

  // If lib/components already exists, no need to wait
  if (existsSync(componentsPath)) {
    console.log('Build artifacts found, starting demo server...');
    return;
  }

  console.log('Waiting for initial build to complete...');

  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      if (existsSync(componentsPath)) {
        clearInterval(checkInterval);
        console.log('Build complete, starting demo server...');
        resolve();
      }
    }, 1000);
  });
}

/**
 * Main entry point
 */
async function main() {
  // Set up signal handlers for graceful shutdown
  // eslint-disable-next-line no-undef
  process.on('SIGINT', shutdown);
  // eslint-disable-next-line no-undef
  process.on('SIGTERM', shutdown);

  console.log('Starting development environment...\n');

  // Start the build watcher
  console.log('Starting build watcher (gulp watch)...');
  const watchProc = spawnProcess('npx', ['gulp', 'watch']);

  watchProc.on('exit', code => {
    if (code !== null && code !== 0) {
      console.error(`Build watcher exited with code ${code}`);
      shutdown();
    }
  });

  // Wait for initial build to complete
  await waitForBuild();

  // Start the demo server
  console.log('Starting demo server...');
  const serverProc = spawnProcess('node', ['dev-server/server.mjs']);

  serverProc.on('exit', code => {
    if (code !== null && code !== 0) {
      console.error(`Demo server exited with code ${code}`);
      shutdown();
    }
  });
}

main().catch(err => {
  console.error('Failed to start development environment:', err);
  shutdown();
});
