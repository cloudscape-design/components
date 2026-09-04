// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TableContextProvider } from './context';
import { TableRootProps } from './interfaces';
import { useTableRoot } from './use-table-root';

import styles from './styles.css.js';

type InternalRootProps = TableRootProps & InternalBaseComponentProps;

export function InternalRoot(props: InternalRootProps) {
  const {
    columnLayout = { type: 'auto' },
    ariaRowcount,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    children,
    __internalRootRef,
  } = props;

  const isGrid = columnLayout.type === 'grid';
  const table = useTableRoot(columnLayout);
  const baseProps = getBaseProps(props);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <TableContextProvider value={table}>
        {/* The page owns vertical scroll; this wrapper reintroduces an inline scroll viewport so a wide table scrolls horizontally instead of spilling out. */}
        <div className={styles['scroll-container']} style={{ overflow: 'visible' }}>
          <div className={styles['body-scroller']}>
            <table
              // Only stated in grid layout: `display:grid` blockifies the table and drops its
              // implicit role. In auto layout the native <table> role is used (an explicit
              // role="table" there is redundant and flagged by a11y validators).
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
