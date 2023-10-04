// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import PropertyFilter from '../../../lib/components/property-filter';
import Select from '../../../lib/components/select';
import createWrapper, { ElementWrapper, PaginationWrapper, TableWrapper } from '../../../lib/components/test-utils/dom';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import headerCellStyles from '../../../lib/components/table/header-cell/styles.css.js';
import styles from '../../../lib/components/table/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn(),
}));

interface Item {
  id: number;
  name: string;
}

function findFooterPagination(wrapper: TableWrapper) {
  return wrapper.findComponent(`.${styles['footer-pagination']}`, PaginationWrapper);
}

function getHeaderHtmlContent(wrapper: ElementWrapper) {
  return (
    wrapper
      // find header content without sorting elements
      .findByClassName(headerCellStyles['header-cell-text'])!
      .getElement()
      .innerHTML.trim()
  );
}

function Counter({ id }: { id: number | string }) {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <span data-testid={`display-${id}`}>{count}</span>
      <button data-testid={`increment-${id}`} onClick={() => setCount(count => count + 1)}>
        +
      </button>
    </>
  );
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: item => item.id, isRowHeader: true },
  { header: 'name', cell: item => item.name },
];
const defaultColumnsWithIds: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'id', cell: item => item.id },
  { id: 'name', header: 'name', cell: item => item.name },
];
const editableColumns: TableProps.ColumnDefinition<Item>[] = [
  { header: 'id', cell: (item: Item) => item.id, editConfig: { editingCell: item => item.id } },
  { header: 'name', cell: (item: Item) => item.name, editConfig: { editingCell: item => item.name } },
];

const statefulColumns: TableProps.ColumnDefinition<Item>[] = [
  {
    header: 'Counter 1',
    cell: item => <Counter id={`1-${item.id}`} />,
  },
  {
    header: 'Counter 2',
    cell: item => <Counter id={`2-${item.id}`} />,
  },
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

test('should render table without extra slots', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  expect(wrapper.findHeaderSlot()).toBeNull();
  expect(wrapper.findFooterSlot()).toBeNull();
  expect(wrapper.findTextFilter()).toBeNull();
  expect(wrapper.findPagination()).toBeNull();
});

test('should render table with no pagination in the footer for default variant', () => {
  const { wrapper } = renderTable(
    <Table pagination="pagination" columnDefinitions={defaultColumns} items={defaultItems} />
  );
  expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
  expect(findFooterPagination(wrapper)).toBeNull();
});

test('should render table with pagination in the footer for full-page variants on mobile', () => {
  (useMobile as jest.Mock).mockReturnValue(true);
  const { wrapper } = renderTable(
    <Table pagination="pagination" variant="full-page" columnDefinitions={defaultColumns} items={defaultItems} />
  );
  expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
  expect(findFooterPagination(wrapper)?.getElement()).toHaveTextContent('pagination');
  jest.resetAllMocks();
});

test('should not render table with pagination in the footer for full-page variants on desktop', () => {
  (useMobile as jest.Mock).mockReturnValue(false);
  const { wrapper } = renderTable(
    <Table pagination="pagination" variant="full-page" columnDefinitions={defaultColumns} items={defaultItems} />
  );
  expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
  expect(findFooterPagination(wrapper)).toBeNull();
  jest.resetAllMocks();
});

test('should render table with header and footer', () => {
  const { wrapper } = renderTable(
    <Table header="Header" footer="Footer" columnDefinitions={defaultColumns} items={defaultItems} />
  );
  expect(wrapper.findHeaderSlot()!.getElement()).toHaveTextContent('Header');
  expect(wrapper.findFooterSlot()!.getElement()).toHaveTextContent('Footer');
});

test('should render table with loading state', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      loading={true}
      loadingText="loading items"
      empty="no content"
    />
  );
  expect(wrapper.findColumnHeaders()).toHaveLength(2);
  expect(wrapper.findRows()).toHaveLength(0);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()!.getElement()).toHaveTextContent('loading items');
});

test('should render table with empty state when loading text is not set', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={[]} empty="no content" />);
  expect(wrapper.findColumnHeaders()).toHaveLength(2);
  expect(wrapper.findRows()).toHaveLength(0);
  expect(wrapper.findEmptySlot()!.getElement()).toHaveTextContent('no content');
  expect(wrapper.findLoadingText()).toBeNull();
});

test('should render table with a property filter', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      filter={
        <PropertyFilter
          onChange={() => {}}
          query={{ tokens: [], operation: 'and' }}
          i18nStrings={{ filteringAriaLabel: 'filter' }}
          filteringProperties={[]}
        />
      }
    />
  );

  expect(wrapper.findPropertyFilter()).not.toBeNull();
});

test('should render table with a select filter', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumns}
      items={defaultItems}
      filter={<Select onChange={() => {}} selectedOption={{}} />}
    />
  );

  expect(wrapper.findFilterSlot()?.findSelect()).not.toBeNull();
});

test('should render table with empty state when  loading text is defined', () => {
  const { wrapper } = renderTable(
    <Table columnDefinitions={defaultColumns} items={[]} empty="no content" loadingText="loading" />
  );
  expect(wrapper.findColumnHeaders()).toHaveLength(2);
  expect(wrapper.findRows()).toHaveLength(0);
  expect(wrapper.findEmptySlot()!.getElement()).toHaveTextContent('no content');
  expect(wrapper.findLoadingText()).toBeNull();
});

test('should render table with primitive content', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['id', 'name']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(1, 1)!.getElement()).toContainHTML('1');
  expect(wrapper.findBodyCell(2, 2)!.getElement()).toContainHTML('Oranges');
});

test('should render table with accessible headers', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  const columnHeaders = wrapper.findColumnHeaders();
  columnHeaders.forEach(header => {
    expect(header.getElement()).toHaveAttribute('scope', 'col');
  });
});

test('should render row headers if defined', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={defaultColumns} items={defaultItems} />);
  defaultItems.forEach((item, index) => {
    const cellElement = wrapper.findBodyCell(index + 1, 1)?.getElement();
    expect(cellElement?.tagName).toBe('TH');
    expect(cellElement).toHaveAttribute('scope', 'row');
  });
});

test('should render table header with icons to indicate editable columns', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);
  const columnHeaders = wrapper.findColumnHeaders();
  columnHeaders.forEach(header => {
    expect(header.getElement().querySelector('svg')).toBeInTheDocument();
  });
});

test('should show edit icon on hover', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);

  // No icon by default
  const editButton = wrapper.findEditCellButton(1, 1);
  expect(editButton?.findIcon()).toBeNull();

  // Show icon on hover
  fireEvent.mouseEnter(editButton!.getElement());
  expect(editButton?.findIcon()).not.toBeNull();

  // Remove icon when mouse moves away
  fireEvent.mouseLeave(editButton!.getElement());
  expect(editButton?.findIcon()).toBeNull();
});

test('should show edit icon on focus', () => {
  const { wrapper } = renderTable(<Table columnDefinitions={editableColumns} items={defaultItems} />);

  // No icon by default
  const editButton = wrapper.findEditCellButton(1, 1);
  expect(editButton?.findIcon()).toBeNull();

  // Show icon on focus
  editButton?.focus();
  expect(editButton?.findIcon()).not.toBeNull();

  // Remove icon on blur
  editButton?.blur();
  expect(editButton?.findIcon()).toBeNull();
});

test('should cancel edit using ref imperative method', async () => {
  const ref = React.createRef<any>();
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={editableColumns}
      items={defaultItems}
      submitEdit={async () => {
        await new Promise((resolve, reject) => setTimeout(reject, 1000));
      }}
      ref={ref}
    />
  );

  const button = wrapper.findEditCellButton(2, 2)!;

  fireEvent.click(button.getElement());
  act(() => {
    ref.current.cancelEdit();
  });
  await waitFor(() => {
    expect(wrapper.find(`[data-inline-editing-active="true"]`)?.getElement()).toBeUndefined();
  });
});

test('should render table with react content', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    ...defaultColumns,
    {
      header: (
        <>
          Advanced <span>header</span>
        </>
      ),
      cell: item => <input value={item.name} readOnly={true} />,
    },
  ];
  const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} />);
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['id', 'name', 'Advanced <span>header</span>']);
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(1, 3)!.getElement().innerHTML).toEqual('<input readonly="" value="Apples">');
  expect(wrapper.findBodyCell(2, 3)!.getElement().innerHTML).toEqual('<input readonly="" value="Oranges">');
});

test('should render only columns with id in visibleColumns', () => {
  const { wrapper } = renderTable(
    <Table columnDefinitions={defaultColumnsWithIds} items={defaultItems} visibleColumns={['name']} />
  );
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['name']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(2, 1)!.getElement()).toContainHTML('Oranges');
});

test('should render only columns with visible attribute set to true in columnDisplay', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumnsWithIds}
      items={defaultItems}
      columnDisplay={[
        { id: 'id', visible: true },
        { id: 'name', visible: false },
      ]}
    />
  );
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['id']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(2, 1)!.getElement()).toContainHTML('2');
  expect(wrapper.findBodyCell(2, 2)).toBeNull();
});

test('should not render columns not included in columnDisplay', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumnsWithIds}
      items={defaultItems}
      columnDisplay={[{ id: 'id', visible: true }]}
    />
  );
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['id']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(2, 1)!.getElement()).toContainHTML('2');
  expect(wrapper.findBodyCell(2, 2)).toBeNull();
});

test('should render columns in the order specified by columnDisplay', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumnsWithIds}
      items={defaultItems}
      columnDisplay={[
        { id: 'name', visible: true },
        { id: 'id', visible: true },
      ]}
    />
  );
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['name', 'id']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(2, 1)!.getElement()).toContainHTML('Oranges');
  expect(wrapper.findBodyCell(2, 2)!.getElement()).toContainHTML('2');
});

test('should ignore visibleColumns if columnDisplay is set', () => {
  const { wrapper } = renderTable(
    <Table
      columnDefinitions={defaultColumnsWithIds}
      items={defaultItems}
      columnDisplay={[
        { id: 'id', visible: false },
        { id: 'name', visible: true },
      ]}
      visibleColumns={['id']}
    />
  );
  expect(wrapper.findColumnHeaders().map(getHeaderHtmlContent)).toEqual(['name']);
  expect(wrapper.findEmptySlot()).toBeNull();
  expect(wrapper.findLoadingText()).toBeNull();
  expect(wrapper.findRows()).toHaveLength(3);
  expect(wrapper.findBodyCell(2, 1)!.getElement()).toContainHTML('Oranges');
  expect(wrapper.findBodyCell(2, 2)).toBeNull();
});

test('inner state is tracked by row index by default', () => {
  const { rerender, getByTestId, queryByTestId } = renderTable(
    <Table columnDefinitions={statefulColumns} items={defaultItems} />
  );
  fireEvent.click(getByTestId('increment-1-2'));
  expect(queryByTestId('display-1-1')).toHaveTextContent('0');
  expect(queryByTestId('display-1-2')).toHaveTextContent('1');
  expect(queryByTestId('display-1-3')).toHaveTextContent('0');
  rerender(<Table columnDefinitions={statefulColumns} items={defaultItems.slice(1)} />);
  expect(queryByTestId('display-1-1')).toBeNull();
  expect(queryByTestId('display-1-2')).toHaveTextContent('0');
  expect(queryByTestId('display-1-3')).toHaveTextContent('1');
});

test('preserve state after reordering items with track by', () => {
  const { rerender, getByTestId, queryByTestId } = renderTable(
    <Table columnDefinitions={statefulColumns} items={defaultItems} trackBy="id" />
  );
  fireEvent.click(getByTestId('increment-1-2'));
  expect(queryByTestId('display-1-1')).toHaveTextContent('0');
  expect(queryByTestId('display-1-2')).toHaveTextContent('1');
  expect(queryByTestId('display-1-3')).toHaveTextContent('0');
  rerender(<Table columnDefinitions={statefulColumns} items={defaultItems.slice(1)} trackBy="id" />);
  expect(queryByTestId('display-1-1')).toBeNull();
  expect(queryByTestId('display-1-2')).toHaveTextContent('1');
  expect(queryByTestId('display-1-3')).toHaveTextContent('0');
});

test('track by can be a function', () => {
  const trackByFn: TableProps.TrackBy<Item> = item => item.id + item.name;
  const { rerender, getByTestId, queryByTestId } = renderTable(
    <Table columnDefinitions={statefulColumns} items={defaultItems} trackBy={trackByFn} />
  );
  fireEvent.click(getByTestId('increment-1-2'));
  expect(queryByTestId('display-1-2')).toHaveTextContent('1');
  rerender(<Table columnDefinitions={statefulColumns} items={defaultItems.slice(1)} trackBy={trackByFn} />);
  expect(queryByTestId('display-1-2')).toHaveTextContent('1');
});

test('inner state is tracked by column index by default', () => {
  const { rerender, getByTestId, queryByTestId } = renderTable(
    <Table columnDefinitions={statefulColumns} items={defaultItems} />
  );
  fireEvent.click(getByTestId('increment-2-1'));
  expect(queryByTestId('display-1-1')).toHaveTextContent('0');
  expect(queryByTestId('display-2-1')).toHaveTextContent('1');
  rerender(<Table columnDefinitions={statefulColumns.slice(1)} items={defaultItems} />);
  expect(queryByTestId('display-1-1')).toBeNull();
  expect(queryByTestId('display-2-1')).toHaveTextContent('0');
});

test('inner state can be tracked by column id', () => {
  const statefulColumnsWithId = statefulColumns.map((column, index) => ({ ...column, id: `${index}` }));
  const { rerender, getByTestId, queryByTestId } = renderTable(
    <Table columnDefinitions={statefulColumnsWithId} items={defaultItems} />
  );
  fireEvent.click(getByTestId('increment-2-1'));
  expect(queryByTestId('display-1-1')).toHaveTextContent('0');
  expect(queryByTestId('display-2-1')).toHaveTextContent('1');
  rerender(<Table columnDefinitions={statefulColumnsWithId.slice(1)} items={defaultItems} />);
  expect(queryByTestId('display-1-1')).toBeNull();
  expect(queryByTestId('display-2-1')).toHaveTextContent('1');
});

test('should submit edits successfully', async () => {
  const data = {
    name: 'apple',
  };

  const mockSubmitFn = jest.fn();

  const submitEditFn = async (item: typeof data, column: any, value: any) => {
    mockSubmitFn(item, column, value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    data.name = value;
  };

  const { wrapper } = renderTable(
    <Table<{ name: string }>
      columnDefinitions={[
        {
          id: 'name',
          header: 'Name',
          cell: item => <input type="text" id="test-input" value={item.name} readOnly={true} disabled={true} />,
          editConfig: {
            ariaLabel: 'test-name',
            constraintText: 'test-constraint',
            editingCell: (item, { setValue, currentValue }) => (
              <input
                type="text"
                id="test-input"
                onChange={e => setValue(e.target.value)}
                value={currentValue ?? item.name}
                disabled={false}
              />
            ),
          },
        },
      ]}
      items={[data]}
      ariaLabels={{
        activateEditLabel() {
          return 'activate-edit';
        },
        cancelEditLabel() {
          return 'cancel-edit';
        },
        submitEditLabel() {
          return 'save-edit';
        },
      }}
      submitEdit={submitEditFn}
    />
  );

  const bodyCell = wrapper.find('td');
  const button = wrapper.findEditCellButton(1, 1);

  // activate edit
  fireEvent.click(button!.getElement()!);

  expect(bodyCell?.getElement()?.querySelector('input')).not.toBeDisabled();
  fireEvent.change(bodyCell!.getElement()!.querySelector('input')!, {
    target: { value: 'banana' },
  });

  // submit edit
  fireEvent.click(bodyCell!.findButton(`[aria-label="save-edit"]`)!.getElement()!);
  expect(mockSubmitFn).toHaveBeenCalled();
  expect(bodyCell!.findButton(`[aria-label="save-edit"]`)?.findLoadingIndicator()?.getElement()).toBeVisible();
  await waitFor(() => {
    expect(data.name).toBe('banana');
  });
});
