// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { SearchResults, SearchResultsProps } from '../../../lib/components/text-filter/search-results'; // Adjust path as needed
import styles from '../../../lib/components/text-filter/styles.css.js';

describe('SearchResults Component', () => {
  let ref: React.RefObject<SearchResultsProps.Ref>;

  beforeEach(() => {
    jest.useFakeTimers();
    ref = React.createRef<SearchResultsProps.Ref>(); // Create a ref to test the imperative handle
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('contains the visible representation and the invisible live region', () => {
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        123 results found
      </SearchResults>
    );

    const resultsSpan = screen.queryAllByText('123 results found');
    expect(resultsSpan.length).toBe(2);

    const visibleResultText = container.querySelector(`.${styles.results}`);
    const liveRegionText = container.querySelector(`#search-results-id`);
    expect(visibleResultText!.textContent).toBe('123 results found');
    expect(liveRegionText!.textContent).toBe('123 results found');
  });

  it('reannounces countText', () => {
    const countText = '123 results found';
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        {countText}
      </SearchResults>
    );

    // Initial state
    const liveRegionText = container.querySelector(`#search-results-id`);
    expect(liveRegionText!.textContent).toBe('123 results found');

    // Trigger reannounce adds the dot.
    act(() => {
      ref.current!.reannounceCountText();
    });
    jest.runAllTimers();
    expect(liveRegionText!.textContent).toBe('123 results found.');

    // Trigger again reannounce removes the dot.
    act(() => {
      ref.current!.reannounceCountText();
    });
    jest.runAllTimers();
    expect(liveRegionText!.textContent).toBe('123 results found');
  });
});
