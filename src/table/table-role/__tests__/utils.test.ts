// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  findClosestCellByAriaColIndex,
  findNextCell,
  findTableRowCellByAriaColIndex,
  getAllCellsInRow,
} from '../utils';

function createCell(colIndex: number, colspan = 1, rowspan = 1): HTMLTableCellElement {
  const cell = document.createElement('td');
  cell.setAttribute('aria-colindex', String(colIndex));
  cell.colSpan = colspan;
  cell.rowSpan = rowspan;
  return cell;
}

function createRow(ariaRowIndex: number, cells: HTMLTableCellElement[]): HTMLTableRowElement {
  const row = document.createElement('tr');
  row.setAttribute('aria-rowindex', String(ariaRowIndex));
  cells.forEach(c => row.appendChild(c));
  return row;
}

function createTable(rows: HTMLTableRowElement[]): HTMLTableElement {
  const table = document.createElement('table');
  rows.forEach(r => table.appendChild(r));
  return table;
}

describe('findTableRowCellByAriaColIndex', () => {
  test('finds cell by exact colindex', () => {
    const row = createRow(1, [createCell(1), createCell(2), createCell(3)]);
    expect(findTableRowCellByAriaColIndex(row, 2, 1)).toBe(row.children[1]);
  });
});

describe('findClosestCellByAriaColIndex', () => {
  test('finds cell covered by colspan', () => {
    const cells = [createCell(1, 3), createCell(4)];
    // Target 2 is within colspan of cell at colindex=1 (covers 1,2,3)
    expect(findClosestCellByAriaColIndex(cells, 2, 1)).toBe(cells[0]);
  });

  test('finds closest cell when target is beyond last cell (forward)', () => {
    const cells = [createCell(1), createCell(2), createCell(3)];
    // Target 5 doesn't exist — closest in forward direction is cell 3
    expect(findClosestCellByAriaColIndex(cells, 5, 1)).toBe(cells[2]);
  });

  test('breaks when columnIndex exceeds target in forward direction', () => {
    // Cells at 1, 3, 5 — target is 4, delta >= 0
    // Sorted: 1, 3, 5. Loop: targetCell=1, targetCell=3, targetCell=5 (5>4 → break)
    const cells = [createCell(1), createCell(3), createCell(5)];
    expect(findClosestCellByAriaColIndex(cells, 4, 1)).toBe(cells[2]);
  });

  test('breaks when columnIndex is below target in reverse direction', () => {
    // Cells at 1, 3, 5 — target is 4, delta < 0
    // Sorted reversed: 5, 3, 1. Loop: targetCell=5, targetCell=3 (3<4 → break)
    const cells = [createCell(1), createCell(3), createCell(5)];
    expect(findClosestCellByAriaColIndex(cells, 4, -1)).toBe(cells[1]);
  });
});

describe('getAllCellsInRow', () => {
  test('includes cells from earlier rows that span into target row', () => {
    const cell1 = createCell(1, 1, 2); // rowspan=2, spans rows 1-2
    const cell2 = createCell(2);
    const row1 = createRow(1, [cell1, cell2]);
    const cell3 = createCell(2);
    const row2 = createRow(2, [cell3]);
    const table = createTable([row1, row2]);

    const cells = getAllCellsInRow(table, 2);
    // cell1 (rowspan=2 from row 1) + cell3 (row 2)
    expect(cells).toContain(cell1);
    expect(cells).toContain(cell3);
    expect(cells).not.toContain(cell2); // cell2 only in row 1
  });
});

describe('findNextCell', () => {
  test('skips past current cell when vertical movement lands on same cell due to rowspan', () => {
    const cell1 = createCell(1, 1, 2); // rowspan=2, spans rows 1-2
    const cell2 = createCell(2);
    const row1 = createRow(1, [cell1, cell2]);
    const cell3 = createCell(1);
    const cell4 = createCell(2);
    const row2 = createRow(2, [cell3, cell4]);
    const cell5 = createCell(1);
    const row3 = createRow(3, [cell5]);
    const table = createTable([row1, row2, row3]);

    // Moving down from cell1 (rowspan=2, in row1) targeting row2 — lands on cell1 again
    // Skips to row 1+2=3, finds cell5
    const result = findNextCell(table, row2, 1, { x: 0, y: 1 }, cell1);
    expect(result).toBe(cell5);
  });

  test('returns target cell for horizontal movement', () => {
    const cell1 = createCell(1);
    const cell2 = createCell(2);
    const row = createRow(1, [cell1, cell2]);
    const table = createTable([row]);

    const result = findNextCell(table, row, 2, { x: 1, y: 0 }, cell1);
    expect(result).toBe(cell2);
  });

  test('returns null when horizontal skip lands on same cell (boundary)', () => {
    const cell1 = createCell(1, 3); // colspan=3, covers cols 1-3
    const row = createRow(1, [cell1]);
    const table = createTable([row]);

    // Moving right from cell1 — target col 2 lands on cell1 (colspan covers it)
    // Skip to col 1+3=4, but no cell there → returns null
    const result = findNextCell(table, row, 2, { x: 1, y: 0 }, cell1);
    expect(result).toBeNull();
  });

  test('returns null when vertical skip cannot find a row beyond rowspan', () => {
    const cell1 = createCell(1, 1, 2); // rowspan=2
    const row1 = createRow(1, [cell1]);
    const table = createTable([row1]);

    // Moving down from cell1 (rowspan=2) at row 1.
    // getAllCellsInRow(table, 1) finds cell1. targetCell = cell1 = currentCell.
    // Skip: skipToRowIndex = 1+2 = 3. findTableRowByAriaRowIndex searches tr[aria-rowindex].
    // Only row1 exists (index=1). Loop sets targetRow=row1, no break fires, returns row1.
    // To make it return null, we need no tr[aria-rowindex] for the skip search.
    // Mock: temporarily remove aria-rowindex after getAllCellsInRow runs.
    const origQuerySelectorAll = table.querySelectorAll.bind(table);
    let callCount = 0;
    jest.spyOn(table, 'querySelectorAll').mockImplementation((selector: string) => {
      callCount++;
      // First call is getAllCellsInRow, let it work normally.
      // Second call is findTableRowByAriaRowIndex for the skip — return empty.
      if (callCount > 1 && selector === 'tr[aria-rowindex]') {
        return document.createElement('div').querySelectorAll('tr'); // empty NodeList
      }
      return origQuerySelectorAll(selector);
    });

    const result = findNextCell(table, row1, 1, { x: 0, y: 1 }, cell1);
    expect(result).toBeNull();

    jest.restoreAllMocks();
  });
});
