// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';

interface Item {
  id: number;
  name: string;
}

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

const editableColumns: TableProps.ColumnDefinition<Item, string | number>[] = [
  {
    header: 'id',
    cell: (item: Item, { isEditing }) => {
      if (isEditing) {
        return <input type="number" value={item.id} readOnly={true} data-testid={`id-editing-${item.id}`} />;
      }
      return item.id;
    },
    editConfig: {
      ariaLabel: 'Edit id',
      errorIconAriaLabel: 'Error',
      editIconAriaLabel: 'Edit',
    },
  },
  {
    header: 'name',
    cell: (item: Item, { isEditing }) => {
      if (isEditing) {
        return <input type="number" value={item.name} readOnly={true} data-testid={`name-editing-${item.name}`} />;
      }
      return item.name;
    },
    editConfig: {
      ariaLabel: 'Edit id',
      errorIconAriaLabel: 'Error',
      editIconAriaLabel: 'Edit',
    },
  },
];

function renderTable(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

describe('Editable Table TestUtils', () => {
  test('should find the correct active cell', () => {
    const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);
    const cellId0 = wrapper.findBodyCell(1, 1)!.getElement()!;
    const cellName0 = wrapper.findBodyCell(1, 2)!.getElement()!;
    fireEvent.click(cellId0);
    expect(wrapper.findEditingCell()!.getElement()!).toBe(cellId0);
    fireEvent.click(cellName0);
    expect(wrapper.findEditingCell()!.getElement()!).toBe(cellName0);
  });

  test('should find the correct edit controls', () => {
    const { wrapper, getByTestId } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);
    const cellId0 = wrapper.findBodyCell(1, 1)!.getElement()!;
    fireEvent.click(cellId0);
    const buttons = getByTestId('id-editing-1').closest('form')!.querySelectorAll('button')!;
    expect(wrapper.findEditingCellCancelButton()!.getElement()!).toBe(buttons[0]);
    expect(wrapper.findEditingCellSaveButton()!.getElement()!).toBe(buttons[1]);
  });
});
