// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import Header from '../../../lib/components/header';
import { render } from '@testing-library/react';
import tableStyles from '../../../lib/components/table/styles.css.js';
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

describe('table role', () => {
  test('table has role="table" when inline editing, sorting, resizable columns, and selection are not used', () => {
    const wrapper = renderTableWrapper({ sortingDisabled: true });
    expect(wrapper.find('[role="table"]')).not.toBeNull();
  });

  test('table has role="grid" when inline editing is used', () => {
    const wrapper = renderTableWrapper({
      sortingDisabled: true,
      columnDefinitions: defaultColumns,
      submitEdit: () => {},
    });
    expect(wrapper.find('[role="grid"]')).not.toBeNull();
  });

  test('table has role="grid" when sorting is used', () => {
    const wrapper = renderTableWrapper();
    expect(wrapper.find('[role="grid"]')).not.toBeNull();
  });

  test('table has role="grid" when resizable columns is used', () => {
    const wrapper = renderTableWrapper({ sortingDisabled: true, resizableColumns: true });
    expect(wrapper.find('[role="grid"]')).not.toBeNull();
  });

  test('table has role="grid" when selection is used', () => {
    const wrapper = renderTableWrapper({ sortingDisabled: true, selectionType: 'single' });
    expect(wrapper.find('[role="grid"]')).not.toBeNull();
  });

  test('table role is set only once', () => {
    const { container, rerender } = render(<Table items={defaultItems} columnDefinitions={defaultColumns} />);
    expect(container.querySelector('[role="grid"]')).not.toBeNull();

    rerender(<Table items={defaultItems} columnDefinitions={defaultColumns} sortingDisabled={true} />);
    expect(container.querySelector('[role="grid"]')).not.toBeNull();
  });
});

describe('labels', () => {
  test('not to have aria-label if omitted', () => {
    const wrapper = renderTableWrapper();
    expect(wrapper.findByClassName(tableStyles.table)!.getElement()).not.toHaveAttribute('aria-label');
  });

  test('sets aria-label on table', () => {
    const wrapper = renderTableWrapper({
      ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
    });
    expect(wrapper.findByClassName(tableStyles.table)!.getElement().getAttribute('aria-label')).toEqual(tableLabel);
  });

  test('automatically labels table with header if provided', () => {
    const wrapper = renderTableWrapper({
      header: <Header counter="(10)">Labelled table</Header>,
    });
    expect(wrapper.findByClassName(tableStyles.table)!.getElement()).toHaveAccessibleName('Labelled table');
  });

  test('aria-label has priority over auto-labelling', () => {
    const wrapper = renderTableWrapper({
      header: <Header>Labelled table</Header>,
      ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
    });
    expect(wrapper.findByClassName(tableStyles.table)!.getElement()).toHaveAccessibleName(tableLabel);
  });

  describe('rows', () => {
    test('sets aria-rowcount on table', () => {
      const wrapper = renderTableWrapper({
        totalItemsCount: 300,
      });
      expect(wrapper.findByClassName(tableStyles.table)!.getElement().getAttribute('aria-rowcount')).toEqual('301');
    });

    test('aria-rowcount should be -1 if totalItemsCount is undefined', () => {
      const wrapper = renderTableWrapper({});
      expect(wrapper.findByClassName(tableStyles.table)!.getElement().getAttribute('aria-rowcount')).toEqual('-1');
    });

    test('sets aria-rowindex on table rows', () => {
      const wrapper = renderTableWrapper({ firstIndex: 21 });
      const [headerRow, firstRowInTable] = wrapper.findAll('tr');
      // header row is always index 1
      expect(headerRow!.getElement().getAttribute('aria-rowindex')).toEqual('1');
      // rows in a table are index + 1 as header row is index 1
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
