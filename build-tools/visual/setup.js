// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* global jest, beforeEach */
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const { configure } = require('@cloudscape-design/browser-test-tools/use-browser');

const isSafari = process.env.BROWSER === 'safari';

// The PR build (the code under test) is served on port 8080.
// The baseline build (main branch, same node_modules) is served on port 8081.
configure({
  browserName: isSafari ? 'Safari' : 'ChromeHeadlessIntegration',
  browserCreatorOptions: {
    seleniumUrl: isSafari ? 'http://localhost:4444' : 'http://localhost:9515',
  },
  webdriverOptions: {
    baseUrl: 'http://localhost:8080',
  },
});

jest.retryTimes(2, { logErrorsBeforeRetry: true });

// Local safaridriver only supports one session at a time and doesn't reliably
// release the session lock between tests. Restarting the process before each
// test guarantees a clean state. This is not needed with BrowserStack.
if (isSafari) {
  let safariDriverProcess;

  beforeEach(async () => {
    if (safariDriverProcess) {
      safariDriverProcess.kill();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    safariDriverProcess = spawn('safaridriver', ['--port', '4444']);
    await waitOn({ resources: ['http-get://localhost:4444/status'], timeout: 10000 });
  });
}
