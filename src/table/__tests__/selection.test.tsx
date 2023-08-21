// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

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
  const props: TableProps = {
    items: items,
    columnDefinitions: columnDefinitions,
    ...tableProps,
  };
  const { container, rerender, getByTestId, queryByTestId } = render(<Table {...props} />);
  const wrapper = createWrapper(container).findTable()!;
  return {
    wrapper,
    rerender: (extraProps: Partial<TableProps>) => rerender(<Table {...props} {...extraProps} />),
    getByTestId,
    queryByTestId,
  };
}

const getSelectionInput = (tableWrapper: TableWrapper, index: number) =>
  tableWrapper.findRowSelectionArea(index)!.find<HTMLInputElement>('input')!;
const getSelectAllInput = (tableWrapper: TableWrapper) =>
  tableWrapper.findSelectAllTrigger()!.find<HTMLInputElement>('input')!;
const getControlIds = (tableWrapper: TableWrapper) =>
  tableWrapper.findRows().map(row => row.find('td:first-child input')!.getElement().id);
const expectSelected = (arr: Item[], handleSelectionChange: jest.Mock, index = 0) => {
  const { selectedItems } = handleSelectionChange.mock.calls[index][0].detail;
  expect(selectedItems).toHaveLength(arr.length);
  expect(selectedItems).toEqual(expect.arrayContaining(arr));
};

test('does not render selection controls when selectionType is not set', () => {
  const { wrapper } = renderTable({});
  expect(wrapper.findSelectAllTrigger()).toBeFalsy();
  expect(wrapper.findRowSelectionArea(1)).toBeFalsy();
});

test.each<TableProps['selectionType']>(['single', 'multi', undefined])(
  'Table headers with selectionType=%s are marked as columns for a11y',
  (selectionType: TableProps['selectionType']) => {
    const { wrapper: tableWrapper } = renderTable({ selectionType });
    tableWrapper.findColumnHeaders().forEach(headerWrapper => {
      const hasThTag = headerWrapper.getElement().tagName === 'TH';
      const hasScope = headerWrapper.getElement().getAttribute('scope') === 'col';
      expect(hasThTag || hasScope).toBe(true);
    });
  }
);

describe('Selection controls` labelling', () => {
  let tableWrapper: TableWrapper;
  const ariaLabels: TableProps['ariaLabels'] = {
    selectionGroupLabel: 'group label',
    allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
    itemSelectionLabel: ({ selectedItems }, item) =>
      `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
  };

  test('puts selectionGroupLabel and allItemsSelectionLabel on selectAll checkbox', () => {
    tableWrapper = renderTable({ selectionType: 'multi', selectedItems: [items[0]], ariaLabels }).wrapper;
    expect(tableWrapper.findSelectAllTrigger()?.getElement()).toHaveAttribute(
      'aria-label',
      'group label 1 item selected'
    );
  });

  test('puts selectionGroupLabel on single selection column header', () => {
    tableWrapper = renderTable({ selectionType: 'single', ariaLabels }).wrapper;
    expect(tableWrapper.findColumnHeaders()[0].find(`.${screenreaderOnlyStyles.root}`)?.getElement()).toHaveTextContent(
      'group label'
    );
  });

  describe.each<TableProps['selectionType']>(['single', 'multi'])('', (selectionType: TableProps['selectionType']) => {
    test('leaves the controls without labels, when ariaLabels is omitted', () => {
      tableWrapper = renderTable({ selectionType }).wrapper;
      for (let i = 1; i <= items.length; i++) {
        expect(tableWrapper.findRowSelectionArea(i)?.getElement()).not.toHaveAttribute('aria-label');
      }
    });

    test('puts selectionGroupLabel and itemSelectionLabel on row selection control', () => {
      tableWrapper = renderTable({ selectionType, ariaLabels, selectedItems: [items[1]] }).wrapper;
      expect(tableWrapper.findRowSelectionArea(1)?.getElement()).toHaveAttribute(
        'aria-label',
        'group label Apples is not selected'
      );
      expect(tableWrapper.findRowSelectionArea(2)?.getElement()).toHaveAttribute(
        'aria-label',
        'group label Oranges is selected'
      );
      expect(tableWrapper.findRowSelectionArea(3)?.getElement()).toHaveAttribute(
        'aria-label',
        'group label Bananas is not selected'
      );
    });
  });
});
describe('Select all checkbox', () => {
  let tableWrapper: TableWrapper;
  test('indeterminate, when some of the items are selected', () => {
    tableWrapper = renderTable({ selectionType: 'multi', selectedItems: [items[1]] }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('indeterminate', true);
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('checked', false);
  });
  test('indeterminate, when there are selected items that do not match the items list', () => {
    tableWrapper = renderTable({ selectionType: 'multi', selectedItems: [{ id: 4, name: 'Apples' }] }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('indeterminate', true);
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('checked', false);
  });
  test('unchecked, when none of the items are selected', () => {
    tableWrapper = renderTable({ selectionType: 'multi', selectedItems: [] }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('indeterminate', false);
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('checked', false);
  });
  test('disabled, when every item is disabled', () => {
    tableWrapper = renderTable({ selectionType: 'multi', isItemDisabled: () => true }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('disabled', true);
  });
  test('checked, when every item is selected', () => {
    tableWrapper = renderTable({ selectionType: 'multi', selectedItems: items }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('checked', true);
  });
  test('disabled, when there are no items', () => {
    tableWrapper = renderTable({ selectionType: 'multi', items: [] }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('disabled', true);
  });
  test('disabled, when table is loading', () => {
    tableWrapper = renderTable({ selectionType: 'multi', loading: true }).wrapper;
    expect(getSelectAllInput(tableWrapper)?.getElement()).toHaveProperty('disabled', true);
  });
  test('does not exist in selectionType="single"', () => {
    tableWrapper = renderTable({ selectionType: 'single' }).wrapper;
    expect(tableWrapper.findSelectAllTrigger()).toBeFalsy();
  });
  test('does not toggle disabled items', () => {
    const handleSelectionChange = jest.fn();
    tableWrapper = renderTable({
      selectionType: 'multi',
      isItemDisabled: item => item.id === items[1].id,
      selectedItems: [],
      onSelectionChange: handleSelectionChange,
    }).wrapper;
    tableWrapper.findSelectAllTrigger()!.click();
    expectSelected([items[0], items[2]], handleSelectionChange);
    handleSelectionChange.mockReset();
    tableWrapper = renderTable({
      selectionType: 'multi',
      isItemDisabled: item => item.id === items[1].id,
      selectedItems: items,
      onSelectionChange: handleSelectionChange,
    }).wrapper;
    tableWrapper.findSelectAllTrigger()!.click();
    expectSelected([items[1]], handleSelectionChange);
  });
});

// Some other components may need this click, for example, popover (AWSUI-7864)
test.each<TableProps['selectionType']>(['single', 'multi'])(
  'Should propagate click event with selectionType=%s',
  (selectionType: TableProps['selectionType']) => {
    const { wrapper: tableWrapper } = renderTable({ selectionType });
    const clickSpy = jest.fn();
    document.body.addEventListener('click', clickSpy);
    tableWrapper.findRowSelectionArea(1)!.click();
    expect(clickSpy).toHaveBeenCalled();
    document.body.removeEventListener('click', clickSpy);
  }
);
describe('Single selection', () => {
  let tableWrapper: TableWrapper;
  const handleSelectionChange = jest.fn();
  beforeEach(() => {
    handleSelectionChange.mockReset();
    tableWrapper = renderTable({
      selectionType: 'single',
      selectedItems: [items[0]],
      onSelectionChange: handleSelectionChange,
    }).wrapper;
  });
  test('should render radio buttons for `selectionType="single"`', () => {
    expect(getSelectionInput(tableWrapper, 1)?.getElement()).toHaveAttribute('type', 'radio');
  });
  test('should deselect previous row when `single` type', () => {
    tableWrapper.findRowSelectionArea(2)!.click();
    expectSelected([items[1]], handleSelectionChange);
  });
  test('should not deselect row when clicked and `single` selection', () => {
    tableWrapper.findRowSelectionArea(1)!.click();
    expect(handleSelectionChange).not.toHaveBeenCalled();
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
      onSelectionChange: handleSelectionChange,
    });
    const secondTableName = getSelectionInput(secondWrapper, 1).getElement().name;
    expect(firstTableName).not.toEqual(secondTableName);
  });
});

describe('Multi selection', () => {
  let tableWrapper: TableWrapper;
  let rerender: (props: Partial<TableProps>) => void;
  const handleSelectionChange = jest.fn();
  beforeEach(() => {
    handleSelectionChange.mockReset();
    const result = renderTable({
      selectionType: 'multi',
      selectedItems: [items[0]],
      onSelectionChange: handleSelectionChange,
      isItemDisabled: item => item === items[1],
    });
    tableWrapper = result.wrapper;
    rerender = result.rerender;
  });
  test('should deselect row when clicked', () => {
    tableWrapper.findRowSelectionArea(1)!.click();
    expectSelected([], handleSelectionChange);
  });
  test('should add clicked item to the selectedItems', () => {
    tableWrapper.findRowSelectionArea(3)!.click();
    expectSelected([items[0], items[2]], handleSelectionChange);
  });
  test('should not fire the even on disabled row clicks', () => {
    tableWrapper.findRowSelectionArea(2)!.click();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });
  test('should not remove items that are not currently visible from the `selectedItems` array', () => {
    rerender({ items: items.slice(1) });
    // select item
    tableWrapper.findRowSelectionArea(2)!.click();
    expectSelected([items[0], items[2]], handleSelectionChange);
    handleSelectionChange.mockReset();
    // select all page
    tableWrapper.findSelectAllTrigger()!.click();
    expectSelected([items[0], items[2]], handleSelectionChange);
    handleSelectionChange.mockReset();
    // deselect item
    rerender({ items: items.slice(1), selectedItems: [items[0], items[2]] });
    tableWrapper.findRowSelectionArea(2)!.click();
    expectSelected([items[0]], handleSelectionChange);
    // deselect all page
    handleSelectionChange.mockReset();
    tableWrapper.findSelectAllTrigger()!.click();
    expectSelected([items[0]], handleSelectionChange);
  });
});

describe('Row click event', () => {
  let onRowClickSpy: jest.Mock;
  let tableWrapper: TableWrapper;
  const handleSelectionChange = jest.fn();
  beforeEach(() => {
    onRowClickSpy = jest.fn();
    const result = renderTable({
      selectionType: 'multi',
      selectedItems: [items[0]],
      onSelectionChange: handleSelectionChange,
      isItemDisabled: item => item === items[1],
      onRowClick: onRowClickSpy,
    });
    tableWrapper = result.wrapper;
  });

  afterEach(() => {
    handleSelectionChange.mockReset();
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

describe('selection component with trackBy', function () {
  let tableWrapper: TableWrapper;
  let rerender: (props: Partial<TableProps>) => void;
  beforeEach(() => {
    const result = renderTable({
      selectedItems: [{ name: items[0].name, id: items[1].id }],
      selectionType: 'multi',
      isItemDisabled: item => item === items[1],
      trackBy: 'name',
    });
    tableWrapper = result.wrapper;
    rerender = result.rerender;
  });
  const getSelectedNames = () =>
    tableWrapper.findSelectedRows()?.map(wrapper => wrapper.find('td:nth-child(3)')?.getElement().textContent);

  test('should select rows when selection attached', function () {
    const selectedNames = getSelectedNames();
    expect(selectedNames).toEqual(['Apples']);
  });

  test('should select items after trackBy change', () => {
    const selectedNames = getSelectedNames();
    expect(selectedNames).toEqual(['Apples']);
    rerender({ trackBy: 'id' });
    const newSelectedNames = getSelectedNames();
    expect(newSelectedNames).toEqual(['Oranges']);
  });

  test('preserves control ids using track by', () => {
    const initialIds = getControlIds(tableWrapper);
    rerender({ items: [{ id: 4, name: 'Peaches' }, items[0], items[1]] });
    const newIds = getControlIds(tableWrapper);
    expect(newIds).toEqual([expect.any(String), initialIds[0], initialIds[1]]);
  });
});
