// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { SortingStatus } from './utils';
import styles from './styles.css.js';
import { getStickyClassNames } from '../utils';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { TableRole, getTableColHeaderRoleProps, useGridNavigationFocusable } from '../table-role';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

interface TableThElementProps {
  className?: string;
  style?: React.CSSProperties;
  sortingStatus?: SortingStatus;
  sortingDisabled?: boolean;
  hidden?: boolean;
  colIndex: number;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef?: React.Ref<HTMLElement>;
  tableRole: TableRole;
  children: React.ReactNode;
}

export function TableThElement({
  className,
  style,
  sortingStatus,
  sortingDisabled,
  hidden,
  colIndex,
  columnId,
  stickyState,
  cellRef,
  tableRole,
  children,
}: TableThElementProps) {
  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
  });

  const cellObjectRef = useRef<HTMLTableCellElement>(null);
  const mergedRef = useMergeRefs(stickyStyles.ref, cellRef, cellObjectRef);

  const cellId = useUniqueId();
  const { focusMuted, focusTarget } = useGridNavigationFocusable(cellId, cellObjectRef);
  const shouldMuteFocus = focusMuted && focusTarget !== cellObjectRef.current;

  return (
    <th
      className={clsx(
        className,
        {
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
      {...getTableColHeaderRoleProps({ tableRole, sortingStatus, colIndex })}
      tabIndex={!focusMuted ? undefined : shouldMuteFocus ? -1 : 0}
    >
      {children}
    </th>
  );
}
