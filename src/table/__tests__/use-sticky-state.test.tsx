// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';
import { renderHook } from '../../__tests__/render-hook';
import { useStickyState } from '../use-sticky-state';
import { useStickyColumnsContext } from '../sticky-columns-context';

jest.mock('../sticky-columns-context', () => ({
  useStickyColumnsContext: jest.fn(),
}));

const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

describe('useStickyState', () => {
  beforeEach(() => {
    (useStickyColumnsContext as jest.Mock).mockImplementation(() => ({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register left callback when isLastStickyLeft is true', () => {
    renderHook(() => useStickyState(true, false));

    expect(mockSubscribe).toHaveBeenCalled();
    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });

  it('should register left callback when isLastStickyLeft is true', () => {
    renderHook(() => useStickyState(true, false));

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  it('should register right callback when isLastStickyRight is true', () => {
    renderHook(() => useStickyState(false, true));

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  it('should unregister callbacks on unmount', () => {
    const { unmount } = renderHook(() => useStickyState(true, true));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
  });

  it('should update isStuckToTheLeft and isStuckToTheRight states based on scroll position', () => {
    const { result: leftResult } = renderHook(() => useStickyState(true, false));
    const { result: rightResult } = renderHook(() => useStickyState(false, true));

    act(() => {
      const leftCallback = mockSubscribe.mock.calls[0][0];
      const rightCallback = mockSubscribe.mock.calls[1][0];

      leftCallback({ left: true });
      rightCallback({ right: false });
    });

    expect(leftResult.current.isStuckToTheLeft).toBe(true);
    expect(leftResult.current.isStuckToTheRight).toBe(false);
    expect(rightResult.current.isStuckToTheLeft).toBe(false);
    expect(rightResult.current.isStuckToTheRight).toBe(false);
  });
});
