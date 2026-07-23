// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { act, renderHook } from '../../__tests__/render-hook';
import { DEFAULT_VIRTUAL_ROW_HEIGHT, useVirtualScroll } from '../use-virtual-scroll';

function createContainer({ scrollTop = 0, clientHeight = 0 }: { scrollTop?: number; clientHeight?: number }) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight });
  el.scrollTop = scrollTop;
  return el;
}

describe('useVirtualScroll', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('is a no-op when disabled: renders the full range with no padding', () => {
    const container = createContainer({ clientHeight: 400 });
    const ref = { current: container } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() =>
      useVirtualScroll({ enabled: false, itemCount: 1000, containerRef: ref, rowHeight: 40 })
    );

    expect(result.current.enabled).toBe(false);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(1000);
    expect(result.current.topPadding).toBe(0);
    expect(result.current.bottomPadding).toBe(0);
    expect(result.current.totalSize).toBe(1000 * 40);
  });

  test('computes a windowed range based on scroll offset and viewport height', () => {
    const container = createContainer({ scrollTop: 4000, clientHeight: 400 });
    const ref = { current: container } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() =>
      useVirtualScroll({ enabled: true, itemCount: 1000, containerRef: ref, rowHeight: 40, overscan: 5 })
    );

    // 4000 / 40 = row 100; minus overscan 5 => startIndex 95
    expect(result.current.startIndex).toBe(95);
    // visibleCount ceil(400/40)=10; endIndex = 95 + 10 + 2*5 = 115
    expect(result.current.endIndex).toBe(115);
    expect(result.current.topPadding).toBe(95 * 40);
    expect(result.current.bottomPadding).toBe((1000 - 115) * 40);
  });

  test('recomputes the window after a scroll event', () => {
    const container = createContainer({ scrollTop: 0, clientHeight: 400 });
    const ref = { current: container } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() =>
      useVirtualScroll({ enabled: true, itemCount: 1000, containerRef: ref, rowHeight: 40, overscan: 0 })
    );

    expect(result.current.startIndex).toBe(0);

    act(() => {
      container.scrollTop = 2000;
      fireEvent.scroll(container);
    });

    expect(result.current.startIndex).toBe(50);
  });

  test('handles an empty dataset', () => {
    const container = createContainer({ clientHeight: 400 });
    const ref = { current: container } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() =>
      useVirtualScroll({ enabled: true, itemCount: 0, containerRef: ref, rowHeight: 40 })
    );

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(0);
    expect(result.current.totalSize).toBe(0);
  });

  test('falls back to the default row height when a non-positive value is provided', () => {
    const container = createContainer({ clientHeight: 400 });
    const ref = { current: container } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() =>
      useVirtualScroll({ enabled: true, itemCount: 100, containerRef: ref, rowHeight: 0 })
    );

    expect(result.current.totalSize).toBe(100 * DEFAULT_VIRTUAL_ROW_HEIGHT);
  });
});
