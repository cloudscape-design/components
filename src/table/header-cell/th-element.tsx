// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { SortingStatus } from './utils';
import styles from './styles.css.js';
import { getStickyClassNames } from '../utils';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { TableRole, getTableColHeaderRoleProps } from '../table-role';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import useMouseDownTarget from '../../internal/hooks/use-mouse-down-target';

interface TableThElementProps {
  className?: string;
  style?: React.CSSProperties;
  sortingStatus?: SortingStatus;
  sortingDisabled?: boolean;
  focusedComponent?: null | string;
  hidden?: boolean;
  colIndex: number;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef?: React.RefCallback<HTMLElement>;
  tableRole: TableRole;
  children: React.ReactNode;
}

export function TableThElement({
  className,
  style,
  sortingStatus,
  sortingDisabled,
  focusedComponent,
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

  const getMouseDownTarget = useMouseDownTarget();
  const cellRefObject = useRef<HTMLTableCellElement>(null);
  const mergedRef = useMergeRefs(stickyStyles.ref, cellRef, cellRefObject);
  const { tabIndex } = useSingleTabStopNavigation(cellRefObject);

  return (
    <th
      data-focus-id={`header-${String(columnId)}`}
      onFocus={event => {
        if (!event.currentTarget.contains(getMouseDownTarget())) {
          event.target.scrollIntoView?.({ block: 'center' });
        }
      }}
      className={clsx(
        className,
        {
          [styles['header-cell-fake-focus']]: focusedComponent === `header-${String(columnId)}`,
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
      tabIndex={tabIndex}
    >
      {children}
    </th>
  );
}
