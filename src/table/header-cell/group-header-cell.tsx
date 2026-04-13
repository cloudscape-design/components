// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
import { TableThElement } from './th-element';

import styles from './styles.css.js';

export interface TableGroupHeaderCellProps {
  group: TableProps.GroupDefinition<any>;
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
  childColumnMinWidths: Map<PropertyKey, number>;
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
  isLastChildOfGroup,
  columnGroupId,
  stickyColumnId,
}: TableGroupHeaderCellProps) {
  const headerId = useUniqueId('table-group-header-');
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
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colspan}
      rowSpan={rowspan}
      scope="colgroup"
      isLastChildOfGroup={isLastChildOfGroup}
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
        <div className={styles['header-cell-text']} id={headerId}>
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
          minWidth={undefined}
          roleDescription={resizerRoleDescription}
          tooltipText={resizerTooltipText}
          isBorderless={variant === 'full-page' || variant === 'embedded' || variant === 'borderless'}
        />
      ) : (
        <Divider className={clsx(styles['resize-divider'])} />
      )}
    </TableThElement>
  );
}
