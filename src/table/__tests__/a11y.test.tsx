// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import { render } from '@testing-library/react';
import { useContainerQuery } from '../../../lib/components/internal/hooks/container-queries';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/container-queries', () => ({
  useContainerQuery: jest.fn().mockReturnValue([800, { current: null }]),
}));

interface Item {
  id: number;
  name: string;
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderTableWrapper(props?: Partial<TableProps>) {
  const { container } = render(<Table items={defaultItems} columnDefinitions={defaultColumns} {...props} />);
  return createWrapper(container).findTable()!;
}

function mockSmallWrapper() {
  // This is very brittle, bc we do not pass any identifying parameters to
  // userContainerQuery. It relies on the call order inside the table.
  (useContainerQuery as jest.MockedFn<typeof useContainerQuery>).mockReturnValueOnce([400, { current: null }]);
}

const tableLabel = 'Items';

afterAll(() => {
  jest.restoreAllMocks();
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

  test('sets role=region and aria-label on scrollable wrapper when overflowing', () => {
    mockSmallWrapper();
    const wrapper = renderTableWrapper({
      ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
    });

    expect(wrapper.find('[role=region]')!.getElement().getAttribute('aria-label')).toEqual(tableLabel);
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
    test('Should render a live region with table total count and indices when liveAnnouncement and firstIndex are available', () => {
      const firstIndex = 1;
      const totalItemsCount = defaultItems.length;
      const lastIndex = firstIndex + defaultItems.length;

      const wrapper = renderTableWrapper({
        firstIndex,
        totalItemsCount,
        liveAnnouncement: ({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`,
      });

      expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(
        `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`
      );
    });
  });
});
