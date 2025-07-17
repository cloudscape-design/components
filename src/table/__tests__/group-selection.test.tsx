// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import { getControlIds, getSelectAllInput, getSelectionA11yHeader } from './utils/extra-selectors';

interface Item {
  id: string;
  name: string;
  children?: Item[];
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const items: Item[] = [
  {
    id: '1',
    name: 'Apples',
    children: [
      {
        id: '1.1',
        name: 'Apple 1',
        children: [
          { id: '1.1.1', name: 'Apple 1.1' },
          { id: '1.1.1', name: 'Apple 1.2' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Oranges',
    children: [
      {
        id: '2.1',
        name: 'Orange 1',
        children: [{ id: '2.1.1', name: 'Orange 1.1' }],
      },
    ],
  },
  { id: '3', name: 'Bananas' },
];

const createExpandableRows = (
  partial: Partial<TableProps.ExpandableRows<Item>> = {}
): TableProps.ExpandableRows<Item> => ({
  getItemChildren: item => item.children ?? [],
  isItemExpandable: () => false,
  expandedItems: [],
  onExpandableItemToggle: () => {},
  ...partial,
});

const createLoaderProps = (status: TableProps.LoadingStatus): Partial<TableProps> => ({
  getLoadingStatus: () => status,
  renderLoaderLoading: ({ item }) => `${item?.name ?? 'Root'} loader`,
  renderLoaderPending: ({ item }) => `${item?.name ?? 'Root'} loader`,
  renderLoaderError: ({ item }) => `${item?.name ?? 'Root'} loader`,
});

function renderTable(tableProps: Partial<TableProps>) {
  const expandableRows =
    tableProps.expandableRows ?? createExpandableRows({ groupSelection: { inverted: false, toggledItems: [] } });
  const props: TableProps = { items, columnDefinitions, ...tableProps, expandableRows };
  const { container, rerender } = render(<Table {...props} />);
  const wrapper = createWrapper(container).findTable()!;
  return {
    wrapper,
    rerender: (extraProps: Partial<TableProps>) => rerender(<Table {...props} {...extraProps} />),
  };
}

function getAllState(w: TableWrapper) {
  const checkbox = w.findSelectAllTrigger()!.find('input')!.getElement() as HTMLInputElement;
  return [checkbox.checked, checkbox.indeterminate];
}

function getRowCheckbox(w: TableWrapper, content: string) {
  const row = w.findRows().find(r => r.findAll('td,th').some(c => c.getElement().textContent === content));
  if (!row) {
    throw new Error(`Could not find row for content="${content}"`);
  }
  return row.find('input')!.getElement() as HTMLInputElement;
}

function getRowState(w: TableWrapper, content: string) {
  const checkbox = getRowCheckbox(w, content);
  return [checkbox.checked, checkbox.indeterminate];
}

function getCallArgs(handler: jest.Mock, index = 0) {
  return handler.mock.calls[index][0].detail.groupSelection;
}

test('does not render selection controls when group selection is not set', () => {
  const { wrapper } = renderTable({ expandableRows: createExpandableRows() });
  expect(wrapper.findSelectAllTrigger()).toBeFalsy();
  expect(wrapper.findRowSelectionArea(1)).toBeFalsy();
});

describe('selection control labels', () => {
  const ariaLabels: TableProps<Item>['ariaLabels'] = {
    selectionGroupLabel: 'group label',
    allItemsSelectionLabel: ({ selectedItems, itemsCount, selectedItemsCount }) =>
      `${selectedItemsCount}(${selectedItems.length}) of ${itemsCount} selected`,
    itemSelectionLabel: ({ itemsCount, selectedItemsCount }, item) =>
      `${selectedItemsCount} of ${itemsCount} ${item.name} selected`,
    allItemsLoaderSelectionLabel: () => 'Root loader',
    itemLoaderSelectionLabel: (_, item) => `${item.name} loader`,
  };
  const getRowSelector = (w: TableWrapper, i: number) => w.findRowSelectionArea(i)!.getElement();

  test('adds selectionGroupLabel and allItemsSelectionLabel to select-all checkbox', () => {
    const { wrapper, rerender } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [items[0]] } }),
      totalItemsCount: 3,
      selectedItems: items[0].children![0].children,
      ariaLabels,
    });
    expect(getSelectionA11yHeader(wrapper)).toBe(null);
    expect(wrapper.findSelectAllTrigger()!.getElement()).toHaveAttribute('aria-label', '2(2) of 3 selected');

    rerender({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [items[0]] },
        totalItemsCount: 12,
        totalSelectedItemsCount: 8,
      }),
    });
    expect(wrapper.findSelectAllTrigger()!.getElement()).toHaveAttribute('aria-label', '8(2) of 12 selected');
  });

  test('leaves the controls without labels, when ariaLabels is omitted', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [] },
      }),
      ...createLoaderProps('pending'),
    });
    expect(wrapper.findSelectAllTrigger()!.getElement()).not.toHaveAttribute('aria-label');
    expect(getRowSelector(wrapper, 1)).not.toHaveAttribute('aria-label');
    expect(getRowSelector(wrapper, 2)).not.toHaveAttribute('aria-label');
    expect(getRowSelector(wrapper, 3)).not.toHaveAttribute('aria-label');
    expect(getRowSelector(wrapper, 4)).not.toHaveAttribute('aria-label');
  });

  test('adds selectionGroupLabel and itemSelectionLabel to row selection control', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [items[1]] },
        getItemsCount: item => item.name.length,
        getSelectedItemsCount: item => (item.name === 'Oranges' ? 1 : 0),
      }),
      ariaLabels,
    });
    expect(getRowSelector(wrapper, 1)).toHaveAttribute('aria-label', '0 of 6 Apples selected');
    expect(getRowSelector(wrapper, 2)).toHaveAttribute('aria-label', '1 of 7 Oranges selected');
    expect(getRowSelector(wrapper, 3)).toHaveAttribute('aria-label', '0 of 7 Bananas selected');
  });

  test('adds allItemsLoaderSelectionLabel and itemLoaderSelectionLabel', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        expandedItems: items,
        groupSelection: { inverted: true, toggledItems: [] },
      }),
      ...createLoaderProps('pending'),
      ariaLabels,
    });
    expect(getRowSelector(wrapper, 3)).toHaveAttribute('aria-label', 'Apples loader');
    expect(getRowSelector(wrapper, 6)).toHaveAttribute('aria-label', 'Oranges loader');
    expect(getRowSelector(wrapper, 8)).toHaveAttribute('aria-label', 'Root loader');
  });
});

test('adds items count and selection count to cell counter renderer', () => {
  const { wrapper } = renderTable({
    columnDefinitions: columnDefinitions.map(definition => ({
      ...definition,
      counter: data => `${data.selectedItemsCount}/${data.itemsCount} (${data.item[definition.header as keyof Item]})`,
    })),
    expandableRows: createExpandableRows({
      groupSelection: { inverted: false, toggledItems: [items[1]] },
      getItemsCount: item => item.name.length,
      getSelectedItemsCount: item => (item.name === 'Oranges' ? 3 : 0),
    }),
  });
  expect(wrapper.findBodyCellCounter(1, 2)!.getElement().textContent).toBe('0/6 (1)');
  expect(wrapper.findBodyCellCounter(1, 3)!.getElement().textContent).toBe('0/6 (Apples)');
  expect(wrapper.findBodyCellCounter(2, 3)!.getElement().textContent).toBe('3/7 (Oranges)');
  expect(wrapper.findBodyCellCounter(3, 3)!.getElement().textContent).toBe('0/7 (Bananas)');
});

describe('select all checkbox', () => {
  test('indeterminate, when some of the items are selected', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [items[0]] } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('unchecked, when no items selected', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [] } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('unchecked, when selected items are missed in the items list', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [{ id: '0', name: 'Pumpkins' }] },
      }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('not disabled, when every item is disabled', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [] } }),
      isItemDisabled: () => true,
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', false);
  });
  test('checked, when every item is selected', () => {
    const { wrapper, rerender } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: true, toggledItems: [] } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);

    rerender({
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: items } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);
  });
  test('not disabled, when there are no items', () => {
    const { wrapper } = renderTable({
      items: [],
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [] } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', false);
  });
  test('not disabled, when table is loading', () => {
    const { wrapper } = renderTable({
      loading: true,
      expandableRows: createExpandableRows({ groupSelection: { inverted: false, toggledItems: [] } }),
    });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', false);
  });
  test('toggles when all items are disabled', () => {
    const onGroupSelectionChange = jest.fn();
    const { wrapper, rerender } = renderTable({
      isItemDisabled: () => true,
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [] },
        onGroupSelectionChange,
      }),
    });
    wrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onGroupSelectionChange)).toEqual({ inverted: true, toggledItems: [] });

    onGroupSelectionChange.mockReset();
    rerender({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: true, toggledItems: [] },
        onGroupSelectionChange,
      }),
    });
    wrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onGroupSelectionChange)).toEqual({ inverted: false, toggledItems: [] });
  });
});

describe('compares selectable items using trackBy', () => {
  let tableWrapper: TableWrapper;
  let rerender: (props: Partial<TableProps>) => void;
  beforeEach(() => {
    const result = renderTable({
      trackBy: 'name',
      expandableRows: createExpandableRows({
        expandedItems: items,
        groupSelection: { inverted: false, toggledItems: [{ name: items[0].name, id: items[1].id }] },
      }),
    });
    tableWrapper = result.wrapper;
    rerender = result.rerender;
  });
  const getSelectedNames = () =>
    tableWrapper.findSelectedRows()!.map(wrapper => wrapper.find('td:nth-child(3)')?.getElement().textContent);

  test('should select rows matched by name', () => {
    expect(getSelectedNames()).toEqual(['Apples', 'Apple 1']);
  });

  test('should select items matched by id', () => {
    expect(getSelectedNames()).toEqual(['Apples', 'Apple 1']);
    rerender({ trackBy: 'id' });
    expect(getSelectedNames()).toEqual(['Oranges', 'Orange 1']);
  });

  test('preserves control ids using track by', () => {
    const initialIds = getControlIds(tableWrapper);
    rerender({ items: [{ id: 4, name: 'Peaches' }, items[0], items[1]] });
    const newIds = getControlIds(tableWrapper);
    expect(newIds).toEqual([expect.any(String), initialIds[0], initialIds[1], initialIds[2], initialIds[3]]);
  });
});

describe('partial items selection with progressive loading', () => {
  const getRandomStatus = () => (['loading', 'pending', 'error'] as const)[Math.floor(Math.random() * 3)];

  test('does not normalize root selection when loader row is present', () => {
    // Without loader row, the selection is normalized.
    const { wrapper, rerender } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [items[0], items[1], items[2]] },
      }),
    });
    expect(getAllState(wrapper)).toEqual([true, false]);
    expect(getRowState(wrapper, 'Apples')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Oranges')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Bananas')).toEqual([true, false]);

    // With loader row, the selection is NOT normalized.
    rerender({ ...createLoaderProps(getRandomStatus()) });
    expect(getAllState(wrapper)).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apples')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Oranges')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Bananas')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Root loader')).toEqual([false, false]);
  });

  test('does not normalize group selection when loader row is present', () => {
    // Without loader row, the selection is normalized.
    const { wrapper, rerender } = renderTable({
      expandableRows: createExpandableRows({
        expandedItems: items,
        groupSelection: { inverted: false, toggledItems: items[0].children! },
      }),
    });
    expect(getAllState(wrapper)).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apples')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Apple 1')).toEqual([true, false]);

    // With loader row, the selection is NOT normalized.
    rerender({ ...createLoaderProps(getRandomStatus()) });
    expect(getAllState(wrapper)).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apples')).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apple 1')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Apples loader')).toEqual([false, false]);
  });

  test('loader row is selected when its group is selected', () => {
    const { wrapper, rerender } = renderTable({
      expandableRows: createExpandableRows({ groupSelection: { inverted: true, toggledItems: [items[0]] } }),
      ...createLoaderProps(getRandomStatus()),
    });
    expect(getAllState(wrapper)).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apples')).toEqual([false, false]);
    expect(getRowState(wrapper, 'Oranges')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Bananas')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Root loader')).toEqual([true, false]);

    rerender({
      expandableRows: createExpandableRows({
        expandedItems: items,
        groupSelection: { inverted: false, toggledItems: [items[0]] },
      }),
      ...createLoaderProps(getRandomStatus()),
    });
    expect(getAllState(wrapper)).toEqual([false, true]);
    expect(getRowState(wrapper, 'Apples')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Apple 1')).toEqual([true, false]);
    expect(getRowState(wrapper, 'Apples loader')).toEqual([true, false]);
  });

  test('toggling root loader row selection inverts root selection', () => {
    const s1: TableProps.GroupSelectionState<Item> = { inverted: false, toggledItems: [items[0]] };
    const s2: TableProps.GroupSelectionState<Item> = { inverted: true, toggledItems: [items[1], items[2]] };
    for (const [initial, expected] of [
      [s1, s2],
      [s2, s1],
    ]) {
      const onGroupSelectionChange = jest.fn();
      const { wrapper } = renderTable({
        expandableRows: createExpandableRows({ groupSelection: initial, onGroupSelectionChange }),
        ...createLoaderProps(getRandomStatus()),
      });
      getRowCheckbox(wrapper, 'Root loader').click();
      expect(getCallArgs(onGroupSelectionChange)).toEqual(expected);
    }
  });

  test('toggling group loader row selection inverts group selection', () => {
    const s1: TableProps.GroupSelectionState<Item> = { inverted: false, toggledItems: items[0].children! };
    const s2: TableProps.GroupSelectionState<Item> = { inverted: false, toggledItems: [items[0]] };
    for (const [initial, expected] of [
      [s1, s2],
      [s2, s1],
    ]) {
      const onGroupSelectionChange = jest.fn();
      const { wrapper } = renderTable({
        expandableRows: createExpandableRows({ expandedItems: items, groupSelection: initial, onGroupSelectionChange }),
        ...createLoaderProps(getRandomStatus()),
      });
      getRowCheckbox(wrapper, 'Apples loader').click();
      expect(getCallArgs(onGroupSelectionChange)).toEqual(expected);
    }
  });

  test('computes loader counter selected state correctly', () => {
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        expandedItems: items,
        groupSelection: { inverted: false, toggledItems: [items[0]] },
      }),
      ...createLoaderProps('pending'),
      renderLoaderCounter: ({ loadingStatus, item, selected }) =>
        `${loadingStatus}-${item?.name ?? 'Root'}-${selected}`,
    });
    expect(
      wrapper.findRows().map(r =>
        r
          .findAll('td,th')
          .map(c => c.getElement().textContent.trim())
          .filter(Boolean)
          .join(' ')
      )
    ).toEqual([
      '1 Apples',
      '1.1 Apple 1',
      'Apples loader pending-Apples-true',
      '2 Oranges',
      '2.1 Orange 1',
      'Oranges loader pending-Oranges-false',
      '3 Bananas',
      'Root loader pending-Root-false',
    ]);
  });
});

describe('shift selection', () => {
  function clickRow(w: TableWrapper, content: string) {
    getRowCheckbox(w, content).click();
  }
  function shiftClickRow(w: TableWrapper, content: string) {
    const checkbox = getRowCheckbox(w, content);
    checkbox.dispatchEvent(new MouseEvent('mousedown', { shiftKey: true, bubbles: true }));
    checkbox.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
    checkbox.dispatchEvent(new MouseEvent('mouseup', { shiftKey: false, bubbles: true }));
  }

  test('selects multiple root items with shift+click', () => {
    const onGroupSelectionChange = jest.fn();
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [items[1]] },
        onGroupSelectionChange,
      }),
    });
    clickRow(wrapper, 'Apples');
    shiftClickRow(wrapper, 'Bananas');
    expect(getCallArgs(onGroupSelectionChange, 1)).toEqual({ inverted: true, toggledItems: [] });
  });

  test('selects multiple items within a single group with shift+click', () => {
    const onGroupSelectionChange = jest.fn();
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        expandedItems: [...items, ...items[0].children!],
        groupSelection: { inverted: false, toggledItems: [] },
        onGroupSelectionChange,
      }),
    });
    clickRow(wrapper, 'Apple 1.1');
    shiftClickRow(wrapper, 'Apple 1.2');
    expect(getCallArgs(onGroupSelectionChange, 1)).toEqual({ inverted: false, toggledItems: [items[0]] });
  });

  test.each(['click', 'shift-click'])('selects a single item with shift+click, first action: %s', firstActionType => {
    const onGroupSelectionChange = jest.fn();
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        groupSelection: { inverted: false, toggledItems: [] },
        onGroupSelectionChange,
      }),
    });
    (firstActionType === 'click' ? clickRow : shiftClickRow)(wrapper, 'Oranges');
    shiftClickRow(wrapper, 'Oranges');
    expect(getCallArgs(onGroupSelectionChange, 1)).toEqual({ inverted: false, toggledItems: [items[1]] });
  });

  test('performs no shift-selection when target items have distinct parents', () => {
    const onGroupSelectionChange = jest.fn();
    const { wrapper } = renderTable({
      expandableRows: createExpandableRows({
        expandedItems: [...items, ...items[0].children!],
        groupSelection: { inverted: false, toggledItems: [] },
        onGroupSelectionChange,
      }),
    });
    clickRow(wrapper, 'Apples');
    shiftClickRow(wrapper, 'Oranges');
    expect(onGroupSelectionChange).toHaveBeenCalledTimes(1);
  });
});
