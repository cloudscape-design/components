// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../__tests__/render-hook';
import useScrollSpy from '../scroll-spy';

// Mocking window and document functions/variables
const setWindowPageYOffset = (y: number) => {
  Object.defineProperty(window, 'pageYOffset', {
    value: y,
  });
};

const mockGetElementById = () => {
  document.getElementById = jest.fn(() => ({
    getBoundingClientRect: jest.fn(() => ({ bottom: 300 })),
  })) as unknown as (elementId: string) => HTMLElement | null;
};

describe('useScrollSpy hook', () => {
  beforeEach(() => {
    setWindowPageYOffset(0);
    mockGetElementById();
  });

  it('should update currentHref based on scroll position', () => {
    const { result } = renderHook(() => useScrollSpy({ hrefs: ['#section1', '#section2'] }));

    act(() => {
      setWindowPageYOffset(0);
      window.dispatchEvent(new Event('scroll'));
    });

    // Replace the following with your actual condition based on which href should be active
    expect(result.current[0]).toBe('#section1');
  });

  it('should set disableTracking', () => {
    const { result } = renderHook(() => useScrollSpy({ hrefs: ['#section1', '#section2'] }));

    act(() => {
      result.current[2](true);
    });

    expect(result.current[2]).toBe(true);
  });

  // Add more tests as needed
});
