// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderHook } from '../../__tests__/render-hook';
import { useIntersectionObserver, IntersectionObserverProvider, ObservedElement } from '../use-intersection-observer';
import { render, unmountComponentAtNode } from 'react-dom';

declare global {
  interface Window {
    IntersectionObserver: any;
  }
}

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockIntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}));

describe('useIntersectionObserver', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    window.IntersectionObserver = mockIntersectionObserver;
    jest.clearAllMocks();
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
  });
  test('returns default register and unregister functions', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const { registerChildCallback, unregisterChildCallback } = result.current;
    expect(typeof registerChildCallback).toBe('function');
    expect(typeof unregisterChildCallback).toBe('function');
  });

  test('cleans up observers and callbacks on unmount', () => {
    const observedElements: ObservedElement[] = [{ id: 'element1', ref: React.createRef<Element>(), options: {} }];

    const TestComponent = () => {
      const { registerChildCallback, unregisterChildCallback } = useIntersectionObserver();
      React.useEffect(() => {
        registerChildCallback(observedElements[0].id, () => {});
        return () => {
          unregisterChildCallback(observedElements[0].id, () => {});
        };
      }, [registerChildCallback, unregisterChildCallback]);

      return <div />;
    };

    render(
      <IntersectionObserverProvider observedElements={observedElements}>
        <TestComponent />
      </IntersectionObserverProvider>,
      container
    );

    // Trigger unmounting of the component
    unmountComponentAtNode(container);

    // Expect the observer's disconnect method to be called
    expect(mockDisconnect).toHaveBeenCalledTimes(observedElements.length);
  });

  test('creates an observer for each observed element on mount', () => {
    const TestComponent = ({ children }: { children: React.ReactNode }) => {
      const observedElements: ObservedElement[] = [
        {
          id: 'id1',
          ref: React.useRef(document.createElement('div')),
          options: {},
        },
        {
          id: 'id2',
          ref: React.useRef(document.createElement('div')),
          options: {},
        },
      ];
      return (
        <IntersectionObserverProvider observedElements={observedElements}>{children}</IntersectionObserverProvider>
      );
    };
    renderHook(() => useIntersectionObserver(), { wrapper: TestComponent });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockObserve).toHaveBeenCalledWith(document.createElement('div'));
  });
});
