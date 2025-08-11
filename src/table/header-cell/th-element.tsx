// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode/index.js';
import { ColumnWidthStyle } from '../column-widths-utils.js';
import { TableProps } from '../interfaces.js';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns/index.js';
import { getTableColHeaderRoleProps, TableRole } from '../table-role/index.js';
import { getStickyClassNames } from '../utils.js';
import { SortingStatus } from './utils.js';

import tableStyles from '../styles.css.js';
import styles from './styles.css.js';

export interface TableThElementProps {
  resizableStyle?: ColumnWidthStyle;
  sortingStatus?: SortingStatus;
  sortingDisabled?: boolean;
  focusedComponent?: null | string;
  stuck?: boolean;
  sticky?: boolean;
  resizable?: boolean;
  hidden?: boolean;
  stripedRows?: boolean;
  isSelection?: boolean;
  colIndex: number;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef?: React.RefCallback<HTMLElement> | null;
  tableRole: TableRole;
  children: React.ReactNode;
  variant: TableProps.Variant;
  ariaLabel?: string;
  tableVariant?: string;
}

export function TableThElement({
  resizableStyle,
  sortingStatus,
  sortingDisabled,
  focusedComponent,
  stuck,
  sticky,
  resizable,
  hidden,
  stripedRows,
  isSelection,
  colIndex,
  columnId,
  stickyState,
  cellRef,
  tableRole,
  children,
  variant,
  ariaLabel,
  tableVariant,
  ...props
}: TableThElementProps) {
  const isVisualRefresh = useVisualRefresh();

  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
  });

  const cellRefObject = useRef<HTMLTableCellElement>(null);
  const mergedRef = useMergeRefs(stickyStyles.ref, cellRef, cellRefObject);
  const { tabIndex: cellTabIndex } = useSingleTabStopNavigation(cellRefObject);

  return (
    <th
      data-focus-id={`header-${String(columnId)}`}
      className={clsx(
        styles['header-cell'],
        styles[`header-cell-variant-${variant}`],
        sticky && styles['header-cell-sticky'],
        resizable && styles['header-cell-resizable'],
        stuck && styles['header-cell-stuck'],
        stripedRows && styles['has-striped-rows'],
        isVisualRefresh && styles['is-visual-refresh'],
        isSelection && clsx(tableStyles['selection-control'], tableStyles['selection-control-header']),
        tableVariant && styles[`table-variant-${tableVariant}`],
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
      style={{ ...resizableStyle, ...stickyStyles.style }}
      ref={mergedRef}
      {...getTableColHeaderRoleProps({ tableRole, sortingStatus, colIndex })}
      tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
      {...copyAnalyticsMetadataAttribute(props)}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </th>
  );
}
