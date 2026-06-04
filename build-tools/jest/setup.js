// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* globals afterEach */

// we load this file in both SSR and DOM environment, but these utilities are only needed in DOM
if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom/extend-expect');
  const { cleanup } = require('@testing-library/react');
  afterEach(cleanup);
}

// jsdom doesn't implement ResizeObserver. Provide a no-op mock so components
// that use it (e.g. PromptInput) can render without errors in unit tests.
if (window && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
