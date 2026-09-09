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

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <TableContextProvider value={table}>
        <div className={styles['scroll-container']} style={{ overflow: 'visible' }}>
          <div className={styles['body-scroller']}>
            <table
              // display:grid drops the table's implicit ARIA role, so restore it in grid layout only
              // (an explicit role is redundant, and flagged by a11y validators, in auto layout).
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
