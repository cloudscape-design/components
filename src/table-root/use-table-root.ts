// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { TableRootProps } from './interfaces';

export interface UseTableRootResult {
  columnLayout: TableRootProps.ColumnLayout;
  /** The `grid-template-columns` value for `grid` layout, compiled from each column's `size` union; `undefined` in `auto` layout. */
  gridTemplateColumns?: string;
  /** The consumer-supplied `aria-rowcount`, present only when the table is virtualized (a grid rendering a subset of rows). */
  ariaRowcount?: number;
}

export function useTableRoot(columnLayout: TableRootProps.ColumnLayout, ariaRowcount?: number): UseTableRootResult {
  const gridTemplateColumns = useMemo(() => {
    if (columnLayout.type !== 'grid') {
      return undefined;
    }
    return columnLayout.columns
      .map(column => {
        if (typeof column.size === 'number') {
          return `${column.size}px`;
        }
        const min = `${column.minWidth ?? 0}px`;
        if (column.maxWidth !== undefined) {
          return `minmax(${min}, ${column.maxWidth}px)`;
        }
        // `size` is narrowed to `{ flex: number } | undefined` here (the numeric case returned above).
        const flex = column.size?.flex ?? 1;
        return `minmax(${min}, ${flex}fr)`;
      })
      .join(' ');
  }, [columnLayout]);

  return useMemo(
    () => ({ columnLayout, gridTemplateColumns, ariaRowcount }),
    [columnLayout, gridTemplateColumns, ariaRowcount]
  );
}
