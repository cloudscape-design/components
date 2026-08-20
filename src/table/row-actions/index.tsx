// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalButtonDropdown from '../../button-dropdown/internal';
import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { TableProps } from '../interfaces';

// Symbol used as the column ID for the row-actions column (avoids string collisions).
export const rowActionsColumnId = Symbol('row-actions-column-id');

// ──────────────────────────────────────────────────────────────────────────────
// Body cell
// ──────────────────────────────────────────────────────────────────────────────

interface TableRowActionsBodyCellProps<T>
  extends Omit<TableTdElementProps, 'children' | 'colIndex' | 'wrapLines' | 'isEditable' | 'isEditing'> {
  item: T;
  rowActions: TableProps.RowActionsConfig<T>;
  colIndex: number;
}

export function TableRowActionsCell<T>({ item, rowActions, colIndex, ...tdProps }: TableRowActionsBodyCellProps<T>) {
  const { items, onItemClick, ariaLabel, disabled } = rowActions;
  const dropdownItems = items(item);
  const triggerAriaLabel = ariaLabel ? ariaLabel(item) : 'Actions';
  const isDisabled = disabled ? disabled(item) : false;

  return (
    <TableTdElement {...tdProps} colIndex={colIndex} wrapLines={false} isEditable={false} isEditing={false}>
      <InternalButtonDropdown
        variant="inline-icon"
        iconName="ellipsis"
        ariaLabel={triggerAriaLabel}
        items={dropdownItems}
        disabled={isDisabled || dropdownItems.length === 0}
        expandToViewport={true}
        onItemClick={event => {
          event.preventDefault();
          onItemClick(event.detail, item);
        }}
      />
    </TableTdElement>
  );
}
