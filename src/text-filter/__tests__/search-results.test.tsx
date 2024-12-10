// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { act, render } from '@testing-library/react';

import { InternalLiveRegionRef } from '../../../lib/components/live-region/internal'; // Adjust path as needed
import createWrapper from '../../../lib/components/test-utils/dom';
import { SearchResults } from '../../../lib/components/text-filter/search-results'; // Adjust path as needed

import styles from '../../../lib/components/text-filter/styles.css.js';

const renderSearchResults = (jsx: React.ReactElement, runAllTimers = true) => {
  const { container, rerender } = render(jsx);
  if (runAllTimers) {
    act(() => void jest.runAllTimers());
  }

  return {
    searchResultsElement: container.querySelector(`.${styles.results}`)!,
    wrapper: createWrapper(container),
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

  test('renders the visible representation and live region component when renderLiveRegion set to true', () => {
    const { searchResultsElement, wrapper } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef} renderLiveRegion={true}>
        123 results found
      </SearchResults>
    );
    expect(searchResultsElement.textContent).toBe('123 results found');
    expect(wrapper.findLiveRegion()!.getElement().textContent).toBe('123 results found');
  });

  test('renders the visible representation and no live region component when renderLiveRegion set to false', () => {
    const { searchResultsElement, wrapper } = renderSearchResults(
      <SearchResults id="search-results-id" ref={searchResultsRef} renderLiveRegion={false}>
        123 results found
      </SearchResults>
    );
    expect(searchResultsElement.textContent).toBe('123 results found');
    expect(wrapper.findLiveRegion()).toBeNull();
  });

  // TODO add test if reannounce is called; mock InternalLiveRegion's reannounce and validate if it's called as expected.
});
