// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { getTableColHeaderRoleProps, TableRole } from '../table-role';
import { getStickyClassNames } from '../utils';
import { SortingStatus } from './utils';

import tableStyles from '../styles.css.js';
import styles from './styles.css.js';

export interface TableThElementProps {
  resizableStyle?: ColumnWidthStyle;
  sortingStatus?: SortingStatus;
  sortingDisabled?: boolean;
  /**
   * When true, the visual caret driven by `sortingStatus` is preserved but the
   * `aria-sort` attribute is omitted. Used for non-primary columns in a
   * multi-column sort, where ARIA only allows one column to declare itself
   * sorted.
   */
  suppressAriaSort?: boolean;
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
  tableVariant?: TableProps.Variant;
  ariaLabel?: string;
  colSpan?: number;
  rowSpan?: number;
  scope?: 'col' | 'colgroup';
  columnGroupId?: string;
  isLast?: boolean;
  /**
   * For cells that span multiple columns (group headers): the column id of the boundary leaf
   * whose sticky shadow this cell should inherit. The cell's position still comes from `columnId`.
   */
  stickyBoundaryColumnId?: PropertyKey;
}

export function TableThElement({
  resizableStyle,
  sortingStatus,
  sortingDisabled,
  suppressAriaSort,
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
  colSpan,
  rowSpan,
  scope,
  columnGroupId,
  isLast,
  stickyBoundaryColumnId,
  ...props
}: TableThElementProps) {
  const isVisualRefresh = useVisualRefresh();

  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
    boundaryColumnId: stickyBoundaryColumnId,
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
        scope === 'colgroup' && styles['header-cell-group'],
        {
          [styles['header-cell-fake-focus']]: focusedComponent === `header-${String(columnId)}`,
          [styles['header-cell-sortable']]: sortingStatus,
          [styles['header-cell-sorted']]: sortingStatus === 'ascending' || sortingStatus === 'descending',
          [styles['header-cell-disabled']]: sortingDisabled,
          [styles['header-cell-ascending']]: sortingStatus === 'ascending',
          [styles['header-cell-descending']]: sortingStatus === 'descending',
          [styles['header-cell-hidden']]: hidden,
          [styles['header-cell-spans-rows']]: (rowSpan ?? 1) > 1,
          [styles['header-cell-grouped']]: !!columnGroupId,
        },
        stickyStyles.className
      )}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={{ ...resizableStyle, ...stickyStyles.style }}
      ref={mergedRef}
      {...getTableColHeaderRoleProps({
        tableRole,
        sortingStatus: suppressAriaSort ? undefined : sortingStatus,
        colIndex,
      })}
      scope={scope ?? 'col'}
      tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
      {...copyAnalyticsMetadataAttribute(props)}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...(isLast ? { 'data-rightmost': true } : {})}
      {...(scope !== 'colgroup' ? { 'data-column-index': colIndex + 1 } : {})}
      {...(columnGroupId ? { 'data-column-group-id': columnGroupId } : {})}
    >
      {children}
    </th>
  );
}
