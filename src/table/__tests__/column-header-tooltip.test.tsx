// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

import headerCellStyles from '../../../lib/components/table/header-cell/styles.css.js';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const items: TestItem[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

function renderTable(overrides: Partial<React.ComponentProps<typeof Table<TestItem>>> = {}) {
  const defaultColumnDefinitions: TableProps.ColumnDefinition<TestItem>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: (item: TestItem) => item.id,
      tooltip: 'The unique identifier.',
    },
    {
      id: 'name',
      header: 'Name',
      cell: (item: TestItem) => item.name,
      tooltip: <span data-testid="rich-tooltip">Rich tooltip content</span>,
    },
    {
      id: 'value',
      header: 'Value',
      cell: (item: TestItem) => item.value,
      // No tooltip
    },
  ];
  const { container } = render(
    <Table<TestItem>
      items={items}
      columnDefinitions={defaultColumnDefinitions}
      ariaLabels={{ tableLabel: 'Test table' }}
      {...overrides}
    />
  );
  return createWrapper(container).findTable()!;
}

describe('Table column header tooltip', () => {
  describe('rendering', () => {
    it('renders an info button when tooltip is provided', () => {
      const wrapper = renderTable();
      expect(wrapper.findColumnHeaderInfo(1)).not.toBeNull();
      expect(wrapper.findColumnHeaderInfo(2)).not.toBeNull();
    });

    it('does not render an info button when tooltip is not provided', () => {
      const wrapper = renderTable();
      expect(wrapper.findColumnHeaderInfo(3)).toBeNull();
    });

    it('info button has accessible label derived from string header', () => {
      const wrapper = renderTable();
      const button = wrapper.findColumnHeaderInfo(1)!.getElement();
      expect(button).toHaveAttribute('aria-label', 'ID - info');
    });

    it('info button has generic accessible label when header is not a string', () => {
      const colDefs: TableProps.ColumnDefinition<TestItem>[] = [
        {
          id: 'id',
          header: <span>Custom header</span>,
          cell: (item: TestItem) => item.id,
          tooltip: 'Tooltip text',
        },
      ];
      const wrapper = renderTable({ columnDefinitions: colDefs });
      const button = wrapper.findColumnHeaderInfo(1)!.getElement();
      expect(button).toHaveAttribute('aria-label', 'info');
    });

    it('info button has type="button" to avoid form submission', () => {
      const wrapper = renderTable();
      const button = wrapper.findColumnHeaderInfo(1)!.getElement();
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('popover interaction', () => {
    it('shows tooltip content when info button is clicked', () => {
      const wrapper = renderTable();
      const infoButton = wrapper.findColumnHeaderInfo(1)!.getElement();
      fireEvent.click(infoButton);
      expect(screen.getByText('The unique identifier.')).toBeInTheDocument();
    });

    it('supports rich ReactNode tooltip content', () => {
      const wrapper = renderTable();
      const infoButton = wrapper.findColumnHeaderInfo(2)!.getElement();
      fireEvent.click(infoButton);
      expect(screen.getByTestId('rich-tooltip')).toBeInTheDocument();
    });

    it('hides tooltip content before the button is clicked', () => {
      renderTable();
      expect(screen.queryByText('The unique identifier.')).not.toBeInTheDocument();
    });
  });

  describe('coexistence with sorting', () => {
    it('renders info button alongside sortable column', () => {
      const colDefs: TableProps.ColumnDefinition<TestItem>[] = [
        {
          id: 'id',
          header: 'ID',
          cell: (item: TestItem) => item.id,
          sortingField: 'id',
          tooltip: 'Sortable column tooltip',
        },
      ];
      const wrapper = renderTable({ columnDefinitions: colDefs });
      expect(wrapper.findColumnHeaderInfo(1)).not.toBeNull();
      expect(wrapper.findColumnSortingArea(1)).not.toBeNull();
    });

    it('clicking sort area does not open tooltip', () => {
      const colDefs2: TableProps.ColumnDefinition<TestItem>[] = [
        {
          id: 'id',
          header: 'ID',
          cell: (item: TestItem) => item.id,
          sortingField: 'id',
          tooltip: 'Sortable column tooltip',
        },
      ];
      const wrapper = renderTable({ columnDefinitions: colDefs2 });
      const sortArea = wrapper.findColumnSortingArea(1)!.getElement();
      fireEvent.click(sortArea);
      expect(screen.queryByText('Sortable column tooltip')).not.toBeInTheDocument();
    });
  });

  describe('coexistence with resizable columns', () => {
    it('renders info button when resizableColumns is true', () => {
      const wrapper = renderTable({ resizableColumns: true });
      expect(wrapper.findColumnHeaderInfo(1)).not.toBeNull();
      expect(wrapper.findColumnResizer(1)).not.toBeNull();
    });
  });

  describe('coexistence with inline editing', () => {
    it('renders info button alongside editable column', () => {
      const editColDefs: TableProps.ColumnDefinition<TestItem>[] = [
        {
          id: 'id',
          header: 'ID',
          cell: (item: TestItem) => item.id,
          tooltip: 'Editable column tooltip',
          editConfig: {
            ariaLabel: 'Edit ID',
            editingCell: (item: TestItem, { currentValue, setValue }: TableProps.CellContext<string>) => (
              <input value={currentValue ?? item.id} onChange={e => setValue(e.target.value)} />
            ),
          },
        },
      ];
      const wrapper = renderTable({ columnDefinitions: editColDefs, submitEdit: async () => {} });
      expect(wrapper.findColumnHeaderInfo(1)).not.toBeNull();
    });
  });

  describe('CSS classes', () => {
    it('info container has the expected CSS class', () => {
      const wrapper = renderTable();
      const infoContainer = wrapper
        .findColumnHeaderInfo(1)!
        .getElement()
        .closest(`.${headerCellStyles['header-cell-info']}`);
      expect(infoContainer).toBeInTheDocument();
    });
  });
});
