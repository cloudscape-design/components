// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import { ButtonDropdownProps } from '../../../lib/components/button-dropdown/interfaces';
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

const selectionControllerItems: ButtonDropdownProps.Items = [
  { id: 'all', text: 'All' },
  { id: 'none', text: 'None' },
  { id: 'with-desc', text: 'With description', secondaryText: 'A helpful description' },
  { id: 'disabled-item', text: 'Disabled', disabled: true },
];

function renderTable(props: Partial<TableProps>) {
  const allProps: TableProps = {
    items,
    columnDefinitions,
    ...props,
  };
  const { container } = render(<Table {...allProps} />);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper };
}

function findSelectionControllerDropdown(container: ReturnType<typeof renderTable>['wrapper']) {
  // The selection controller is an InternalButtonDropdown rendered inside the header selection cell
  // Use the root element to find it via the ButtonDropdownWrapper selector
  const rootElement = container.getElement().closest('body') ?? container.getElement();
  return createWrapper(rootElement as HTMLElement).findButtonDropdown();
}

describe('Selection Controller - Rendering conditions', () => {
  test('renders selection controller when selectionType is multi and items are provided', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    expect(findSelectionControllerDropdown(wrapper)).toBeTruthy();
  });

  test('does not render selection controller when selectionType is single', () => {
    const { wrapper } = renderTable({
      selectionType: 'single',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    expect(findSelectionControllerDropdown(wrapper)).toBeFalsy();
  });

  test('does not render selection controller when selectionControllerItems is undefined', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
    });
    expect(findSelectionControllerDropdown(wrapper)).toBeFalsy();
  });

  test('does not render selection controller when selectionControllerItems is empty', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems: [],
    });
    expect(findSelectionControllerDropdown(wrapper)).toBeFalsy();
  });

  test('does not render selection controller when selectionType is not set', () => {
    const { wrapper } = renderTable({
      selectionControllerItems,
    });
    expect(findSelectionControllerDropdown(wrapper)).toBeFalsy();
  });
});

describe('Selection Controller - Dropdown menu', () => {
  test('opens dropdown and shows items on click', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    const menuItems = dropdown.findItems();
    expect(menuItems).toHaveLength(4);
  });

  test('displays item text in menu items', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    const menuItems = dropdown.findItems();
    expect(menuItems[0].getElement().textContent).toContain('All');
    expect(menuItems[1].getElement().textContent).toContain('None');
    expect(menuItems[2].getElement().textContent).toContain('With description');
  });

  test('displays item description as secondary text', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    const menuItems = dropdown.findItems();
    expect(menuItems[2].getElement().textContent).toContain('A helpful description');
  });

  test('fires onSelectionControllerItemClick with correct id on item click', () => {
    const onItemClick = jest.fn();
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
      onSelectionControllerItemClick: onItemClick,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    dropdown.findItemById('all')!.click();
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ id: 'all' }) })
    );
  });

  test('fires onSelectionControllerItemClick with correct id for different items', () => {
    const onItemClick = jest.fn();
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
      onSelectionControllerItemClick: onItemClick,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    dropdown.findItemById('none')!.click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ id: 'none' }) })
    );
  });
});

describe('Selection Controller - Disabled items', () => {
  test('does not fire onSelectionControllerItemClick for disabled items', () => {
    const onItemClick = jest.fn();
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
      onSelectionControllerItemClick: onItemClick,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    const disabledItem = dropdown.findItemById('disabled-item');
    expect(disabledItem).toBeTruthy();
    disabledItem!.click();
    expect(onItemClick).not.toHaveBeenCalled();
  });

  test('renders disabled items in disabled state', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    const disabledItems = dropdown.findItems({ disabled: true });
    expect(disabledItems).toHaveLength(1);
  });
});

describe('Selection Controller - Loading state', () => {
  test('disables trigger when loading is true', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
      loading: true,
      loadingText: 'Loading',
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    const trigger = dropdown.findNativeButton();
    expect(trigger.getElement()).toBeDisabled();
  });
});

describe('Selection Controller - Aria labels', () => {
  test('applies selectionControllerLabel as aria-label on trigger', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: jest.fn(),
      selectionControllerItems,
      ariaLabels: {
        selectionGroupLabel: 'group',
        allItemsSelectionLabel: () => 'select all',
        itemSelectionLabel: () => 'select item',
        selectionControllerLabel: 'Selection options',
      },
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    const trigger = dropdown.findNativeButton();
    expect(trigger.getElement()).toHaveAttribute('aria-label', 'Selection options');
  });
});

describe('Selection Controller - Does not modify selectedItems', () => {
  test('selectedItems remains unchanged after selection controller item click', () => {
    const initialSelected = [items[0]];
    const onSelectionChange = jest.fn();
    const onItemClick = jest.fn();
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: initialSelected,
      onSelectionChange,
      selectionControllerItems,
      onSelectionControllerItemClick: onItemClick,
    });
    const dropdown = findSelectionControllerDropdown(wrapper)!;
    dropdown.openDropdown();
    dropdown.findItemById('none')!.click();
    // The table should NOT have called onSelectionChange — only onSelectionControllerItemClick
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});

describe('Selection Controller - Coexistence with select-all checkbox', () => {
  test('select-all checkbox still works when controller is present', () => {
    const onSelectionChange = jest.fn();
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange,
      selectionControllerItems,
    });
    // The select-all trigger should still exist
    const selectAll = wrapper.findSelectAllTrigger();
    expect(selectAll).toBeTruthy();
    // Click the select-all checkbox
    selectAll!.click();
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });
});
