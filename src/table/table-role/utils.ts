// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getClosestCell(element: Element) {
  return element.closest('td,th') as null | HTMLTableCellElement;
}

export function isElementDisabled(element: HTMLElement) {
  if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
    return element.disabled;
  }
  return false;
}

/**
 * Returns true if the target element or one of its parents is a dialog or is marked with data-awsui-table-suppress-navigation attribute.
 * This is used to suppress navigation for interactive content without a need to use a custom suppression check.
 */
export function defaultIsSuppressed(target: Element) {
  let current: null | Element = target;
  while (current) {
    // Stop checking for parents upon reaching the cell element as the function only aims at the cell content.
    if (isTableCell(current)) {
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
export function findTableRowByAriaRowIndex(table: null | HTMLTableElement, targetAriaRowIndex: number, delta: number) {
  let targetRow: null | HTMLTableRowElement = null;
  const rowElements = Array.from(table?.querySelectorAll('tr[aria-rowindex]') ?? []);
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
  const cellElements = Array.from(
    tableRow.querySelectorAll<HTMLTableCellElement>('td[aria-colindex],th[aria-colindex]')
  );
  return findClosestCellByAriaColIndex(cellElements, targetAriaColIndex, delta);
}

/**
 * Collects all cells visually present in a row, including cells from earlier rows
 * that span into this row via rowspan. This is needed because cells with rowspan > 1
 * are only in one <tr> in the DOM but visually occupy multiple rows.
 */
export function getAllCellsInRow(table: null | HTMLTableElement, targetAriaRowIndex: number): HTMLTableCellElement[] {
  if (!table) {
    return [];
  }

  const cells: HTMLTableCellElement[] = [];
  const rows = table.querySelectorAll<HTMLTableRowElement>('tr[aria-rowindex]');

  for (const row of Array.from(rows)) {
    const rowIndex = parseInt(row.getAttribute('aria-rowindex') ?? '');
    if (isNaN(rowIndex) || rowIndex > targetAriaRowIndex) {
      continue;
    }

    const rowCells = row.querySelectorAll<HTMLTableCellElement>('td[aria-colindex],th[aria-colindex]');
    for (const cell of Array.from(rowCells)) {
      const rowspan = cell.rowSpan || 1;
      // Cell is visible in target row if: rowIndex <= targetAriaRowIndex < rowIndex + rowspan
      if (rowIndex + rowspan > targetAriaRowIndex) {
        cells.push(cell);
      }
    }
  }

  return cells;
}

/**
 * From a list of cell elements, find the closest one to targetAriaColIndex in the direction of delta.
 * Accounts for colspan: a cell with colindex=2 and colspan=4 covers columns 2,3,4,5.
 */
export function findClosestCellByAriaColIndex(
  cellElements: HTMLTableCellElement[],
  targetAriaColIndex: number,
  delta: number
): HTMLTableCellElement | null {
  // First check if any cell's colspan range covers the target exactly.
  for (const element of cellElements) {
    const colIndex = parseInt(element.getAttribute('aria-colindex') ?? '');
    const colspan = element.colSpan || 1;
    if (colIndex <= targetAriaColIndex && targetAriaColIndex < colIndex + colspan) {
      return element;
    }
  }

  // Otherwise find the closest cell in the direction of delta.
  let targetCell: null | HTMLTableCellElement = null;
  const sorted = [...cellElements].sort((a, b) => {
    const aIdx = parseInt(a.getAttribute('aria-colindex') ?? '0');
    const bIdx = parseInt(b.getAttribute('aria-colindex') ?? '0');
    return aIdx - bIdx;
  });
  if (delta < 0) {
    sorted.reverse();
  }
  for (const element of sorted) {
    const columnIndex = parseInt(element.getAttribute('aria-colindex') ?? '');
    targetCell = element;

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

export function isTableCell(element: Element) {
  return element.tagName === 'TD' || element.tagName === 'TH';
}

export function focusNextElement(element: null | HTMLElement) {
  if (element) {
    // Table cells are not focusable by default (tabIndex=undefined) so cell.focus() is ignored.
    // To force focusing we have to imperatively set tabIndex to -1. This tabIndex is then to be
    // overridden by the single tab stop context to be 0 or undefined.
    // We cannot make cells have tabIndex=-1 by default due to an associated bug with text selection, see: PR 2158.
    if (isTableCell(element) && element.tabIndex !== 0) {
      element.tabIndex = -1;
    }
    element.focus();
  }
}
