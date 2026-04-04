// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findClosestCellByAriaColIndex, getAllCellsInRow } from '../../../../lib/components/table/table-role/utils';

interface CellDef {
  tag: 'th' | 'td';
  colindex: number;
  text: string;
  rowspan?: number;
  colspan?: number;
}

interface RowDef {
  rowindex: number;
  cells: CellDef[];
}

function buildTable(rows: RowDef[]): HTMLTableElement {
  const table = document.createElement('table');
  for (const rowDef of rows) {
    const tr = document.createElement('tr');
    tr.setAttribute('aria-rowindex', String(rowDef.rowindex));
    for (const cellDef of rowDef.cells) {
      const cell = document.createElement(cellDef.tag);
      cell.setAttribute('aria-colindex', String(cellDef.colindex));
      cell.textContent = cellDef.text;
      if (cellDef.rowspan && cellDef.rowspan > 1) {
        cell.rowSpan = cellDef.rowspan;
      }
      if (cellDef.colspan && cellDef.colspan > 1) {
        cell.colSpan = cellDef.colspan;
      }
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  return table;
}

describe('getAllCellsInRow', () => {
  test('returns empty array for null table', () => {
    expect(getAllCellsInRow(null, 1)).toEqual([]);
  });

  test('returns cells from a simple row', () => {
    const table = buildTable([
      {
        rowindex: 1,
        cells: [
          { tag: 'th', colindex: 1, text: 'Col 1' },
          { tag: 'th', colindex: 2, text: 'Col 2' },
        ],
      },
      {
        rowindex: 2,
        cells: [
          { tag: 'td', colindex: 1, text: 'A' },
          { tag: 'td', colindex: 2, text: 'B' },
        ],
      },
    ]);
    const cells = getAllCellsInRow(table, 2);
    expect(cells.length).toBe(2);
    expect(cells[0].textContent).toBe('A');
    expect(cells[1].textContent).toBe('B');
  });

  test('includes cells with rowspan that span into the target row', () => {
    const table = buildTable([
      {
        rowindex: 1,
        cells: [
          { tag: 'th', colindex: 1, text: 'Selection', rowspan: 3 },
          { tag: 'th', colindex: 2, text: 'Group' },
        ],
      },
      { rowindex: 2, cells: [{ tag: 'th', colindex: 2, text: 'Leaf Col' }] },
      {
        rowindex: 3,
        cells: [
          { tag: 'td', colindex: 1, text: 'Data A' },
          { tag: 'td', colindex: 2, text: 'Data B' },
        ],
      },
    ]);

    // Row 2: should include Selection (rowspan=3 from row 1) + Leaf Col
    const row2Cells = getAllCellsInRow(table, 2);
    expect(row2Cells.length).toBe(2);
    expect(row2Cells[0].textContent).toBe('Selection');
    expect(row2Cells[1].textContent).toBe('Leaf Col');

    // Row 3: should include Selection (still spanning) + both data cells
    const row3Cells = getAllCellsInRow(table, 3);
    expect(row3Cells.length).toBe(3);
  });

  test('excludes cells whose rowspan does not reach the target row', () => {
    const table = buildTable([
      {
        rowindex: 1,
        cells: [
          { tag: 'th', colindex: 1, text: 'Group', rowspan: 2 },
          { tag: 'th', colindex: 2, text: 'Other' },
        ],
      },
      { rowindex: 2, cells: [{ tag: 'th', colindex: 2, text: 'Under Other' }] },
      {
        rowindex: 3,
        cells: [
          { tag: 'td', colindex: 1, text: 'Data' },
          { tag: 'td', colindex: 2, text: 'Data' },
        ],
      },
    ]);

    // Row 3: Group (rowspan=2, from row1) does NOT reach row 3
    const row3Cells = getAllCellsInRow(table, 3);
    expect(row3Cells.length).toBe(2);
    expect(row3Cells[0].textContent).toBe('Data');
  });

  test('skips rows with aria-rowindex greater than target', () => {
    const table = buildTable([
      { rowindex: 1, cells: [{ tag: 'td', colindex: 1, text: 'R1' }] },
      { rowindex: 5, cells: [{ tag: 'td', colindex: 1, text: 'R5' }] },
    ]);
    const cells = getAllCellsInRow(table, 1);
    expect(cells.length).toBe(1);
    expect(cells[0].textContent).toBe('R1');
  });
});

describe('findClosestCellByAriaColIndex', () => {
  function createCells(
    colConfigs: Array<{ colindex: number; colspan?: number; text: string }>
  ): HTMLTableCellElement[] {
    return colConfigs.map(({ colindex, colspan, text }) => {
      const td = document.createElement('td');
      td.setAttribute('aria-colindex', String(colindex));
      if (colspan && colspan > 1) {
        td.colSpan = colspan;
      }
      td.textContent = text;
      return td;
    });
  }

  test('returns exact match by colspan range', () => {
    const cells = createCells([
      { colindex: 1, text: 'A' },
      { colindex: 2, colspan: 3, text: 'B-span' },
      { colindex: 5, text: 'C' },
    ]);

    // Target colindex 3 falls within B-span (colindex=2, colspan=3 -> covers 2,3,4)
    const result = findClosestCellByAriaColIndex(cells, 3, 1);
    expect(result?.textContent).toBe('B-span');
  });

  test('returns exact match for single column', () => {
    const cells = createCells([
      { colindex: 1, text: 'A' },
      { colindex: 2, text: 'B' },
      { colindex: 3, text: 'C' },
    ]);

    const result = findClosestCellByAriaColIndex(cells, 2, 1);
    expect(result?.textContent).toBe('B');
  });

  test('returns closest cell in positive direction when no exact match', () => {
    const cells = createCells([
      { colindex: 1, text: 'A' },
      { colindex: 5, text: 'E' },
    ]);

    // Looking for colindex 3, delta > 0 -> should return colindex 5
    const result = findClosestCellByAriaColIndex(cells, 3, 1);
    expect(result?.textContent).toBe('E');
  });

  test('returns closest cell in negative direction when no exact match', () => {
    const cells = createCells([
      { colindex: 1, text: 'A' },
      { colindex: 5, text: 'E' },
    ]);

    // Looking for colindex 3, delta < 0 -> should return colindex 1
    const result = findClosestCellByAriaColIndex(cells, 3, -1);
    expect(result?.textContent).toBe('A');
  });

  test('returns null for empty cells array', () => {
    const result = findClosestCellByAriaColIndex([], 1, 1);
    expect(result).toBe(null);
  });
});
