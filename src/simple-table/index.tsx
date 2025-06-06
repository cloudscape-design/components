// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// import clsx from 'clsx';
import { SortingColumn, SortingState } from '@cloudscape-design/collection-hooks/cjs/interfaces.js';

import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events/index.js';
import { TableHeaderCell } from '../table/header-cell/index.js';

import styles from './styles.css.js';

interface Column<T = any> extends SortingColumn<T> {
  cell: (row: T) => React.ReactNode;
  header: string;
  minWidth?: number;
}

export interface SimpleTableProps<T = any> {
  items: ReadonlyArray<T>;
  columnDefinitions: Column<T>[];
  onSortingChange?(event: NonCancelableCustomEvent<SortingState<T>>): void;
  sortingColumn?: SortingColumn<T>;
  sortingDescending?: boolean;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  items,
  columnDefinitions,
  onSortingChange,
  sortingColumn,
  sortingDescending,
}) => {
  return (
    <table className={styles.root}>
      <thead>
        <tr>
          {columnDefinitions.map((column, columnIndex) => (
            <TableHeaderCell
              key={columnIndex}
              column={column}
              colIndex={columnIndex}
              cellRef={() => {}}
              columnId={columnIndex}
              onClick={e => onSortingChange && fireNonCancelableEvent(onSortingChange, e)}
              onResizeFinish={() => {}}
              variant="borderless"
              tabIndex={0}
              tableRole="table"
              updateColumn={() => {}}
              activeSortingColumn={sortingColumn}
              sortingDescending={sortingDescending}
            />
            // <th key={columnIndex} className={styles.cell} style={{minWidth: column.minWidth}}><div className={clsx(styles.content)}>{column.header}</div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columnDefinitions.map((column, columnIndex) => (
              <td key={`${rowIndex}-${columnIndex}`} className={styles.cell}>
                <div className={styles.content}>{column.cell(row)}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
