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
  const focusIndex =
    delta.x === 0 && from.elementIndex !== -1 ? from.elementIndex : targetCellFocusables.length === 1 ? 0 : -1;
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
 * Overrides focusability of the table elements to make focus targets controllable with keyboard commands.
 */
export function updateTableFocusables(table: HTMLTableElement, cell: null | FocusedCell) {
  // Restore default focus behavior and make all cells focusable when focus is inside a widget cell.
  if (cell && cell.widget && cell.element !== cell.cellElement) {
    for (const focusable of getFocusables(table)) {
      focusable.tabIndex = 0;
    }
    return;
  }

  const tableCells = Array.from(table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>);

  for (const cell of tableCells) {
    cell.tabIndex = -1;
    cell.setAttribute('data-focusable', 'true');
  }
  for (const focusable of getActualFocusables(table)) {
    focusable.tabIndex = -1;
    focusable.setAttribute('data-focusable', 'true');
  }

  // The only focusable element of the table.
  let focusTarget: undefined | HTMLElement = tableCells[0];

  if (cell && table.contains(cell.element)) {
    focusTarget = cell.element;
  } else if (tableCells.length > 0) {
    const cellFocusables = getFocusables(tableCells[0]);
    const eligibleForElementFocus = !isWidgetCell(tableCells[0]) && cellFocusables.length === 1;
    focusTarget = eligibleForElementFocus ? cellFocusables[0] : focusTarget;
  }

  if (focusTarget) {
    focusTarget.tabIndex = 0;
  }
}

export function restoreTableFocusables(table: HTMLTableElement) {
  for (const focusable of getFocusables(table)) {
    if (focusable instanceof HTMLTableCellElement) {
      focusable.tabIndex = -1;
    } else {
      focusable.tabIndex = 0;
    }
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
  const rowElements = Array.from(table.querySelectorAll('tr[aria-rowindex]'));
  if (delta < 0) {
    rowElements.reverse();
  }
  for (const element of rowElements) {
    const rowIndex = parseInt(element.getAttribute('aria-rowindex') ?? '');
    targetRow = element as HTMLTableRowElement;

    if (rowIndex === targetAriaRowIndex) {
      break;
    }
    if (delta >= 0 && rowIndex > targetAriaRowIndex) {
      break;
    }
    if (delta < 0 && rowIndex < targetAriaRowIndex) {
      break;
    }
  }
  return targetRow;
}

function findTableRowCellByAriaColIndex(tableRow: HTMLTableRowElement, targetAriaColIndex: number, delta: number) {
  let targetCell: null | HTMLTableCellElement = null;
  const cellElements = Array.from(tableRow.querySelectorAll('td[aria-colindex],th[aria-colindex]'));
  if (delta < 0) {
    cellElements.reverse();
  }
  for (const element of cellElements) {
    const columnIndex = parseInt(element.getAttribute('aria-colindex') ?? '');
    targetCell = element as HTMLTableCellElement;

    if (columnIndex === targetAriaColIndex) {
      break;
    }
    if (delta >= 0 && columnIndex > targetAriaColIndex) {
      break;
    }
    if (delta < 0 && columnIndex < targetAriaColIndex) {
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
