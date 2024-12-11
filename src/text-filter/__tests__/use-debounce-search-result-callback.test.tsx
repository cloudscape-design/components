// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import useDebounceSearchResultCallback, {
  DebouncedLiveAnnouncementProps,
} from '../../../lib/components/text-filter/use-debounce-search-result-callback';

const TestComponent = (props: DebouncedLiveAnnouncementProps) => {
  useDebounceSearchResultCallback(props);
  return null;
};

const renderTestComponent = (props: DebouncedLiveAnnouncementProps) => {
  const { rerender } = render(<TestComponent {...props} />);
  jest.runAllTimers();

  return {
    rerender,
  };
};

describe('useDebounceSearchResultCallback', () => {
  let announceCallback: () => void;
  beforeEach(() => {
    announceCallback = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('sync filtering (loading = false)', () => {
    test('should not call announceCallback when searchQuery and countText are undefined', () => {
      renderTestComponent({ announceCallback, loading: false, searchQuery: undefined, countText: undefined });
      expect(announceCallback).not.toHaveBeenCalled();
    });

    test('should not call announceCallback when searchQuery is present and countText is undefined', () => {
      renderTestComponent({ announceCallback, loading: false, searchQuery: '', countText: undefined });
      expect(announceCallback).not.toHaveBeenCalled();
    });

    test('should call announceCallback when searchQuery and countText are present', () => {
      renderTestComponent({ announceCallback, loading: false, searchQuery: 'A', countText: '123 matches' });
      expect(announceCallback).toHaveBeenCalledTimes(1);
    });

    test('should call announceCallback twice when searchQuery changes and countText stays the same', () => {
      const { rerender } = renderTestComponent({
        announceCallback,
        loading: false,
        searchQuery: 'A',
        countText: '123 matches',
      });
      rerender(
        <TestComponent
          announceCallback={announceCallback}
          loading={false}
          searchQuery={'AB'}
          countText={'123 matches'}
        />
      );
      jest.runAllTimers();
      expect(announceCallback).toHaveBeenCalledTimes(2);
    });

    test('should call announceCallback twice when searchQuery stays and countText changes', () => {
      const searchQuery = 'A';
      const { rerender } = renderTestComponent({
        announceCallback,
        loading: false,
        searchQuery,
        countText: '123 matches',
      });
      rerender(
        <TestComponent
          announceCallback={announceCallback}
          loading={false}
          searchQuery={searchQuery}
          countText={'1234 matches'}
        />
      );
      jest.runAllTimers();
      expect(announceCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('async filtering (loading = true)', () => {
    test('should not call announceCallback when searchQuery and countText are present', () => {
      renderTestComponent({
        announceCallback,
        loading: true,
        searchQuery: 'A',
        countText: '123 matches',
      });
      expect(announceCallback).not.toHaveBeenCalled();
    });

    test('should not announceCallback when searchQuery and countText are present and loading changes from true to false', () => {
      const searchQuery = 'A';
      const countText = '123 matches';
      const { rerender } = renderTestComponent({
        announceCallback,
        loading: true,
        searchQuery,
        countText,
      });
      expect(announceCallback).not.toHaveBeenCalled();

      rerender(
        <TestComponent
          announceCallback={announceCallback}
          loading={false}
          searchQuery={searchQuery}
          countText={countText}
        />
      );
      jest.runAllTimers();
      expect(announceCallback).toHaveBeenCalledTimes(1);
    });
  });
});
