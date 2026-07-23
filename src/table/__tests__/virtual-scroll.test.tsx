// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/table/styles.css.js';

interface Item {
  id: number;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
];

function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
}

function renderTable(props: Partial<TableProps<Item>>) {
  const { container } = render(
    <Table items={generateItems(500)} columnDefinitions={columnDefinitions} trackBy="id" {...props} />
  );
  return createWrapper(container).findTable()!;
}

describe('Table virtualScroll (v0)', () => {
  test('renders every row when virtualScroll is not set', () => {
    const wrapper = renderTable({});
    expect(wrapper.findRows()).toHaveLength(500);
    expect(wrapper.findByClassName(styles['virtual-scroll-spacer'])).toBeNull();
  });

  test('renders only a windowed subset of rows when virtualScroll is enabled', () => {
    const wrapper = renderTable({ virtualScroll: true });
    // Only a small window (viewport + overscan) is rendered, far fewer than 500.
    expect(wrapper.findRows().length).toBeLessThan(500);
    expect(wrapper.findRows().length).toBeGreaterThan(0);
  });

  test('renders a spacer row to preserve total scroll height', () => {
    const wrapper = renderTable({ virtualScroll: true });
    expect(wrapper.findByClassName(styles['virtual-scroll-spacer'])).not.toBeNull();
  });

  test('accepts an object configuration', () => {
    const wrapper = renderTable({ virtualScroll: { rowHeight: 30, overscan: 2 } });
    expect(wrapper.findRows().length).toBeLessThan(500);
  });
});
