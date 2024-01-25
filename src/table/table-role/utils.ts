// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getClosestCell(element: Element) {
  return element.closest('td,th') as null | HTMLTableCellElement;
}

/**
 * Returns true if the target element or one of its parents is a dialog or is marked with data-awsui-table-suppress-navigation attribute.
 * This is used to suppress navigation for interactive content without a need to use a custom suppression check.
 */
export function defaultIsSuppressed(target: Element) {
  let current: null | Element = target;
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
 * Finds the closest row to the targetAriaRowIndex+delta in the direction of delta.
 */
export function findTableRowByAriaRowIndex(table: HTMLTableElement, targetAriaRowIndex: number, delta: number) {
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
export function findTableRowCellByAriaColIndex(
  tableRow: HTMLTableRowElement,
  targetAriaColIndex: number,
  delta: number
) {
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
