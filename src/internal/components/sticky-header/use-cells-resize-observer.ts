// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useRef } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

export function useCellsResizeObserver(getCells: () => ReadonlyArray<HTMLElement>, onResize: () => void) {
  const stableOnResize = useStableCallback(onResize);
  const observerRef = useRef<ResizeObserver | null>(null);
  const observedCellsRef = useRef<ReadonlyArray<HTMLElement>>([]);

  // Cells can be replaced on any render, so the observed set is checked after each one.
  useLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const cells = getCells();
    const observedCells = observedCellsRef.current;
    if (haveSameElements(cells, observedCells)) {
      return;
    }
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(() => stableOnResize());
    }
    const observer = observerRef.current;
    observedCells.filter(cell => !cells.includes(cell)).forEach(cell => observer.unobserve(cell));
    cells.filter(cell => !observedCells.includes(cell)).forEach(cell => observer.observe(cell));
    observedCellsRef.current = cells;
  });

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      observedCellsRef.current = [];
    };
  }, []);
}

function haveSameElements(a: ReadonlyArray<HTMLElement>, b: ReadonlyArray<HTMLElement>) {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}
