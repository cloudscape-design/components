// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { SortingStatus } from './utils';
import styles from './styles.css.js';
import { getStickyClassNames } from '../utils';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { TableRole, getTableColHeaderRoleProps } from '../table-role';

interface TableThElementProps {
  className?: string;
  style?: React.CSSProperties;
  sortingStatus?: SortingStatus;
  sortingDisabled?: boolean;
  hidden?: boolean;
  colIndex: number;
  focusedComponent?: null | string;
  resizableColumns?: boolean;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef?: React.RefCallback<HTMLElement>;
  tableRole: TableRole;
  children: React.ReactNode;
  isWidget?: boolean;
}

export function TableThElement({
  className,
  style,
  sortingStatus,
  sortingDisabled,
  hidden,
  colIndex,
  focusedComponent,
  resizableColumns,
  columnId,
  stickyState,
  cellRef,
  tableRole,
  children,
  isWidget,
}: TableThElementProps) {
  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
  });

  const mergedRef = useMergeRefs(stickyStyles.ref, cellRef);

  return (
    <th
      data-focus-id={`header-${String(columnId)}`}
      className={clsx(
        className,
        {
          [styles['header-cell-fake-focus']]: focusedComponent === `header-${String(columnId)}`,
          [styles['header-cell-resizable']]: !!resizableColumns,
          [styles['header-cell-sortable']]: sortingStatus,
          [styles['header-cell-sorted']]: sortingStatus === 'ascending' || sortingStatus === 'descending',
          [styles['header-cell-disabled']]: sortingDisabled,
          [styles['header-cell-ascending']]: sortingStatus === 'ascending',
          [styles['header-cell-descending']]: sortingStatus === 'descending',
          [styles['header-cell-hidden']]: hidden,
        },
        stickyStyles.className
      )}
      style={{ ...style, ...stickyStyles.style }}
      ref={mergedRef}
      {...getTableColHeaderRoleProps({ tableRole, sortingStatus, colIndex, isWidget })}
    >
      {children}
    </th>
  );
}
