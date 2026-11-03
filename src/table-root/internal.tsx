// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { StickyScrollbar } from '../internal/components/sticky-scrollbar';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { TableContextProvider } from './context';
import { computeGridTemplateColumns } from './grid-template-columns';
import { TableRootProps } from './interfaces';
import StickyHeaderSlot from './sticky-header-slot';
import { useTableRootStickyHeader } from './use-sticky-header';

import styles from './styles.css.js';

export interface InternalTableRootProps extends TableRootProps, InternalBaseComponentProps {}

// In grid layout the rows overflow the table element, so the scroller, not the table, measures the
// scrollable width. scrollWidth is rounded to a whole pixel, so content that fits a fractional-width
// scroller reports the scroller's own width instead, using the same tolerance as measureScrollable.
function getScrollerContentInlineSize(_table: HTMLElement, scroller: HTMLElement) {
  return scroller.scrollWidth - scroller.clientWidth > 1
    ? scroller.scrollWidth
    : scroller.getBoundingClientRect().width;
}

export default function InternalTableRoot({
  columnLayout = { type: 'auto' },
  ariaRowcount,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  stickyHeader,
  stickyHeaderVerticalOffset,
  children,
  __internalRootRef,
  ...rest
}: InternalTableRootProps) {
  const isGrid = columnLayout.type === 'grid';
  const gridTemplateColumns = computeGridTemplateColumns(columnLayout);
  // Memoized because it is the TableContext value; a fresh object re-renders every cell. Both fields are
  // primitives compared by value, so it stays stable even when the caller passes a fresh columnLayout.
  const tableContext = useMemo(() => ({ isGrid, gridTemplateColumns }), [isGrid, gridTemplateColumns]);
  const baseProps = getBaseProps(rest);

  // A wide table's horizontal scroller isn't keyboard-reachable on its own, so a read-only table with no
  // focusable cell content can't be scrolled by keyboard. When the content overflows, expose the scroller
  // as a focusable region so keyboard users can scroll it horizontally, matching the existing Table's
  // getTableWrapperRoleProps.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const measureScrollable = useCallback(() => {
    const node = scrollerRef.current;
    if (node) {
      setIsScrollable(node.scrollWidth - node.clientWidth > 1);
    }
  }, []);
  // Observe the scroller and the table it wraps: a viewport resize changes the scroller box, and
  // auto-layout content growth changes the table box — either can start or stop the horizontal overflow.
  useResizeObserver(scrollerRef, measureScrollable);
  useResizeObserver(() => scrollerRef.current?.firstElementChild ?? null, measureScrollable);
  // Grid column templates change the tracks' overflow without resizing either observed box, so no observer
  // fires — re-measure when the template changes.
  useEffect(() => {
    if (isGrid) {
      measureScrollable();
    }
  }, [isGrid, gridTemplateColumns, measureScrollable]);

  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRootRef = useMergeRefs(rootRef, __internalRootRef);
  const sticky = useTableRootStickyHeader({
    enabled: !!stickyHeader,
    verticalOffset: stickyHeaderVerticalOffset,
    isGrid,
    rootRef,
    scrollerRef,
  });
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const handleScroll = useScrollSync([scrollerRef, scrollbarRef, sticky.copyScrollerRef]);

  // Set role="region" whenever scrollable (label passes through even if undefined), matching the
  // existing Table's getTableWrapperRoleProps rather than gating the role on a label.
  const scrollRegionProps = isScrollable
    ? {
        role: 'region' as const,
        tabIndex: 0,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
      }
    : {};

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={mergedRootRef}>
      {/* TableContext supplies this table's column layout to every part. */}
      <TableContextProvider value={tableContext}>
        {sticky.isSticky && (
          <StickyHeaderSlot
            slotRef={sticky.slotRef}
            copyScrollerRef={sticky.copyScrollerRef}
            copyTableRef={sticky.copyTableRef}
            onScroll={handleScroll}
            onFocus={sticky.onCopyFocus}
            isStuck={sticky.isStuck}
            isGrid={isGrid}
            style={sticky.stickyStyles.style}
          >
            {stickyHeader}
          </StickyHeaderSlot>
        )}
        {/* The page owns vertical scroll; this wrapper reintroduces an inline scroll viewport so a wide table scrolls horizontally instead of spilling out. */}
        <div
          className={styles['body-scroller']}
          ref={scrollerRef}
          onScroll={handleScroll}
          onFocus={sticky.onScrollerFocus}
          onBlur={sticky.onScrollerBlur}
          {...scrollRegionProps}
        >
          <table
            ref={sticky.realTableRef}
            // Without an explicit role, browsers guess whether a table holds data or is only for layout.
            role="table"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-rowcount={ariaRowcount}
            className={clsx(styles.table, isGrid ? styles['table-grid'] : styles['table-auto'])}
          >
            {stickyHeader}
            {children}
          </table>
        </div>
        <StickyScrollbar
          ref={scrollbarRef}
          wrapperRef={scrollerRef}
          tableRef={sticky.realTableRef}
          onScroll={handleScroll}
          getContentInlineSize={getScrollerContentInlineSize}
          contentKey={gridTemplateColumns}
        />
      </TableContextProvider>
    </div>
  );
}
