// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { act, renderHook } from '../../__tests__/render-hook';
import { useVirtualModel } from '../use-virtual-model';

// The compound F1-A2 core drives the same windowing + opt-in measurement engine the
// config-driven cell uses: Root owns one inner scroll container, data rows are fixed at the
// density estimate (no measurement cost) unless getRowHeight opts them into 'auto', and only
// expanded regions / opted-in rows are measured, with anchor-based offset correction so
// measured growth above the fold does not shift the viewport. jsdom has no layout, so the
// DOM-driven paths are exercised with a controllable ResizeObserver and a fake scroll
// container whose scrollTop/clientHeight/scrollHeight are stubbed (viewport falls back to
// 600px when clientHeight is 0).

interface Row {
  id: string;
}
const trackBy = (row: Row) => row.id;
const makeItems = (n: number): Row[] => Array.from({ length: n }, (_, i) => ({ id: String(i) }));

interface FakeContainer {
  clientHeight?: number;
  scrollHeight?: number;
  scrollTop?: number;
}
function makeContainer({ clientHeight = 0, scrollHeight = 0, scrollTop = 0 }: FakeContainer = {}): HTMLElement {
  const el = document.createElement('div');
  let top = scrollTop;
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => clientHeight });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => scrollHeight });
  Object.defineProperty(el, 'scrollTop', { configurable: true, get: () => top, set: value => (top = value) });
  return el;
}

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

interface ModelOptions {
  items: Row[];
  container?: HTMLElement;
  expandedIds?: Set<string>;
  expandedSignature?: string;
  estimatedRowHeight?: number;
  getRowHeight?: (item: Row) => number | 'auto';
  getExpandedRowHeight?: (item: Row) => number | 'auto';
  overscan?: number;
}

function renderModel(options: ModelOptions) {
  const ref = { current: options.container ?? makeContainer() } as React.RefObject<HTMLElement>;
  const { result, rerender } = renderHook(() =>
    useVirtualModel<Row>({
      items: options.items,
      trackBy,
      expandedIds: options.expandedIds ?? new Set<string>(),
      expandedSignature: options.expandedSignature ?? '',
      estimatedRowHeight: options.estimatedRowHeight ?? 20,
      getRowHeight: options.getRowHeight,
      getExpandedRowHeight: options.getExpandedRowHeight,
      overscan: options.overscan ?? 5,
      scrollContainerRef: ref,
    })
  );
  return { result, rerender, container: ref.current! };
}

describe('VirtualTable (F1-A2 compound) useVirtualModel', () => {
  test('windows a large dataset to far fewer rows than it holds', () => {
    const items = makeItems(1000);
    const { result } = renderModel({ items, estimatedRowHeight: 20, overscan: 5 });
    expect(result.current.slots.length).toBeGreaterThan(0);
    expect(result.current.slots.length).toBeLessThan(items.length);
    expect(result.current.firstIndex).toBe(0);
    // Window is bounded: 600px viewport / 20px rows = 30 visible + 5 overscan = last data index 35.
    expect(result.current.lastIndex).toBe(35);
    expect(result.current.slots.every(slot => slot.type === 'data')).toBe(true);
    // Fixed rows: total runway is a simple product, independent of the window.
    expect(result.current.totalSize).toBe(1000 * 20);
  });

  test('recomputes the visible range when the container scrolls', () => {
    const container = makeContainer();
    const { result } = renderModel({ items: makeItems(1000), estimatedRowHeight: 20, overscan: 5, container });
    expect(result.current.firstIndex).toBe(0);

    // Scroll to offset 4000 (row 200). The scroll listener re-reads scrollTop and the window
    // recomputes: firstVisible 200 - 5 overscan = 195; lastVisible 230 + 5 = 235.
    act(() => {
      container.scrollTop = 4000;
      container.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.firstIndex).toBe(195);
    expect(result.current.lastIndex).toBe(235);
  });

  test('inserts an expanded slot immediately after its data row and grows the runway by its height', () => {
    const items = makeItems(50);
    const { result } = renderModel({
      items,
      expandedIds: new Set(['0']),
      expandedSignature: '0',
      getExpandedRowHeight: () => 120,
    });
    const expandedSlot = result.current.slots.find(slot => slot.type === 'expanded');
    expect(expandedSlot).toBeDefined();
    expect(expandedSlot!.index).toBe(0);
    expect(result.current.totalSize).toBe(50 * 20 + 120);
  });

  test('does not observe fixed-height rows but does observe auto rows, and applies the measured height', () => {
    const items = makeItems(10);
    const { result } = renderModel({ items, estimatedRowHeight: 20, getRowHeight: () => 'auto' });
    expect(result.current.totalSize).toBe(10 * 20);

    const before = observers.length;
    // observers[0] is the engine's own viewport ResizeObserver (attached on mount); `before`
    // is captured after mount so any new observer here is the measurement one. A fixed row
    // (auto=false) is never observed — it never pays measurement cost.
    act(() => result.current.measureRef('d:0', false)(stubHeight(55)));
    expect(observers.length).toBe(before);

    // An auto data row is observed (the F1-A2 getRowHeight='auto' path that lets the raw view
    // wrap long lines); firing the observer applies the real height and reflows the runway.
    act(() => result.current.measureRef('d:0', true)(stubHeight(55)));
    expect(observers.length).toBe(before + 1);
    act(() => observers[observers.length - 1].cb([], observers[observers.length - 1] as unknown as ResizeObserver));
    expect(result.current.totalSize).toBe(55 + 9 * 20);
  });

  test('scrollToIndex positions the container at the row start', () => {
    const container = makeContainer();
    const { result } = renderModel({ items: makeItems(100), estimatedRowHeight: 20, container });
    act(() => result.current.scrollToIndex(10));
    expect(container.scrollTop).toBe(10 * 20);
  });

  test('scrollToEnd pins the container to the bottom of the runway', () => {
    const container = makeContainer({ scrollHeight: 1234 });
    const { result } = renderModel({ items: makeItems(100), container });
    act(() => result.current.scrollToEnd());
    expect(container.scrollTop).toBe(1234);
  });

  test('isPinnedToEnd reflects whether the viewport is at the bottom edge', () => {
    const pinned = makeContainer({ clientHeight: 100, scrollHeight: 100, scrollTop: 0 });
    expect(renderModel({ items: makeItems(100), container: pinned }).result.current.isPinnedToEnd()).toBe(true);

    const scrolledUp = makeContainer({ clientHeight: 100, scrollHeight: 1000, scrollTop: 0 });
    expect(renderModel({ items: makeItems(100), container: scrolledUp }).result.current.isPinnedToEnd()).toBe(false);
  });
});
