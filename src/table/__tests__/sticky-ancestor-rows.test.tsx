// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import {
  DEFAULT_STICKY_ANCESTOR_ROW_HEIGHT,
  getStickyAncestorRowOffset,
} from '../../../lib/components/table/sticky-ancestor-rows';
import createWrapper from '../../../lib/components/test-utils/dom';

import tableStyles from '../../../lib/components/table/styles.css.js';

describe('getStickyAncestorRowOffset', () => {
  test('top-level rows sit flush against the header offset', () => {
    expect(getStickyAncestorRowOffset({ level: 1, headerOffset: 50, rowHeight: 40 })).toBe(50);
  });

  test('each deeper level stacks one row height below the previous', () => {
    expect(getStickyAncestorRowOffset({ level: 2, headerOffset: 50, rowHeight: 40 })).toBe(90);
    expect(getStickyAncestorRowOffset({ level: 3, headerOffset: 50, rowHeight: 40 })).toBe(130);
  });

  test('normalizes non-positive / fractional levels to level 1', () => {
    expect(getStickyAncestorRowOffset({ level: 0, headerOffset: 10, rowHeight: 40 })).toBe(10);
    expect(getStickyAncestorRowOffset({ level: -5, headerOffset: 10, rowHeight: 40 })).toBe(10);
    expect(getStickyAncestorRowOffset({ level: 1.9, headerOffset: 10, rowHeight: 40 })).toBe(10);
  });

  test('clamps negative row height to zero', () => {
    expect(getStickyAncestorRowOffset({ level: 3, headerOffset: 10, rowHeight: -40 })).toBe(10);
  });

  test('exposes a sane default row height', () => {
    expect(DEFAULT_STICKY_ANCESTOR_ROW_HEIGHT).toBeGreaterThan(0);
  });
});

interface Item {
  name: string;
  children?: Item[];
}

const items: Item[] = [
  { name: 'Parent A', children: [{ name: 'Child A1' }, { name: 'Child A2' }] },
  { name: 'Parent B', children: [{ name: 'Child B1' }] },
];

function renderTable(stickyAncestorRows: boolean) {
  const expandableRows: TableProps.ExpandableRows<Item> = {
    getItemChildren: item => item.children ?? [],
    isItemExpandable: item => !!item.children,
    expandedItems: [items[0]],
    onExpandableItemToggle: () => {},
    stickyAncestorRows,
  };
  const { container } = render(
    <Table
      stickyHeader={true}
      columnDefinitions={[{ id: 'name', header: 'Name', cell: item => item.name }]}
      items={items}
      trackBy="name"
      expandableRows={expandableRows}
    />
  );
  return createWrapper(container).findTable()!;
}

describe('stickyAncestorRows rendering', () => {
  test('applies the sticky-ancestor-row class to expanded parent rows', () => {
    const table = renderTable(true);
    // Row 1 = expanded "Parent A".
    const parentRow = table.findRows()[0].getElement();
    expect(parentRow.className).toContain(tableStyles['sticky-ancestor-row']);
  });

  test('does not apply the sticky class to leaf/child rows', () => {
    const table = renderTable(true);
    // Row 2 = "Child A1" (leaf, not expanded).
    const childRow = table.findRows()[1].getElement();
    expect(childRow.className).not.toContain(tableStyles['sticky-ancestor-row']);
  });

  test('does not apply the sticky class when the feature is disabled', () => {
    const table = renderTable(false);
    const parentRow = table.findRows()[0].getElement();
    expect(parentRow.className).not.toContain(tableStyles['sticky-ancestor-row']);
  });
});
