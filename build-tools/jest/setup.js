// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// we load this file in both SSR and DOM environment, but these utilities are only needed in DOM
if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom/extend-expect');
  const { cleanup } = require('@testing-library/react');
  afterEach(cleanup);

  // Autosuggest input blur handler uses document.hasFocus() to optimize user experience when focus leaves the page.
  // In JSDOM the hasFocus() always returns false which differs from the in-browser experience, so setting it to true using mock.
  // See: https://github.com/jsdom/jsdom/issues/3794
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    jest.spyOn(window.document, 'hasFocus').mockImplementation(() => true);
  });
}
