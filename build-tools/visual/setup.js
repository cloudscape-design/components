// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* global jest */
const { configure } = require('@cloudscape-design/browser-test-tools/use-browser');

// The PR build (the code under test) is served on port 8080.
// The baseline build (main branch, same node_modules) is served on port 8081.
configure({
  browserName: 'ChromeHeadlessIntegration',
  browserCreatorOptions: {
    seleniumUrl: 'http://localhost:9515',
  },
  webdriverOptions: {
    baseUrl: 'http://localhost:8080',
  },
});

jest.retryTimes(2, { logErrorsBeforeRetry: true });
