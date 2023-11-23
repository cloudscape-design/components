// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFocusables as getActualFocusables } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

// For the grid to have a single Tab stop all interactive element indices are updated to be -999.
// The elements having tab index -999 are eligible for keyboard navigation but not for Tab navigation.
const PSEUDO_FOCUSABLE_TAB_INDEX = -999;
const FOCUSABLES_SELECTOR = `[tabIndex="0"],[tabIndex="${PSEUDO_FOCUSABLE_TAB_INDEX}"]`;

/**
 * Finds focused cell props corresponding the focused element inside the table.
 * The function relies on ARIA colindex/rowindex attributes being correctly applied.
 */
export function findFocusinCell(event: FocusEvent): null | FocusedCell {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }
  const element = event.target;

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

  return { rowIndex, colIndex, rowElement, cellElement, element, elementIndex };
}

/**
 * Moves table focus in the provided direction. The focus can transition between cells or interactive elements inside cells.
 */
export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  // Find next row to move focus into (can be null if the top/bottom is reached).
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  // Move focus to the next interactive cell content element if available.
  const cellFocusables = getFocusables(from.cellElement);
  const nextElementIndex = from.elementIndex + delta.x;
  if (delta.x && from.elementIndex !== -1 && 0 <= nextElementIndex && nextElementIndex < cellFocusables.length) {
    focus(cellFocusables[nextElementIndex]);
    return;
  }

  // Find next cell to focus or move focus into (can be null if the left/right edge is reached).
  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  // When target cell matches the current cell it means we reached the left or right boundary.
  if (targetCell === from.cellElement && delta.x !== 0) {
    return;
  }

  // Move focus on the cell interactive content or the cell itself.
  const targetCellFocusables = getFocusables(targetCell);
  const focusIndex = delta.x < 0 ? targetCellFocusables.length - 1 : delta.x > 0 ? 0 : from.elementIndex;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  focus(focusTarget);
}

/**
 * Makes the cell element, the first interactive element or the first cell of the table user-focusable.
 */
export function ensureSingleFocusable(table: HTMLElement, cell: null | FocusedCell) {
  const firstTableCell = table.querySelector('td,th') as null | HTMLTableCellElement;

  // A single element of the table is made user-focusable.
  // It defaults to the first interactive element of the first cell or the first cell itself otherwise.
  let focusTarget: null | HTMLElement = (firstTableCell && getFocusables(firstTableCell)[0]) ?? firstTableCell;

  // When a navigation-focused element is present in the table it is used for user-navigation instead.
  if (cell && table.contains(cell.element) && isUserFocusable(cell.element)) {
    focusTarget = cell.element;
  }

  setTabIndex(focusTarget, 0);
}

/**
 * Makes all element focusable children pseudo-focusable unless the grid navigation is suppressed.
 */
export function muteElementFocusables(element: HTMLElement, suppressed: boolean) {
  // When grid navigation is suppressed all interactive elements and all cells focus is unmuted to unblock Tab navigation.
  // Leaving the interactive widget using Tab navigation moves the focus to the current or adjacent cell and un-suppresses
  // the navigation when implemented correctly.
  if (suppressed) {
    for (const focusable of getFocusables(element)) {
      setTabIndex(focusable, 0);
    }
    return;
  }

  // Assigning pseudo-focusable tab index to all cells and all interactive elements makes them focusable with grid navigation.
  for (const focusable of getActualFocusables(element)) {
    if (focusable !== document.activeElement) {
      setTabIndex(focusable, PSEUDO_FOCUSABLE_TAB_INDEX);
    }
  }
}

/**
 * This cleanup code ensures all cells are no longer focusable but the interactive elements are.
 * Currently there are no use cases for it as we don't expect the navigation to be used conditionally.
 */
export function restoreElementFocusables(element: HTMLTableElement) {
  for (const focusable of getFocusables(element)) {
    if (focusable instanceof HTMLTableCellElement) {
      setTabIndex(focusable, -1);
    } else {
      setTabIndex(focusable, 0);
    }
  }
}

/**
 * Returns true if the target element or one of its parents is a dialog or is marked with data-awsui-table-suppress-navigation attribute.
 * This is used to suppress navigation for interactive content without a need to use a custom suppression check.
 */
export function defaultIsSuppressed(target: HTMLElement) {
  let current: null | HTMLElement = target;
  while (current) {
    // Stop checking for parents upon reaching the cell element as the function only aims at the cell content.
    const tagName = current.tagName.toLowerCase();
    if (tagName === 'td' || tagName === 'th') {
      return false;
    }
    if (
      current.getAttribute('role') === 'dialog' ||
      current.getAttribute('data-awsui-table-suppress-navigation') === 'true'
    ) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

/**
 * Returns actually focusable or pseudo-focusable elements to find navigation targets.
 */
export function getFocusables(element: HTMLElement) {
  return Array.from(element.querySelectorAll(FOCUSABLES_SELECTOR)) as HTMLElement[];
}

export function getFirstFocusable(element: HTMLElement) {
  return element.querySelector(FOCUSABLES_SELECTOR) as null | HTMLElement;
}

/**
 * Finds the closest row to the targetAriaRowIndex+delta in the direction of delta.
 */
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

/**
 * Finds the closest column to the targetAriaColIndex+delta in the direction of delta.
 */
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
  setTabIndex(element, 0);
  element?.focus();
}

function setTabIndex(element: null | HTMLElement, tabIndex: number) {
  if (element && element.tabIndex !== tabIndex) {
    element.tabIndex = tabIndex;
  }
}

function isUserFocusable(element: HTMLElement) {
  return element.matches(FOCUSABLES_SELECTOR);
}
