// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useRef, useState } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

/**
 * Determines whether the table is wider than its container (i.e. it scrolls horizontally).
 *
 * Only the boolean is kept in state, so the table re-renders when it flips rather than on every
 * width change. Resizing a column changes the table width on every pointer move, and keeping
 * the raw widths in state would re-render the entire table body each time.
 */
export function useIsTableScrollable(containerRef: RefObject<HTMLElement>, tableRef: RefObject<HTMLElement>): boolean {
  // Starts as `null` (not measured) so that the first measurement commits one render after mount, as
  // `useContainerQuery` did. Parts of the table rely on that render, e.g. attributes from `useDOMAttribute`.
  const [isScrollable, setIsScrollable] = useState<boolean | null>(null);
  const containerWidthRef = useRef(0);
  const tableWidthRef = useRef(0);

  const update = () => {
    const containerWidth = containerWidthRef.current;
    const tableWidth = tableWidthRef.current;
    setIsScrollable(!!(tableWidth && containerWidth && tableWidth > containerWidth));
  };

  useResizeObserver(containerRef, entry => {
    containerWidthRef.current = entry.borderBoxWidth;
    update();
  });

  useResizeObserver(tableRef, entry => {
    tableWidthRef.current = entry.borderBoxWidth;
    update();
  });

  return !!isScrollable;
}
