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
  const elementIndex = cellFocusables.indexOf(element);

  const widget = isWidgetCell(cellElement);

  return { rowIndex, colIndex, elementIndex, rowElement, cellElement, element, widget };
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
  const targetElementIndex = from.elementIndex === -1 ? -1 : from.elementIndex + delta.x;
  if (eligibleForElementFocus && 0 <= targetElementIndex && targetElementIndex < cellFocusables.length) {
    focus(cellFocusables[targetElementIndex]);
    return;
  }

  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  // For widget cells always focus on the cell element itself.
  if (isWidgetCell(targetCell)) {
    return focus(targetCell);
  }

  // For zero delta (exiting command) and multi-element cell focus cell itself.
  const targetCellFocusables = getFocusables(targetCell);
  if (delta.x === 0 && delta.y === 0 && targetCellFocusables.length > 1) {
    return focus(targetCell);
  }

  // For non-widget cell focus on the focusable element inside if exactly one is available.
  const focusIndex = delta.x === 0 ? from.elementIndex : targetCellFocusables.length === 1 ? 0 : -1;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  focus(focusTarget);
}

/**
 * Moves focus to the first focusable element inside the cell.
 */
export function moveFocusIn(from: FocusedCell) {
  focus(getFirstFocusable(from.cellElement));
}

/**
 * Ensures exactly one table element is focusable for the entire table to have a single TAB stop.
 */
export function updateTableIndices(table: HTMLTableElement, cell: null | FocusedCell) {
  const tableCells = Array.from(table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>);

  for (const cell of tableCells) {
    cell.tabIndex = -1;
    cell.setAttribute('data-focusable', 'true');
  }
  for (const focusable of getActualFocusables(table)) {
    focusable.tabIndex = -1;
    focusable.setAttribute('data-focusable', 'true');
  }

  // Make focused element the only focusable element of the table.
  if (cell && table.contains(cell.element)) {
    cell.element.tabIndex = 0;

    // For widget cells unmute all cell elements to be focusable with Tab/Shift+Tab.
    if (cell.widget) {
      getFocusables(cell.cellElement).forEach(element => (element.tabIndex = 0));
    }

    // Make the current and the next cell focusable to allow existing widget cell with Tab/Shift+Tab.
    if (cell.widget && cell.element !== cell.cellElement) {
      const cellIndex = tableCells.indexOf(cell.cellElement);
      if (tableCells[cellIndex + 1]) {
        cell.cellElement.tabIndex = 0;
        tableCells[cellIndex + 1].tabIndex = 0;
      }
    }
  }

  // Make first table cell the only focusable element of the table.
  else if (tableCells[0]) {
    const cellFocusables = getFocusables(tableCells[0]);
    !isWidgetCell(tableCells[0]) && cellFocusables[0] ? (cellFocusables[0].tabIndex = 0) : (tableCells[0].tabIndex = 0);
  }
}

function isWidgetCell(cell: HTMLElement) {
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

function focus(element: null | HTMLElement) {
  if (element) {
    element.tabIndex = 0;
    element.focus();
  }
}
