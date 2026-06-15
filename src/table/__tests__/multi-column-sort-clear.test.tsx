// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Pagination from '../../../lib/components/pagination';
import Table from '../../../lib/components/table';
import { TableProps } from '../../../lib/components/table/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';

import tableStyles from '../../../lib/components/table/styles.css.js';

interface Item {
  id: string;
  name: string;
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' },
  { id: 'id', header: 'Id', cell: item => item.id, sortingField: 'id' },
];

const items: Item[] = [
  { id: '1', name: 'alpha' },
  { id: '2', name: 'beta' },
];

const activeSort: ReadonlyArray<TableProps.SortingState<Item>> = [
  { sortingColumn: { sortingField: 'name' }, isDescending: false },
];

function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return { wrapper: createWrapper(container).findTable()!, container };
}

test('renders a Clear sort button when multiColumnSort is active on at least one column', () => {
  const { wrapper } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: activeSort, onChange: () => {} }}
    />
  );
  // The label text itself comes from the i18n provider (no hardcoded fallback in the component),
  // so here we only assert the button is rendered. Label text is covered by the i18nStrings test below.
  expect(wrapper.findClearSort()).not.toBeNull();
});

test('uses the i18nStrings.clearSort label when provided', () => {
  const { wrapper } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: activeSort, onChange: () => {} }}
      i18nStrings={{ clearSort: 'Reset sorting' }}
    />
  );
  expect(wrapper.findClearSort()!.getElement()).toHaveTextContent('Reset sorting');
});

test('does not render the Clear sort button when no column is sorted', () => {
  const { wrapper } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: [], onChange: () => {} }}
    />
  );
  expect(wrapper.findClearSort()).toBeNull();
});

test('does not render the Clear sort button for single-column (non-multi) sorting', () => {
  const { wrapper } = renderTable(
    <Table items={items} columnDefinitions={columnDefinitions} sortingColumn={{ sortingField: 'name' }} />
  );
  expect(wrapper.findClearSort()).toBeNull();
});

test('clicking Clear sort fires onChange with an empty sorting state', () => {
  const onChange = jest.fn();
  const { wrapper } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: activeSort, onChange }}
    />
  );
  wrapper.findClearSort()!.click();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].detail).toEqual({ sortingColumns: [] });
});

test('moves focus to the first sortable column header after clearing sort (avoids losing focus to the body)', () => {
  const { wrapper } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: activeSort, onChange: () => {} }}
    />
  );
  wrapper.findClearSort()!.click();
  // Focus should land on the first sortable column's sort control, not fall back to document.body.
  expect(document.activeElement).toHaveAttribute('data-focus-id', 'sorting-control-name');
});

test('renders the Clear sort button before the pagination slot', () => {
  const { container } = renderTable(
    <Table
      items={items}
      columnDefinitions={columnDefinitions}
      multiColumnSort={{ sortingColumns: activeSort, onChange: () => {} }}
      pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
    />
  );
  const clearSort = container.querySelector(`.${tableStyles['tools-clear-sort']}`)!;
  const pagination = container.querySelector(`.${tableStyles['tools-pagination']}`)!;
  expect(clearSort).not.toBeNull();
  expect(pagination).not.toBeNull();
  expect(clearSort.compareDocumentPosition(pagination) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
