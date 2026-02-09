// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import { getControlIds, getSelectAllInput, getSelectionA11yHeader, getSelectionInput } from './utils/extra-selectors';

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
  const { container, rerender } = render(<Table {...props} />);
  const wrapper = createWrapper(container).findTable()!;
  return {
    wrapper,
    rerender: (extraProps: Partial<TableProps>) => rerender(<Table {...props} {...extraProps} />),
  };
}

function getCallArgs(handler: jest.Mock, index = 0) {
  return handler.mock.calls[index][0].detail.selectedItems;
}

test('does not render selection controls when selectionType is not set', () => {
  const { wrapper } = renderTable({});
  expect(wrapper.findSelectAllTrigger()).toBeFalsy();
  expect(wrapper.findRowSelectionArea(1)).toBeFalsy();
});

test.each(['single', 'multi', undefined] as const)(
  'Table headers with selectionType=%s are marked as columns for a11y',
  selectionType => {
    const { wrapper: tableWrapper } = renderTable({ selectionType });
    tableWrapper.findColumnHeaders().forEach(headerWrapper => {
      const hasThTag = headerWrapper.getElement().tagName === 'TH';
      const hasScope = headerWrapper.getElement().getAttribute('scope') === 'col';
      expect(hasThTag || hasScope).toBe(true);
    });
  }
);

describe('selection control labels', () => {
  const ariaLabels: TableProps['ariaLabels'] = {
    selectionGroupLabel: 'group label',
    allItemsSelectionLabel: ({ selectedItems, itemsCount, selectedItemsCount }) =>
      `${selectedItemsCount}(${selectedItems.length}) of ${itemsCount} selected`,
    itemSelectionLabel: ({ selectedItems }, item) =>
      `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
  };
  const getRowSelector = (w: TableWrapper, i: number) => w.findRowSelectionArea(i)!.getElement();

  test('adds allItemsSelectionLabel to select-all checkbox', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', selectedItems: [items[0]], ariaLabels });
    expect(getSelectionA11yHeader(wrapper)).toBe(null);
    expect(wrapper.findSelectAllTrigger()!.getElement()).toHaveAttribute('aria-label', '1(1) of 3 selected');
  });

  test('adds selectionGroupLabel to single selection column header', () => {
    const { wrapper } = renderTable({ selectionType: 'single', ariaLabels });
    expect(getSelectionA11yHeader(wrapper)).toHaveTextContent('group label');
  });

  describe.each(['single', 'multi'] as const)('selectionType=%s', selectionType => {
    test('leaves the controls without labels, when ariaLabels is omitted', () => {
      const { wrapper } = renderTable({ selectionType });
      if (selectionType === 'single') {
        expect(getSelectionA11yHeader(wrapper)!.textContent).toBe('');
      } else {
        expect(wrapper.findSelectAllTrigger()!.getElement()).not.toHaveAttribute('aria-label');
      }
      expect(getRowSelector(wrapper, 1)).not.toHaveAttribute('aria-label');
      expect(getRowSelector(wrapper, 2)).not.toHaveAttribute('aria-label');
      expect(getRowSelector(wrapper, 3)).not.toHaveAttribute('aria-label');
    });

    test('adds selectionGroupLabel and itemSelectionLabel to row selection control', () => {
      const { wrapper } = renderTable({ selectionType, selectedItems: [items[1]], ariaLabels });
      expect(getRowSelector(wrapper, 1)).toHaveAttribute('aria-label', 'Apples is not selected');
      expect(getRowSelector(wrapper, 2)).toHaveAttribute('aria-label', 'Oranges is selected');
      expect(getRowSelector(wrapper, 3)).toHaveAttribute('aria-label', 'Bananas is not selected');
    });
  });
});

describe('select all checkbox', () => {
  test('indeterminate, when some of the items are selected', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', selectedItems: [items[1]] });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('unchecked, when no items selected', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', selectedItems: [] });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('indeterminate, when there are selected items that do not match the items list', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', selectedItems: [{ id: 4, name: 'Apples' }] });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', false);
  });
  test('disabled, when every item is disabled', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', isItemDisabled: () => true });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', true);
  });
  test('checked, when every item is selected', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', selectedItems: items });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('checked', true);
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('indeterminate', false);
  });
  test('disabled, when there are no items', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', items: [] });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', true);
  });
  test('disabled, when table is loading', () => {
    const { wrapper } = renderTable({ selectionType: 'multi', loading: true });
    expect(getSelectAllInput(wrapper)!.getElement()).toHaveProperty('disabled', true);
  });
  test('does not exist in selectionType="single"', () => {
    const { wrapper } = renderTable({ selectionType: 'single' });
    expect(wrapper.findSelectAllTrigger()).toBeFalsy();
  });
  test('does not toggle disabled items', () => {
    const onSelectionChange = jest.fn();
    const { wrapper, rerender } = renderTable({
      selectionType: 'multi',
      isItemDisabled: item => item.id === items[1].id,
      selectedItems: [],
      onSelectionChange,
    });
    wrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0], items[2]]);
    onSelectionChange.mockReset();
    rerender({
      selectionType: 'multi',
      isItemDisabled: item => item.id === items[1].id,
      selectedItems: items,
      onSelectionChange,
    });
    wrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[1]]);
  });
});

// Some other components may need this click, for example, popover (AWSUI-7864)
test.each(['single', 'multi'] as const)('should propagate click event with selectionType=%s', selectionType => {
  const { wrapper } = renderTable({ selectionType });
  const clickSpy = jest.fn();
  document.body.addEventListener('click', clickSpy);
  wrapper.findRowSelectionArea(1)!.click();
  expect(clickSpy).toHaveBeenCalled();
  document.body.removeEventListener('click', clickSpy);
});

describe('single selection', () => {
  let tableWrapper: TableWrapper;
  const onSelectionChange = jest.fn();
  beforeEach(() => {
    onSelectionChange.mockReset();
    tableWrapper = renderTable({
      selectionType: 'single',
      selectedItems: [items[0]],
      onSelectionChange,
    }).wrapper;
  });
  test('should render radio buttons for `selectionType="single"`', () => {
    expect(getSelectionInput(tableWrapper, 1)?.getElement()).toHaveAttribute('type', 'radio');
  });
  test('should deselect previous row when `single` type', () => {
    tableWrapper.findRowSelectionArea(2)!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[1]]);
  });
  test('should not deselect row when clicked and `single` selection', () => {
    tableWrapper.findRowSelectionArea(1)!.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
  test('should use the same name for all radios inside a table', () => {
    const names: string[] = [];
    for (let i = 1; i <= items.length; i++) {
      names.push(getSelectionInput(tableWrapper, i).getElement().name);
    }
    expect(names).toHaveLength(3);
    expect(names.every(name => name === names[0])).toBeTruthy();
  });
  test('should use different name for the second table', function () {
    const firstTableName = getSelectionInput(tableWrapper, 1).getElement().name;
    const { wrapper: secondWrapper } = renderTable({
      selectionType: 'single',
      selectedItems: [items[0]],
      onSelectionChange: onSelectionChange,
    });
    const secondTableName = getSelectionInput(secondWrapper, 1).getElement().name;
    expect(firstTableName).not.toEqual(secondTableName);
  });
});

describe('multi selection', () => {
  let tableWrapper: TableWrapper;
  let rerender: (props: Partial<TableProps>) => void;
  const onSelectionChange = jest.fn();
  beforeEach(() => {
    onSelectionChange.mockReset();
    const result = renderTable({
      selectionType: 'multi',
      selectedItems: [items[0]],
      onSelectionChange,
      isItemDisabled: item => item === items[1],
    });
    tableWrapper = result.wrapper;
    rerender = result.rerender;
  });
  test('should deselect row when clicked', () => {
    tableWrapper.findRowSelectionArea(1)!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([]);
  });
  test('should add clicked item to the selectedItems', () => {
    tableWrapper.findRowSelectionArea(3)!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0], items[2]]);
  });
  test('should not fire the even on disabled row clicks', () => {
    tableWrapper.findRowSelectionArea(2)!.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
  describe('keyboard interaction', () => {
    test('should move focus over a disabled item', () => {
      getSelectionInput(tableWrapper, 1)?.keydown(KeyCode.down);
      expect(getSelectionInput(tableWrapper, 3)?.getElement()).toEqual(document.activeElement);
      getSelectionInput(tableWrapper, 3)?.keydown(KeyCode.up);
      expect(getSelectionInput(tableWrapper, 1)?.getElement()).toEqual(document.activeElement);
    });
    test('should move focus up from the first item to "select all" cell', () => {
      getSelectionInput(tableWrapper, 1)?.keydown(KeyCode.up);
      expect(getSelectAllInput(tableWrapper)?.getElement()).toEqual(document.activeElement);
    });
    test('should move focus down from "select all" cell to first item', () => {
      getSelectAllInput(tableWrapper)?.keydown(KeyCode.down);
      expect(getSelectionInput(tableWrapper, 1)?.getElement()).toEqual(document.activeElement);
    });
    test('should not move focus up from "select all" cell', () => {
      getSelectAllInput(tableWrapper)?.focus();
      getSelectAllInput(tableWrapper)?.keydown(KeyCode.up);
      expect(getSelectAllInput(tableWrapper)?.getElement()).toEqual(document.activeElement);
    });
    test('should not move focus down from the last item', () => {
      getSelectionInput(tableWrapper, 3)?.focus();
      getSelectionInput(tableWrapper, 3)?.keydown(KeyCode.down);
      expect(getSelectionInput(tableWrapper, 3)?.getElement()).toEqual(document.activeElement);
    });
  });
  test('should not remove items that are not currently visible from the `selectedItems` array', () => {
    rerender({ items: items.slice(1) });
    // select item
    tableWrapper.findRowSelectionArea(2)!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0], items[2]]);
    onSelectionChange.mockReset();
    // select all page
    tableWrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0], items[2]]);
    onSelectionChange.mockReset();
    // deselect item
    rerender({ items: items.slice(1), selectedItems: [items[0], items[2]] });
    tableWrapper.findRowSelectionArea(2)!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0]]);
    // deselect all page
    onSelectionChange.mockReset();
    tableWrapper.findSelectAllTrigger()!.click();
    expect(getCallArgs(onSelectionChange)).toEqual([items[0]]);
  });
});

describe('row click event', () => {
  let onRowClickSpy: jest.Mock;
  let tableWrapper: TableWrapper;
  beforeEach(() => {
    onRowClickSpy = jest.fn();
    const result = renderTable({ selectionType: 'multi', selectedItems: [items[0]], onRowClick: onRowClickSpy });
    tableWrapper = result.wrapper;
  });

  test('should fire when clicking on a body cell that is not a selection area', () => {
    tableWrapper.findBodyCell(1, 2)!.click();
    expect(onRowClickSpy).toHaveBeenCalledTimes(1);
    expect(onRowClickSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { item: { id: 1, name: 'Apples' }, rowIndex: 0 } })
    );
  });

  test('should not fire when clicking on selection area', () => {
    tableWrapper.findRowSelectionArea(3)!.click();
    expect(onRowClickSpy).toHaveBeenCalledTimes(0);
  });
});

describe.each(['single', 'multi'] as const)(
  'compares selectable items using trackBy, selectionType=%s',
  selectionType => {
    let tableWrapper: TableWrapper;
    let rerender: (props: Partial<TableProps>) => void;
    beforeEach(() => {
      const selectedItems = [{ name: items[0].name, id: items[1].id }];
      const result = renderTable({ selectionType, selectedItems, trackBy: 'name' });
      tableWrapper = result.wrapper;
      rerender = result.rerender;
    });
    const getSelectedNames = () =>
      tableWrapper.findSelectedRows()!.map(wrapper => wrapper.find('td:nth-child(3)')?.getElement().textContent);

    test('should select rows matched by name', () => {
      expect(getSelectedNames()).toEqual(['Apples']);
    });

    test('should select items matched by id', () => {
      expect(getSelectedNames()).toEqual(['Apples']);
      rerender({ trackBy: 'id' });
      expect(getSelectedNames()).toEqual(['Oranges']);
    });

    test('preserves control ids using track by', () => {
      const initialIds = getControlIds(tableWrapper);
      rerender({ items: [{ id: 4, name: 'Peaches' }, items[0], items[1]] });
      const newIds = getControlIds(tableWrapper);
      expect(newIds).toEqual([expect.any(String), initialIds[0], initialIds[1]]);
    });
  }
);
