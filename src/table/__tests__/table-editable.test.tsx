// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

import bodyCellStyles from '../../../lib/components/table/body-cell/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn(),
}));

interface Item {
  id: number;
  name: string;
}

const editableColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: (item: Item) => item.id, editConfig: { editingCell: item => item.id } },
  { header: 'name', cell: (item: Item) => item.name, editConfig: { editingCell: item => item.name } },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderTable(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender };
}

test('should show success icon after edit is saved', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);

  // No success icon by default
  expect(wrapper.findBodyCell(1, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).toBe(null);

  // Shows no icon if edit was discarded
  wrapper.findBodyCell(1, 1)!.click();
  wrapper.findEditingCellCancelButton()!.click();
  expect(wrapper.findBodyCell(1, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).toBe(null);

  // Shows success icon if edit completes successfully
  wrapper.findBodyCell(1, 1)!.click();
  wrapper.findEditingCellSaveButton()!.click();
  expect(wrapper.findBodyCell(1, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).not.toBe(null);
});

test('should render table header with icons to indicate editable columns', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);
  const columnHeaders = wrapper.findColumnHeaders();
  columnHeaders.forEach(header => {
    expect(header.getElement().querySelector('svg')).toBeInTheDocument();
  });
});

test('should cancel edit using ref imperative method', async () => {
  const ref = React.createRef<any>();
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={editableColumns}
      items={defaultItems}
      submitEdit={async () => {
        await new Promise((resolve, reject) => setTimeout(reject, 1000));
      }}
      ref={ref}
    />
  );

  const button = wrapper.findEditCellButton(2, 2)!;

  fireEvent.click(button.getElement());
  act(() => {
    ref.current.cancelEdit();
  });
  await waitFor(() => {
    expect(wrapper.find(`[data-inline-editing-active="true"]`)?.getElement()).toBeUndefined();
  });
});

test('should change success icon placement if rows order change', () => {
  const { wrapper, rerender } = renderTable(
    <Table columnDefinitions={editableColumns} items={defaultItems} trackBy="id" />
  );

  wrapper.findBodyCell(1, 1)!.click();
  wrapper.findEditingCellSaveButton()!.click();
  expect(wrapper.findBodyCell(1, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).not.toBe(null);

  rerender(<Table columnDefinitions={editableColumns} items={[...defaultItems].reverse()} trackBy="id" />);
  expect(wrapper.findBodyCell(3, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).not.toBe(null);
});

test('should hide success icon if columns order change', () => {
  const { wrapper, rerender } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);

  wrapper.findBodyCell(1, 1)!.click();
  wrapper.findEditingCellSaveButton()!.click();
  expect(wrapper.findBodyCell(1, 1)!.findByClassName(bodyCellStyles['body-cell-success'])).not.toBe(null);

  rerender(<Table columnDefinitions={[...editableColumns].reverse()} items={defaultItems} trackBy="id" />);
  expect(wrapper.findByClassName(bodyCellStyles['body-cell-success'])).toBe(null);
});
