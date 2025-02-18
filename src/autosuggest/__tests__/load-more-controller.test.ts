// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { act, renderHook } from '../../__tests__/render-hook';
import { OptionsLoadItemsDetail } from '../../internal/components/dropdown/interfaces';
import { useAutosuggestLoadMore } from '../load-more-controller';

describe('Autosuggest load-more-controller', () => {
  test('calls onLoadItems on input focus', () => {
    const onLoadItems = jest.fn();
    const { result } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [], statusType: 'error', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnInputFocus());
    expect(onLoadItems).toHaveBeenCalledWith({ firstPage: true, samePage: false, filteringText: '' });
  });

  test('calls onLoadItems on input change', () => {
    const onLoadItems = jest.fn();
    const { result } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [], statusType: 'error', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnInputChange('a'));
    act(() => result.current.fireLoadMoreOnInputChange('ab'));
    act(() => result.current.fireLoadMoreOnInputChange('ab'));
    expect(onLoadItems).toHaveBeenCalledTimes(2);
    expect(onLoadItems).toHaveBeenCalledWith({ firstPage: true, samePage: false, filteringText: 'a' });
    expect(onLoadItems).toHaveBeenCalledWith({ firstPage: true, samePage: false, filteringText: 'ab' });
  });

  test('calls onLoadItems on recovery click', () => {
    const onLoadItems = jest.fn();
    const { result } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [], statusType: 'error', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnRecoveryClick());
    expect(onLoadItems).toHaveBeenCalledWith({ firstPage: false, samePage: true, filteringText: '' });
  });

  test('only calls onLoadItems on scroll when options are not empty and status is pending', () => {
    const onLoadItems = jest.fn();
    const { result, rerender } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [{ value: 'Option 0' }], statusType: 'pending', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnScroll());
    expect(onLoadItems).toHaveBeenCalledWith({ firstPage: false, samePage: false, filteringText: '' });

    rerender({ options: [], statusType: 'pending', onLoadItems });
    act(() => result.current.fireLoadMoreOnScroll());

    rerender({ options: [{ value: 'Option 0' }], statusType: 'finished', onLoadItems });
    act(() => result.current.fireLoadMoreOnScroll());

    rerender({ options: [{ value: 'Option 0' }], statusType: 'loading', onLoadItems });
    act(() => result.current.fireLoadMoreOnScroll());

    rerender({ options: [{ value: 'Option 0' }], statusType: 'error', onLoadItems });
    act(() => result.current.fireLoadMoreOnScroll());

    expect(onLoadItems).toHaveBeenCalledTimes(1);
  });

  test('returns current filtering text when called on input focus', () => {
    let filteringText = '';
    const onLoadItems = (detail: OptionsLoadItemsDetail) => {
      filteringText = detail.filteringText;
    };
    const { result } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [], statusType: 'error', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnInputChange('input'));
    act(() => result.current.fireLoadMoreOnInputFocus());
    expect(filteringText).toBe('input');
  });

  test('does not override filtering text when called on recovery or scroll', () => {
    let filteringText = '';
    const onLoadItems = (detail: OptionsLoadItemsDetail) => {
      filteringText = detail.filteringText;
    };
    const { result } = renderHook(useAutosuggestLoadMore, {
      initialProps: { options: [{ value: 'Option 0' }], statusType: 'pending', onLoadItems },
    });
    act(() => result.current.fireLoadMoreOnInputChange('input'));
    act(() => result.current.fireLoadMoreOnRecoveryClick());
    act(() => result.current.fireLoadMoreOnScroll());
    expect(filteringText).toBe('input');
  });
});
