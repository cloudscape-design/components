// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Table, { TableProps } from '../../../lib/components/table';
import { ColumnWidthsProvider, useColumnWidths } from '../../../lib/components/table/use-column-widths';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import { fakeBoundingClientRect, firePointerdown, firePointermove, firePointerup } from './utils/resize-actions';

jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => ({
  ...jest.requireActual('../../../lib/components/internal/utils/scrollable-containers'),
  getOverflowParents: jest.fn(() => {
    const overflowParent = document.createElement('div');
    overflowParent.style.width = '1000px';
    overflowParent.getBoundingClientRect = fakeBoundingClientRect;
    return [overflowParent];
  }),
}));

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

test('useColumnWidths returns safe defaults without provider', () => {
  function Bare() {
    const ctx = useColumnWidths();
    expect(ctx.getColumnStyles(false, 'x')).toEqual({});
    expect(ctx.columnWidths).toEqual(new Map());
    expect(() => ctx.updateColumn('x', 100)).not.toThrow();
    expect(() => ctx.updateGroup('x', 100)).not.toThrow();
    expect(() => ctx.setCell(false, 'x', null)).not.toThrow();
    expect(() => ctx.setCol('x', null)).not.toThrow();
    return null;
  }
  render(<Bare />);
});

test('updateGroup does not crash without groupColumnMap', () => {
  let updateGroup: (groupId: PropertyKey, width: number) => void;
  function Consumer() {
    ({ updateGroup } = useColumnWidths());
    return null;
  }
  const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLElement>;
  render(
    <ColumnWidthsProvider visibleColumns={[]} resizableColumns={true} containerRef={containerRef}>
      <Consumer />
    </ColumnWidthsProvider>
  );
  // No groupColumnMap passed → guard returns early
  expect(() => updateGroup!('any', 200)).not.toThrow();
});

test('updateGroup does not crash for unknown groupId', () => {
  let updateGroup: (groupId: PropertyKey, width: number) => void;
  function Consumer() {
    ({ updateGroup } = useColumnWidths());
    return null;
  }
  const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLElement>;
  render(
    <ColumnWidthsProvider
      visibleColumns={[]}
      resizableColumns={true}
      containerRef={containerRef}
      groupColumnMap={new Map([['g1', ['a', 'b']]])}
    >
      <Consumer />
    </ColumnWidthsProvider>
  );
  // groupColumnMap exists but 'unknown' not in it → columnIds=[], rightmostColumn undefined → guard returns
  expect(() => updateGroup!('unknown', 200)).not.toThrow();
});

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
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual([
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
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual(['100px', '300px']);
  rerender(
    <Table
      columnDefinitions={columns}
      visibleColumns={['id', 'name', 'description']}
      items={defaultItems}
      resizableColumns={true}
    />
  );

  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual([
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
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual(['100px', '120px']);
  rerender(
    <Table
      columnDefinitions={columns}
      visibleColumns={['id', 'name', 'description']}
      items={defaultItems}
      resizableColumns={true}
    />
  );
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual([
    '100px',
    '120px',
    '120px',
  ]);
});

test('should respect minWidth when dynamically adding columns via visibleColumns', () => {
  const columns: TableProps.ColumnDefinition<Item>[] = [
    { id: 'id', header: '', cell: item => item.id, width: 100 },
    { id: 'small-width', header: '', cell: () => '-', width: 80, minWidth: 150 },
    { id: 'width-only', header: '', cell: () => '-', width: 180 },
    { id: 'minWidth-larger', header: '', cell: () => '-', width: 180, minWidth: 200 },
    { id: 'no-width-no-minWidth', header: '', cell: () => '-' },
    { id: 'no-width-minWidth-large', header: '', cell: () => '-', minWidth: 200 },
    { id: 'no-width-minWidth-small', header: '', cell: () => '-', minWidth: 80 },
    { id: 'width-larger-than-minWidth', header: '', cell: () => '-', width: 200, minWidth: 100 },
  ];
  const { wrapper, rerender } = renderTable(
    <Table columnDefinitions={columns} visibleColumns={['id']} items={defaultItems} resizableColumns={true} />
  );
  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual(['100px']);

  // Dynamically add columns with various width/minWidth configurations
  rerender(
    <Table
      columnDefinitions={columns}
      visibleColumns={[
        'id',
        'small-width',
        'width-only',
        'minWidth-larger',
        'no-width-no-minWidth',
        'no-width-minWidth-large',
        'no-width-minWidth-small',
        'width-larger-than-minWidth',
      ]}
      items={defaultItems}
      resizableColumns={true}
    />
  );

  expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual([
    '100px', // original column unchanged
    '150px', // width=80, minWidth=150 -> use minWidth because 150 > 80
    '180px', // width=180, no minWidth -> minWidth defaults to width, use 180
    '200px', // width=180, minWidth=200 -> use minWidth because 200 > 180
    '120px', // no width, no minWidth -> width defaults to DEFAULT (120), minWidth defaults to width
    '200px', // no width, minWidth=200 -> width defaults to DEFAULT (120), minWidth=200 -> use 200
    '120px', // no width, minWidth=80 -> width defaults to DEFAULT (120), minWidth=80 -> use 120
    '200px', // width=200, minWidth=100 -> use width because 200 > 100
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
    expect(wrapper.findColumnHeaders().map(column => column.getElement().style.width)).toEqual([
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

describe('with grouped columns', () => {
  const groupedColumns: TableProps.ColumnDefinition<Item>[] = [
    { id: 'id', header: 'ID', cell: item => item.id, width: 150 },
    { id: 'name', header: 'Name', cell: item => item.text, width: 150 },
    { id: 'type', header: 'Type', cell: () => '-', width: 200 },
    { id: 'az', header: 'AZ', cell: () => '-', width: 200 },
  ];
  const groupDefinitions: TableProps.GroupDefinition<Item>[] = [{ id: 'config', header: 'Configuration' }];
  const columnDisplay: TableProps.ColumnDisplayProperties[] = [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'config',
      visible: true,
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
      ],
    },
  ];

  function renderGroupedTable(props: Partial<TableProps<Item>> = {}) {
    const { container } = render(
      <Table
        columnDefinitions={groupedColumns}
        items={defaultItems}
        groupDefinitions={groupDefinitions}
        columnDisplay={columnDisplay}
        resizableColumns={true}
        {...props}
      />
    );
    return createWrapper(container).findTable()!;
  }

  test('renders colgroup with col elements for grouped resizable table', () => {
    const wrapper = renderGroupedTable();
    const cols = wrapper.getElement().querySelectorAll('colgroup col');
    expect(cols.length).toBe(4);
  });

  test('assigns widths to columns in grouped table', () => {
    const wrapper = renderGroupedTable();
    const columnCells = wrapper.findAll('thead th[scope="col"]');
    expect(columnCells[0].getElement().style.width).toBe('150px');
    expect(columnCells[1].getElement().style.width).toBe('150px');
    expect(columnCells[2].getElement().style.width).toBe('200px');
    expect(columnCells[3].getElement().style.width).toBe('200px');
  });

  test('resizing a group applies the width delta to the last column in the group', () => {
    const onColumnWidthsChange = jest.fn();
    const wrapper = renderGroupedTable({ onColumnWidthsChange });
    const groupCell = wrapper.find('thead th[scope="colgroup"]')!;
    const resizerBtn = new ElementWrapper(groupCell.find('button')!.getElement());

    firePointerdown(resizerBtn);
    firePointermove(500);
    firePointerup(500);

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    // Group total was 400 (200+200), resized to 500 → delta 100 applied to last column 'az'
    expect(onColumnWidthsChange.mock.calls[0][0].detail).toEqual({ widths: [150, 150, 200, 300] });
  });

  test('shrinking a group only reduces the last column in the group', () => {
    const onColumnWidthsChange = jest.fn();
    const wrapper = renderGroupedTable({ onColumnWidthsChange });
    const groupCell = wrapper.find('thead th[scope="colgroup"]')!;
    const resizerBtn = new ElementWrapper(groupCell.find('button')!.getElement());

    firePointerdown(resizerBtn);
    firePointermove(350);
    firePointerup(350);

    // Group shrunk from 400 to 350 → delta -50 applied to last column 'az' (200→150)
    expect(onColumnWidthsChange.mock.calls[0][0].detail).toEqual({ widths: [150, 150, 200, 150] });
  });

  test('resizing a split group applies delta to the last column of the split half', () => {
    const onColumnWidthsChange = jest.fn();
    const wrapper = renderGroupedTable({ onColumnWidthsChange, stickyColumns: { first: 3 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    // With stickyColumns.first=3: id(0), name(1), type(2) are sticky.
    // config group (type, az) straddles boundary → split into left (type) and right (az).
    const leftSplitCell = groupCells[0];
    const leftResizerBtn = new ElementWrapper(leftSplitCell.find('button')!.getElement());

    firePointerdown(leftResizerBtn);
    firePointermove(250);
    firePointerup(250);

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);

    // Also resize the right half of the split group
    onColumnWidthsChange.mockClear();
    const rightSplitCell = groupCells[1];
    const rightResizerBtn = rightSplitCell.find('button');
    if (rightResizerBtn) {
      firePointerdown(new ElementWrapper(rightResizerBtn.getElement()));
      firePointermove(300);
      firePointerup(300);
      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    }
  });

  test('renders colgroup with selection col for grouped table', () => {
    const wrapper = renderGroupedTable({ selectionType: 'multi' });
    const cols = wrapper.getElement().querySelectorAll('colgroup col');
    // 4 data columns + 1 selection col
    expect(cols.length).toBe(5);
  });
});
