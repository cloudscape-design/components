// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  VirtualizationConfig,
  VirtualizationResult,
  VirtualizationRowProps,
  VirtualizationWindowItem,
} from './interfaces';
import { useVirtualModel } from './use-virtual-model';

// Count-based virtualization primitive. It knows nothing about data, columns, or expansion — it
// takes a row `count` + height strategy and returns plain positioning props for a consumer to
// spread onto a BasicTable (or any table-like DOM):
//   - `window`: the windowed [{index, offset}] slice to iterate (NOT the whole dataset);
//   - `runwayProps`: spread onto the scrolling body element — a relative runway sized to the full
//     virtual height, plus a ref used to locate the scroll viewport and drive measurement;
//   - `rowProps(index, offset)`: spread onto each windowed row — absolute offset positioning,
//     `aria-rowindex` (index + 2, header counted as row 1), and a measure ref for `'auto'` rows;
//   - `scrollToIndex` / `scrollToEnd` / `isPinnedToEnd`: scroll anchoring + live-tail composition
//     (`scrollToIndex` releases the live-tail pin);
//   - `visibleRange`: the current windowed index range.
//
// The consumer wires it explicitly:
//   const v = useVirtualization({ count: items.length, estimatedRowHeight: 40 });
//   <BasicTable.Body totalRowCount={items.length} {...v.runwayProps}>
//     {v.window.map(({ index, offset }) => (
//       <BasicTable.Row key={items[index].id} {...v.rowProps(index, offset)}>…</BasicTable.Row>
//     ))}
//   </BasicTable.Body>

const DEFAULT_OVERSCAN = 10;

// Walk up from the runway node to the nearest scrollable ancestor (the bounded viewport that
// windowing measures + listens to). Runs once per runway mount (a ref callback), not on a hot
// path. Falls back to the node itself if no scrollable ancestor is found.
function findScrollParent(node: HTMLElement): HTMLElement {
  let el: HTMLElement | null = node.parentElement;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return el;
    }
    el = el.parentElement;
  }
  return node;
}

export function useVirtualization(config: VirtualizationConfig): VirtualizationResult {
  const {
    count,
    estimatedRowHeight,
    getRowHeight,
    overscan = DEFAULT_OVERSCAN,
    getExpandedRowHeight,
    onVisibleRangeChange,
  } = config;

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const model = useVirtualModel({
    count,
    estimatedRowHeight,
    getRowHeight,
    getExpandedRowHeight,
    overscan,
    scrollContainerRef,
  });

  // Capture the runway node and resolve its scroll viewport for the model to measure.
  const setRunway = useCallback((node: HTMLElement | null) => {
    scrollContainerRef.current = node ? findScrollParent(node) : null;
  }, []);

  // Per-index {size, auto} lookup so rowProps can position/measure a windowed row.
  const slotByIndex = useMemo(() => {
    const map = new Map<number, { size: number; auto: boolean }>();
    for (const slot of model.window) {
      map.set(slot.index, { size: slot.size, auto: slot.auto });
    }
    return map;
  }, [model.window]);

  const window: ReadonlyArray<VirtualizationWindowItem> = useMemo(
    () => model.window.map(slot => ({ index: slot.index, offset: slot.start })),
    [model.window]
  );

  const rowProps = useCallback(
    (index: number, offset: number): VirtualizationRowProps => {
      const slot = slotByIndex.get(index);
      const auto = slot?.auto ?? false;
      return {
        'aria-rowindex': index + 2, // header counted as row 1
        style: {
          position: 'absolute',
          insetBlockStart: offset,
          insetInlineStart: 0,
          inlineSize: '100%',
          // Clamp fixed rows to their model pitch so intrinsic content height cannot overflow the
          // runway slot; 'auto' rows stay unbounded so they measure at their real height.
          blockSize: auto ? undefined : slot?.size,
        },
        ref: model.measureRef(index, auto),
      };
    },
    [slotByIndex, model]
  );

  const visibleRange = useMemo(
    () => ({ firstIndex: model.firstIndex, lastIndex: model.lastIndex }),
    [model.firstIndex, model.lastIndex]
  );

  useEffect(() => {
    if (model.firstIndex >= 0 && model.lastIndex >= 0) {
      onVisibleRangeChange?.({ firstIndex: model.firstIndex, lastIndex: model.lastIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.firstIndex, model.lastIndex]);

  const runwayProps: VirtualizationResult['runwayProps'] = {
    ref: setRunway,
    // min (not fixed) so the runway spans the full dataset yet can grow to contain rows that
    // measure taller than their estimate, avoiding a spurious scrollbar on unbounded tables.
    style: { position: 'relative', minBlockSize: model.totalSize },
  };

  return {
    window,
    runwayProps,
    rowProps,
    scrollToIndex: model.scrollToIndex,
    scrollToEnd: model.scrollToEnd,
    isPinnedToEnd: model.isPinnedToEnd,
    visibleRange,
  };
}
