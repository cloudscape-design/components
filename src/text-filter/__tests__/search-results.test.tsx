// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import { InternalLiveRegionRef } from '../../../lib/components/live-region/internal'; // Adjust path as needed
import { SearchResults } from '../../../lib/components/text-filter/search-results'; // Adjust path as needed

import styles from '../../../lib/components/text-filter/styles.css.js';

const renderSearchResults = (jsx: React.ReactElement, runAllTimers = true) => {
  const { container, rerender } = render(jsx);
  if (runAllTimers) {
    act(() => void jest.runAllTimers());
  }

  return {
    searchResultsElement: container.querySelector(`.${styles.results}`)!,
    liveRegionElement: document.querySelector('[aria-live="polite"]')!,
    rerender,
  };
};

describe('SearchResults', () => {
  let searchResultsRef: React.RefObject<InternalLiveRegionRef>;
  beforeEach(() => {
    jest.useFakeTimers();
    searchResultsRef = createRef<InternalLiveRegionRef>(); // Create a ref to test the imperative handle
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the visible representation and the live region announcement', () => {
    const { searchResultsElement, liveRegionElement } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef}>
        123 results found
      </SearchResults>
    );
    expect(searchResultsElement.textContent).toBe('123 results found');
    expect(liveRegionElement.textContent).toBe('123 results found');
  });

  test('re-announces content when calling the reannounce', () => {
    const { liveRegionElement } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef}>
        123 results found
      </SearchResults>
    );

    // Initial state
    expect(liveRegionElement.textContent).toBe('123 results found');

    // Trigger reannounce which suffixes a dot in the polite region.
    searchResultsRef.current!.reannounce();
    act(() => void jest.runAllTimers());
    expect(liveRegionElement.textContent).toBe('123 results found.');

    // Trigger another reannounce which removes the suffixed dot in the polite region.
    searchResultsRef.current!.reannounce();
    act(() => void jest.runAllTimers());
    expect(liveRegionElement.textContent).toBe('123 results found');
  });

  test('debounce announcement on multiple reannounce calls', () => {
    const { liveRegionElement } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef}>
        123 results found
      </SearchResults>
    );

    // Initial state
    expect(liveRegionElement.textContent).toBe('123 results found');

    // Trigger multiple re-announce which suffixes the dot.
    // Without debouncing, it would suffix the dot on the first call
    // and remove the suffix dot on the second call. This would not re-announce the countText.
    searchResultsRef.current!.reannounce();
    searchResultsRef.current!.reannounce();
    act(() => void jest.runAllTimers());
    expect(liveRegionElement.textContent).toBe('123 results found.');

    // Again: multiple re-announce calls to removes the suffixed dot.
    // Without debouncing, it would remove the suffixed dot on the first call
    // and would suffix the dot on the second call. This would not re-announce the countText.
    searchResultsRef.current!.reannounce();
    searchResultsRef.current!.reannounce();
    searchResultsRef.current!.reannounce();
    searchResultsRef.current!.reannounce();
    act(() => void jest.runAllTimers());
    expect(liveRegionElement.textContent).toBe('123 results found');
  });

  test('setting countText and calling reannounce immediately does the live announcement only once', () => {
    const { liveRegionElement } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef}>
        123 results found
      </SearchResults>,
      false
    );

    // Initially trigger the live announcement node is empty.
    expect(liveRegionElement.textContent).toBe('');

    // Initial announcement + reannounce call get debounced and announces only once.
    // This is indicated by not having a suffixed dot.
    searchResultsRef.current!.reannounce();
    act(() => void jest.runAllTimers());
    expect(liveRegionElement.textContent).toBe('123 results found');
  });
});
