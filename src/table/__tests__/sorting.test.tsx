// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Table from '../../../lib/components/table';
import { TableProps } from '../../../lib/components/table/interfaces';
import tableStyles from '../../../lib/components/table/styles.css.js';
import headerCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import resizerStyles from '../../../lib/components/table/resizer/styles.css.js';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

interface Item {
  id: number;
  name: string;
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'id',
    header: 'id',
    cell: item => item.id,
    sortingField: 'id',
    ariaLabel: ({ sorted, descending }) => `id,sorted=${sorted},descending=${descending}`,
  },
  { id: 'name', header: 'name', cell: item => item.name },
  { id: 'sortable', header: 'name', cell: item => item.name, sortingField: 'name' },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderTable(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

function findNativeTable(wrapper: TableWrapper) {
  return wrapper.find(`.${tableStyles.wrapper} table`);
}

function getHeaderCell(wrapper: TableWrapper, idx: number) {
  return wrapper.findColumnHeaders()[idx - 1]!.getElement();
}

function assertColumnNotSortable(wrapper: TableWrapper, index: number) {
  expect(getHeaderCell(wrapper, index)).not.toHaveClass(headerCellStyles['header-cell-sortable']);
}

function assertColumnSortable(wrapper: TableWrapper, index: number) {
  expect(getHeaderCell(wrapper, index)).toHaveClass(headerCellStyles['header-cell-sortable']);
  expect(getHeaderCell(wrapper, index)).toHaveAttribute('aria-sort');
}

function assertColumnSorted(wrapper: TableWrapper, index: number, isDescending: boolean) {
  expect(getHeaderCell(wrapper, index)).toHaveAttribute('aria-sort', isDescending ? 'descending' : 'ascending');
  const headerCell = isDescending ? wrapper.findDescSortedColumn() : wrapper.findAscSortedColumn();
  expect(headerCell).toBeTruthy();
}

function assertColumnNotSorted(wrapper: TableWrapper, index: number) {
  expect(getHeaderCell(wrapper, index)).not.toHaveClass(headerCellStyles['header-cell-sorted']);
  expect(getHeaderCell(wrapper, index)).toHaveAttribute('aria-sort', 'none');
}

test('adds optional label to sort button', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  expect(wrapper.findColumnSortingArea(1)!.getElement()).toHaveAttribute(
    'aria-label',
    'id,sorted=false,descending=false'
  );
  expect(wrapper.findColumnSortingArea(3)!.getElement()).not.toHaveAttribute('aria-label');
});

test('does not sort the sortable columns by default', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  assertColumnNotSorted(wrapper, 1);
  assertColumnNotSorted(wrapper, 3);
});

test('passes correct sortingState to label', function () {
  const columnDefinitions = [...defaultColumns];
  columnDefinitions[0] = {
    ...defaultColumns[0],
    ariaLabel: data => `${data.sorted} ${data.descending} ${data.disabled}`,
  };
  const { wrapper, rerender } = renderTable(
    <Table columnDefinitions={columnDefinitions} items={defaultItems} sortingColumn={columnDefinitions[0]} />
  );
  expect(wrapper.findColumnSortingArea(1)!.getElement()).toHaveAttribute('aria-label', 'true false false');
  rerender(
    <Table
      columnDefinitions={columnDefinitions}
      items={defaultItems}
      sortingColumn={defaultColumns[2]}
      sortingDescending={true}
    />
  );
  expect(wrapper.findColumnSortingArea(1)!.getElement()).toHaveAttribute('aria-label', 'false false false');
});

test('with no sorting parameters provided', function () {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  assertColumnSortable(wrapper, 1);
  assertColumnNotSortable(wrapper, 2);
  assertColumnSortable(wrapper, 3);
});

test('with selected sorted column and default direction', function () {
  const { wrapper } = renderTable(
    <Table columnDefinitions={defaultColumns} items={defaultItems} sortingColumn={defaultColumns[2]} />
  );

  assertColumnSortable(wrapper, 1);
  assertColumnNotSortable(wrapper, 2);
  assertColumnSorted(wrapper, 3, false);
});

test('with selected sorted column and custom direction', function () {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      sortingColumn={defaultColumns[0]}
      sortingDescending={true}
    />
  );

  assertColumnSorted(wrapper, 1, true);
  assertColumnNotSortable(wrapper, 2);
  assertColumnSortable(wrapper, 3);
});

describe('should change direction', () => {
  let wrapper: TableWrapper;
  const sortingChangeSpy = jest.fn();
  beforeEach(() => {
    wrapper = renderTable(
      <Table
        columnDefinitions={defaultColumns}
        items={defaultItems}
        sortingColumn={defaultColumns[0]}
        sortingDescending={true}
        onSortingChange={sortingChangeSpy}
      />
    ).wrapper;
  });
  afterEach(() => sortingChangeSpy.mockClear());

  test('on click', () => {
    wrapper.findColumnSortingArea(1)!.click();
    expect(sortingChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          sortingColumn: defaultColumns[0],
          isDescending: false,
        },
      })
    );
  });

  test('when pressing Enter', () => {
    wrapper.findColumnSortingArea(1)!.keypress(KeyCode.enter);
    expect(sortingChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          sortingColumn: defaultColumns[0],
          isDescending: false,
        },
      })
    );
  });

  test('when pressing Space', () => {
    wrapper.findColumnSortingArea(1)!.keypress(KeyCode.space);
    expect(sortingChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          sortingColumn: defaultColumns[0],
          isDescending: false,
        },
      })
    );
  });
});

test('should change column on click and set default sorting direction', () => {
  const sortingChangeSpy = jest.fn();
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      sortingColumn={defaultColumns[0]}
      sortingDescending={true}
      onSortingChange={sortingChangeSpy}
    />
  );
  wrapper.findColumnSortingArea(3)!.click();
  expect(sortingChangeSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        sortingColumn: defaultColumns[2],
        isDescending: false,
      },
    })
  );
});

test('removes the button when disabled', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      sortingColumn={defaultColumns[0]}
      sortingDisabled={true}
    />
  );
  assertColumnSorted(wrapper, 1, false);
  expect(wrapper.findColumnSortingArea(3)).toBeFalsy();
});

describe('with stickyHeader=true', () => {
  const originalFn = window.CSS.supports;

  beforeEach(() => {
    window.CSS.supports = jest.fn().mockReturnValue(true);
  });
  afterEach(() => {
    window.CSS.supports = originalFn;
  });

  test('renders a fake focus ring on sort control when the hidden sort button is focused', () => {
    const { wrapper } = renderTable(
      <Table
        columnDefinitions={defaultColumns}
        items={defaultItems}
        sortingColumn={defaultColumns[0]}
        stickyHeader={true}
      />
    );
    findNativeTable(wrapper)!.findByClassName(headerCellStyles['header-cell-content'])!.focus();
    fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
    expect(wrapper.findByClassName(headerCellStyles['header-cell-fake-focus'])).not.toBeFalsy();
  });

  test('renders a fake focus ring on resizer when the hidden sort button is focused', () => {
    const { wrapper } = renderTable(
      <Table
        columnDefinitions={defaultColumns}
        items={defaultItems}
        sortingColumn={defaultColumns[0]}
        stickyHeader={true}
        resizableColumns={true}
      />
    );
    findNativeTable(wrapper)!.findByClassName(resizerStyles.resizer)!.focus();
    fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65 });
    expect(wrapper.findByClassName(resizerStyles['has-focus'])).not.toBeFalsy();
  });
});

test('matches currently sorted column, when `sortingColumn` value is a copy of the column object', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={[
        ...defaultColumns,
        {
          id: 'extra',
          header: 'extra',
          cell: item => item.name,
          sortingField: 'name',
          ariaLabel: ({ sorted, descending }) => `extra,sorted=${sorted},descending=${descending}`,
        },
      ]}
      items={defaultItems}
      sortingColumn={{ ...defaultColumns[0] }}
    />
  );
  assertColumnSorted(wrapper, 1, false);
  expect(wrapper.findColumnSortingArea(1)!.getElement()).toHaveAttribute(
    'aria-label',
    'id,sorted=true,descending=false'
  );
  expect(wrapper.findColumnSortingArea(4)!.getElement()).toHaveAttribute(
    'aria-label',
    'extra,sorted=false,descending=false'
  );
});
