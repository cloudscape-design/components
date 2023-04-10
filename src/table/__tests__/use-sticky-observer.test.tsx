// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';
import { renderHook } from '../../__tests__/render-hook';
import { useStickyObserver } from '../use-sticky-observer';
import * as intersectionObserver from '../use-intersection-observer';

const mockRegisterChildCallback = jest.fn();
const mockUnregisterChildCallback = jest.fn();

// Mock the useIntersectionObserver hook
Object.defineProperty(intersectionObserver, 'useIntersectionObserver', {
  value: () => ({
    registerChildCallback: mockRegisterChildCallback,
    unregisterChildCallback: mockUnregisterChildCallback,
  }),
});

describe('useStickyObserver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register left callback when isLastStickyLeft is true', () => {
    renderHook(() => useStickyObserver(true, false));

    expect(mockRegisterChildCallback).toHaveBeenCalledWith('left_sentinel', expect.any(Function));
  });

  it('should register right callback when isLastStickyRight is true', () => {
    renderHook(() => useStickyObserver(false, true));

    expect(mockRegisterChildCallback).toHaveBeenCalledWith('right_sentinel', expect.any(Function));
  });

  it('should unregister callbacks on unmount', () => {
    const { unmount } = renderHook(() => useStickyObserver(true, true));

    unmount();

    expect(mockUnregisterChildCallback).toHaveBeenCalledWith('left_sentinel', expect.any(Function));
    expect(mockUnregisterChildCallback).toHaveBeenCalledWith('right_sentinel', expect.any(Function));
  });

  it('should update isStuckToTheLeft and isStuckToTheRight states based on intersection', () => {
    const leftEntry = { isIntersecting: false };
    const rightEntry = { isIntersecting: true };

    mockRegisterChildCallback.mockImplementation((id, callback) => {
      if (id === 'left_sentinel') {
        act(() => {
          callback(leftEntry);
        });
      } else if (id === 'right_sentinel') {
        act(() => {
          callback(rightEntry);
        });
      }
    });

    const { result } = renderHook(() => useStickyObserver(true, true));

    expect(result.current.isStuckToTheLeft).toBe(true);
    expect(result.current.isStuckToTheRight).toBe(false);
  });
});
