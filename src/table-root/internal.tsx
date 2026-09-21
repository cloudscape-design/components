// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TableContextProvider } from './context';
import { TableRootProps } from './interfaces';
import { useTableRoot } from './use-table-root';

import styles from './styles.css.js';

export interface InternalTableRootProps extends TableRootProps, InternalBaseComponentProps {}

export default function InternalTableRoot({
  columnLayout = { type: 'auto' },
  ariaRowcount,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  children,
  __internalRootRef,
  ...rest
}: InternalTableRootProps) {
  const isGrid = columnLayout.type === 'grid';
  const table = useTableRoot(columnLayout);
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
    measureScrollable();
  }, [table.gridTemplateColumns, measureScrollable]);

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
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      {/* TableContext supplies this table's column layout to every part. It also resets the layout at the
          table boundary, so a table nested inside another table's cell renders from its own layout rather
          than inheriting the outer table's. */}
      <TableContextProvider value={table}>
        {/* The page owns vertical scroll; this wrapper reintroduces an inline scroll viewport so a wide table scrolls horizontally instead of spilling out. */}
        <div className={styles['scroll-container']} style={{ overflow: 'visible' }}>
          <div className={styles['body-scroller']} ref={scrollerRef} {...scrollRegionProps}>
            <table
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
        </div>
      </TableContextProvider>
    </div>
  );
}
