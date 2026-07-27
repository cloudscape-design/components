// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table from '../../../lib/components/table';
import { TableProps } from '../../../lib/components/table/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  name: string;
  state: string;
  cpu: number;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'type', header: 'Type', cell: item => item.id, sortingField: 'type' },
  { id: 'state', header: 'State', cell: item => item.state, sortingField: 'state' },
  { id: 'cpu', header: 'CPU', cell: item => item.cpu, sortingField: 'cpu' },
];

const items: Item[] = [
  { id: '1', name: 'alpha', state: 'running', cpu: 12 },
  { id: '2', name: 'beta', state: 'stopped', cpu: 0 },
];

// Column indices are 1-based: name=1, type=2, state=3, cpu=4.
const STATE_COL = 3;
const CPU_COL = 4;
const NAME_COL = 1;

function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findTable()!;
}

function renderMultiSort(sortingColumns: ReadonlyArray<TableProps.SortingState<Item>>) {
  return renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns, onChange: () => {} }}
    />
  );
}

// state (asc, priority 1) + cpu (desc, priority 2)
const twoColumnSort: ReadonlyArray<TableProps.SortingState<Item>> = [
  { sortingColumn: { sortingField: 'state' }, isDescending: false },
  { sortingColumn: { sortingField: 'cpu' }, isDescending: true },
];

describe('findColumnSortMenu', () => {
  test('returns a sort menu wrapper for a sortable column when multiColumnSort is set', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    expect(wrapper.findColumnSortMenu(STATE_COL)).not.toBeNull();
  });

  test('returns null when the table does not opt in to multi-column sorting', () => {
    const wrapper = renderTable(<Table items={items} columnDefinitions={columnDefinitions} />);
    expect(wrapper.findColumnSortMenu(STATE_COL)).toBeNull();
  });

  test('exposes a named finder for every sort menu item once the dropdown is open', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    const menu = wrapper.findColumnSortMenu(NAME_COL)!;
    menu.openDropdown();

    expect(menu.findSortAscendingItem()).not.toBeNull();
    expect(menu.findSortDescendingItem()).not.toBeNull();
    expect(menu.findAddToSortAscendingItem()).not.toBeNull();
    expect(menu.findAddToSortDescendingItem()).not.toBeNull();
    expect(menu.findRemoveFromSortItem()).not.toBeNull();
  });

  test('reflects disabled state for a column already in the sort', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    const menu = wrapper.findColumnSortMenu(STATE_COL)!;
    menu.openDropdown();

    // Sort ascending/descending are always-enabled checkboxes; their checked state is asserted in the behavior test.
    expect(menu.findSortAscendingItem({ disabled: false })).not.toBeNull();
    expect(menu.findSortDescendingItem({ disabled: false })).not.toBeNull();
    expect(menu.findAddToSortAscendingItem({ disabled: true })).not.toBeNull();
    expect(menu.findAddToSortDescendingItem({ disabled: true })).not.toBeNull();
    expect(menu.findRemoveFromSortItem({ disabled: false })).not.toBeNull();
  });

  test('reflects disabled state for a column not in the sort', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    const menu = wrapper.findColumnSortMenu(NAME_COL)!;
    menu.openDropdown();

    expect(menu.findSortAscendingItem({ disabled: false })).not.toBeNull();
    expect(menu.findSortDescendingItem({ disabled: false })).not.toBeNull();
    expect(menu.findAddToSortAscendingItem({ disabled: false })).not.toBeNull();
    expect(menu.findRemoveFromSortItem({ disabled: true })).not.toBeNull();
  });
});

describe('findColumnSortPriorityBadge', () => {
  test('shows the 1-based priority on each sorted column when 2+ columns are sorted', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    expect(wrapper.findColumnSortPriorityBadge(STATE_COL)!.getElement()).toHaveTextContent('1');
    expect(wrapper.findColumnSortPriorityBadge(CPU_COL)!.getElement()).toHaveTextContent('2');
  });

  test('returns null for a column that is not part of the sort', () => {
    const wrapper = renderMultiSort(twoColumnSort);
    expect(wrapper.findColumnSortPriorityBadge(NAME_COL)).toBeNull();
  });

  test('returns null when only a single column is sorted (priority adds no information)', () => {
    const wrapper = renderMultiSort([{ sortingColumn: { sortingField: 'state' }, isDescending: false }]);
    expect(wrapper.findColumnSortPriorityBadge(STATE_COL)).toBeNull();
  });
});
