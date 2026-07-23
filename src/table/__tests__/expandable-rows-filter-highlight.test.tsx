// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

interface Instance {
  name: string;
  children?: Instance[];
}

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [{ header: 'name', cell: item => item.name }];

const nestedItems: Instance[] = [
  {
    name: 'Root-1',
    children: [
      { name: 'Nested-1.1', children: [] },
      { name: 'Nested-1.2' },
      { name: 'Nested-1.3', children: [{ name: 'Nested-1.3.1' }, { name: 'Nested-1.3.2' }] },
    ],
  },
  {
    name: 'Root-2',
    children: [{ name: 'Nested-2.1' }, { name: 'Nested-2.2' }],
  },
];

function renderTable(props: Partial<TableProps<Instance>> & { items: readonly Instance[] }) {
  const mergedProps = { columnDefinitions, ...props } as TableProps<Instance>;
  const { container } = render(<Table {...mergedProps} />);
  return createWrapper(container).findTable()!;
}

const baseExpandableRows = {
  isItemExpandable: (item: Instance) => !!item.children && item.children.length > 0,
  getItemChildren: (item: Instance) => item.children ?? [],
  expandedItems: [] as Instance[],
  onExpandableItemToggle: () => {},
};

function rowTexts(table: ReturnType<typeof renderTable>) {
  return table.findRows().map(r => r.find('td')!.getElement().textContent);
}

describe('Expandable rows filter highlight', () => {
  test('auto-expands ancestors of a matching descendant so the match becomes reachable', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    // Root-1 and Nested-1.3 are ancestors of the match and are auto-expanded; Root-2 stays collapsed.
    expect(rowTexts(table)).toEqual([
      'Root-1',
      'Nested-1.1',
      'Nested-1.2',
      'Nested-1.3',
      'Nested-1.3.1',
      'Nested-1.3.2',
      'Root-2',
    ]);
  });

  test('highlights only the matched rows', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    const matched = table.findMatchedRows();
    expect(matched).toHaveLength(1);
    expect(matched[0].find('td')!.getElement().textContent).toBe('Nested-1.3.2');
  });

  test('highlights every matching row at multiple levels', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        highlightMatched: true,
        // Match a parent and a deeply nested child in different subtrees.
        isItemMatched: item => item.name === 'Nested-1.3' || item.name === 'Nested-2.2',
      },
    });

    expect(table.findMatchedRows().map(r => r.find('td')!.getElement().textContent)).toEqual([
      'Nested-1.3',
      'Nested-2.2',
    ]);
    // Root-2 is auto-expanded because Nested-2.2 matches.
    expect(rowTexts(table)).toContain('Nested-2.2');
  });

  test('auto-expanded ancestors report aria-expanded="true"', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    // Row 1 = Root-1 (auto-expanded), row 4 = Nested-1.3 (auto-expanded).
    expect(table.findExpandToggle(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(table.findExpandToggle(4)!.getElement()).toHaveAttribute('aria-expanded', 'true');
  });

  test('toggling an auto-expanded ancestor fires onExpandableItemToggle with expanded=false', () => {
    const onExpandableItemToggle = jest.fn();
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        onExpandableItemToggle,
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    table.findExpandToggle(1)!.click();
    expect(onExpandableItemToggle).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ expanded: false }) })
    );
  });

  test('is backward compatible: without highlightMatched no auto-expansion or highlighting occurs', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        // isItemMatched provided but highlightMatched not enabled -> no effect.
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    expect(rowTexts(table)).toEqual(['Root-1', 'Root-2']);
    expect(table.findMatchedRows()).toHaveLength(0);
  });

  test('does not auto-expand subtrees without matches', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-2.1',
      },
    });

    // Only Root-2's subtree is expanded; Root-1 stays collapsed.
    expect(rowTexts(table)).toEqual(['Root-1', 'Root-2', 'Nested-2.1', 'Nested-2.2']);
    expect(table.findMatchedRows().map(r => r.find('td')!.getElement().textContent)).toEqual(['Nested-2.1']);
  });

  test('manually expanded items remain expanded alongside auto-expanded ancestors', () => {
    const table = renderTable({
      items: nestedItems,
      trackBy: item => item.name,
      expandableRows: {
        ...baseExpandableRows,
        expandedItems: [nestedItems[1]], // Root-2 expanded manually
        highlightMatched: true,
        isItemMatched: item => item.name === 'Nested-1.3.2',
      },
    });

    const texts = rowTexts(table);
    // Root-2 stays expanded (manual) and Root-1 subtree auto-expands to reveal the match.
    expect(texts).toContain('Nested-2.1');
    expect(texts).toContain('Nested-1.3.2');
  });
});
