// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Characterization test for the Step 3a atomic-row selection swap: a plain table (tableRole='table')
// renders data rows as the atomic <TableRow>. This locks in two contracts:
//   1. findSelectedRows() still resolves selected rows (finder reconciled via dual-class), and
//   2. selected rows expose aria-selected="true" (new in 3a; classic rows had no aria-selected).
// Run on clean HEAD this is RED (aria-selected is null); after 3a it is GREEN.
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderTable(tableProps: Partial<TableProps>) {
  const props: TableProps = { items, totalItemsCount: items.length, columnDefinitions, ...tableProps };
  const { container } = render(<Table {...props} />);
  return createWrapper(container).findTable()!;
}

test('selected rows are resolved by findSelectedRows and expose aria-selected="true"', () => {
  const wrapper = renderTable({ selectionType: 'multi', selectedItems: [items[0], items[2]] });

  const selectedRows = wrapper.findSelectedRows();
  // Finder contract: reconciled via dual-class so the classic test-util marker survives the swap.
  expect(selectedRows).toHaveLength(2);

  selectedRows.forEach(row => {
    expect(row.getElement().tagName).toBe('TR');
    expect(row.getElement().getAttribute('aria-selected')).toBe('true');
  });

  // Unselected rows must not falsely advertise selection.
  const allRows = wrapper.findRows();
  expect(allRows).toHaveLength(3);
  const unselected = allRows.filter(row => row.getElement().getAttribute('aria-selected') === 'true');
  expect(unselected).toHaveLength(2); // only the two selected rows carry aria-selected
});
