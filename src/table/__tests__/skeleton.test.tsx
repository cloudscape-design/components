// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id },
  { header: 'name', cell: item => item.name },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderTable(props?: Partial<TableProps>) {
  const { container } = render(<Table items={defaultItems} columnDefinitions={defaultColumns} {...props} />);
  const wrapper = createWrapper(container);
  return wrapper;
}

describe('Table skeleton loading', () => {
  describe('initial load (no items)', () => {
    test('renders skeleton rows with skeleton components when loading', () => {
      const wrapper = renderTable({ items: [], loading: true, skeleton: { totalRows: 5 } });
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(skeletonRows).toHaveLength(5);
      expect(wrapper.findAllSkeletons()).toHaveLength(10); // 2 columns × 5 rows
    });

    test('does not render skeleton rows when skeleton prop is not provided', () => {
      const wrapper = renderTable({ items: [], loading: true });
      const rows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(rows).toHaveLength(0);
    });

    test('does not render skeleton rows when not loading', () => {
      const wrapper = renderTable({ items: [], loading: false, skeleton: { totalRows: 5 } });
      const rows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(rows).toHaveLength(0);
    });

    test('renders a screen-reader-only loading announcement', () => {
      const wrapper = renderTable({
        items: [],
        loading: true,
        loadingText: 'Loading resources',
        skeleton: { totalRows: 3 },
      });
      expect(wrapper.getElement().textContent).toContain('Loading resources');
    });
  });

  describe('progressive loading (partial items)', () => {
    test('renders data rows and skeleton rows for remaining items', () => {
      const wrapper = renderTable({ items: defaultItems, loading: true, skeleton: { totalRows: 6 } });
      const table = wrapper.findTable()!;
      const allRows = table.findRows();
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      // findRows() returns only data rows, not skeleton rows
      expect(allRows).toHaveLength(3);
      expect(skeletonRows).toHaveLength(3);
      expect(wrapper.findAllSkeletons()).toHaveLength(6); // 2 columns × 3 rows
      expect(table.findBodyCell(1, 2)!.getElement().textContent).toBe('Apples');
    });

    test('does not render skeleton rows when items fill totalRows', () => {
      const wrapper = renderTable({ items: defaultItems, loading: true, skeleton: { totalRows: 3 } });
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(skeletonRows).toHaveLength(0);
    });

    test('does not render skeleton rows when loading is false', () => {
      const wrapper = renderTable({ items: defaultItems, loading: false, skeleton: { totalRows: 6 } });
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(skeletonRows).toHaveLength(0);
    });

    test('renders a screen-reader-only loading announcement', () => {
      const wrapper = renderTable({
        items: defaultItems,
        loading: true,
        loadingText: 'Loading more',
        skeleton: { totalRows: 6 },
      });
      expect(wrapper.getElement().textContent).toContain('Loading more');
    });
  });
});
