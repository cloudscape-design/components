// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import { StyleClassNames } from '../../../lib/components/table/style-api';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  name: string;
}
const items: Item[] = [{ name: 'a' }, { name: 'b' }];
const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'length', header: 'Length', cell: item => item.name.length },
];

function renderTable(props: Partial<TableProps<Item>>, styleClassNames: unknown) {
  const { container } = render(
    <Table items={items} columnDefinitions={columnDefinitions} {...props} {...({ styleClassNames } as any)} />
  );
  return createWrapper(container).findTable()!;
}

describe('Table Style API v2 (implicit styleClassNames)', () => {
  test.each(['container', 'embedded'] as const)('applies the root slot in %s variant', variant => {
    const table = renderTable({ variant }, { root: 'root', unknown: 'unknown' });
    expect(table.getElement()).toHaveClass('root');
    expect(table.getElement().querySelector('.unknown')).toBeNull();
  });

  test('applies string slots to every header cell, row and body cell', () => {
    const table = renderTable({}, { headerCell: 'header-cell', row: 'row', cell: 'cell' });
    expect(table.findColumnHeaders().map(header => header.getElement().className)).toEqual([
      expect.stringContaining('header-cell'),
      expect.stringContaining('header-cell'),
    ]);
    expect(table.findRows().every(row => row.getElement().classList.contains('row'))).toBe(true);
    expect(table.findBodyCell(2, 2)!.getElement()).toHaveClass('cell');
  });

  test('resolves callback slots per item, column and group', () => {
    const table = renderTable(
      {
        groupDefinitions: [{ id: 'group', header: 'Group' }],
        columnDisplay: [{ type: 'group', id: 'group', visible: true, children: [{ id: 'name', visible: true }] }],
      },
      {
        headerCell: args =>
          args.type === 'group' ? `group-${args.group.id}` : args.type === 'column' ? `column-${args.column.id}` : '',
        row: ({ item }) => `row-${item.name}`,
        cell: args => (args.type === 'data' ? `cell-${args.item.name}-${args.column.id}` : undefined),
      } satisfies StyleClassNames<Item>
    );
    expect(table.find('.group-group')).not.toBeNull();
    expect(table.find('.column-name')).not.toBeNull();
    expect(table.findRows()[1].getElement()).toHaveClass('row-b');
    expect(table.findBodyCell(2, 1)!.getElement()).toHaveClass('cell-b-name');
  });

  test('applies the cell and header cell slots to selection cells', () => {
    const table = renderTable({ selectionType: 'multi', selectedItems: [items[1]] }, {
      headerCell: args => (args.type === 'selection' ? 'selection-header' : undefined),
      row: ({ selected }) => (selected ? 'row-selected' : 'row-unselected'),
      cell: ({ type }) => `${type}-cell`,
    } satisfies StyleClassNames<Item>);
    expect(table.find('thead th.selection-header')).not.toBeNull();
    expect(table.findRows()[0].getElement()).toHaveClass('row-unselected');
    expect(table.findRows()[1].getElement()).toHaveClass('row-selected');
    expect(table.findRows()[1].find('td:first-child')!.getElement()).toHaveClass('selection-cell');
    expect(table.findBodyCell(1, 2)!.getElement()).toHaveClass('data-cell');
  });

  test('resolves the header cell slot with the sorting state', () => {
    const sortable = { ...columnDefinitions[0], sortingField: 'name' };
    const table = renderTable(
      { columnDefinitions: [sortable, columnDefinitions[1]], sortingColumn: sortable, sortingDescending: true },
      {
        headerCell: args =>
          args.type === 'column'
            ? [args.sortable && 'sortable', args.sorted && 'sorted', args.sortingDescending && 'descending']
                .filter(Boolean)
                .join(' ')
            : undefined,
      } satisfies StyleClassNames<Item>
    );
    expect(table.findColumnHeaders()[0].getElement()).toHaveClass('sortable', 'sorted', 'descending');
    expect(table.findColumnHeaders()[1].getElement()).not.toHaveClass('sortable');
  });

  test.each([
    [false, 1],
    [true, 0],
  ])('applies the sorting button slot to sortable columns when sortingDisabled=%s', (sortingDisabled, count) => {
    const sortable = { ...columnDefinitions[0], sortingField: 'name' };
    const table = renderTable({ columnDefinitions: [sortable, columnDefinitions[1]], sortingDisabled }, {
      sortingButton: 'sorting-button',
    } satisfies StyleClassNames<Item>);
    expect(table.findColumnHeaders()[0].findAll('[role="button"].sorting-button')).toHaveLength(count);
    expect(table.findAll('.sorting-button')).toHaveLength(count);
  });

  test('applies the sorting menu slot to the multi-column sort menu', () => {
    const [a, b] = columnDefinitions.map(column => ({ ...column, sortingField: column.id }));
    const table = renderTable(
      { columnDefinitions: [a, b], multiColumnSort: { sortingColumns: [{ sortingColumn: a }], onChange: () => {} } },
      { sortingMenu: { trigger: 'sorting-menu-trigger' } } satisfies StyleClassNames<Item>
    );
    expect(table.findAll('button.sorting-menu-trigger')).toHaveLength(2);
  });

  test('applies the sorting indicator slot to the sorting indicator and the sort priority', () => {
    const [a, b] = columnDefinitions.map(column => ({ ...column, sortingField: column.id }));
    const table = renderTable(
      {
        columnDefinitions: [a, b],
        multiColumnSort: {
          sortingColumns: [{ sortingColumn: a }, { sortingColumn: b, isDescending: true }],
          onChange: () => {},
        },
      },
      { sortingIndicator: 'indicator' } satisfies StyleClassNames<Item>
    );
    const indicators = table.findColumnHeaders().map(header => header.find('.indicator')!.getElement());
    expect(indicators.map(indicator => indicator.textContent)).toEqual(['1', '2']);
    expect(indicators.every(indicator => indicator.querySelector('svg'))).toBe(true);
  });

  test('passes the row index to the row slot', () => {
    const table = renderTable({}, { row: ({ index }: { index: number }) => `row-${index}` });
    expect(table.findRows().map(row => row.getElement().className)).toEqual([
      expect.stringContaining('row-0'),
      expect.stringContaining('row-1'),
    ]);
  });

  test.each([
    ['multi', 'checkbox', 3],
    ['single', 'radio', 2],
  ] as const)('applies the %s selection control slot to every control', (selectionType, control, count) => {
    const table = renderTable({ selectionType, selectedItems: [items[0]], isItemDisabled: item => item.name === 'b' }, {
      selectionCheckbox: { control: 'checkbox' },
      selectionRadio: { control: 'radio' },
    } satisfies StyleClassNames<Item>);
    expect(table.findAll(`.${control}`)).toHaveLength(count);
    expect(table.findAll(`.${control === 'checkbox' ? 'radio' : 'checkbox'}`)).toHaveLength(0);
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const table = renderTable({}, { root: 'root' });
    expect(table.getElement()).not.toHaveAttribute('styleClassNames');
  });
});
