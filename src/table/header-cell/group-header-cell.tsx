// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { TableRole } from '../table-role';
import { DEFAULT_COLUMN_WIDTH, useColumnWidths } from '../use-column-widths';
import { getStickyClassNames } from '../utils';
import { TableThElement } from './th-element';

import styles from './styles.css.js';

export interface TableGroupHeaderCellProps {
  group: TableProps.GroupDefinition;
  colspan: number;
  rowspan: number;
  colIndex: number;
  groupId: string;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  onResizeFinish: () => void;
  updateGroupWidth: (groupId: PropertyKey, newWidth: number) => void;
  childColumnIds: PropertyKey[];
  firstChildColumnId?: PropertyKey;
  lastChildColumnId?: PropertyKey;
  focusedComponent?: null | string;
  tabIndex: number;
  sticky?: boolean;
  hidden?: boolean;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  tableRole: TableRole;
  resizerRoleDescription?: string;
  resizerTooltipText?: string;
  variant: TableProps.Variant;
  tableVariant?: TableProps.Variant;
  isLastChildOfGroup?: boolean;
  columnGroupId?: string;
  /** When set, the <th> uses this column ID for sticky positioning instead of groupId. */
  stickyColumnId?: PropertyKey;
  /**
   * When set, subscribes to this column's sticky state to inherit boundary classes
   * (shadow) without affecting the offset. Used when the positioning column
   * and the boundary column differ (e.g. sticky-first split groups).
   */
  stickyBoundaryColumnId?: PropertyKey;
  isRightmost?: boolean;
  wrapLines?: boolean;
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
  isRightmost,
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

  // Subscribe to the boundary leaf's sticky state to inherit shadow/clip-path classes.
  // The offset/position comes from stickyColumnId (first child); this only adds boundary classes.
  const boundaryStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId: stickyBoundaryColumnId ?? stickyColumnId ?? groupId,
    getClassName: props => getStickyClassNames(styles, props),
    classOnly: true,
  });

  // Extract only the shadow classes from the boundary subscription
  const boundaryClassName = stickyBoundaryColumnId && boundaryStyles.className ? boundaryStyles.className : undefined;

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
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colspan}
      rowSpan={rowspan}
      scope="colgroup"
      isRightmost={isRightmost}
      columnGroupId={columnGroupId}
      extraClassName={boundaryClassName}
      extraRef={stickyBoundaryColumnId ? boundaryStyles.ref : undefined}
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
          dividerPosition={columnGroupId ? 'full' : 'bottom'}
        />
      ) : (
        <Divider position={columnGroupId ? 'full' : 'bottom'} variant="interactive" />
      )}
    </TableThElement>
  );
}
