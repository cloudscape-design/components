// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFirstFocusable } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

export function findFocusinCell(event: FocusEvent): null | FocusedCell {
  if (!(event.target instanceof Element)) {
    return null;
  }

  const closestCell = event.target.closest('td,th') as null | HTMLTableCellElement;
  const closestRow = closestCell?.closest('tr');

  if (!closestCell || !closestRow) {
    return null;
  }

  const colIndex = parseInt(closestCell.getAttribute('aria-colindex') ?? '');
  const rowIndex = parseInt(closestRow.getAttribute('aria-rowindex') ?? '');
  if (isNaN(colIndex)) {
    return null;
  }

  return { rowIndex: isNaN(rowIndex) ? 0 : rowIndex, colIndex, cellElement: closestCell, element: event.target };
}

export function moveFocusBy(
  table: HTMLTableElement,
  from: { rowIndex: number; colIndex: number },
  delta: { rowIndex: number; colIndex: number }
) {
  const targetAriaRowIndex = from.rowIndex + delta.rowIndex;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.rowIndex);
  if (!targetRow) {
    return;
  }

  const targetAriaColIndex = from.colIndex + delta.colIndex;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.colIndex);
  if (!targetCell) {
    return;
  }

  const cellFirstFocusable = getFirstFocusable(targetCell);
  const focusTarget = cellFirstFocusable ? cellFirstFocusable : targetCell;
  focusTarget.focus();
}

function findTableRowByAriaRowIndex(table: HTMLTableElement, targetAriaRowIndex: number, delta: number) {
  let targetRow: null | HTMLTableRowElement = null;
  const rowElements = table.querySelectorAll('tr[aria-rowindex]');
  for (let elementIndex = 0; elementIndex < rowElements.length; elementIndex++) {
    const rowIndex = parseInt(rowElements[elementIndex].getAttribute('aria-rowindex') ?? '');
    targetRow = rowElements[elementIndex] as HTMLTableRowElement;

    if (rowIndex === targetAriaRowIndex || (delta < 0 && rowIndex >= targetAriaRowIndex)) {
      break;
    }
  }
  return targetRow;
}

function findTableRowCellByAriaColIndex(tableRow: HTMLTableRowElement, targetAriaColIndex: number, delta: number) {
  let targetCell: null | HTMLTableCellElement = null;
  const cellElements = tableRow.querySelectorAll('td[aria-colindex],th[aria-colindex]');
  for (let elementIndex = 0; elementIndex < cellElements.length; elementIndex++) {
    const columnIndex = parseInt(cellElements[elementIndex].getAttribute('aria-colindex') ?? '');
    targetCell = cellElements[elementIndex] as HTMLTableCellElement;

    if (columnIndex === targetAriaColIndex || (delta < 0 && columnIndex >= targetAriaColIndex)) {
      break;
    }
  }
  return targetCell;
}
