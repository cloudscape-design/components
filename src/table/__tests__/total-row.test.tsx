// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
  value: number;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'value', header: 'Value', cell: item => item.value },
];

const items: Item[] = [
  { id: 1, name: 'Alpha', value: 100 },
  { id: 2, name: 'Beta', value: 200 },
  { id: 3, name: 'Gamma', value: 300 },
];

const totalRow: TableProps.TotalRow = {
  cells: [
    { columnId: 'name', content: 'Total' },
    { columnId: 'value', content: '600' },
  ],
};

function renderTable(props?: Partial<TableProps<Item>>) {
  const { container } = render(<Table columnDefinitions={columnDefinitions} items={items} {...props} />);
  return createWrapper(container).findTable()!;
}

describe('Table totalRow', () => {
  test('renders no tfoot when totalRow is not provided', () => {
    const wrapper = renderTable();
    expect(wrapper.findTotalRow()).toBeNull();
  });

  test('renders tfoot row when totalRow is provided', () => {
    const wrapper = renderTable({ totalRow });
    expect(wrapper.findTotalRow()).not.toBeNull();
  });

  test('renders cell content for matching column ids', () => {
    const wrapper = renderTable({ totalRow });
    // column index 2 = name (1-based, no selection column)
    expect(wrapper.findTotalRowCell(2)?.getElement().textContent).toBe('Total');
    // column index 3 = value
    expect(wrapper.findTotalRowCell(3)?.getElement().textContent).toBe('600');
  });

  test('renders empty cell for columns without a matching entry', () => {
    const wrapper = renderTable({ totalRow });
    // column index 1 = id — no cell defined
    expect(wrapper.findTotalRowCell(1)?.getElement().textContent).toBe('');
  });

  test('renders tfoot as a <tfoot> element', () => {
    const { container } = render(<Table columnDefinitions={columnDefinitions} items={items} totalRow={totalRow} />);
    expect(container.querySelector('tfoot')).not.toBeNull();
  });

  test('renders ReactNode content in total row cells', () => {
    const richTotalRow: TableProps.TotalRow = {
      cells: [
        { columnId: 'name', content: <strong data-testid="total-label">Grand Total</strong> },
        { columnId: 'value', content: <span data-testid="total-value">600</span> },
      ],
    };
    const { getByTestId } = render(
      <Table columnDefinitions={columnDefinitions} items={items} totalRow={richTotalRow} />
    );
    expect(getByTestId('total-label').textContent).toBe('Grand Total');
    expect(getByTestId('total-value').textContent).toBe('600');
  });

  test('renders correct number of total row cells (one per visible column)', () => {
    const wrapper = renderTable({ totalRow });
    const row = wrapper.findTotalRow()!;
    // 3 columns, no selection type
    expect(row.findAll('td').length).toBe(3);
  });

  test('renders an extra empty cell when selectionType is set', () => {
    const wrapper = renderTable({ totalRow, selectionType: 'multi' });
    const row = wrapper.findTotalRow()!;
    // 3 data columns + 1 selection column
    expect(row.findAll('td').length).toBe(4);
  });
});
