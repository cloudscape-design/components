// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Table from '../../../lib/components/table';
import { TableProps } from '../../../lib/components/table/interfaces';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  a: string;
  b: string;
  c: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'a', header: 'A', cell: i => i.a, sortingField: 'a' },
  { id: 'b', header: 'B', cell: i => i.b, sortingField: 'b' },
  { id: 'c', header: 'C', cell: i => i.c, sortingField: 'c' },
];

const items: Item[] = [{ a: '1', b: '2', c: '3' }];

// 1-based column indices
const COL_A = 1;
const COL_B = 2;
const COL_C = 3;

type Sort = ReadonlyArray<TableProps.SortingState<Item>>;

function renderTable(sortingColumns: Sort, onChange = jest.fn(), extraColumns?: TableProps.ColumnDefinition<Item>[]) {
  const { container } = render(
    <Table
      items={items}
      columnDefinitions={extraColumns ?? columnDefinitions}
      multiColumnSort={{ sortingColumns, onChange }}
    />
  );
  return { wrapper: createWrapper(container).findTable()!, onChange };
}

// Extracts the emitted sort state as a comparable [{ field, desc }] array.
function emitted(onChange: jest.Mock) {
  const detail = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    .detail as TableProps.MultiColumnSortChangeDetail<Item>;
  return detail.sortingColumns.map(s => ({ field: s.sortingColumn.sortingField, desc: !!s.isDescending }));
}

function clickHeader(wrapper: TableWrapper, colIndex: number, shiftKey = false) {
  fireEvent.click(wrapper.findColumnSortingArea(colIndex)!.getElement(), { shiftKey });
}

function getHeaderCell(wrapper: TableWrapper, colIndex: number) {
  return wrapper.findColumnHeaders()[colIndex - 1]!.getElement();
}

describe('header click / keyboard', () => {
  test('plain click on an unsorted column replaces the sort (ascending)', () => {
    const { wrapper, onChange } = renderTable([]);
    clickHeader(wrapper, COL_A);
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: false }]);
  });

  test('plain click on a column already in the sort toggles its direction', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    clickHeader(wrapper, COL_A);
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: true }]);
  });

  test('Shift+click appends a new column to the sort', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    clickHeader(wrapper, COL_B, true);
    expect(emitted(onChange)).toEqual([
      { field: 'a', desc: false },
      { field: 'b', desc: false },
    ]);
  });

  test('Enter triggers the same behavior as a click', () => {
    const { wrapper, onChange } = renderTable([]);
    fireEvent.keyPress(wrapper.findColumnSortingArea(COL_A)!.getElement(), { keyCode: KeyCode.enter });
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: false }]);
  });

  test('Shift+Enter appends like Shift+click', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    fireEvent.keyPress(wrapper.findColumnSortingArea(COL_B)!.getElement(), { keyCode: KeyCode.enter, shiftKey: true });
    expect(emitted(onChange)).toEqual([
      { field: 'a', desc: false },
      { field: 'b', desc: false },
    ]);
  });

  test('Shift+click on a column already in the sort toggles it in place (does not duplicate)', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    clickHeader(wrapper, COL_A, true);
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: true }]);
  });

  test('Shift+mousedown prevents default to avoid extending the text selection', () => {
    const { wrapper } = renderTable([]);
    // fireEvent returns false when the event's default action was prevented.
    const notPreventedWithShift = fireEvent.mouseDown(wrapper.findColumnSortingArea(COL_A)!.getElement(), {
      shiftKey: true,
    });
    expect(notPreventedWithShift).toBe(false);
    // A plain mousedown must not prevent default.
    const notPreventedPlain = fireEvent.mouseDown(wrapper.findColumnSortingArea(COL_A)!.getElement());
    expect(notPreventedPlain).toBe(true);
  });
});

describe('sort menu dropdown actions', () => {
  function openAndClick(
    wrapper: TableWrapper,
    colIndex: number,
    click: (menu: ReturnType<TableWrapper['findColumnSortMenu']>) => void
  ) {
    const menu = wrapper.findColumnSortMenu(colIndex)!;
    menu.openDropdown();
    click(menu);
  }

  test('"Add to sort (descending)" appends the column descending', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    openAndClick(wrapper, COL_B, menu => menu!.findAddToSortDescendingItem()!.click());
    expect(emitted(onChange)).toEqual([
      { field: 'a', desc: false },
      { field: 'b', desc: true },
    ]);
  });

  test('"Remove from sort" removes the column and keeps the rest', () => {
    const { wrapper, onChange } = renderTable([
      { sortingColumn: { sortingField: 'a' }, isDescending: false },
      { sortingColumn: { sortingField: 'b' }, isDescending: true },
    ]);
    openAndClick(wrapper, COL_A, menu => menu!.findRemoveFromSortItem()!.click());
    expect(emitted(onChange)).toEqual([{ field: 'b', desc: true }]);
  });

  test('"Sort descending" on a column not in the sort replaces the whole sort', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'b' }, isDescending: false }]);
    openAndClick(wrapper, COL_A, menu => menu!.findSortDescendingItem()!.click());
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: true }]);
  });

  test('"Sort ascending" on a column not in the sort replaces the whole sort', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'b' }, isDescending: true }]);
    openAndClick(wrapper, COL_A, menu => menu!.findSortAscendingItem()!.click());
    expect(emitted(onChange)).toEqual([{ field: 'a', desc: false }]);
  });

  test('"Sort ascending" on a column already in the sort sets its direction and keeps the others', () => {
    const { wrapper, onChange } = renderTable([
      { sortingColumn: { sortingField: 'a' }, isDescending: true },
      { sortingColumn: { sortingField: 'b' }, isDescending: true },
    ]);
    openAndClick(wrapper, COL_A, menu => menu!.findSortAscendingItem()!.click());
    expect(emitted(onChange)).toEqual([
      { field: 'a', desc: false },
      { field: 'b', desc: true },
    ]);
  });

  test('"Add to sort (ascending)" appends the column ascending', () => {
    const { wrapper, onChange } = renderTable([{ sortingColumn: { sortingField: 'a' }, isDescending: false }]);
    openAndClick(wrapper, COL_B, menu => menu!.findAddToSortAscendingItem()!.click());
    expect(emitted(onChange)).toEqual([
      { field: 'a', desc: false },
      { field: 'b', desc: false },
    ]);
  });
});

describe('aria-sort', () => {
  test('declares aria-sort only on the primary sorted column; secondaries are suppressed; unsorted are "none"', () => {
    const { wrapper } = renderTable([
      { sortingColumn: { sortingField: 'a' }, isDescending: false },
      { sortingColumn: { sortingField: 'b' }, isDescending: true },
    ]);
    expect(getHeaderCell(wrapper, COL_A).getAttribute('aria-sort')).toBe('ascending');
    // ARIA permits only one sorted column, so secondary sorted columns omit aria-sort entirely.
    expect(getHeaderCell(wrapper, COL_B).getAttribute('aria-sort')).toBeNull();
    expect(getHeaderCell(wrapper, COL_C).getAttribute('aria-sort')).toBe('none');
  });
});

describe('column ariaLabel sortIndex', () => {
  test('receives the 1-based priority for sorted columns and undefined for unsorted', () => {
    const labelColumns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'a', header: 'A', cell: i => i.a, sortingField: 'a', ariaLabel: ({ sortIndex }) => `A idx=${sortIndex}` },
      { id: 'b', header: 'B', cell: i => i.b, sortingField: 'b', ariaLabel: ({ sortIndex }) => `B idx=${sortIndex}` },
      { id: 'c', header: 'C', cell: i => i.c, sortingField: 'c', ariaLabel: ({ sortIndex }) => `C idx=${sortIndex}` },
    ];
    const { wrapper } = renderTable(
      [
        { sortingColumn: { sortingField: 'a' }, isDescending: false },
        { sortingColumn: { sortingField: 'b' }, isDescending: true },
      ],
      jest.fn(),
      labelColumns
    );
    expect(wrapper.findColumnSortingArea(COL_A)!.getElement().getAttribute('aria-label')).toBe('A idx=1');
    expect(wrapper.findColumnSortingArea(COL_B)!.getElement().getAttribute('aria-label')).toBe('B idx=2');
    expect(wrapper.findColumnSortingArea(COL_C)!.getElement().getAttribute('aria-label')).toBe('C idx=undefined');
  });
});

describe('sort menu gating', () => {
  test('non-sortable columns do not render a sort menu', () => {
    const mixed: TableProps.ColumnDefinition<Item>[] = [
      { id: 'a', header: 'A', cell: i => i.a, sortingField: 'a' },
      { id: 'b', header: 'B', cell: i => i.b }, // no sortingField -> not sortable
    ];
    const { wrapper } = renderTable([], jest.fn(), mixed);
    expect(wrapper.findColumnSortMenu(COL_A)).not.toBeNull();
    expect(wrapper.findColumnSortMenu(COL_B)).toBeNull();
  });
});
