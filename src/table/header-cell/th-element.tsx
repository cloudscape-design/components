// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from '../interfaces';
import { getAriaSort, getSortingStatus } from './utils';
import styles from '../body-cell/styles.css.js';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';

export interface TableThElementProps {
  style?: React.CSSProperties;
  sortable?: boolean;
  sorted?: boolean;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  resizableColumns?: boolean;
  hidden?: boolean;
  sticky?: boolean;
  stuck?: boolean;
  stripedRows?: boolean;
  hasSelection?: boolean;
  variant: TableProps.Variant;
  children: React.ReactNode;
}

export function TableThElement({
  style,
  sortable,
  sorted,
  sortingDescending,
  sortingDisabled,
  resizableColumns,
  hidden,
  sticky,
  stuck,
  stripedRows,
  hasSelection,
  variant,
  children,
}: TableThElementProps) {
  const sortingStatus = getSortingStatus(!!sortable, !!sorted, !!sortingDescending, !!sortingDisabled);
  const isVisualRefresh = useVisualRefresh();
  return (
    <th
      className={clsx(styles['header-cell'], styles[`header-cell-variant-${variant}`], {
        [styles['selection-control']]: hasSelection,
        [styles['selection-control-header']]: hasSelection,
        [styles['header-cell-sticky']]: sticky,
        [styles['header-cell-stuck']]: stuck,
        [styles['has-striped-rows']]: stripedRows,
        [styles['is-visual-refresh']]: isVisualRefresh,
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
