// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
import { TableThElement } from './th-element';

import styles from './styles.css.js';

export interface TableHiddenHeaderCellProps {
  columnId: string;
  colIndex: number;
  colspan: number;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  onResizeFinish: () => void;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  focusedComponent?: null | string;
  tabIndex: number;
  stuck?: boolean;
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
  minWidth?: number;
}

export function TableHiddenHeaderCell({
  columnId,
  colIndex,
  colspan,
  resizableColumns,
  resizableStyle,
  onResizeFinish,
  updateColumn,
  focusedComponent,
  tabIndex,
  stuck,
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
  minWidth,
}: TableHiddenHeaderCellProps) {
  const cellRefObject = useRef<HTMLElement>(null);
  const cellRefCombined = useMergeRefs(cellRef, cellRefObject);

  return (
    <TableThElement
      resizableStyle={resizableStyle}
      cellRef={cellRefCombined}
      focusedComponent={focusedComponent}
      stuck={stuck}
      sticky={sticky}
      resizable={resizableColumns}
      hidden={hidden}
      stripedRows={stripedRows}
      colIndex={colIndex}
      columnId={columnId}
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colspan}
      scope="col"
      ariaLabel=""
    >
      {/* Empty content — this is a hidden placeholder cell */}
      <div className={styles['header-cell-hidden-content']} aria-hidden="true" />
      {resizableColumns ? (
        <Resizer
          tabIndex={tabIndex}
          focusId={`resize-control-${columnId}`}
          showFocusRing={focusedComponent === `resize-control-${columnId}`}
          onWidthUpdate={newWidth => updateColumn(columnId, newWidth)}
          onWidthUpdateCommit={onResizeFinish}
          ariaLabelledby=""
          minWidth={minWidth}
          roleDescription={resizerRoleDescription}
          tooltipText={resizerTooltipText}
          isBorderless={variant === 'full-page' || variant === 'embedded' || variant === 'borderless'}
        />
      ) : (
        <Divider className={styles['resize-divider']} />
      )}
    </TableThElement>
  );
}
