// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import { COLUMN_DEFS, FLAT_DISPLAY, GROUP_DEFS, ITEMS } from './column-grouping-fixtures';

function renderTable(props: Partial<TableProps<(typeof ITEMS)[0]>> = {}) {
  const { container } = render(
    <Table
      items={ITEMS}
      columnDefinitions={COLUMN_DEFS}
      groupDefinitions={GROUP_DEFS}
      columnDisplay={FLAT_DISPLAY}
      {...props}
    />
  );
  return createWrapper(container).findTable()!;
}

describe('Table with column grouping', () => {
  test('renders multiple header rows with correct group text, colspan, and scope', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows.length).toBeGreaterThan(1);

    const ths = thead.findAll('th');
    const texts = ths.map(th => th.getElement().textContent?.trim());
    expect(texts).toContain('Performance');
    expect(texts).toContain('Configuration');

    const perfTh = ths.find(th => th.getElement().textContent?.trim() === 'Performance')!;
    expect(perfTh.getElement().getAttribute('colspan')).toBe('3'); // cpu+memory+networkIn
    expect(perfTh.getElement().getAttribute('scope')).toBe('colgroup');

    const configTh = ths.find(th => th.getElement().textContent?.trim() === 'Configuration')!;
    expect(configTh.getElement().getAttribute('colspan')).toBe('2'); // type+az
  });

  test('leaf headers carry data-column-group-id; ungrouped headers do not', () => {
    const wrapper = renderTable();
    // Search across all header rows — ungrouped columns now span rows from row 0
    const allThs = wrapper.find('thead')!.findAll('th');

    const cpuTh = allThs.find(th => th.getElement().textContent?.trim() === 'CPU');
    expect(cpuTh?.getElement().getAttribute('data-column-group-id')).toBe('performance');

    const idTh = allThs.find(th => th.getElement().textContent?.trim() === 'ID');
    expect(idTh?.getElement().getAttribute('data-column-group-id')).toBeNull();
  });

  test('aria-rowindex on each header row equals its 1-based position', () => {
    const wrapper = renderTable();
    const rows = wrapper.find('thead')!.findAll('tr');
    rows.forEach((row, i) => {
      expect(row.getElement().getAttribute('aria-rowindex')).toBe(`${i + 1}`);
    });
  });

  test('hidden columns are absent from the DOM', () => {
    const wrapper = renderTable({
      columnDisplay: [
        { id: 'id', visible: true },
        { id: 'name', visible: true },
        {
          type: 'group',
          id: 'performance',
          visible: true,
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: false },
            { id: 'networkIn', visible: false },
          ],
        },
        {
          type: 'group',
          id: 'config',
          visible: true,
          children: [
            { id: 'type', visible: false },
            { id: 'az', visible: false },
          ],
        },
        { type: 'group', visible: true, id: 'pricing', children: [{ id: 'cost', visible: false }] },
      ],
    });
    const texts = wrapper
      .find('thead')!
      .findAll('th')
      .map(th => th.getElement().textContent?.trim());
    expect(texts).toContain('CPU');
    expect(texts).not.toContain('Memory');
    expect(texts).not.toContain('Cost');
  });

  test('no groupDefinitions → single header row', () => {
    const wrapper = renderTable({ groupDefinitions: undefined, columnDisplay: undefined });
    expect(wrapper.find('thead')!.findAll('tr')).toHaveLength(1);
  });

  test('selectionType: checkbox present in last header row', () => {
    const wrapper = renderTable({
      selectionType: 'multi',
      selectedItems: [],
      onSelectionChange: () => {},
      ariaLabels: {
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: () => 'Select all',
        itemSelectionLabel: (_, item) => `Select ${item.name}`,
      },
    });
    const rows = wrapper.find('thead')!.findAll('tr');
    expect(rows.length).toBeGreaterThan(1);
    expect(wrapper.findSelectAllTrigger()).not.toBeNull();
  });

  test('resizableColumns: multiple header rows and colgroup still present', () => {
    const { container } = render(
      <Table
        items={ITEMS}
        columnDefinitions={COLUMN_DEFS}
        groupDefinitions={GROUP_DEFS}
        columnDisplay={FLAT_DISPLAY}
        resizableColumns={true}
      />
    );
    const wrapper = createWrapper(container).findTable()!;
    expect(wrapper.find('thead')!.findAll('tr').length).toBeGreaterThan(1);
    expect(container.querySelector('colgroup')).toBeTruthy();
  });
});
