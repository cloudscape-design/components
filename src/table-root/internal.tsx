// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
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
  // as a focusable labeled region (matching the existing Table's getTableWrapperRoleProps).
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }
    const update = () => setIsScrollable(node.scrollWidth - node.clientWidth > 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    if (node.firstElementChild) {
      observer.observe(node.firstElementChild);
    }
    return () => observer.disconnect();
  }, [table.gridTemplateColumns]);

  const scrollRegionProps = isScrollable
    ? {
        role: ariaLabel || ariaLabelledby ? ('region' as const) : undefined,
        tabIndex: 0,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
      }
    : {};

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
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
