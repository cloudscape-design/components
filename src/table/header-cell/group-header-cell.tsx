// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { DEFAULT_COLUMN_WIDTH, useColumnWidths } from '../use-column-widths';
import { BaseHeaderCellProps } from './common-props';
import { TableThElement } from './th-element';

import styles from './styles.css.js';

export interface TableGroupHeaderCellProps extends BaseHeaderCellProps {
  group: TableProps.GroupDefinition;
  colspan: number;
  rowspan: number;
  groupId: string;
  updateGroupWidth: (groupId: PropertyKey, newWidth: number) => void;
  childColumnIds: PropertyKey[];
  firstChildColumnId?: PropertyKey;
  lastChildColumnId?: PropertyKey;
  columnGroupId?: string;
  stickyColumnId?: PropertyKey;
  stickyBoundaryColumnId?: PropertyKey;
  isLast?: boolean;
}

export function TableGroupHeaderCell({
  group,
  colspan,
  rowspan,
  colIndex,
  groupId,
  resizableColumns,
  resizableStyle,
  onResizeFinish,
  updateGroupWidth,
  childColumnIds,
  focusedComponent,
  tabIndex,
  sticky,
  hidden,
  stripedRows,
  stickyState,
  cellRef,
  tableRole,
  resizerRoleDescription,
  resizerTooltipText,
  variant,
  tableVariant,
  columnGroupId,
  stickyColumnId,
  stickyBoundaryColumnId,
  isLast,
  wrapLines,
}: TableGroupHeaderCellProps) {
  const headerId = useUniqueId('table-group-header-');
  const { columnWidths } = useColumnWidths();

  // Effective min = sum of non-rightmost children's current widths (fixed) + rightmost child's minWidth
  const lastChild = childColumnIds[childColumnIds.length - 1];
  const groupMinWidth = childColumnIds.reduce<number>((sum, id) => {
    if (id === lastChild) {
      return sum + DEFAULT_COLUMN_WIDTH;
    }
    return sum + (columnWidths.get(id) || DEFAULT_COLUMN_WIDTH);
  }, 0);
  const clickableHeaderRef = useRef<HTMLDivElement>(null);
  const { tabIndex: clickableHeaderTabIndex } = useSingleTabStopNavigation(clickableHeaderRef, { tabIndex });

  return (
    <TableThElement
      resizableStyle={resizableStyle}
      cellRef={cellRef}
      focusedComponent={focusedComponent}
      sticky={sticky}
      resizable={resizableColumns}
      hidden={hidden}
      stripedRows={stripedRows}
      colIndex={colIndex}
      columnId={stickyColumnId ?? groupId}
      stickyBoundaryColumnId={stickyBoundaryColumnId}
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colspan}
      rowSpan={rowspan}
      scope="colgroup"
      isLast={isLast}
      columnGroupId={columnGroupId}
    >
      <div
        ref={clickableHeaderRef}
        data-focus-id={`group-header-${groupId}`}
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent === `group-header-${groupId}`,
        })}
        aria-label={group.ariaLabel?.({ sorted: false, descending: false, disabled: true })}
        tabIndex={clickableHeaderTabIndex}
      >
        <div className={clsx(styles['header-cell-text'], wrapLines && styles['header-cell-text-wrap'])} id={headerId}>
          {group.header}
        </div>
      </div>
      {resizableColumns ? (
        <Resizer
          tabIndex={tabIndex}
          focusId={`resize-group-${groupId}`}
          showFocusRing={focusedComponent === `resize-group-${groupId}`}
          onWidthUpdate={newWidth => updateGroupWidth(groupId, newWidth)}
          onWidthUpdateCommit={onResizeFinish}
          ariaLabelledby={headerId}
          minWidth={groupMinWidth}
          roleDescription={resizerRoleDescription}
          tooltipText={resizerTooltipText}
          isBorderless={variant === 'full-page' || variant === 'embedded' || variant === 'borderless'}
          isLast={isLast}
          isGrouped={true}
          dividerPosition={columnGroupId ? 'full' : 'bottom'}
        />
      ) : (
        <Divider position={columnGroupId ? 'full' : 'bottom'} isGrouped={true} />
      )}
    </TableThElement>
  );
}
