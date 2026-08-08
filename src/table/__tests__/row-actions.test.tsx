// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
  active: boolean;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
];

const items: Item[] = [
  { id: 1, name: 'Alpha', active: true },
  { id: 2, name: 'Beta', active: false },
  { id: 3, name: 'Gamma', active: true },
];

function buildRowActions(
  onItemClick: jest.Mock,
  overrides?: Partial<TableProps.RowActionsConfig<Item>>
): TableProps.RowActionsConfig<Item> {
  return {
    items: () => [
      { id: 'edit', text: 'Edit' },
      { id: 'delete', text: 'Delete' },
    ],
    onItemClick,
    ...overrides,
  };
}

function renderTable(props: Partial<TableProps<Item>> = {}) {
  const { container } = render(
    <Table items={items} columnDefinitions={columnDefinitions} ariaLabels={{ tableLabel: 'Test table' }} {...props} />
  );
  return createWrapper(container).findTable()!;
}

// ──────────────────────────────────────────────────────────────────────────────
// Rendering
// ──────────────────────────────────────────────────────────────────────────────

describe('Table rowActions', () => {
  describe('rendering', () => {
    it('renders no extra column when rowActions is not provided', () => {
      const wrapper = renderTable();
      // 2 defined columns → 2 header cells
      expect(wrapper.findColumnHeaders()).toHaveLength(2);
    });

    it('renders an extra column header when rowActions is provided', () => {
      const wrapper = renderTable({ rowActions: buildRowActions(jest.fn()) });
      // 2 defined columns + 1 actions column
      expect(wrapper.findColumnHeaders()).toHaveLength(3);
    });

    it('renders one actions button per data row', () => {
      const wrapper = renderTable({ rowActions: buildRowActions(jest.fn()) });
      const rows = wrapper.findRows();
      expect(rows).toHaveLength(items.length);
      rows.forEach(row => {
        const buttons = row.findAll('button');
        expect(buttons.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('uses the default aria-label "Actions" when ariaLabel is not specified', () => {
      renderTable({ rowActions: buildRowActions(jest.fn()) });
      const actionButtons = screen.getAllByRole('button', { name: 'Actions' });
      expect(actionButtons).toHaveLength(items.length);
    });

    it('uses a custom aria-label when ariaLabel is specified', () => {
      renderTable({
        rowActions: buildRowActions(jest.fn(), {
          ariaLabel: item => `Actions for ${item.name}`,
        }),
      });
      expect(screen.getByRole('button', { name: 'Actions for Alpha' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actions for Beta' })).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Interaction
  // ──────────────────────────────────────────────────────────────────────────

  describe('interaction', () => {
    it('calls onItemClick with the correct detail and item when an action is clicked', () => {
      const onItemClick = jest.fn();
      renderTable({ rowActions: buildRowActions(onItemClick) });

      // Open the dropdown for the first row
      const [firstRowButton] = screen.getAllByRole('button', { name: 'Actions' });
      act(() => {
        fireEvent.click(firstRowButton);
      });

      // Click "Edit"
      const editOption = screen.getByRole('menuitem', { name: 'Edit' });
      act(() => {
        fireEvent.click(editOption);
      });

      expect(onItemClick).toHaveBeenCalledTimes(1);
      const [detail, item] = onItemClick.mock.calls[0];
      expect(detail.id).toBe('edit');
      expect(item).toEqual(items[0]);
    });

    it('calls onItemClick with the item corresponding to the clicked row', () => {
      const onItemClick = jest.fn();
      renderTable({ rowActions: buildRowActions(onItemClick) });

      // Open the dropdown for the SECOND row
      const actionButtons = screen.getAllByRole('button', { name: 'Actions' });
      act(() => {
        fireEvent.click(actionButtons[1]);
      });

      const deleteOption = screen.getByRole('menuitem', { name: 'Delete' });
      act(() => {
        fireEvent.click(deleteOption);
      });

      expect(onItemClick).toHaveBeenCalledTimes(1);
      const [detail, item] = onItemClick.mock.calls[0];
      expect(detail.id).toBe('delete');
      expect(item).toEqual(items[1]);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Disabled state
  // ──────────────────────────────────────────────────────────────────────────

  describe('disabled', () => {
    it('disables the trigger button for rows where disabled() returns true', () => {
      renderTable({
        rowActions: buildRowActions(jest.fn(), {
          disabled: item => !item.active,
        }),
      });

      const actionButtons = screen.getAllByRole('button', { name: 'Actions' });
      // items[0] active=true → enabled
      expect(actionButtons[0]).not.toBeDisabled();
      // items[1] active=false → disabled
      expect(actionButtons[1]).toBeDisabled();
      // items[2] active=true → enabled
      expect(actionButtons[2]).not.toBeDisabled();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Empty items list
  // ──────────────────────────────────────────────────────────────────────────

  describe('empty items list', () => {
    it('disables the trigger when items() returns an empty array', () => {
      renderTable({
        rowActions: buildRowActions(jest.fn(), {
          items: () => [],
        }),
      });

      const actionButtons = screen.getAllByRole('button', { name: 'Actions' });
      actionButtons.forEach(btn => expect(btn).toBeDisabled());
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Column count with selection
  // ──────────────────────────────────────────────────────────────────────────

  describe('column count with selectionType', () => {
    it('renders data columns + actions column header alongside selection', () => {
      const wrapper = renderTable({
        rowActions: buildRowActions(jest.fn()),
        selectionType: 'multi',
      });
      // selection(1) + 2 data columns + 1 actions column = 4 header cells
      expect(wrapper.findColumnHeaders()).toHaveLength(4);
    });

    it('renders actions buttons for every row even with multi selection', () => {
      renderTable({
        rowActions: buildRowActions(jest.fn()),
        selectionType: 'multi',
      });
      const actionButtons = screen.getAllByRole('button', { name: 'Actions' });
      expect(actionButtons).toHaveLength(items.length);
    });
  });
});
