// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* global jest, beforeEach */
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

// Safari's WebDriver needs a moment to fully release a session before a new one
// can be created. Without this delay, the next test hits "already paired" errors.
if (isSafari) {
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
  });
}
