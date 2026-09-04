// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { TableRootProps } from './interfaces';

export interface UseTableRootResult {
  columnLayout: TableRootProps.ColumnLayout;
  /** The `grid-template-columns` value for `grid` layout, compiled from each column's `size` union; `undefined` in `auto` layout. */
  gridTemplateColumns?: string;
}

export function useTableRoot(columnLayout: TableRootProps.ColumnLayout): UseTableRootResult {
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
        const flex = column.size && 'flex' in column.size ? column.size.flex : 1;
        return `minmax(${min}, ${flex}fr)`;
      })
      .join(' ');
  }, [columnLayout]);

  return { columnLayout, gridTemplateColumns };
}
