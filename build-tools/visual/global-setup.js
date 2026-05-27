// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { spawn } = require('child_process');
const waitOn = require('wait-on');

module.exports = async () => {
  if (process.env.BROWSER === 'safari') {
    // Kill any lingering safaridriver process from a previous run to ensure
    // no stale sessions exist (Safari only supports one session at a time).
    const { execSync } = require('child_process');
    try {
      execSync('pkill -f safaridriver', { stdio: 'ignore' });
      // Give the OS a moment to release the port.
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      // No existing process — that's fine.
    }

    const driverProcess = spawn('safaridriver', ['--port', '4444']);
    driverProcess.on('error', err => {
      throw err;
    });
    await waitOn({ resources: ['http-get://localhost:4444/status'], timeout: 10000 });
    global.__DRIVER_PROCESS__ = driverProcess;
  } else {
    const { startWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
    await startWebdriver();
  }
};
