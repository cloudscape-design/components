// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { SearchResults, SearchResultsProps } from '../../../lib/components/text-filter/search-results'; // Adjust path as needed
import { mockInnerText } from '../../internal/analytics/__tests__/mocks';

import styles from '../../../lib/components/text-filter/styles.css.js';

mockInnerText();

describe('SearchResults Component', () => {
  let ref: React.RefObject<SearchResultsProps.Ref>;

  beforeEach(() => {
    jest.useFakeTimers();
    ref = React.createRef<SearchResultsProps.Ref>(); // Create a ref to test the imperative handle
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('contains the visible representation and the invisible live region', () => {
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        123 results found
      </SearchResults>
    );
    act(() => {
      jest.runAllTimers();
    });

    const visibleResultText = container.querySelector(`.${styles.results}`)!;
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;
    expect(visibleResultText.textContent).toBe('123 results found');
    expect(liveRegionText.textContent).toBe('123 results found');
  });

  test('re-announces when calling the renderCountTextAriaLive', () => {
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        123 results found
      </SearchResults>
    );
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;

    // Initial state
    act(() => {
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found');

    // Trigger the re-announcement which suffixes the dot.
    act(() => {
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found.');

    // Trigger the re-announcement which removes the suffixed the dot.
    act(() => {
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found');
  });

  test('debounce multiple renderCountTextAriaLive calls', () => {
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        123 results found
      </SearchResults>
    );
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;

    // Initial state
    act(() => {
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found');

    // Trigger multiple re-announce which suffixes the dot.
    // Without debouncing, it would suffix the dot on the first call
    // and remove the suffix dot on the second call. This would not re-announce the countText.
    act(() => {
      ref.current!.renderCountTextAriaLive();
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found.');

    // Again: multiple re-announce calls to removes the suffixed dot.
    // Without debouncing, it would remove the suffixed dot on the first call
    // and would suffix the dot on the second call. This would not re-announce the countText.
    act(() => {
      ref.current!.renderCountTextAriaLive();
      ref.current!.renderCountTextAriaLive();
      ref.current!.renderCountTextAriaLive();
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found');
  });

  test('setting countText and calling renderCountTextAriaLive immoderate does the live announcement', () => {
    const { container } = render(
      <SearchResults id="search-results-id" ref={ref}>
        123 results found
      </SearchResults>
    );
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;
    // Initially trigger the live announcement node is empty.
    expect(liveRegionText.textContent).toBe('');

    // Triggering renderCountTextAriaLive will suffix the dot on the initial announcement.
    act(() => {
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('123 results found');
  });

  test('live announce initial countText and changed count text', () => {
    const { container, rerender } = render(<SearchResults id="search-results-id">18 matches</SearchResults>);
    act(() => {
      jest.runAllTimers();
    });
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;
    expect(liveRegionText.textContent).toBe('18 matches');

    rerender(<SearchResults id="search-results-id">9999 matches</SearchResults>);
    act(() => {
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('9999 matches');
  });

  test('calling renderCountTextAriaLive on change count text announces correctly', () => {
    const { container, rerender } = render(
      <SearchResults id="search-results-id" ref={ref}>
        18 matches
      </SearchResults>
    );
    act(() => {
      jest.runAllTimers();
    });
    const liveRegionText = container.querySelector(`[aria-live="polite"]`)!;
    expect(liveRegionText.textContent).toBe('18 matches');
    act(() => {
      ref.current!.renderCountTextAriaLive();
    });
    expect(liveRegionText.textContent).toBe('18 matches');

    rerender(
      <SearchResults id="search-results-id" ref={ref}>
        9999 matches
      </SearchResults>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('9999 matches');
    act(() => {
      ref.current!.renderCountTextAriaLive();
      jest.runAllTimers();
    });
    expect(liveRegionText.textContent).toBe('9999 matches.');
  });
});
