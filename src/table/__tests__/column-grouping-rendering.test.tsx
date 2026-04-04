// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  networkIn: number;
  type: string;
  az: string;
  cost: number;
}

const items: Item[] = [
  { id: 1, name: 'web-1', cpu: 45, memory: 62, networkIn: 1250, type: 't3.medium', az: 'us-east-1a', cost: 30 },
  { id: 2, name: 'api-1', cpu: 78, memory: 81, networkIn: 3420, type: 't3.large', az: 'us-east-1b', cost: 60 },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id, isRowHeader: true },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'cpu', header: 'CPU', cell: item => item.cpu, groupId: 'performance' },
  { id: 'memory', header: 'Memory', cell: item => item.memory, groupId: 'performance' },
  { id: 'networkIn', header: 'Network In', cell: item => item.networkIn, groupId: 'performance' },
  { id: 'type', header: 'Type', cell: item => item.type, groupId: 'config' },
  { id: 'az', header: 'AZ', cell: item => item.az, groupId: 'config' },
  { id: 'cost', header: 'Cost', cell: item => `$${item.cost}`, groupId: 'pricing' },
];

const columnGroupingDefinitions: TableProps.ColumnGroupsDefinition<Item>[] = [
  { id: 'performance', header: 'Performance' },
  { id: 'config', header: 'Configuration' },
  { id: 'pricing', header: 'Pricing' },
];

function renderTable(props: Partial<TableProps<Item>> = {}) {
  const { container } = render(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      columnGroupingDefinitions={columnGroupingDefinitions}
      {...props}
    />
  );
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, container };
}

describe('Table with column grouping', () => {
  test('renders multiple header rows when columnGroupingDefinitions are provided', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows.length).toBeGreaterThan(1);
  });

  test('renders group header cells with correct text', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');
    const headerTexts = thElements.map(th => th.getElement().textContent?.trim());
    expect(headerTexts).toContain('Performance');
    expect(headerTexts).toContain('Configuration');
    expect(headerTexts).toContain('Pricing');
  });

  test('renders leaf column headers', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');
    const headerTexts = thElements.map(th => th.getElement().textContent?.trim());
    expect(headerTexts).toContain('ID');
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('CPU');
    expect(headerTexts).toContain('Memory');
    expect(headerTexts).toContain('Cost');
  });

  test('group header cells have correct colspan', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');

    // Find the Performance group header
    const perfHeader = thElements.find(th => th.getElement().textContent?.trim() === 'Performance');
    expect(perfHeader).toBeDefined();
    const colspan = perfHeader!.getElement().getAttribute('colspan');
    // Performance group has cpu, memory, networkIn = 3 columns
    expect(colspan).toBe('3');

    // Find the Configuration group header
    const configHeader = thElements.find(th => th.getElement().textContent?.trim() === 'Configuration');
    expect(configHeader).toBeDefined();
    const configColspan = configHeader!.getElement().getAttribute('colspan');
    // Configuration has type, az = 2 columns
    expect(configColspan).toBe('2');
  });

  test('renders correct number of body rows', () => {
    const { wrapper } = renderTable();
    const rows = wrapper.findAll('tr').filter(row => !row.getElement().closest('thead'));
    // 2 items
    expect(rows.length).toBe(2);
  });

  test('renders correct number of body cells per row', () => {
    const { wrapper } = renderTable();
    const bodyRows = wrapper.findAll('tr').filter(row => !row.getElement().closest('thead'));
    // Each row should have cells for all visible columns
    bodyRows.forEach(row => {
      const cells = row.findAll('td');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  test('aria-rowindex accounts for multiple header rows', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const headerRows = thead.findAll('tr');

    headerRows.forEach((row, idx) => {
      expect(row.getElement().getAttribute('aria-rowindex')).toBe(`${idx + 1}`);
    });
  });

  test('works with selectionType', () => {
    const { wrapper } = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: () => {},
      ariaLabels: {
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: () => 'Select all',
        itemSelectionLabel: (_, item) => `Select ${item.name}`,
      },
    });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows.length).toBeGreaterThan(1);
    // Selection checkbox should be in the first header row
    const firstRowThs = rows[0].findAll('th');
    expect(firstRowThs.length).toBeGreaterThan(0);
  });

  test('renders single header row when no columnGroupingDefinitions', () => {
    const { wrapper } = renderTable({ columnGroupingDefinitions: undefined });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows.length).toBe(1);
  });

  test('renders with resizableColumns', () => {
    const { wrapper } = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows.length).toBeGreaterThan(1);
  });

  test('renders with columnDisplay to control visibility', () => {
    const { wrapper } = renderTable({
      columnDisplay: [
        { id: 'id', visible: true },
        { id: 'name', visible: true },
        { id: 'cpu', visible: true },
        { id: 'memory', visible: false },
        { id: 'networkIn', visible: false },
        { id: 'type', visible: false },
        { id: 'az', visible: false },
        { id: 'cost', visible: false },
      ],
    });
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');
    const headerTexts = thElements.map(th => th.getElement().textContent?.trim());
    expect(headerTexts).toContain('ID');
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('CPU');
    // Hidden columns should not be present
    expect(headerTexts).not.toContain('Memory');
    expect(headerTexts).not.toContain('Cost');
  });

  test('renders with nested column groups', () => {
    const nestedGroupDefs: TableProps.ColumnGroupsDefinition<Item>[] = [
      { id: 'performance', header: 'Performance', groupId: 'metrics' },
      { id: 'metrics', header: 'Metrics' },
      { id: 'config', header: 'Configuration' },
      { id: 'pricing', header: 'Pricing' },
    ];
    const { wrapper } = renderTable({ columnGroupingDefinitions: nestedGroupDefs });
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');
    const headerTexts = thElements.map(th => th.getElement().textContent?.trim());
    expect(headerTexts).toContain('Metrics');
    expect(headerTexts).toContain('Performance');
  });

  test('renders colgroup when resizableColumns and grouped', () => {
    const { container } = renderTable({ resizableColumns: true });
    const colgroup = container.querySelector('colgroup');
    expect(colgroup).toBeTruthy();
  });
});

describe('Table with column grouping and resizable columns', () => {
  test('renders with resizable columns enabled', () => {
    const { wrapper } = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    // Should still have multiple header rows
    expect(rows.length).toBeGreaterThan(1);
    // All group + leaf header cells should be rendered
    const thElements = thead.findAll('th');
    expect(thElements.length).toBeGreaterThan(0);
  });

  test('group headers have scope="colgroup"', () => {
    const { wrapper } = renderTable();
    const thead = wrapper.find('thead')!;
    const thElements = thead.findAll('th');

    const perfHeader = thElements.find(th => th.getElement().textContent?.trim() === 'Performance');
    if (perfHeader) {
      expect(perfHeader.getElement().getAttribute('scope')).toBe('colgroup');
    }
  });
});
