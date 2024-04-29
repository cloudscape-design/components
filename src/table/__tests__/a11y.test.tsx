// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import Header from '../../../lib/components/header';
import Modal from '../../../lib/components/modal';
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

function rerenderableTableWrapper(props?: Partial<TableProps>) {
  const toRender = (props?: Partial<TableProps>) => (
    <Table items={defaultItems} columnDefinitions={defaultColumns} {...props} />
  );
  const rendered = render(toRender(props));
  return {
    rerender: (newProps?: Partial<TableProps>) => rendered.rerender(toRender({ ...props, ...newProps })),
    wrapper: createWrapper(rendered.container).findTable()!,
  };
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

  test('automatically labels table with header if provided', () => {
    const wrapper = renderTableWrapper({
      header: <Header counter="(10)">Labelled table</Header>,
    });
    expect(wrapper.find('[role=table]')!.getElement()).toHaveAccessibleName('Labelled table');
  });

  test('should not get auto label from a modal', () => {
    const { rerender, wrapper } = rerenderableTableWrapper({
      header: (
        <>
          <Header counter="(10)">Labelled table</Header>
          <Modal header="Modal title" visible={false} />
        </>
      ),
    });
    // re-render was needed to trigger the error scenario here
    rerender({ items: defaultItems.slice(1) });

    expect(wrapper.find('[role=table]')!.getElement()).toHaveAccessibleName('Labelled table');
  });

  test('aria-label has priority over auto-labelling', () => {
    const wrapper = renderTableWrapper({
      header: <Header>Labelled table</Header>,
      ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
    });
    expect(wrapper.find('[role=table]')!.getElement()).toHaveAccessibleName(tableLabel);
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

    test.each([undefined, 21])('sets aria-rowindex on table rows', firstIndex => {
      const expectedFirstIndex = firstIndex ?? 1;
      const wrapper = renderTableWrapper({ firstIndex });
      const [headerRow, firstRowInTable] = wrapper.findAll('tr');
      // header row is always index 1
      expect(headerRow!.getElement().getAttribute('aria-rowindex')).toEqual('1');
      // rows in a table are index + 1 as header row is index 1
      expect(firstRowInTable!.getElement().getAttribute('aria-rowindex')).toEqual((expectedFirstIndex + 1).toString());
    });
  });

  describe('live region', () => {
    test.each([
      { firstIndex: 1, totalItemsCount: defaultItems.length },
      { firstIndex: undefined, totalItemsCount: undefined },
    ])(
      'Should render a live region when firstIndex="$firstIndex" and totalItemsCount="$totalItemsCount"',
      ({ firstIndex, totalItemsCount }) => {
        const expectedFirstIndex = firstIndex ?? 1;
        const lastIndex = expectedFirstIndex + defaultItems.length - 1;

        const wrapper = renderTableWrapper({
          firstIndex,
          totalItemsCount,
          renderAriaLive: ({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`,
        });

        expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(
          `Displaying items from ${expectedFirstIndex} to ${lastIndex} of ${totalItemsCount} items`
        );
      }
    );

    test('The table items live region must not include nested items', () => {
      const firstIndex = 1;
      const totalItemsCount = defaultItems.length;
      const lastIndex = firstIndex + defaultItems.length - 1;

      const wrapper = renderTableWrapper({
        firstIndex,
        totalItemsCount,
        renderAriaLive: ({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`,
        expandableRows: {
          getItemChildren: item => [{ ...item, id: item.id * 100 }],
          isItemExpandable: item => item.id < 100,
          expandedItems: defaultItems,
          onExpandableItemToggle: () => {},
        },
      });

      expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(
        `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`
      );
    });
  });
});
