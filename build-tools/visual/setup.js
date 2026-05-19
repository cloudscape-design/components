// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* global jest */
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

// Retries help with flaky tests, but Safari's single-session constraint means
// a retry can hit "already paired" if the previous attempt's session hasn't
// fully released. Disable retries for Safari.
if (!isSafari) {
  jest.retryTimes(2, { logErrorsBeforeRetry: true });
}
