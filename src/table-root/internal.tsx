// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { TableContextProvider } from './context';
import { computeGridTemplateColumns } from './grid-template-columns';
import { TableRootProps } from './interfaces';
import StickyHeaderSlot from './sticky-header-slot';

import styles from './styles.css.js';

export interface InternalTableRootProps extends TableRootProps, InternalBaseComponentProps {}

export default function InternalTableRoot({
  columnLayout = { type: 'auto' },
  ariaRowcount,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  stickyHeader,
  stickyHeaderOffset = 0,
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

  // The shadow-copy sticky header pins outside the horizontal scroller. In grid mode the copy aligns
  // columns by reusing the same grid template; in auto (native table-layout) mode column widths are
  // content-derived, so the copy mirrors the measured header-cell widths under a fixed layout.
  const isSticky = !!stickyHeader;

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
  const copyScrollerRef = useRef<HTMLDivElement>(null);
  const realTableRef = useRef<HTMLElement | null>(null);
  const realHeaderRef = useRef<HTMLElement | null>(null);

  // The real <thead> belongs to a child component (TableHead) we can't ref directly, so derive it from
  // the <table> in a callback ref (runs at commit) for the sticky slot's tuck to measure.
  const setRealTable = useCallback((node: HTMLTableElement | null) => {
    realTableRef.current = node;
    realHeaderRef.current = node ? node.querySelector('thead') : null;
  }, []);

  // Cheap (no observer); the copy scroller mirrors the body's horizontal offset when the slot is mounted.
  const handleScroll = useScrollSync([scrollerRef, copyScrollerRef]);

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
        {isSticky && (
          <StickyHeaderSlot
            rootRef={rootRef}
            realTableRef={realTableRef}
            realHeaderRef={realHeaderRef}
            tuckTargetRef={scrollerRef}
            copyScrollerRef={copyScrollerRef}
            onScroll={handleScroll}
            offset={stickyHeaderOffset}
            isGrid={isGrid}
            headChild={React.Children.toArray(children)[0]}
          />
        )}
        {/* The page owns vertical scroll; this wrapper reintroduces an inline scroll viewport so a wide table scrolls horizontally instead of spilling out. */}
        <div
          className={styles['body-scroller']}
          ref={scrollerRef}
          onScroll={isSticky ? handleScroll : undefined}
          style={
            isSticky
              ? { scrollPaddingBlockStart: `calc(${stickyHeaderOffset}px + var(--sticky-header-height, 0px))` }
              : undefined
          }
          {...scrollRegionProps}
        >
          <table
            ref={isSticky ? setRealTable : undefined}
            // Grid mode only: display:grid drops the table's implicit role. Auto mode keeps the
            // native role (an explicit role="table" there is redundant and flagged by a11y validators).
            role={isGrid ? 'table' : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-rowcount={ariaRowcount}
            className={clsx(styles.table, isGrid ? styles['table-grid'] : styles['table-auto'])}
          >
            {children}
          </table>
        </div>
      </TableContextProvider>
    </div>
  );
}
