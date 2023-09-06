// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFocusables as getActualFocusables } from '../../internal/components/focus-lock/utils';
import { FocusedCell } from './interfaces';

// For the grid to have a single Tab stop all interactive element indices are updated to be -999.
// The elements having tab index -999 are eligible for keyboard navigation but not for Tab navigation.
const PSEUDO_FOCUSABLE_TAB_INDEX = -999;

/**
 * Finds focused cell props corresponding the focused element inside the table.
 * The function relies on ARIA colindex/rowindex attributes being set.
 */
export function findFocusinCell(
  event: FocusEvent,
  customSuppressNavigation?: (focusedElement: HTMLElement) => boolean
): null | FocusedCell {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }

  function focusOnElement(element: HTMLElement): null | FocusedCell {
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
    const suppressNavigation = shouldSuppressNavigation(element) ?? customSuppressNavigation?.(element);

    // Focusing on the cell is not eligible when it contains focusable targets.
    if (cellFocusables.length > 0 && elementIndex === -1) {
      return focusOnElement(cellFocusables[0]);
    }

    return { rowIndex, colIndex, rowElement, cellElement, element, elementIndex, suppressNavigation };
  }

  return focusOnElement(event.target);
}

/**
 * Moves table focus in the provided direction. The focus can transition between cells or interactive elements inside cells.
 */
export function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: { y: number; x: number }) {
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return;
  }

  // Move focus to the next interactive cell content element if eligible.
  const cellFocusables = getFocusables(from.cellElement);
  const eligibleForElementFocus = delta.x && cellFocusables.length > 0;
  const targetElementIndex = from.elementIndex === -1 ? -1 : from.elementIndex + delta.x;
  if (eligibleForElementFocus && 0 <= targetElementIndex && targetElementIndex < cellFocusables.length) {
    focus(cellFocusables[targetElementIndex]);
    return;
  }

  // Find next cell target to focus on.
  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return;
  }

  // Focus on cell interactive content element if available or on the cell itself otherwise.
  const targetCellFocusables = getFocusables(targetCell);
  const focusIndex = delta.x < 0 ? targetCellFocusables.length - 1 : delta.x > 0 ? 0 : from.elementIndex;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  focus(focusTarget);
}

/**
 * Overrides focusability of the table elements to make focus targets controllable with keyboard commands.
 */
export function updateTableFocusables(table: HTMLTableElement, cell: null | FocusedCell) {
  // Restore default focus behavior and make all cells focusable when navigation is suppressed.
  // This allows existing the dialog cell with Tab or Shift+Tab.
  if (cell && cell.suppressNavigation) {
    for (const focusable of getFocusables(table)) {
      focusable.tabIndex = 0;
    }
    return;
  }

  const tableCells = Array.from(table.querySelectorAll('td,th') as NodeListOf<HTMLTableCellElement>);

  for (const cell of tableCells) {
    cell.tabIndex = PSEUDO_FOCUSABLE_TAB_INDEX;
  }
  for (const focusable of getActualFocusables(table)) {
    focusable.tabIndex = PSEUDO_FOCUSABLE_TAB_INDEX;
  }

  // The only focusable element of the table.
  let focusTarget: undefined | HTMLElement =
    cell && table.contains(cell.cellElement) ? cell.cellElement : tableCells[0];

  if (cell && table.contains(cell.element)) {
    focusTarget = cell.element;
  } else if (tableCells.length > 0) {
    focusTarget = getFocusables(tableCells[0])[0] ?? focusTarget;
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

/**
 * Returns true if the target element or one of its parents is a dialog or is marked with data-awsui-table-suppress-navigation.
 * For dialog cells when in focus the tab indices are not overridden and keyboard events are not intercepted.
 */
function shouldSuppressNavigation(target: HTMLElement) {
  let current: null | HTMLElement = target;
  while (current) {
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

function getFocusables(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll(`[tabIndex="0"],[tabIndex="${PSEUDO_FOCUSABLE_TAB_INDEX}"]`)
  ) as HTMLElement[];
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
