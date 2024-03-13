// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { KeyCode } from '../../../lib/components/internal/keycode';

interface Instance {
  name: string;
  children?: Instance[];
}

function flatten(items: Instance[]): Instance[] {
  const allItems: Instance[] = [];
  function traverse(item: Instance) {
    allItems.push(item);
    (item.children ?? []).forEach(traverse);
  }
  items.forEach(traverse);
  return allItems;
}

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [{ header: 'name', cell: item => item.name }];

const simpleItems = [
  { name: '1', expandable: true },
  { name: '2', expandable: false },
  { name: '3', expandable: true },
];

const items1: Instance[] = [
  {
    name: 'Root-1',
    children: [
      {
        name: 'Nested-1.1',
        children: [],
      },
      {
        name: 'Nested-1.2',
      },
      {
        name: 'Nested-1.3',
        children: [{ name: 'Nested-1.3.1' }, { name: 'Nested-1.3.2' }],
      },
    ],
  },
  {
    name: 'Root-2',
    children: [
      {
        name: 'Nested-2.1',
        children: [],
      },
      {
        name: 'Nested-2.2',
        children: [],
      },
    ],
  },
];

function renderTable(tableProps: Partial<TableProps> & { messages?: Record<string, string> }) {
  const mergedProps = { items: items1, columnDefinitions, ...tableProps };
  const { container } = render(
    tableProps.messages ? (
      <TestI18nProvider messages={{ table: tableProps.messages ?? {} }}>
        <Table {...mergedProps} />
      </TestI18nProvider>
    ) : (
      <Table {...mergedProps} />
    )
  );
  const table = createWrapper(container).findTable()!;
  return { container, table };
}

describe('Expandable rows', () => {
  test('expand toggles are added for all items with isItemExpandable(item) === true', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
    });
    expect(table.findExpandToggle(1)).not.toBe(null);
    expect(table.findExpandToggle(2)).toBe(null);
    expect(table.findExpandToggle(3)).not.toBe(null);
  });

  test('expandedItems alter state of expand toggles', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [simpleItems[2]],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
    });
    expect(table.isRowToggled(1)).toBe(false);
    expect(table.isRowToggled(2)).toBe(false);
    expect(table.isRowToggled(3)).toBe(true);
  });

  test('expandedItems are matched with trackBy', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [{ name: '3', expandable: true }],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
      trackBy: item => item.name,
    });
    expect(table.isRowToggled(1)).toBe(false);
    expect(table.isRowToggled(2)).toBe(false);
    expect(table.isRowToggled(3)).toBe(true);
  });

  test('expand toggles have correct ARIA attributes set', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [simpleItems[0]],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
      ariaLabels: {
        expandButtonLabel: item => `Expand item ${item.name}`,
        collapseButtonLabel: item => `Collapse item ${item.name}`,
      },
    });
    expect(table.findExpandToggle(1)!.getElement()).toHaveAccessibleName('Collapse item 1');
    expect(table.findExpandToggle(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(table.findExpandToggle(3)!.getElement()).toHaveAccessibleName('Expand item 3');
    expect(table.findExpandToggle(3)!.getElement()).toHaveAttribute('aria-expanded', 'false');
  });

  test('expand toggles labels are set with i18n provider', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [simpleItems[0]],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
      messages: {
        'ariaLabels.expandButtonLabel': 'Expand item',
        'ariaLabels.collapseButtonLabel': 'Collapse item',
      },
    });
    expect(table.findExpandToggle(1)!.getElement()).toHaveAccessibleName('Collapse item');
    expect(table.findExpandToggle(1)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(table.findExpandToggle(3)!.getElement()).toHaveAccessibleName('Expand item');
    expect(table.findExpandToggle(3)!.getElement()).toHaveAttribute('aria-expanded', 'false');
  });

  test('nested items are rendered for expandable and expanded items', () => {
    const { table } = renderTable({
      items: items1,
      expandableRows: {
        isItemExpandable: item => item.children && item.children.length > 0,
        expandedItems: flatten(items1).filter(item => item.name !== 'Root-2'),
        getItemChildren: item => item.children ?? [],
        onExpandableItemToggle: () => {},
      },
    });
    expect(table.findRows().map(r => r.find('td')!.getElement().textContent)).toEqual([
      'Root-1',
      'Nested-1.1',
      'Nested-1.2',
      'Nested-1.3',
      'Nested-1.3.1',
      'Nested-1.3.2',
      'Root-2',
    ]);
    // Root-1
    expect(table.findRows()[0].getElement()).toHaveAttribute('aria-level', '1');
    expect(table.findRows()[0].getElement()).toHaveAttribute('aria-setsize', '2');
    expect(table.findRows()[0].getElement()).toHaveAttribute('aria-posinset', '1');
    // Nested-1.3.2
    expect(table.findRows()[5].getElement()).toHaveAttribute('aria-level', '3');
    expect(table.findRows()[5].getElement()).toHaveAttribute('aria-setsize', '2');
    expect(table.findRows()[5].getElement()).toHaveAttribute('aria-posinset', '2');
  });

  test('onExpandableItemToggle fires with item and expand state', () => {
    const onExpandableItemToggle = jest.fn();
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [simpleItems[0]],
        getItemChildren: () => [],
        onExpandableItemToggle,
      },
    });

    table.findExpandToggle(1)!.click();
    expect(onExpandableItemToggle).toBeCalledTimes(1);
    expect(onExpandableItemToggle).toBeCalledWith(
      expect.objectContaining({ detail: { item: simpleItems[0], expanded: false } })
    );

    table.findExpandToggle(3)!.click();
    expect(onExpandableItemToggle).toBeCalledTimes(2);
    expect(onExpandableItemToggle).toBeCalledWith(
      expect.objectContaining({ detail: { item: simpleItems[2], expanded: true } })
    );
  });

  test('keyboard navigation is active by default', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
    });

    table.findExpandToggle(1)!.focus();
    fireEvent.keyDown(table.find('table')!.getElement(), { keyCode: KeyCode.down });
    expect(table.findBodyCell(2, 1)!.getElement()).toHaveFocus();

    fireEvent.keyDown(table.find('table')!.getElement(), { keyCode: KeyCode.down });
    expect(table.findExpandToggle(3)!.getElement()).toHaveFocus();
  });

  test('keyboard navigation can be disabled', () => {
    const { table } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
      enableKeyboardNavigation: false,
    });

    table.findExpandToggle(1)!.focus();
    fireEvent.keyDown(table.find('table')!.getElement(), { keyCode: KeyCode.down });
    expect(table.findExpandToggle(1)!.getElement()).toHaveFocus();
  });

  test.each([false, true])('table has role="treegrid" when enableKeyboardNavigation=`%s`', enableKeyboardNavigation => {
    const { container } = renderTable({
      items: simpleItems,
      expandableRows: {
        isItemExpandable: item => item.expandable,
        expandedItems: [],
        getItemChildren: () => [],
        onExpandableItemToggle: () => {},
      },
      enableKeyboardNavigation,
    });
    expect(container.querySelector('table')).toHaveAttribute('role', 'treegrid');
  });
});
