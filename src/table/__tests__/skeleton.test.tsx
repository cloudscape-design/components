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

    test('renders data rows before skeleton rows', () => {
      const wrapper = renderTable({ items: defaultItems, loading: true, skeleton: { totalRows: 6 } });
      const lastDataRow = wrapper.findTable()!.findRows().slice(-1)[0].getElement();
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(skeletonRows).toHaveLength(3);
      for (const skeletonRow of skeletonRows) {
        expect(lastDataRow.compareDocumentPosition(skeletonRow.getElement())).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      }
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

  describe('automatic rows', () => {
    const originalClientHeight = document.documentElement.clientHeight;

    beforeEach(() => {
      Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 400 });
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this === document.body) {
          return { top: 0, bottom: 400, height: 400 } as DOMRect;
        }
        if (this.matches('tr[aria-hidden="true"]')) {
          return { top: 200, bottom: 240, height: 40 } as DOMRect;
        }
        if (this.querySelector('tbody')) {
          return { top: 0, bottom: 300, height: 300 } as DOMRect;
        }
        return { top: 0, bottom: 0, height: 0 } as DOMRect;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Object.defineProperty(document.documentElement, 'clientHeight', {
        configurable: true,
        value: originalClientHeight,
      });
    });

    test('fills the viewport automatically', () => {
      const wrapper = renderTable({ items: [], loading: true, skeleton: { totalRows: 'auto' } });

      expect(wrapper.findAll('tr[aria-hidden="true"]')).toHaveLength(3);
    });

    test('removes rows that overflow the viewport', () => {
      const originalOverflowY = document.body.style.overflowY;
      const originalClientHeight = Object.getOwnPropertyDescriptor(document.body, 'clientHeight');
      const originalScrollHeight = Object.getOwnPropertyDescriptor(document.body, 'scrollHeight');
      document.body.style.overflowY = 'auto';
      Object.defineProperty(document.body, 'clientHeight', { configurable: true, value: 400 });
      Object.defineProperty(document.body, 'scrollHeight', {
        configurable: true,
        get: () => (document.querySelectorAll('tr[aria-hidden="true"]').length > 2 ? 401 : 400),
      });

      try {
        const wrapper = renderTable({ items: [], loading: true, skeleton: { totalRows: 'auto' } });
        expect(wrapper.findAll('tr[aria-hidden="true"]')).toHaveLength(2);
      } finally {
        document.body.style.overflowY = originalOverflowY;
        if (originalClientHeight) {
          Object.defineProperty(document.body, 'clientHeight', originalClientHeight);
        } else {
          delete (document.body as { clientHeight?: number }).clientHeight;
        }
        if (originalScrollHeight) {
          Object.defineProperty(document.body, 'scrollHeight', originalScrollHeight);
        } else {
          delete (document.body as { scrollHeight?: number }).scrollHeight;
        }
      }
    });

    test('respects maxAutoRows', () => {
      const wrapper = renderTable({ items: [], loading: true, skeleton: { totalRows: 'auto', maxAutoRows: 2 } });

      expect(wrapper.findAll('tr[aria-hidden="true"]')).toHaveLength(2);
    });

    test('adds automatic skeleton rows after partial data', () => {
      const wrapper = renderTable({
        items: defaultItems,
        loading: true,
        skeleton: { totalRows: 'auto', maxAutoRows: 2 },
      });

      expect(wrapper.findAll('tr[aria-hidden="true"]')).toHaveLength(2);
    });

    test('renders data rows before automatic skeleton rows', () => {
      const wrapper = renderTable({
        items: defaultItems,
        loading: true,
        skeleton: { totalRows: 'auto', maxAutoRows: 2 },
      });

      const lastDataRow = wrapper.findTable()!.findRows().slice(-1)[0].getElement();
      const skeletonRows = wrapper.findAll('tr[aria-hidden="true"]');
      expect(skeletonRows.length).toBeGreaterThan(0);
      for (const skeletonRow of skeletonRows) {
        expect(lastDataRow.compareDocumentPosition(skeletonRow.getElement())).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      }
    });
  });
});
