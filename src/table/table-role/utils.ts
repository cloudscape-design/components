// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFocusables as getActualFocusables } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

/**
 * Finds focused cell props corresponding the focused element inside the table.
 * The function relies on ARIA colindex/rowindex attributes being set.
 */
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

/**
 * Moves table focus in the provided direction. The focus can transition between cells or between
 * focusable elements within a cell unless the cell is marked as a widget.
 */
export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  // Move focus to the next focusable element within a cell if eligible.
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

  // For widget cells always focus on the cell element itself.
  if (isWidgetCell(targetCell)) {
    return targetCell.focus();
  }

  // For zero delta (exiting command) always focus on the cell element.
  if (delta.x === 0 && delta.y === 0) {
    return targetCell.focus();
  }

  // For non-widget cell focus on the focusable element inside if exactly one is available.
  const targetCellFocusables = getFocusables(targetCell);
  const focusIndex = delta.x === 0 ? from.elementIndex : targetCellFocusables.length === 1 ? 0 : -1;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  focusTarget.focus();
}

export function moveFocusIn(from: FocusedCell) {
  getFirstFocusable(from.cellElement)?.focus();
}

// TODO: optimise: use less computations or a memory-based solution instead
export function updateTableIndices(table: HTMLTableElement, cell: null | FocusedCell) {
  const tableCells = table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>;
  for (let i = 0; i < tableCells.length; i++) {
    tableCells[i].tabIndex = -1;
  }

  let setUserFocus = false;

  const targets = [...getActualFocusables(table), ...getFocusables(table), ...Array.from(tableCells)];

  for (const element of targets) {
    if (element === cell?.element) {
      element.tabIndex = 0;
      setUserFocus = true;
    } else {
      element.tabIndex = -1;
      element.setAttribute('data-focusable', 'true');
    }
  }
  if (!setUserFocus) {
    if (tableCells[0]) {
      tableCells[0].tabIndex = 0;
    }
  }
}

export function isWidgetCell(cell: HTMLElement) {
  return cell.getAttribute('data-widget-cell') === 'true';
}

function getFocusables(element: HTMLElement) {
  return Array.from(element.querySelectorAll('[data-focusable="true"]')) as HTMLElement[];
}

function getFirstFocusable(element: HTMLElement) {
  return getFocusables(element)[0] as null | HTMLElement;
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
