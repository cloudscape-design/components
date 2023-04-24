// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from '../interfaces';
import { getAriaSort, getSortingStatus, isSorted } from './utils';
import styles from '../body-cell/styles.css.js';

export interface TableThElementProps<ItemType> {
  className?: string;
  style?: React.CSSProperties;
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  resizableColumns?: boolean;
  hidden?: boolean;
  children: React.ReactNode;
}

export function TableThElement<ItemType>({
  className,
  style,
  column,
  activeSortingColumn,
  sortingDescending,
  sortingDisabled,
  resizableColumns,
  hidden,
  children,
}: TableThElementProps<ItemType>) {
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const sorted = !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const sortingStatus = getSortingStatus(sortable, sorted, !!sortingDescending, !!sortingDisabled);

  return (
    <th
      className={clsx(className, {
        [styles['header-cell-resizable']]: !!resizableColumns,
        [styles['header-cell-sortable']]: sortingStatus,
        [styles['header-cell-sorted']]: sortingStatus === 'ascending' || sortingStatus === 'descending',
        [styles['header-cell-disabled']]: sortingDisabled,
        [styles['header-cell-ascending']]: sortingStatus === 'ascending',
        [styles['header-cell-descending']]: sortingStatus === 'descending',
        [styles['header-cell-hidden']]: hidden,
      })}
      aria-sort={sortingStatus && getAriaSort(sortingStatus)}
      style={style}
      scope="col"
    >
      {children}
    </th>
  );
}
