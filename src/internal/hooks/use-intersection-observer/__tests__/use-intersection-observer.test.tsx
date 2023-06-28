// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { useIntersectionObserver } from '..';

declare global {
  interface Window {
    IntersectionObserver: any;
  }
}

function TestComponent() {
  const { ref, isIntersecting } = useIntersectionObserver();
  return <div ref={ref} data-testid="test" data-value={isIntersecting} />;
}

const mockObserve = jest.fn();
const mockIntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  disconnect: jest.fn(),
}));

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    window.IntersectionObserver = mockIntersectionObserver;
    jest.clearAllMocks();
  });

  it('should create an observer with the defined target element', async () => {
    const { findByTestId } = render(<TestComponent />);
    const target = await findByTestId('test');

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(target);
  });

  it('defaults to not intersecting', async () => {
    const { findByTestId } = render(<TestComponent />);
    const target = await findByTestId('test');

    expect(target.dataset.value).toBe('false');
  });
});
