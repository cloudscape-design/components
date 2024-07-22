// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import range from 'lodash/range';

import { useCollection } from '@cloudscape-design/collection-hooks';

import Pagination from '../../../lib/components/pagination';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import TextFilter from '../../../lib/components/text-filter';

interface Item {
  id: string;
}
const allItems = range(50).map(id => ({ id: `${id + 1}` }));
const sortingComparator = (a: Item, b: Item) => parseInt(a.id as string, 10) - parseInt(b.id as string, 10);
const columns: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'id', cell: item => item.id, sortingComparator },
];

interface DemoProps {
  defaultFilteringText?: string;
  defaultPage?: number;
  defaultSortingState?: {
    sortingColumn: TableProps.SortingColumn<Item>;
    isDescending?: boolean;
  };
}

function Demo({ defaultFilteringText, defaultPage, defaultSortingState }: DemoProps) {
  const { items, collectionProps, filterProps, paginationProps } = useCollection(allItems, {
    filtering: {
      empty: 'empty',
      noMatch: 'no match',
      defaultFilteringText,
    },
    pagination: { defaultPage },
    sorting: { defaultState: defaultSortingState },
  });
  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      filter={<TextFilter {...filterProps} countText={`${items.length} matches`} />}
      pagination={<Pagination {...paginationProps} />}
    />
  );
}

function renderDemo(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const tableWrapper = createWrapper(container).findTable()!;
  return {
    tableWrapper,
    textFilterWrapper: tableWrapper.findTextFilter()!,
    paginationWrapper: tableWrapper.findPagination()!,
  };
}

test('should apply filtering and display filtered items', () => {
  const { tableWrapper, textFilterWrapper } = renderDemo(<Demo />);
  textFilterWrapper.findInput().setInputValue('11');
  expect(tableWrapper.findEmptySlot()).toBeFalsy();
  expect(tableWrapper.findRows()).toHaveLength(1);
});

test('should apply filtering and display no-match state', () => {
  const { tableWrapper, textFilterWrapper } = renderDemo(<Demo />);
  expect(tableWrapper.findEmptySlot()).toBeNull();
  expect(tableWrapper.findRows()).toHaveLength(10);
  textFilterWrapper.findInput().setInputValue('no such value');
  expect(tableWrapper.findEmptySlot()!.getElement()).toHaveTextContent('no match');
  expect(tableWrapper.findRows()).toHaveLength(0);
  textFilterWrapper.findInput().setInputValue('');
  expect(tableWrapper.findEmptySlot()).toBeNull();
  expect(tableWrapper.findRows()).toHaveLength(10);
});

test('should navigate through pagination', () => {
  const { tableWrapper, paginationWrapper } = renderDemo(<Demo />);
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('1');
  expect(paginationWrapper.findPreviousPageButton().getElement()).toBeDisabled();
  paginationWrapper.findNextPageButton().click();
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('11');
  expect(paginationWrapper.findPreviousPageButton().getElement()).toBeEnabled();
  paginationWrapper.findPageNumberByIndex(4)!.click();
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('31');
});

test('pagination should work when filtering is applied', () => {
  const { tableWrapper, paginationWrapper } = renderDemo(<Demo defaultFilteringText="1" />);
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('1');
  expect(paginationWrapper.findPageNumbers()).toHaveLength(2);
  paginationWrapper.findNextPageButton().click();
  expect(paginationWrapper.findNextPageButton().getElement()).toBeDisabled();
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('19');
});

test('shold apply sorting', () => {
  const { tableWrapper } = renderDemo(<Demo defaultSortingState={{ sortingColumn: columns[0], isDescending: true }} />);
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('50');
  tableWrapper.findColumnSortingArea(1)!.click();
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('1');
});

test('shold reset pagination, when applying sorting', () => {
  const { tableWrapper } = renderDemo(
    <Demo defaultSortingState={{ sortingColumn: columns[0], isDescending: true }} defaultPage={2} />
  );
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('40');
  tableWrapper.findColumnSortingArea(1)!.click();
  expect(tableWrapper.findBodyCell(1, 1)!.getElement().textContent).toEqual('1');
});
