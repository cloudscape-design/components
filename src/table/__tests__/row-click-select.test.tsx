// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
  { id: 3, name: 'Lemonade' },
];

const ariaLabels: TableProps['ariaLabels'] = {
  selectionGroupLabel: 'Items selection',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} selected`,
  itemSelectionLabel: (_, item) => `select ${item.name}`,
};

function renderTable(tableProps: Partial<TableProps<Item>>) {
  const onSelectionChange = jest.fn();
  const props: TableProps<Item> = {
    items,
    columnDefinitions,
    ariaLabels,
    onSelectionChange,
    ...tableProps,
  };
  const { container } = render(<Table {...props} />);
  return { wrapper: createWrapper(container).findTable()!, onSelectionChange };
}

describe('clickToSelect', () => {
  describe('multi-select', () => {
    test('clicking a row selects it', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedItems: [items[0]] } })
      );
    });

    test('clicking a selected row deselects it', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [items[0]],
        clickToSelect: true,
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedItems: [] } }));
    });

    test('clicking multiple rows accumulates selection', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [items[0]],
        clickToSelect: true,
      });
      wrapper.findRows()[1].click();
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedItems: [items[0], items[1]] } })
      );
    });
  });

  describe('single-select', () => {
    test('clicking a row selects it', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'single',
        selectedItems: [],
        clickToSelect: true,
      });
      wrapper.findRows()[1].click();
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedItems: [items[1]] } })
      );
    });

    test('clicking an already-selected row does not fire onSelectionChange again', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'single',
        selectedItems: [items[0]],
        clickToSelect: true,
      });
      // Single-select: re-clicking selected item is a no-op (use-selection.ts guards this)
      wrapper.findRows()[0].click();
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled items', () => {
    test('clicking a disabled row does not fire onSelectionChange', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
        isItemDisabled: item => item.id === 1,
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    test('clicking an enabled row still works when some rows are disabled', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
        isItemDisabled: item => item.id === 1,
      });
      wrapper.findRows()[1].click();
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedItems: [items[1]] } })
      );
    });
  });

  describe('no-op when disabled or not applicable', () => {
    test('does not fire when clickToSelect is false', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: false,
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    test('does not fire when selectionType is not set', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectedItems: [],
        clickToSelect: true,
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    test('does not fire when clickToSelect is not set', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
      });
      wrapper.findRows()[0].click();
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('interactive cell exceptions', () => {
    test('clicking the selection control checkbox does not double-fire', () => {
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
      });
      // Click the selection control (checkbox) directly — should still work via checkbox change handler,
      // but the row-click handler should NOT also fire selection
      const selectionInput = wrapper.findRowSelectionArea(1)?.find('input')?.getElement();
      if (selectionInput) {
        selectionInput.click();
        // onSelectionChange fires once (from the checkbox onChange), not twice
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('cursor style', () => {
    test('adds row-clickable class when clickToSelect and selectionType are set', () => {
      const { wrapper } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
      });
      const rowEl = wrapper.findRows()[0].getElement();
      expect(rowEl.className).toMatch(/row-clickable/);
    });

    test('does not add row-clickable class when clickToSelect is false', () => {
      const { wrapper } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: false,
      });
      const rowEl = wrapper.findRows()[0].getElement();
      expect(rowEl.className).not.toMatch(/row-clickable/);
    });

    test('does not add row-clickable class when selectionType is not set', () => {
      const { wrapper } = renderTable({
        selectedItems: [],
        clickToSelect: true,
      });
      const rowEl = wrapper.findRows()[0].getElement();
      expect(rowEl.className).not.toMatch(/row-clickable/);
    });
  });

  describe('coexistence with onRowClick', () => {
    test('clickToSelect and onRowClick can be used together', () => {
      const onRowClick = jest.fn();
      const { wrapper, onSelectionChange } = renderTable({
        selectionType: 'multi',
        selectedItems: [],
        clickToSelect: true,
        onRowClick,
      });
      wrapper.findRows()[0].click();
      // Both handlers fire
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });
  });
});
