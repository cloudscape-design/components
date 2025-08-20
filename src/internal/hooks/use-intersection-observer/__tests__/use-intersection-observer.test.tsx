// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { useIntersectionObserver } from '../../../../../lib/components/internal/hooks/use-intersection-observer';

function TestComponent({ initialState }: { initialState?: boolean }) {
  const { ref, isIntersecting } = useIntersectionObserver({ initialState });
  return <div ref={ref} data-testid="test" data-value={isIntersecting} />;
}

type MockIntersectionObserverCallback = (
  // only fields actually used in our implementation
  entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting' | 'time'>>
) => void;
let mockObserverInstance: (IntersectionObserver & { callback: MockIntersectionObserverCallback }) | undefined;

class MockIntersectionObserver {
  constructor(callback: MockIntersectionObserverCallback) {
    if (mockObserverInstance) {
      throw new Error('only one observer instance expected per test');
    }
    const instance = {
      observe: jest.fn() as IntersectionObserver['observe'],
      disconnect: jest.fn() as IntersectionObserver['disconnect'],
    } as IntersectionObserver;
    mockObserverInstance = {
      ...instance,
      callback,
    };
    return instance;
  }
}

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    expect(mockObserverInstance!.disconnect).toHaveBeenCalled();
    mockObserverInstance = undefined;
  });

  it('should create an observer with the defined target element', () => {
    const { getByTestId } = render(<TestComponent />);
    const target = getByTestId('test');

    expect(mockObserverInstance!.observe).toHaveBeenCalledWith(target);
  });

  it('defaults to not intersecting', () => {
    const { getByTestId } = render(<TestComponent />);
    const target = getByTestId('test');

    expect(target.dataset.value).toBe('false');
  });

  it('allows overriding the default value', () => {
    const { getByTestId } = render(<TestComponent initialState={true} />);
    const target = getByTestId('test');

    expect(target.dataset.value).toBe('true');
  });

  it('updates value with a callback', () => {
    const { getByTestId } = render(<TestComponent />);

    const target = getByTestId('test');
    expect(target.dataset.value).toBe('false');

    act(() => mockObserverInstance!.callback([{ time: 0, isIntersecting: true }]));
    expect(target.dataset.value).toBe('true');

    act(() => mockObserverInstance!.callback([{ time: 0, isIntersecting: false }]));
    expect(target.dataset.value).toBe('false');
  });

  it('should resolve the final state if multiple observations occurred', () => {
    const { getByTestId } = render(<TestComponent />);

    act(() =>
      mockObserverInstance!.callback([
        { time: 0, isIntersecting: true },
        { time: 1, isIntersecting: false },
        { time: 2, isIntersecting: true },
      ])
    );

    const target = getByTestId('test');
    expect(target.dataset.value).toBe('true');
  });

  it('should sort observations by time', () => {
    const { getByTestId } = render(<TestComponent />);

    act(() =>
      mockObserverInstance!.callback([
        { time: 1, isIntersecting: false },
        { time: 2, isIntersecting: true },
        { time: 0, isIntersecting: false },
      ])
    );

    const target = getByTestId('test');
    expect(target.dataset.value).toBe('true');
  });
});
