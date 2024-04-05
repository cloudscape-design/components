// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

interface Instance {
  name: string;
  children?: Instance[];
}

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [{ header: 'name', cell: item => item.name }];

const nestedItems: Instance[] = [
  {
    name: 'Root-1',
    children: [
      {
        name: 'Nested-1.1',
        children: [{ name: 'Nested-1.1.1' }, { name: 'Nested-1.1.2' }],
      },
      {
        name: 'Nested-1.2',
        children: [{ name: 'Nested-1.2.1' }, { name: 'Nested-1.2.2' }],
      },
    ],
  },
  {
    name: 'Root-2',
    children: [
      {
        name: 'Nested-2.1',
        children: [{ name: 'Nested-2.1.1' }, { name: 'Nested-2.1.2' }],
      },
      {
        name: 'Nested-2.2',
        children: [{ name: 'Nested-2.2.1' }, { name: 'Nested-2.2.2' }],
      },
    ],
  },
];

const defaultExpandableRows: TableProps.ExpandableRows<Instance> = {
  isItemExpandable: item => (item.children ? item.children.length > 0 : false),
  expandedItems: [],
  getItemChildren: item => item.children ?? [],
  onExpandableItemToggle: () => {},
};

function renderTable(tableProps: Partial<TableProps>) {
  const { container } = render(
    <Table
      items={nestedItems}
      columnDefinitions={columnDefinitions}
      trackBy="name"
      renderLoaderPending={({ item }) => ({ buttonLabel: `[pending] Loader for ${item?.name ?? 'TABLE ROOT'}` })}
      renderLoaderLoading={({ item }) => ({ loadingText: `[loading] Loader for ${item?.name ?? 'TABLE ROOT'}` })}
      renderLoaderError={({ item }) => ({ cellContent: `[error] Loader for ${item?.name ?? 'TABLE ROOT'}` })}
      {...tableProps}
    />
  );
  return { container, table: createWrapper(container).findTable()! };
}

function findParentRow(element: HTMLElement): HTMLTableRowElement {
  let current: null | HTMLElement = element;
  while (current) {
    if (current instanceof HTMLTableRowElement) {
      return current;
    }
    current = current.parentElement;
  }
  throw new Error('No parent row found for the provided element.');
}

const getTextContent = (w: ComponentWrapper) => w.getElement().textContent?.trim();
const getAriaLevel = (w: ComponentWrapper) => findParentRow(w.getElement()).getAttribute('aria-level');
const getAriaLive = (w: ComponentWrapper) => w.findByClassName(liveRegionStyles.source)!.getElement().textContent;

describe('Progressive loading', () => {
  test('renders loaders in correct order for normal table', () => {
    const { table } = renderTable({ loadingStatus: 'pending' });

    expect(table.findRows().map(getTextContent)).toEqual(['Root-1', 'Root-2', '[pending] Loader for TABLE ROOT']);
  });

  test('renders loaders in correct order for expandable table', () => {
    const { table } = renderTable({
      expandableRows: {
        ...defaultExpandableRows,
        expandedItems: [
          { name: 'Root-1' },
          { name: 'Nested-1.2' },
          { name: 'Root-2' },
          { name: 'Nested-2.1' },
          { name: 'Nested-2.2' },
        ],
        getItemLoadingStatus: () => 'pending',
      },
      loadingStatus: 'pending',
    });

    expect(table.findRows().map(getTextContent)).toEqual([
      'Root-1',
      'Nested-1.1',
      'Nested-1.2',
      'Nested-1.2.1',
      'Nested-1.2.2',
      '[pending] Loader for Nested-1.2',
      '[pending] Loader for Root-1',
      'Root-2',
      'Nested-2.1',
      'Nested-2.1.1',
      'Nested-2.1.2',
      '[pending] Loader for Nested-2.1',
      'Nested-2.2',
      'Nested-2.2.1',
      'Nested-2.2.2',
      '[pending] Loader for Nested-2.2',
      '[pending] Loader for Root-2',
      '[pending] Loader for TABLE ROOT',
    ]);
  });

  test.each(['pending', 'loading', 'error'] as const)(
    'renders loaders with correct level offset for status="%s"',
    status => {
      const { table } = renderTable({
        expandableRows: {
          ...defaultExpandableRows,
          expandedItems: [{ name: 'Root-1' }, { name: 'Nested-1.2' }],
          getItemLoadingStatus: () => status,
        },
        loadingStatus: status,
      });

      expect(table.findRootItemsLoader()).not.toBe(null);
      expect(table.findItemsLoaderByItemId('Root-1')).not.toBe(null);
      expect(table.findItemsLoaderByItemId('Root-2')).toBe(null);
      expect(table.findItemsLoaderByItemId('Nested-1.1')).toBe(null);
      expect(table.findItemsLoaderByItemId('Nested-1.2')).not.toBe(null);
      expect(table.findItemsLoaderByItemId('Nested-1.2.1')).toBe(null);
      expect(table.findItemsLoaderByItemId('Nested-1.2.2')).toBe(null);

      expect(getTextContent(table.findRootItemsLoader()!)).toBe(`[${status}] Loader for TABLE ROOT`);
      expect(getAriaLevel(table.findRootItemsLoader()!)).toBe(null);

      expect(getTextContent(table.findItemsLoaderByItemId('Root-1')!)).toBe(`[${status}] Loader for Root-1`);
      expect(getAriaLevel(table.findItemsLoaderByItemId('Root-1')!)).toBe('1');

      expect(getTextContent(table.findItemsLoaderByItemId('Nested-1.2')!)).toBe(`[${status}] Loader for Nested-1.2`);
      expect(getAriaLevel(table.findItemsLoaderByItemId('Nested-1.2')!)).toBe('2');
    }
  );

  test('renders no loader for status="finished"', () => {
    const { table } = renderTable({
      expandableRows: {
        ...defaultExpandableRows,
        expandedItems: [{ name: 'Root-1' }, { name: 'Nested-1.2' }],
        getItemLoadingStatus: () => 'finished',
      },
      loadingStatus: 'finished',
    });

    expect(table.findRootItemsLoader()).toBe(null);
    expect(table.findItemsLoaderByItemId('Root-1')).toBe(null);
    expect(table.findItemsLoaderByItemId('Root-2')).toBe(null);
    expect(table.findItemsLoaderByItemId('Nested-1.1')).toBe(null);
    expect(table.findItemsLoaderByItemId('Nested-1.2')).toBe(null);
    expect(table.findItemsLoaderByItemId('Nested-1.2.1')).toBe(null);
    expect(table.findItemsLoaderByItemId('Nested-1.2.2')).toBe(null);
  });

  test('clicking on load more fires event', () => {
    const onLoadMoreItems = jest.fn();
    const { table } = renderTable({
      expandableRows: {
        ...defaultExpandableRows,
        expandedItems: [{ name: 'Root-1' }, { name: 'Nested-1.2' }],
        getItemLoadingStatus: () => 'pending',
      },
      loadingStatus: 'pending',
      onLoadMoreItems,
    });
    const nested12 = nestedItems[0].children?.[1];

    table.findRootItemsLoader()!.findLoadMoreButton()!.click();
    expect(onLoadMoreItems).toHaveBeenCalledTimes(1);
    expect(onLoadMoreItems).toHaveBeenCalledWith(expect.objectContaining({ detail: { item: null } }));

    table.findItemsLoaderByItemId('Nested-1.2')!.findLoadMoreButton()!.click();
    expect(onLoadMoreItems).toHaveBeenCalledTimes(2);
    expect(onLoadMoreItems).toHaveBeenCalledWith(expect.objectContaining({ detail: { item: nested12 } }));
  });

  test.each(['loading', 'error'] as const)('loader content for status="%s" is announced with aria-live', status => {
    const { table } = renderTable({
      expandableRows: {
        ...defaultExpandableRows,
        expandedItems: [{ name: 'Root-1' }, { name: 'Nested-1.2' }],
        getItemLoadingStatus: () => status,
      },
      loadingStatus: status,
    });

    expect(getAriaLive(table.findRootItemsLoader()!)).toBe(`[${status}] Loader for TABLE ROOT`);
    expect(getAriaLive(table.findItemsLoaderByItemId('Root-1')!)).toBe(`[${status}] Loader for Root-1`);
    expect(getAriaLive(table.findItemsLoaderByItemId('Nested-1.2')!)).toBe(`[${status}] Loader for Nested-1.2`);
  });

  test.each(['pending', 'loading', 'error'] as const)(
    'warns when table requires a loader but the render function is missing',
    status => {
      render(
        <Table
          items={nestedItems}
          columnDefinitions={columnDefinitions}
          loadingStatus={status}
          renderLoaderPending={status === 'pending' ? undefined : () => ({ buttonLabel: 'Load more' })}
          renderLoaderLoading={status === 'loading' ? undefined : () => ({ loadingText: 'Loading' })}
          renderLoaderError={status === 'error' ? undefined : () => ({ cellContent: 'Error' })}
        />
      );
      expect(warnOnce).toHaveBeenCalledWith(
        'Table',
        'Must define `renderLoaderPending`, `renderLoaderLoading`, and `renderLoaderError` when using `loadingStatus`.'
      );
    }
  );

  test.each(['single', 'multi'] as const)('selection control is not rendered for loader rows', selectionType => {
    const { table } = renderTable({
      expandableRows: {
        ...defaultExpandableRows,
        expandedItems: [{ name: 'Root-1' }],
        getItemLoadingStatus: () => 'pending',
      },
      loadingStatus: 'pending',
      selectionType,
    });

    expect(table.findRows().map(w => [!!w.find('input'), getTextContent(w)])).toEqual([
      [true, 'Root-1'],
      [true, 'Nested-1.1'],
      [true, 'Nested-1.2'],
      [false, '[pending] Loader for Root-1'],
      [true, 'Root-2'],
      [false, '[pending] Loader for TABLE ROOT'],
    ]);
  });
});
