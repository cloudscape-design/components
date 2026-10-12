// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DragHandle, { DragHandleProps } from '../../internal/components/drag-handle';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { TableThElement, TableThElementProps } from '../header-cell/th-element';

// ─── Header cell ────────────────────────────────────────────────────────────

export interface TableHeaderRowDragHandleCellProps
  extends Omit<TableThElementProps, 'children' | 'colIndex' | 'focusedComponent'> {
  ariaLabel?: string;
}

export function TableHeaderRowDragHandle({ ariaLabel, ...props }: TableHeaderRowDragHandleCellProps) {
  return (
    <TableThElement {...props} colIndex={0} isSelection={true}>
      <ScreenreaderOnly>{ariaLabel}</ScreenreaderOnly>
    </TableThElement>
  );
}

// ─── Body cell ──────────────────────────────────────────────────────────────

export interface TableRowDragHandleCellProps
  extends Omit<TableTdElementProps, 'children' | 'colIndex' | 'wrapLines' | 'isEditable' | 'isEditing'> {
  dragHandleProps: DragHandleProps;
}

export function TableRowDragHandle({ dragHandleProps, ...props }: TableRowDragHandleCellProps) {
  return (
    <TableTdElement {...props} colIndex={0} wrapLines={false} isEditable={false} isEditing={false} isSelection={true}>
      <DragHandle {...dragHandleProps} />
    </TableTdElement>
  );
}
