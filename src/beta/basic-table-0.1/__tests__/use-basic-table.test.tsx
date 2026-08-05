// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { act } from '@testing-library/react';
import { renderHook } from '../../../__tests__/render-hook';
import { BasicTableProps, UseBasicTableConfig } from '../basic-table/interfaces';
import { useBasicTable, UseBasicTableResult } from '../basic-table/use-basic-table';

// useBasicTable is the single behaviour implementation for BasicTable: a positional `columns` width
// list plus table state in, pure spreadable prop-getters out. The getters call no React hooks, so a
// consumer may call them in a loop or conditionally. All column access is by index; a columnId is
// only resolved when explicitly supplied (column-virtualization binding). Sorting is not in the core
// — it is composed via the SortToggle helper, covered by the demo-scoped sorting test. These tests
// drive the hook directly (getters + helpers), then a raw-DOM proof mounts a bare
// <table role="grid"> spreading only the getters onto native elements with no BasicTable.* components,
// asserting the grid a11y contract holds by construction.

// Positional column layout: fixed 200 (floored at 150), a flexible track (no width), fixed 100.
const COLUMNS: BasicTableProps.ColumnDefinition[] = [{ width: 200, minWidth: 150 }, {}, { width: 100 }];

// Same shape but with stable ids — only needed to exercise id-based column resolution.
const ID_COLUMNS: BasicTableProps.ColumnDefinition[] = [{ id: 'name', width: 200 }, { id: 'status' }, { id: 'size', width: 100 }];

function renderTableHook(config?: Partial<UseBasicTableConfig>) {
  return renderHook(() => useBasicTable({ columns: COLUMNS, totalRowCount: 40, ...config }));
}

describe('useBasicTable getters (index-based, refined API)', () => {
  test('getTableProps: grid role, header-counted aria-rowcount, column aria-colcount, label, tabIndex', () => {
    const { result } = renderTableHook({ i18nStrings: { tableLabel: 'Resources' } });
    const props = result.current.getTableProps();
    expect(props.role).toBe('grid');
    expect(props['aria-rowcount']).toBe(41); // totalRowCount 40 + header
    expect(props['aria-colcount']).toBe(3);
    expect(props['aria-label']).toBe('Resources');
    expect(props.tabIndex).toBe(-1);
  });

  test('role="table" is reflected verbatim', () => {
    const { result } = renderTableHook({ role: 'table' });
    expect(result.current.getTableProps().role).toBe('table');
  });

  test('getHeaderGroupProps: header row is aria-rowindex 1 and carries the shared column template', () => {
    const { result } = renderTableHook();
    const group = result.current.getHeaderGroupProps();
    expect(group.role).toBe('row');
    expect(group['aria-rowindex']).toBe(1);
    // col0 fixed 200, col1 flexible (minmax 0 1fr), col2 fixed 100 — one shared template.
    expect(group.style.gridTemplateColumns).toBe('200px minmax(0px, 1fr) 100px');
  });

  test('getColumnHeaderProps: 1-based aria-colindex + scope col, and NO core aria-sort (sorting is composed)', () => {
    const { result } = renderTableHook();
    const first = result.current.getColumnHeaderProps(0);
    expect(first.role).toBe('columnheader');
    expect(first.scope).toBe('col');
    expect(first['aria-colindex']).toBe(1);
    expect(result.current.getColumnHeaderProps(1)['aria-colindex']).toBe(2);
    expect(result.current.getColumnHeaderProps(2)['aria-colindex']).toBe(3);
    // The core header getter never emits aria-sort — the consumer spreads it (composed sorting).
    expect('aria-sort' in first).toBe(false);
  });

  test('getBodyProps / getRowProps / getCellProps carry the grid ARIA numbers (by index)', () => {
    const { result } = renderTableHook();
    expect(result.current.getBodyProps().role).toBe('rowgroup');

    const row = result.current.getRowProps(0);
    expect(row.role).toBe('row');
    expect(row['aria-rowindex']).toBe(2); // header is 1, data index 0 -> 2
    expect(row.style.gridTemplateColumns).toBe('200px minmax(0px, 1fr) 100px');

    const cell = result.current.getCellProps(1, 0);
    expect(cell.role).toBe('gridcell');
    expect(cell['aria-colindex']).toBe(2);
    expect(cell['data-awsui-row-index']).toBe(0);
    // Without a row index the data attribute is omitted.
    expect(result.current.getCellProps(1)['data-awsui-row-index']).toBeUndefined();
  });

  test('getResizeHandleProps: default resize roledescription (overridable via i18nStrings)', () => {
    const { result } = renderTableHook();
    const handle = result.current.getResizeHandleProps(0);
    expect(handle['aria-roledescription']).toBe('resize handle');
    expect(typeof handle.onPointerDown).toBe('function');

    const { result: r2 } = renderTableHook({ i18nStrings: { resizerRoleDescription: 'width handle' } });
    expect(r2.current.getResizeHandleProps(0)['aria-roledescription']).toBe('width handle');
  });

  test('resolveColumnIndex: by id when supplied, positional fallback otherwise', () => {
    const { result } = renderHook(() => useBasicTable({ columns: ID_COLUMNS, totalRowCount: 3 }));
    expect(result.current.resolveColumnIndex('status', null)).toBe(1);
    expect(result.current.resolveColumnIndex('size', null)).toBe(2);
    expect(result.current.resolveColumnIndex('missing', null)).toBe(-1);
    // No id -> positional value (or 0 when none).
    expect(result.current.resolveColumnIndex(undefined, 2)).toBe(2);
    expect(result.current.resolveColumnIndex(undefined, null)).toBe(0);
  });

  test('stickyColumnId: config id if present, else the index', () => {
    const { result } = renderHook(() => useBasicTable({ columns: ID_COLUMNS, totalRowCount: 3 }));
    expect(result.current.stickyColumnId(0)).toBe('name');
    const { result: positional } = renderTableHook();
    expect(positional.current.stickyColumnId(0)).toBe('0');
    expect(positional.current.stickyColumnId(2)).toBe('2');
  });

  test('gridTemplateColumns: controlled widths (keyed by INDEX) honour the column minWidth floor', () => {
    // col0 width controlled below its 150 minWidth -> clamped to minWidth in the track.
    const { result } = renderTableHook({ columnWidths: { 0: 80 } });
    expect(result.current.getHeaderGroupProps().style.gridTemplateColumns).toBe('150px minmax(0px, 1fr) 100px');
  });

  test('adjustColumnWidth: keyboard step clamps at the resize floor (controlled, index-keyed)', () => {
    const onColumnWidthsChange = jest.fn();
    const { result } = renderTableHook({ columnWidths: { 0: 200 }, onColumnWidthsChange });

    // +10 from 200.
    act(() => result.current.adjustColumnWidth(0, 10));
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { widths: expect.objectContaining({ 0: 210 }) } })
    );

    // A large negative step clamps at the column's floor (150), never below it.
    act(() => result.current.adjustColumnWidth(0, -1000));
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { widths: expect.objectContaining({ 0: 150 }) } })
    );
  });

  test('currentColumnWidth + resizeMinWidthOf expose the resize slider values (controlled)', () => {
    const { result } = renderTableHook({ columnWidths: { 0: 175 } });
    expect(result.current.currentColumnWidth(0)).toBe(175);
    // col0 declares minWidth 150; a column with no minWidth floors at DEFAULT_COLUMN_WIDTH (120).
    expect(result.current.resizeMinWidthOf(0)).toBe(150);
    expect(result.current.resizeMinWidthOf(1)).toBe(120);
  });

  test('columnCount + columns reflect the config', () => {
    const { result } = renderTableHook();
    expect(result.current.columnCount).toBe(3);
    expect(result.current.columns).toHaveLength(3);
  });
});

// -----------------------------------------------------------------------------
// Raw-DOM proof: the headless path with no BasicTable.* components.
// -----------------------------------------------------------------------------

const HEADER_LABELS = ['Name', 'Status', 'Size'];
const ROW_KEYS = ['name', 'status', 'size'] as const;
const DATA = [
  { name: 'Alpha', status: 'Up', size: '1' },
  { name: 'Beta', status: 'Down', size: '2' },
];

// A bare table that spreads ONLY the hook's index-based getters onto native table elements.
function RawGrid(config?: Partial<UseBasicTableConfig>) {
  function Grid() {
    const t: UseBasicTableResult = useBasicTable({ columns: COLUMNS, totalRowCount: DATA.length, ...config });
    return (
      <table {...t.getTableProps()}>
        <thead {...t.getBodyProps()}>
          <tr {...t.getHeaderGroupProps()}>
            {HEADER_LABELS.map((label, columnIndex) => (
              <th key={columnIndex} {...t.getColumnHeaderProps(columnIndex)}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...t.getBodyProps()}>
          {DATA.map((item, rowIndex) => (
            <tr key={rowIndex} {...t.getRowProps(rowIndex)}>
              {ROW_KEYS.map((key, columnIndex) => (
                <td key={columnIndex} {...t.getCellProps(columnIndex, rowIndex)}>
                  {item[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return render(<Grid />);
}

describe('useBasicTable raw-DOM contract (no BasicTable.* components)', () => {
  test('the spread getters alone produce a coherent role=grid a11y tree', () => {
    const { container } = RawGrid({ i18nStrings: { tableLabel: 'Resources' } });
    const grid = container.querySelector('table')!;
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-rowcount')).toBe('3'); // 2 data rows + header
    expect(grid.getAttribute('aria-colcount')).toBe('3');
    expect(grid.getAttribute('aria-label')).toBe('Resources');

    const headers = Array.from(grid.querySelectorAll('[role="columnheader"]'));
    expect(headers).toHaveLength(3);
    expect(headers[0].getAttribute('aria-colindex')).toBe('1');
    expect(headers[0].getAttribute('scope')).toBe('col');
    expect(headers[2].getAttribute('aria-colindex')).toBe('3');

    // Data rows carry a full-dataset aria-rowindex; cells carry a 1-based aria-colindex.
    const rows = Array.from(grid.querySelectorAll('tbody [role="row"]'));
    expect(rows[0].getAttribute('aria-rowindex')).toBe('2');
    expect(rows[1].getAttribute('aria-rowindex')).toBe('3');
    const firstRowCells = rows[0].querySelectorAll('[role="gridcell"]');
    expect(firstRowCells[0].getAttribute('aria-colindex')).toBe('1');
    expect(firstRowCells[2].getAttribute('aria-colindex')).toBe('3');
    expect(firstRowCells[0].getAttribute('data-awsui-row-index')).toBe('0');
  });

  test('the shared grid-template-columns aligns the header row and every data row', () => {
    const { container } = RawGrid();
    const template = '200px minmax(0px, 1fr) 100px';
    const headerRow = container.querySelector('thead [role="row"]') as HTMLElement;
    const dataRow = container.querySelector('tbody [role="row"]') as HTMLElement;
    expect(headerRow.style.gridTemplateColumns).toBe(template);
    expect(dataRow.style.gridTemplateColumns).toBe(template);
  });
});
