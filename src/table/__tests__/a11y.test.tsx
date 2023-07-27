// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import { render } from '@testing-library/react';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';

interface Item {
  id: number;
  name: string;
  value: string;
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples', value: 'apples' },
  { id: 2, name: 'Oranges', value: 'oranges' },
  { id: 3, name: 'Bananas', value: 'bananas' },
];

function renderTableWrapper(props?: Partial<TableProps>) {
  const { container } = render(<Table items={defaultItems} columnDefinitions={defaultColumns} {...props} />);
  return createWrapper(container).findTable()!;
}

const tableLabel = 'Items';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('roles', () => {
  test('table has role="table" when no columns are editable', () => {
    const wrapper = renderTableWrapper({ columnDefinitions: defaultColumns });
    expect(wrapper.find('[role="table"]')).not.toBeNull();
    expect(wrapper.find('[role="grid"]')).toBeNull();
  });

  test('table has role="grid" when at least one defined column is editable', () => {
    const wrapper = renderTableWrapper({
      columnDefinitions: [
        ...defaultColumns,
        { header: 'value', cell: item => item.value, editConfig: { editingCell: () => null } },
      ],
      visibleColumns: ['id', 'name'],
    });
    expect(wrapper.find('[role="table"]')).toBeNull();
    expect(wrapper.find('[role="grid"]')).not.toBeNull();
  });
});

describe('labels', () => {
  test('not to have aria-label if omitted', () => {
    const wrapper = renderTableWrapper();
    expect(wrapper.find('[role=table]')!.getElement()).not.toHaveAttribute('aria-label');
  });

  test('sets aria-label on table', () => {
    const wrapper = renderTableWrapper({
      ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
    });
    expect(wrapper.find('[role=table]')!.getElement().getAttribute('aria-label')).toEqual(tableLabel);
  });

  describe('rows', () => {
    test('sets aria-rowcount on table', () => {
      const wrapper = renderTableWrapper({
        totalItemsCount: 300,
      });
      expect(wrapper.find('[role=table]')!.getElement().getAttribute('aria-rowcount')).toEqual('301');
    });

    test('aria-rowcount should be -1 if totalItemsCount is undefined', () => {
      const wrapper = renderTableWrapper({});
      expect(wrapper.find('[role=table]')!.getElement().getAttribute('aria-rowcount')).toEqual('-1');
    });

    test('sets aria-rowindex on table rows', () => {
      const wrapper = renderTableWrapper({ firstIndex: 21 });
      const [headerRow, firstRowInTable] = wrapper.findAll('tr');
      // header row is always index 1
      expect(headerRow!.getElement().getAttribute('aria-rowindex')).toEqual('1');
      // rows in a table are index + 1  as header row is index 1
      expect(firstRowInTable!.getElement().getAttribute('aria-rowindex')).toEqual('22');
    });
  });

  describe('live region', () => {
    test('Should render a live region with table total count and indices when renderAriaLive and firstIndex are available', () => {
      const firstIndex = 1;
      const totalItemsCount = defaultItems.length;
      const lastIndex = firstIndex + defaultItems.length - 1;

      const wrapper = renderTableWrapper({
        firstIndex,
        totalItemsCount,
        renderAriaLive: ({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`,
      });

      expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(
        `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`
      );
    });
  });
});
