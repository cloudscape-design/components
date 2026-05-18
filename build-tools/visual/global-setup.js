// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let driverProcess;

module.exports = async () => {
  if (process.env.BROWSER === 'safari') {
    driverProcess = spawn('safaridriver', ['--port', '4444']);
    driverProcess.on('error', err => {
      throw err;
    });
    await waitOn({ resources: ['http-get://localhost:4444/status'], timeout: 10000 });
  } else {
    const { startWebdriver } = require('@cloudscape-design/browser-test-tools/chrome-launcher');
    await startWebdriver();
  }
  global.__DRIVER_PROCESS__ = driverProcess;
};
