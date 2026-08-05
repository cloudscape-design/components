// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { ColumnVirtualizationResult } from '../use-virtualization';
import { useColumnVirtualization } from '../use-virtualization/use-column-window';

// Tests for useColumnVirtualization, a standalone horizontal-windowing primitive (not a BasicTable
// prop; a consumer wires it by hand, as useVirtualization is wired for vertical windowing). It
// returns `{ visibleColumns, ref, trackStart }`: the consumer renders only the cells whose index is
// in visibleColumns, pinning each to its absolute track via trackStart (a grid-column-start), so the
// shared grid-template-columns (and thus aria-colindex) is unchanged.
//
// The pure geometry (computeColumnWindow) is covered in use-column-window.test.tsx and is not
// duplicated here. This suite covers the hook's observable output: default all-columns, the
// trackStart mapping, the callback ref, and a scroll-driven recompute of visibleColumns.

const WIDTHS = Array.from({ length: 30 }, () => 150);

// jsdom lacks ResizeObserver; the hook observes its scroll node with one. A no-op mock is enough
// (recompute is driven by the scroll event below). requestAnimationFrame is made synchronous so
// the rAF-throttled scroll recompute resolves within the act().
const OriginalResizeObserver = window.ResizeObserver;
let rafSpy: jest.SpyInstance;
beforeEach(() => {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
});
afterEach(() => {
  window.ResizeObserver = OriginalResizeObserver;
  rafSpy.mockRestore();
});

function Harness({
  config,
  onResult,
}: {
  config: Parameters<typeof useColumnVirtualization>[0];
  onResult: (r: ColumnVirtualizationResult) => void;
}) {
  const cv = useColumnVirtualization(config);
  onResult(cv);
  return <div data-testid="scroll" ref={cv.ref} />;
}

function renderCV(
  config: Parameters<typeof useColumnVirtualization>[0],
  geom?: { viewport: number; scrollLeft: number }
) {
  let current!: ColumnVirtualizationResult;
  const { container } = render(<Harness config={config} onResult={c => (current = c)} />);
  const node = container.querySelector('[data-testid="scroll"]') as HTMLElement;
  if (geom) {
    Object.defineProperty(node, 'clientWidth', { configurable: true, get: () => geom.viewport });
    Object.defineProperty(node, 'scrollLeft', { configurable: true, get: () => geom.scrollLeft });
  }
  return {
    get result() {
      return current;
    },
    node,
  };
}

const sorted = (set: Set<number>) => [...set].sort((a, b) => a - b);

describe('useColumnVirtualization (standalone primitive, #4)', () => {
  test('default (no measured viewport): all columns visible; trackStart is the 1-based grid line; ref is a callback', () => {
    const h = renderCV({ widths: WIDTHS, overscan: 3 });
    expect(h.result.visibleColumns.size).toBe(30);
    expect(h.result.trackStart(0)).toBe(1);
    expect(h.result.trackStart(5)).toBe(6);
    expect(typeof h.result.ref).toBe('function');
  });

  test('windows to the visible span + overscan on scroll (left edge)', () => {
    const h = renderCV({ widths: WIDTHS, overscan: 3 }, { viewport: 400, scrollLeft: 0 });
    act(() => {
      h.node.dispatchEvent(new Event('scroll'));
    });
    // [0,400) intersects cols 0,1,2 (150px each); +3 overscan -> 0..5.
    expect(sorted(h.result.visibleColumns)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('slides the window when scrolled right', () => {
    const h = renderCV({ widths: WIDTHS, overscan: 3 }, { viewport: 400, scrollLeft: 2000 });
    act(() => {
      h.node.dispatchEvent(new Event('scroll'));
    });
    // [2000,2400) intersects cols 13,14,15; +3 overscan -> 10..18.
    expect(sorted(h.result.visibleColumns)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18]);
  });

  test('pinned first/last columns are always included even far off-window', () => {
    const h = renderCV({ widths: WIDTHS, overscan: 0, pinnedFirst: 2, pinnedLast: 1 }, { viewport: 200, scrollLeft: 2000 });
    act(() => {
      h.node.dispatchEvent(new Event('scroll'));
    });
    // Window around scrollLeft 2000 plus pinned cols 0,1 (first) and 29 (last).
    const visible = h.result.visibleColumns;
    expect(visible.has(0)).toBe(true);
    expect(visible.has(1)).toBe(true);
    expect(visible.has(29)).toBe(true);
    expect(visible.has(13)).toBe(true); // within the scrolled window
  });
});
