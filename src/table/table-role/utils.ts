// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFocusables } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

export function findFocusinCell(event: FocusEvent): null | FocusedCell {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const cellElement = target.closest('td,th') as null | HTMLTableCellElement;
  const rowElement = cellElement?.closest('tr');

  if (!cellElement || !rowElement) {
    return null;
  }

  const colIndex = parseInt(cellElement.getAttribute('aria-colindex') ?? '');
  const rowIndex = parseInt(rowElement.getAttribute('aria-rowindex') ?? '');
  if (isNaN(colIndex) || isNaN(rowIndex)) {
    return null;
  }

  const cellFocusables = getFocusables(cellElement);
  let elementIndex = cellFocusables.indexOf(target);
  elementIndex = elementIndex === -1 ? 0 : elementIndex;

  const element = target !== cellElement || cellFocusables.length === 0 ? target : cellFocusables[0];

  return { rowIndex, colIndex, elementIndex, rowElement, cellElement, element };
}

export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  const cellFocusables = getFocusables(from.cellElement);
  if (delta.x && 0 <= from.elementIndex + delta.x && from.elementIndex + delta.x < cellFocusables.length) {
    cellFocusables[from.elementIndex + delta.x].focus();
    return;
  }

  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  const targetCellFocusables = getFocusables(targetCell);
  const focusTarget = targetCellFocusables[from.elementIndex] ?? targetCellFocusables[0] ?? targetCell;
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
