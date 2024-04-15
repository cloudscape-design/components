// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderTable(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findTable()!;
  return { wrapper, rerender };
}

function getStyle(wrapper: ElementWrapper) {
  const { width, minWidth, maxWidth } = wrapper.getElement().style;
  return { width, minWidth, maxWidth };
}

const EMPTY_STYLE = { minWidth: '', width: '', maxWidth: '' };

interface Item {
  id: number;
  text: string;
}

const defaultItems = [{ id: 0, text: 'test' }];

test('assigns width configuration to columns', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { header: 'id', cell: item => item.id, minWidth: '30%', width: '50%', maxWidth: '80%' },
    { header: 'text', cell: item => item.text },
  ];
  const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} />);

  expect(getStyle(wrapper.findColumnHeaders()[0])).toEqual({ minWidth: '30%', width: '50%', maxWidth: '80%' });
  expect(getStyle(wrapper.findColumnHeaders()[1])).toEqual(EMPTY_STYLE);
  expect(getStyle(wrapper.findBodyCell(1, 1)!)).toEqual({ minWidth: '30%', width: '50%', maxWidth: '80%' });
  expect(getStyle(wrapper.findBodyCell(1, 2)!)).toEqual(EMPTY_STYLE);
  expect(warnOnce).not.toHaveBeenCalled();
});

// table-layout: fixed considers only the width of the thead content, we can skip rendering the rows for performance
test('assigns width configuration only to header resizable columns are enabled', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { header: 'id', cell: item => item.id, minWidth: 300, width: 300, maxWidth: '60%' },
    { header: 'text', cell: item => item.text },
  ];
  const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} resizableColumns={true} />);
  expect(getStyle(wrapper.findColumnHeaders()[0])).toEqual({ minWidth: '300px', width: '300px', maxWidth: '' });
  expect(getStyle(wrapper.findColumnHeaders()[1])).toEqual({ minWidth: '', width: '120px', maxWidth: '' });
  expect(getStyle(wrapper.findBodyCell(1, 1)!)).toEqual(EMPTY_STYLE);
  expect(getStyle(wrapper.findBodyCell(1, 2)!)).toEqual(EMPTY_STYLE);
  expect(warnOnce).not.toHaveBeenCalled();
});

test('assigns width to middle column to prevent it from collapsing', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { header: 'first', cell: () => '-', width: 300 },
    { header: 'no-width', cell: () => '-' },
    { header: 'last', cell: () => '-', width: 300 },
  ];
  const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} resizableColumns={true} />);
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual([
    '300px',
    '120px',
    '300px',
  ]);
  expect(warnOnce).not.toHaveBeenCalled();
});

test('should render correct width for newly inserted column', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { id: 'id', header: '', cell: item => item.id, width: 100 },
    { id: 'name', header: '', cell: () => '-', width: 200 },
    { id: 'description', header: '', cell: () => '-', width: 300 },
  ];
  const { wrapper, rerender } = renderTable(
    <Table
      columnDefinitions={columns}
      visibleColumns={['id', 'description']}
      items={defaultItems}
      resizableColumns={true}
    />
  );
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual(['100px', '300px']);
  rerender(
    <Table
      columnDefinitions={columns}
      visibleColumns={['id', 'name', 'description']}
      items={defaultItems}
      resizableColumns={true}
    />
  );

  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual([
    '100px',
    '200px',
    '300px',
  ]);
  expect(warnOnce).not.toHaveBeenCalled();
});

test('should use the fallback value for columns without explicit width', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { id: 'id', header: '', cell: item => item.id, width: 100 },
    { id: 'name', header: '', cell: () => '-' },
    { id: 'description', header: '', cell: () => '-' },
  ];
  const { wrapper, rerender } = renderTable(
    <Table columnDefinitions={columns} visibleColumns={['id', 'name']} items={defaultItems} resizableColumns={true} />
  );
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual(['100px', '120px']);
  rerender(
    <Table
      columnDefinitions={columns}
      visibleColumns={['id', 'name', 'description']}
      items={defaultItems}
      resizableColumns={true}
    />
  );
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual([
    '100px',
    '120px',
    '120px',
  ]);
});

describe('reading widths from the DOM', () => {
  const originalBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  beforeEach(() => {
    HTMLElement.prototype.getBoundingClientRect = function () {
      const rect = originalBoundingClientRect.apply(this);
      if (this.tagName === 'TH') {
        rect.width = 20;
      }
      return rect;
    };
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalBoundingClientRect;
  });

  test('should take at least min-width if the width is not defined', () => {
    const columns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'id', header: 'id', cell: () => '-' },
      { id: 'name', header: 'name', cell: () => '-', minWidth: 100 },
      { id: 'description', header: '', cell: () => '-', minWidth: 200 },
    ];
    const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} resizableColumns={true} />);
    expect(wrapper.findColumnHeaders().map(column => column.getElement().style.inlineSize)).toEqual([
      '120px',
      '100px',
      '200px',
    ]);
  });
});

test('prints a warning when resizable columns have non-numeric minWidth', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [{ header: 'id', cell: item => item.id, minWidth: '100px' }];
  renderTable(<Table columnDefinitions={columns} items={defaultItems} resizableColumns={true} />);
  expect(warnOnce).toHaveBeenCalledWith(
    'Table',
    expect.stringContaining('requires minWidth property to be a number, got 100px')
  );
});

test('prints a warning when resizable columns have non-numeric width', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [{ header: 'id', cell: item => item.id, width: '50%' }];
  renderTable(<Table columnDefinitions={columns} items={defaultItems} resizableColumns={true} />);
  expect(warnOnce).toHaveBeenCalledWith(
    'Table',
    expect.stringContaining('requires width property to be a number, got 50%')
  );
});

describe('with stickyHeader=true', () => {
  const originalFn = window.CSS.supports;
  beforeEach(() => {
    window.CSS.supports = jest.fn().mockReturnValue(true);
  });

  afterEach(() => {
    window.CSS.supports = originalFn;
  });

  test('mirrors column width on sticky header copy, but not minWidth/maxWidth', () => {
    const extractSize = (thead: ElementWrapper) =>
      thead.findAll('tr > *').map(column => {
        const { minWidth, maxWidth, width } = column.getElement().style;
        return { minWidth, maxWidth, width };
      });
    const columns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'id', header: 'id', cell: () => '-', width: 200 },
      { id: undefined, header: 'unknown', cell: () => '-', width: 300 },
      { id: 'name', header: 'name', cell: () => '-', minWidth: 100 },
      { id: 'description', header: '', cell: () => '-', maxWidth: 300 },
    ];
    const { wrapper } = renderTable(<Table columnDefinitions={columns} items={defaultItems} stickyHeader={true} />);
    const [fakeHeader, realHeader] = wrapper.findAll('thead');
    expect(extractSize(realHeader)).toEqual([
      { minWidth: '', width: '200px', maxWidth: '' },
      { minWidth: '', width: '300px', maxWidth: '' },
      { minWidth: '100px', width: '', maxWidth: '' },
      { minWidth: '', width: '', maxWidth: '300px' },
    ]);
    expect(extractSize(fakeHeader)).toEqual([
      { minWidth: '', width: '200px', maxWidth: '' },
      { minWidth: '', width: '300px', maxWidth: '' },
      { minWidth: '', width: '', maxWidth: '' },
      { minWidth: '', width: '', maxWidth: '' },
    ]);
  });
});
