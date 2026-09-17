// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { RowVariantContextProvider } from '../table-row/context';
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
  const table = useTableRoot(columnLayout, ariaRowcount);
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
  // Observer stays tied to the stable scroller node (and its child) so it isn't reallocated on every render.
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(measureScrollable);
    observer.observe(node);
    if (node.firstElementChild) {
      observer.observe(node.firstElementChild);
    }
    return () => observer.disconnect();
  }, [measureScrollable]);
  // Re-measure on layout template and content changes: overflow can start/stop without a box-size change
  // (dynamic grid content), which the ResizeObserver alone would miss. Cheap read, no observer churn.
  useEffect(() => {
    measureScrollable();
  }, [table.gridTemplateColumns, children, measureScrollable]);

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
      {/* Reset the shared cell contexts at each table boundary: the cell substrate reads column layout
          and row variant from context, so a table nested inside another table's cell must start from
          this table's own layout and a `default` row variant rather than inheriting the outer table's. */}
      <TableContextProvider value={table}>
        <RowVariantContextProvider value="default">
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
        </RowVariantContextProvider>
      </TableContextProvider>
    </div>
  );
}
