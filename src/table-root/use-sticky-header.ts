// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useCellsResizeObserver } from '../internal/components/sticky-header/use-cells-resize-observer';
import { useStickyHeaderCopy } from '../internal/components/sticky-header/use-sticky-header-copy';
import { useStickyPosition } from '../internal/components/sticky-header/use-sticky-position';
import { useUntabbableDescendants } from '../internal/components/sticky-header/use-untabbable-descendants';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { setElementWidths } from '../table/column-widths-utils';

import abstractSwitchStyles from '../internal/components/abstract-switch/styles.css.js';
import styles from './styles.css.js';

interface UseTableRootStickyHeaderProps {
  enabled: boolean;
  verticalOffset?: number;
  isGrid: boolean;
  rootRef: RefObject<HTMLElement>;
  scrollerRef: RefObject<HTMLElement>;
}

const getHeaderCells = (head: HTMLTableSectionElement | null) =>
  head ? Array.from(head.rows).flatMap(row => Array.from(row.cells)) : [];

// The copy renders the same header, so an element's child-index path finds its counterpart in the copy.
function pathFrom(root: Element, element: Element) {
  const path: number[] = [];
  for (let current = element; current !== root && current.parentElement; current = current.parentElement) {
    path.unshift(Array.prototype.indexOf.call(current.parentElement.children, current));
  }
  return path;
}

function elementAtPath(root: Element, path: number[]) {
  return path.reduce<Element | undefined>((element, index) => element?.children[index], root) ?? null;
}

export function useTableRootStickyHeader({
  enabled,
  verticalOffset,
  isGrid,
  rootRef,
  scrollerRef,
}: UseTableRootStickyHeaderProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const copyScrollerRef = useRef<HTMLDivElement>(null);
  const realTableRef = useRef<HTMLTableElement>(null);
  const copyTableRef = useRef<HTMLTableElement>(null);
  const realHeaderRef = useRef<HTMLTableSectionElement | null>(null);
  const copyHeaderRef = useRef<HTMLTableSectionElement | null>(null);

  useLayoutEffect(() => {
    realHeaderRef.current = realTableRef.current?.tHead ?? null;
    copyHeaderRef.current = copyTableRef.current?.tHead ?? null;
  });

  const { isSticky, isStuck, stickyStyles } = useStickyPosition(rootRef, slotRef, {
    sticky: enabled,
    offset: verticalOffset,
  });

  const { scrollToRow } = useStickyHeaderCopy({
    tableRef: realTableRef,
    theadRef: realHeaderRef,
    secondaryTheadRef: copyHeaderRef,
    secondaryTableRef: copyTableRef,
    tableWrapperRef: scrollerRef,
  });

  // useStickyHeaderCopy pulls the scroller up to hide the real header under the copy, but doesn't undo it.
  useLayoutEffect(() => {
    if (!isSticky && scrollerRef.current) {
      scrollerRef.current.style.marginBlockStart = '';
    }
  }, [isSticky, scrollerRef]);

  // In grid layout the copy shares the column template; in auto layout it copies the real cells' widths.
  // The layout is read from a ref so the callback never changes, as the resize observer can call an older one.
  const isGridRef = useRef(isGrid);
  useLayoutEffect(() => {
    isGridRef.current = isGrid;
  });
  const syncColumnWidths = useCallback(() => {
    if (!copyHeaderRef.current) {
      return;
    }
    const copyCells = getHeaderCells(copyHeaderRef.current);
    const widths = isGridRef.current
      ? []
      : getHeaderCells(realHeaderRef.current).map(cell => cell.getBoundingClientRect().width);
    copyCells.forEach((cell, index) => setElementWidths(cell, { width: widths[index] }));
  }, []);
  useLayoutEffect(() => {
    syncColumnWidths();
  });
  useCellsResizeObserver(() => (isSticky && !isGrid ? getHeaderCells(realHeaderRef.current) : []), syncColumnWidths);

  // The scroll sync only reacts to scroll events, so a copy that mounts after the body has scrolled starts aligned.
  useLayoutEffect(() => {
    if (isSticky && copyScrollerRef.current && scrollerRef.current) {
      copyScrollerRef.current.scrollLeft = scrollerRef.current.scrollLeft;
    }
  }, [isSticky, scrollerRef]);

  useUntabbableDescendants(slotRef);

  // The copy is hidden from assistive technology, so focus that lands in it (from a click) moves to the
  // matching control in the real header. The click itself still reaches the copy.
  const onCopyFocus = (event: React.FocusEvent) => {
    const target = event.target as HTMLElement;
    const copyHeader = copyHeaderRef.current;
    const realHeader = realHeaderRef.current;
    if (copyHeader && realHeader && copyHeader.contains(target)) {
      const realElement = elementAtPath(realHeader, pathFrom(copyHeader, target)) as HTMLElement | null;
      realElement?.focus({ preventScroll: true });
    }
  };

  // The real header is covered by the copy, so the copy shows its focus ring. A checkbox or radio draws its
  // ring on the outline next to its hidden input, which is shown only for keyboard focus, like other rings.
  const [focusedHeaderPath, setFocusedHeaderPath] = useState<number[] | null>(null);
  useLayoutEffect(() => {
    const copyElement =
      focusedHeaderPath && copyHeaderRef.current ? elementAtPath(copyHeaderRef.current, focusedHeaderPath) : null;
    const isKeyboardFocus = document.body.hasAttribute('data-awsui-focus-visible');
    const switchOutline =
      isKeyboardFocus && copyElement?.nextElementSibling?.classList.contains(abstractSwitchStyles.outline)
        ? copyElement.nextElementSibling
        : null;
    copyElement?.classList.add(styles['sticky-copy-focus']);
    switchOutline?.classList.add(abstractSwitchStyles['show-outline']);
    return () => {
      copyElement?.classList.remove(styles['sticky-copy-focus']);
      switchOutline?.classList.remove(abstractSwitchStyles['show-outline']);
    };
  });

  const getMouseDownTarget = useMouseDownTarget();
  const onScrollerFocus = (event: React.FocusEvent) => {
    const target = event.target as HTMLElement;
    const realHeader = realHeaderRef.current;
    if (!isSticky) {
      return;
    }
    if (realHeader?.contains(target)) {
      setFocusedHeaderPath(pathFrom(realHeader, target));
      return;
    }
    // Keeps a focused body row from scrolling under the copy. Skipped for clicks: moving the row
    // between mouse down and mouse up would stop the click reaching its target.
    const row = target.closest('tr');
    if (row && !row.contains(getMouseDownTarget())) {
      scrollToRow(row);
    }
  };
  const onScrollerBlur = () => setFocusedHeaderPath(null);

  return {
    isSticky,
    isStuck,
    stickyStyles,
    slotRef,
    copyScrollerRef,
    realTableRef,
    copyTableRef,
    onCopyFocus,
    onScrollerFocus,
    onScrollerBlur,
  };
}
