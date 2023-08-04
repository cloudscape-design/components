// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFirstFocusable, getFocusables } from '../../internal/components/focus-lock/utils';
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

  const cellFocusables = getFocusables(cellElement);
  let elementIndex = cellFocusables.indexOf(element);
  elementIndex = elementIndex === -1 ? 0 : elementIndex;

  return { rowIndex, colIndex, elementIndex, rowElement, cellElement, element };
}

export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  const cellFocusables = getFocusables(from.cellElement);
  const eligibleForElementFocus =
    delta.x && !isWidgetCell(from.element) && (cellFocusables.length === 1 || from.element !== from.cellElement);
  const targetElementIndex = from.elementIndex + delta.x;
  if (eligibleForElementFocus && 0 <= targetElementIndex && targetElementIndex < cellFocusables.length) {
    cellFocusables[targetElementIndex].focus();
    return;
  }

  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  if (isWidgetCell(targetCell)) {
    return targetCell.focus();
  }

  const targetCellFocusables = getFocusables(targetCell);
  const focusIndex = delta.x === 0 ? from.elementIndex : targetCellFocusables.length === 1 ? 0 : -1;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  focusTarget.focus();
}

export function moveFocusIn(from: FocusedCell) {
  getFirstFocusable(from.cellElement)?.focus();
}

export function updateTableIndices(table: HTMLTableElement) {
  const tableCells = table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>;

  const firstCell = tableCells[0];
  const lastCell = tableCells[tableCells.length - 1];
  for (let i = 1; i < tableCells.length - 1; i++) {
    tableCells[i].tabIndex = -1;
  }
  if (firstCell) {
    firstCell.tabIndex = !getFirstFocusable(firstCell) || isWidgetCell(firstCell) ? 0 : -1;
  }
  if (lastCell) {
    lastCell.tabIndex = !getFirstFocusable(lastCell) || isWidgetCell(lastCell) ? 0 : -1;
  }
}

export function isWidgetCell(cell: HTMLElement) {
  return cell.getAttribute('data-widget-cell') === 'true';
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
