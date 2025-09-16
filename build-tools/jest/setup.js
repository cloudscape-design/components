// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* globals afterEach */

// we load this file in both SSR and DOM environment, but these utilities are only needed in DOM
if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom/extend-expect');
  const { cleanup } = require('@testing-library/react');
  afterEach(cleanup);

  // Mock ResizeObserver for JSDOM environment
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
