// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { InternalLiveRegionRef } from '../../../lib/components/live-region/internal'; // Adjust path as needed
import createWrapper from '../../../lib/components/test-utils/dom';
import { SearchResults } from '../../../lib/components/text-filter/search-results'; // Adjust path as needed

import styles from '../../../lib/components/text-filter/styles.css.js';

const renderSearchResults = (renderLiveRegion: boolean) => {
  const ref = createRef<InternalLiveRegionRef>(); // Create a ref to test the imperative handle
  const { container } = render(
    <SearchResults id="dummy-id" ref={ref} renderLiveRegion={renderLiveRegion}>
      123 results found
    </SearchResults>
  );
  jest.runAllTimers();

  return {
    searchResults: container.querySelector(`.${styles.results}`)!,
    politeRegion: document.querySelector('[aria-live=polite]')!,
    wrapper: createWrapper(container),
    ref,
  };
};

describe('SearchResults', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders the content and live region content when renderLiveRegion is set to true', () => {
    const { searchResults, wrapper } = renderSearchResults(true);
    expect(searchResults.textContent).toBe('123 results found');
    expect(wrapper.findLiveRegion()!.getElement().textContent).toBe('123 results found');
  });

  test('renders the content and no live region content when renderLiveRegion set to false', () => {
    const { searchResults, wrapper } = renderSearchResults(false);
    expect(searchResults.textContent).toBe('123 results found');
    expect(wrapper.findLiveRegion()).toBeNull();
  });

  test('calling `reannounce` on SearchResults re-announces the live region content', async () => {
    const { politeRegion, ref } = renderSearchResults(true);
    await waitFor(() => expect(politeRegion).toHaveTextContent('123 results found'));
    act(() => {
      ref.current?.reannounce();
      jest.runAllTimers();
    });
    await waitFor(() => expect(politeRegion).toHaveTextContent('123 results found.'));
  });
});
