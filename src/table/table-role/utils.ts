// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getAllFocusables } from '../../internal/components/focus-lock/utils';
import { FocusableDefinition, FocusedCell } from './interfaces';

export function getAllowedFocusables(from: HTMLElement, mutedElements: Set<HTMLElement>) {
  return getAllFocusables(from).filter(el => mutedElements.has(el));
}

/**
 * Finds focused cell props corresponding the focused element inside the table.
 * The function relies on ARIA colindex/rowindex attributes being correctly applied.
 */
export function findFocusedCell(focusedElement: HTMLElement, mutedElements: Set<HTMLElement>): null | FocusedCell {
  const cellElement = focusedElement.closest('td,th') as null | HTMLTableCellElement;
  const rowElement = cellElement?.closest('tr');

  if (!cellElement || !rowElement) {
    return null;
  }

  const colIndex = parseInt(cellElement.getAttribute('aria-colindex') ?? '');
  const rowIndex = parseInt(rowElement.getAttribute('aria-rowindex') ?? '');
  if (isNaN(colIndex) || isNaN(rowIndex)) {
    return null;
  }

  const cellFocusables = getAllowedFocusables(cellElement, mutedElements);
  const elementIndex = cellFocusables.indexOf(focusedElement);

  return { rowIndex, colIndex, rowElement, cellElement, element: focusedElement, elementIndex };
}

/**
 * Moves table focus in the provided direction. The focus can transition between cells or interactive elements inside cells.
 */
export function getNextFocusable(
  table: HTMLTableElement,
  from: FocusedCell,
  delta: { y: number; x: number },
  mutedElements: Set<HTMLElement>
) {
  // Find next row to move focus into (can be null if the top/bottom is reached).
  const targetAriaRowIndex = from.rowIndex + delta.y;
  const targetRow = findTableRowByAriaRowIndex(table, targetAriaRowIndex, delta.y);
  if (!targetRow) {
    return null;
  }

  // Move focus to the next interactive cell content element if available.
  const cellFocusables = getAllowedFocusables(from.cellElement, mutedElements);
  const nextElementIndex = from.elementIndex + delta.x;
  if (delta.x && from.elementIndex !== -1 && 0 <= nextElementIndex && nextElementIndex < cellFocusables.length) {
    return cellFocusables[nextElementIndex];
  }

  // Find next cell to focus or move focus into (can be null if the left/right edge is reached).
  const targetAriaColIndex = from.colIndex + delta.x;
  const targetCell = findTableRowCellByAriaColIndex(targetRow, targetAriaColIndex, delta.x);
  if (!targetCell) {
    return null;
  }

  // When target cell matches the current cell it means we reached the left or right boundary.
  if (targetCell === from.cellElement && delta.x !== 0) {
    return null;
  }

  // Move focus on the cell interactive content or the cell itself.
  const targetCellFocusables = getAllowedFocusables(targetCell, mutedElements);
  const focusIndex = delta.x < 0 ? targetCellFocusables.length - 1 : delta.x > 0 ? 0 : from.elementIndex;
  const focusTarget = targetCellFocusables[focusIndex] ?? targetCell;
  return focusTarget;
}

/**
 * Makes the cell element, the first interactive element or the first cell of the table user-focusable.
 */
export function getSingleFocusable(table: HTMLTableElement, cell: null | FocusedCell, mutedElements: Set<HTMLElement>) {
  const firstTableCell = table.querySelector('td,th') as null | HTMLTableCellElement;

  // A single element of the table is made user-focusable.
  // It defaults to the first interactive element of the first cell or the first cell itself otherwise.
  let focusTarget: null | HTMLElement =
    (firstTableCell && getAllowedFocusables(firstTableCell, mutedElements)[0]) ?? firstTableCell;

  // When a navigation-focused element is present in the table it is used for user-navigation instead.
  if (cell) {
    focusTarget = getNextFocusable(table, cell, { x: 0, y: 0 }, mutedElements);
  }

  return focusTarget;
}

export function getFocusableElement(focusable: FocusableDefinition): null | HTMLElement {
  return typeof focusable === 'function' ? focusable() : focusable.current;
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
