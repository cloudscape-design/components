// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import Input from '../../../lib/components/input';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn(),
}));

interface Item {
  id: string;
  name: string;
  status: string;
}

const items: Item[] = [
  { id: 'i-001', name: 'Alpha', status: 'running' },
  { id: 'i-002', name: 'Beta', status: 'stopped' },
];

function makeColumns(): TableProps.ColumnDefinition<Item>[] {
  return [
    {
      id: 'id',
      header: 'ID',
      cell: item => item.id,
    },
    {
      id: 'name',
      header: 'Name',
      cell: item => item.name,
      editConfig: {
        ariaLabel: 'Name',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          return <Input value={currentValue ?? item.name} onChange={e => setValue(e.detail.value)} />;
        },
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: item => item.status,
      editConfig: {
        ariaLabel: 'Status',
        editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
          return <Input value={currentValue ?? item.status} onChange={e => setValue(e.detail.value)} />;
        },
      },
    },
  ];
}

const ariaLabels: TableProps.AriaLabels<Item> = {
  tableLabel: 'Test table',
  activateRowEditLabel: item => `Edit row ${item.id}`,
  cancelRowEditLabel: item => `Cancel row ${item.id}`,
  submitRowEditLabel: item => `Save row ${item.id}`,
};

function renderTable(props: Partial<TableProps<Item>> = {}) {
  const { container } = render(
    <Table
      items={items}
      columnDefinitions={makeColumns()}
      trackBy="id"
      ariaLabels={ariaLabels}
      {...props}
    />
  );
  return createWrapper(container).findTable()!;
}

describe('Table row-level editing', () => {
  test('renders an action column with Edit button per row when rowEditingConfig is provided', () => {
    const wrapper = renderTable({ rowEditingConfig: {} });
    // Each data row should have an edit button
    const editButtons = screen.getAllByRole('button', { name: /Edit row/i });
    expect(editButtons).toHaveLength(items.length);
  });

  test('does not render action column when rowEditingConfig is absent', () => {
    renderTable();
    expect(screen.queryByRole('button', { name: /Edit row/i })).toBeNull();
  });

  test('clicking Edit puts all editable cells in the row into edit state', () => {
    const wrapper = renderTable({ rowEditingConfig: {} });
    const editButton = screen.getByRole('button', { name: 'Edit row i-001' });
    act(() => {
      fireEvent.click(editButton);
    });
    // Both editable columns should be in editing state (inputs visible)
    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test('Cancel button reverts row to read state', () => {
    renderTable({ rowEditingConfig: {} });
    const editButton = screen.getByRole('button', { name: 'Edit row i-001' });
    act(() => {
      fireEvent.click(editButton);
    });
    const cancelButton = screen.getByRole('button', { name: 'Cancel row i-001' });
    act(() => {
      fireEvent.click(cancelButton);
    });
    // Edit button should be visible again
    expect(screen.getByRole('button', { name: 'Edit row i-001' })).toBeInTheDocument();
    // No inputs should remain
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  test('Save button calls submitRowEdit with item and changed values', async () => {
    const submitRowEdit = jest.fn().mockResolvedValue(undefined);
    renderTable({ rowEditingConfig: {}, submitRowEdit });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Edit row i-001' }));
    });

    // Change the name input
    const inputs = screen.getAllByRole('textbox');
    act(() => {
      fireEvent.change(inputs[0], { target: { value: 'Alpha Updated' } });
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Save row i-001' }));
    });

    await waitFor(() => {
      expect(submitRowEdit).toHaveBeenCalledTimes(1);
      const [calledItem] = submitRowEdit.mock.calls[0];
      expect(calledItem).toEqual(items[0]);
    });
  });

  test('disabled row shows Edit button in disabled state', () => {
    renderTable({
      rowEditingConfig: {
        disabledReason: item => (item.id === 'i-002' ? 'Locked' : undefined),
      },
    });
    const editButtonBeta = screen.getByRole('button', { name: 'Edit row i-002' });
    expect(editButtonBeta).toBeDisabled();
    const editButtonAlpha = screen.getByRole('button', { name: 'Edit row i-001' });
    expect(editButtonAlpha).not.toBeDisabled();
  });

  test('only one row is in edit state at a time', () => {
    renderTable({ rowEditingConfig: {} });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Edit row i-001' }));
    });
    // Row 1 is editing; row 2 still shows its Edit button
    expect(screen.getByRole('button', { name: 'Edit row i-002' })).toBeInTheDocument();
    // Row 1 should not show its Edit button
    expect(screen.queryByRole('button', { name: 'Edit row i-001' })).toBeNull();
  });

  test('per-cell editing still works when rowEditingConfig is absent', () => {
    const submitEdit = jest.fn();
    renderTable({ submitEdit });
    // No row-edit buttons
    expect(screen.queryByRole('button', { name: /Edit row/i })).toBeNull();
  });
});
