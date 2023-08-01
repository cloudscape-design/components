// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFirstFocusable } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

export function findFocusinCell(event: FocusEvent): null | FocusedCell {
  const element = event.target;

  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const cellElement = element.closest('td,th') as null | HTMLTableCellElement;
  const rowElement = cellElement?.closest('tr');

  if (!cellElement || !rowElement) {
    return null;
  }

  const colIndex = parseInt(cellElement.getAttribute('aria-colindex') ?? '');
  const rowIndex = parseInt(rowElement.getAttribute('aria-rowindex') ?? '');
  if (isNaN(colIndex) || isNaN(rowIndex)) {
    return null;
  }

  return { rowIndex, colIndex, rowElement, cellElement, element };
}

export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  targetCell.focus();
}

export function moveFocusIn(from: FocusedCell) {
  getFirstFocusable(from.cellElement)?.focus();
}

export function updateTableIndices(table: HTMLTableElement, cell: null | FocusedCell) {
  const tableCells = table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>;

  for (let i = 1; i < tableCells.length - 1; i++) {
    tableCells[i].tabIndex = -1;
  }
  if (tableCells[0]) {
    tableCells[0].tabIndex = 0;
  }
  if (tableCells[tableCells.length - 1]) {
    tableCells[tableCells.length - 1].tabIndex = 0;
  }

  if (!cell) {
    return;
  }

  const cellIndex = Array.from(tableCells).indexOf(cell.cellElement);
  if (tableCells[cellIndex]) {
    tableCells[cellIndex].tabIndex = 0;
  }
  if (tableCells[cellIndex - 1]) {
    tableCells[cellIndex - 1].tabIndex = 0;
  }
  if (tableCells[cellIndex + 1]) {
    tableCells[cellIndex + 1].tabIndex = 0;
  }
}

export function updateCellFocus(table: HTMLTableElement, cell: FocusedCell) {
  const targetRow = findTableRowByAriaRowIndex(table, cell.rowIndex);
  if (!targetRow) {
    return;
  }

  const targetCell = findTableRowCellByAriaColIndex(targetRow, cell.colIndex);
  if (!targetCell) {
    return;
  }

  targetCell.tabIndex = -1;
  targetCell.focus();
  updateTableIndices(table, cell);
}

function findTableRowByAriaRowIndex(table: HTMLTableElement, targetAriaRowIndex: number, delta = 0) {
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

function findTableRowCellByAriaColIndex(tableRow: HTMLTableRowElement, targetAriaColIndex: number, delta = 0) {
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
