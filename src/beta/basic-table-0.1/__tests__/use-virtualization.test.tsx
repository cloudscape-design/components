// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { VirtualizationConfig, VirtualizationResult } from '../use-virtualization';
import { useVirtualization } from '../use-virtualization';

// useVirtualization is the raw, count-based virtualization primitive. It owns its own inner scroll
// container (resolved from the runway node's nearest scrollable ancestor), windows a row `count` over
// that viewport, and returns plain positioning props the consumer spreads onto a BasicTable. It is
// data/column/expansion agnostic: index-based only.
//
// jsdom has no layout, so the primitive is mounted through a harness that spreads `runwayProps` onto
// a real overflow:auto <div> (its nearest scrollable ancestor). After mount the scroll ancestor's
// geometry is stubbed (clientHeight/scrollHeight/scrollTop, with a writable scrollTop) so
// scroll-driven windowing, the live-tail pin, and scrollToIndex/scrollToEnd exercise the real engine.

// Records every ResizeObserver so a test can fire a measurement callback deterministically.
interface MockObserver {
  cb: ResizeObserverCallback;
  node?: Element;
  disconnected: boolean;
}
let observers: MockObserver[] = [];
const OriginalResizeObserver = window.ResizeObserver;

beforeEach(() => {
  observers = [];
  class MockResizeObserver {
    private record: MockObserver;
    constructor(cb: ResizeObserverCallback) {
      this.record = { cb, disconnected: false };
      observers.push(this.record);
    }
    observe(node: Element) {
      this.record.node = node;
    }
    unobserve() {}
    disconnect() {
      this.record.disconnected = true;
    }
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  window.ResizeObserver = OriginalResizeObserver;
});

function stubHeight(height: number): HTMLElement {
  const node = document.createElement('div');
  node.getBoundingClientRect = () =>
    ({ height, width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON() {} }) as DOMRect;
  return node;
}

interface Geometry {
  clientHeight?: number;
  scrollHeight?: number;
  scrollTop?: number;
}

function Harness({
  config,
  onResult,
}: {
  config: VirtualizationConfig;
  onResult: (result: VirtualizationResult) => void;
}) {
  const v = useVirtualization(config);
  onResult(v);
  // The runway's nearest scrollable ancestor (overflowY:auto) is the viewport the primitive
  // resolves + measures. Runway spreads runwayProps (relative runway + measure/scroll-locate ref).
  return (
    <div data-testid="scroll" style={{ overflowY: 'auto' }}>
      <div {...v.runwayProps} data-testid="runway" />
    </div>
  );
}

function renderVirtual(config: VirtualizationConfig, geom: Geometry = {}) {
  let current!: VirtualizationResult;
  const { container, rerender } = render(<Harness config={config} onResult={v => (current = v)} />);
  const scroll = container.querySelector('[data-testid="scroll"]') as HTMLElement;
  let top = geom.scrollTop ?? 0;
  const clientHeight = geom.clientHeight ?? 0;
  let scrollHeight = geom.scrollHeight ?? 0;
  Object.defineProperty(scroll, 'clientHeight', { configurable: true, get: () => clientHeight });
  Object.defineProperty(scroll, 'scrollHeight', { configurable: true, get: () => scrollHeight });
  // Clamp scrollTop to [0, scrollHeight-clientHeight] exactly like a real browser, so the
  // scrollToEnd clamp-vs-seed behaviour is faithfully exercised.
  Object.defineProperty(scroll, 'scrollTop', {
    configurable: true,
    get: () => top,
    set: v => (top = Math.max(0, Math.min(v, Math.max(0, scrollHeight - clientHeight)))),
  });
  return {
    get result() {
      return current;
    },
    scroll,
    setScrollTop: (v: number) => (top = v),
    setScrollHeight: (v: number) => (scrollHeight = v),
    rerenderWithCount: (count: number) =>
      rerender(<Harness config={{ ...config, count }} onResult={v => (current = v)} />),
  };
}

describe('useVirtualization (count-based primitive)', () => {
  describe('windowing', () => {
    test('windows a large dataset to far fewer rows than it holds, with {index, offset} items', () => {
      const { result } = renderVirtual({ count: 1000, estimatedRowHeight: 20, overscan: 5 });
      expect(result.window.length).toBeGreaterThan(0);
      expect(result.window.length).toBeLessThan(1000);
      // 600px fallback viewport / 20px rows = 30 visible; +5 overscan -> last data index 35.
      expect(result.visibleRange).toEqual({ firstIndex: 0, lastIndex: 35 });
      expect(result.window[0]).toEqual({ index: 0, offset: 0 });
      expect(result.window[1]).toEqual({ index: 1, offset: 20 });
      expect(result.window[result.window.length - 1]).toEqual({ index: 35, offset: 35 * 20 });
    });

    test('runway is sized (min) to the full virtual height and is a relative positioning context', () => {
      const { result } = renderVirtual({ count: 1000, estimatedRowHeight: 20 });
      expect(result.runwayProps.style!.minBlockSize).toBe(1000 * 20);
      expect(result.runwayProps.style!.position).toBe('relative');
      expect(typeof result.runwayProps.ref).toBe('function');
    });

    test('recomputes the visible range + fires onVisibleRangeChange when the container scrolls', () => {
      const onVisibleRangeChange = jest.fn();
      const h = renderVirtual(
        { count: 1000, estimatedRowHeight: 20, overscan: 5, onVisibleRangeChange },
        { clientHeight: 0, scrollHeight: 20000, scrollTop: 0 }
      );
      // Initial windowed range is announced on mount.
      expect(onVisibleRangeChange).toHaveBeenLastCalledWith({ firstIndex: 0, lastIndex: 35 });
      onVisibleRangeChange.mockClear();

      // Scroll to offset 4000 (row 200): firstVisible 200 - 5 = 195; lastVisible 230 + 5 = 235.
      act(() => {
        h.setScrollTop(4000);
        h.scroll.dispatchEvent(new Event('scroll'));
      });
      expect(h.result.visibleRange).toEqual({ firstIndex: 195, lastIndex: 235 });
      expect(onVisibleRangeChange).toHaveBeenLastCalledWith({ firstIndex: 195, lastIndex: 235 });
    });
  });

  describe('rowProps', () => {
    test('positions a fixed row absolutely at its offset, clamps its block-size, sets aria-rowindex=index+2', () => {
      const { result } = renderVirtual({ count: 100, estimatedRowHeight: 20 });
      const first = result.rowProps(0, 0);
      expect(first['aria-rowindex']).toBe(2); // header counted as row 1
      expect(first.style!.position).toBe('absolute');
      expect(first.style!.insetBlockStart).toBe(0);
      expect(first.style!.blockSize).toBe(20); // fixed rows are clamped to their model pitch
      expect(typeof first.ref).toBe('function');

      const fifth = result.rowProps(5, 100);
      expect(fifth['aria-rowindex']).toBe(7);
      expect(fifth.style!.insetBlockStart).toBe(100);
    });

    test("an 'auto' row is left unbounded (no block-size clamp) so it can measure its real height", () => {
      const { result } = renderVirtual({ count: 10, estimatedRowHeight: 20, getRowHeight: () => 'auto', overscan: 5 });
      const auto = result.rowProps(0, 0);
      expect(auto.style!.blockSize).toBeUndefined();
    });
  });

  describe('getRowHeight strategy', () => {
    test('uniform fixed rows: total runway is a simple product', () => {
      const { result } = renderVirtual({ count: 1000, estimatedRowHeight: 20 });
      expect(result.runwayProps.style!.minBlockSize).toBe(1000 * 20);
    });

    test("'auto' rows seed at the estimate, then an observed measurement reflows the runway", () => {
      // NOTE: use the live `h.result` accessor (not a destructured value) so post-reflow reads see
      // the latest render's result.
      const h = renderVirtual({ count: 10, estimatedRowHeight: 20, getRowHeight: () => 'auto', overscan: 5 });
      // Pre-measurement: every auto row seeds at estimatedRowHeight -> 10 * 20.
      expect(h.result.runwayProps.style!.minBlockSize).toBe(10 * 20);

      // The measure ref for a fixed row is never observed; an auto row IS observed, and firing its
      // observer applies the real height and reflows the runway.
      const before = observers.length;
      act(() => h.result.rowProps(0, 0).ref!(stubHeight(55)));
      expect(observers.length).toBe(before + 1);
      act(() => {
        const obs = observers[observers.length - 1];
        obs.cb([], obs as unknown as ResizeObserver);
      });
      expect(h.result.runwayProps.style!.minBlockSize).toBe(55 + 9 * 20);
    });
  });

  describe('scroll anchoring + live tail', () => {
    test('scrollToEnd pins the viewport to the bottom of the runway; isPinnedToEnd reflects it', () => {
      const h = renderVirtual({ count: 100, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 2000, scrollTop: 0 });
      expect(h.result.isPinnedToEnd()).toBe(false); // gap 1900 > one row

      act(() => h.result.scrollToEnd());
      expect(h.scroll.scrollTop).toBe(1900); // scrollHeight - clientHeight
      expect(h.result.isPinnedToEnd()).toBe(true); // gap 0
    });

    test('isPinnedToEnd tolerates within one row of the bottom (absorbs the sub-pixel clamp gap)', () => {
      // gap 15 < estimatedRowHeight 20 -> pinned.
      const near = renderVirtual({ count: 100, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 1000, scrollTop: 885 });
      expect(near.result.isPinnedToEnd()).toBe(true);
      // gap 25 > 20 -> not pinned.
      const up = renderVirtual({ count: 100, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 1000, scrollTop: 875 });
      expect(up.result.isPinnedToEnd()).toBe(false);
    });

    test('when pinned, an appended row re-targets the true bottom instead of the stale position', () => {
      const h = renderVirtual({ count: 50, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 1000, scrollTop: 900 });
      // A user scroll at the bottom edge latches the end-pin.
      act(() => {
        h.scroll.scrollTop = 900;
        h.scroll.dispatchEvent(new Event('scroll'));
      });
      expect(h.result.isPinnedToEnd()).toBe(true);

      // Append one row: runway grows one row (1000 -> 1020). The anchor-correction layout effect
      // must drive scrollTop to the NEW end (1020 - 100 = 920), not hold 900.
      act(() => {
        h.setScrollHeight(1020);
        h.scroll.dispatchEvent(new Event('scroll'));
      });
      // Append one row: count grows 50 -> 51 (runway 1000 -> 1020). The anchor-correction layout
      // effect re-targets the pinned viewport to the new bottom (1020 - 100 = 920), not the stale 900.
      act(() => {
        h.setScrollHeight(1020);
        h.rerenderWithCount(51);
      });
      expect(h.result.isPinnedToEnd()).toBe(true);
      expect(h.scroll.scrollTop).toBe(920);
    });

    test('a wheel scroll-up (deltaY < 0) releases live-tail follow', () => {
      const h = renderVirtual({ count: 50, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 1000, scrollTop: 0 });
      act(() => h.result.scrollToEnd());
      expect(h.result.isPinnedToEnd()).toBe(true);

      act(() => {
        h.scroll.dispatchEvent(new WheelEvent('wheel', { deltaY: -10 }));
      });
      // The latch is released: scrolling up away from the bottom is no longer pinned.
      act(() => {
        h.setScrollTop(0);
        h.scroll.dispatchEvent(new Event('scroll'));
      });
      expect(h.result.isPinnedToEnd()).toBe(false);
    });

    test('F-U8: scrollToIndex targets the row start AND releases the live-tail pin', () => {
      const h = renderVirtual({ count: 50, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 1000, scrollTop: 900 });
      act(() => h.result.scrollToEnd());
      expect(h.result.isPinnedToEnd()).toBe(true);

      // A programmatic scroll-to-row is an explicit "go here" intent: land at the target row start
      // (index 10 -> 10 * 20 = 200) and RELEASE the pin so the layout effect does not snap back.
      act(() => h.result.scrollToIndex(10));
      expect(h.scroll.scrollTop).toBe(200);
      expect(h.result.isPinnedToEnd()).toBe(false);
    });

    test('scrollToIndex is a no-op for an out-of-range index', () => {
      const h = renderVirtual({ count: 10, estimatedRowHeight: 20 }, { clientHeight: 100, scrollHeight: 200, scrollTop: 50 });
      act(() => h.result.scrollToIndex(999));
      expect(h.scroll.scrollTop).toBe(50);
    });
  });
});
