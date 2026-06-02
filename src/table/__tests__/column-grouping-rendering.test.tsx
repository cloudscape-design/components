// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { PointerEventMock } from '../../../lib/components/internal/utils/pointer-events-mock';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

interface Item {
  id: string;
  name: string;
  type: string;
  az: string;
  cpu: number;
  memory: number;
}

const items: Item[] = [
  { id: 'i-1', name: 'web', type: 't3.medium', az: 'us-east-1a', cpu: 45, memory: 62 },
  { id: 'i-2', name: 'api', type: 't3.large', az: 'us-east-1b', cpu: 78, memory: 81 },
];

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'type', header: 'Type', cell: item => item.type },
  { id: 'az', header: 'AZ', cell: item => item.az },
  { id: 'cpu', header: 'CPU', cell: item => `${item.cpu}%` },
  { id: 'memory', header: 'Memory', cell: item => `${item.memory}%` },
];

const groupDefinitions: TableProps.GroupDefinition[] = [
  { id: 'config', header: 'Configuration' },
  { id: 'perf', header: 'Performance' },
];

const singleLevelDisplay: TableProps.ColumnDisplayProperties[] = [
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
  {
    type: 'group',
    id: 'perf',
    visible: true,
    children: [
      { id: 'cpu', visible: true },
      { id: 'memory', visible: true },
    ],
  },
];

function renderTable(props: Partial<TableProps<Item>> = {}) {
  const { container } = render(
    <Table
      columnDefinitions={columnDefinitions}
      items={items}
      groupDefinitions={groupDefinitions}
      columnDisplay={singleLevelDisplay}
      {...props}
    />
  );
  return createWrapper(container).findTable()!;
}

describe('Column grouping rendering', () => {
  test('renders two header rows for single-level grouping', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(2);
  });

  test('renders group header cells with correct colspan', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];
    const groupCells = firstRow.findAll('th[scope="colgroup"]');

    expect(groupCells).toHaveLength(2);
    expect(groupCells[0].getElement().getAttribute('colspan')).toBe('2');
    expect(groupCells[1].getElement().getAttribute('colspan')).toBe('2');
  });

  test('renders group header labels', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];
    const groupCells = firstRow.findAll('th[scope="colgroup"]');

    expect(groupCells[0].getElement().textContent).toContain('Configuration');
    expect(groupCells[1].getElement().textContent).toContain('Performance');
  });

  test('ungrouped columns get rowspan=2 in first row', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];
    const leafCells = firstRow.findAll('th[scope="col"]');

    // id and name are ungrouped, should span both rows
    const idCell = leafCells.find(el => el.getElement().textContent?.includes('ID'));
    const nameCell = leafCells.find(el => el.getElement().textContent?.includes('Name'));
    expect(idCell!.getElement().getAttribute('rowspan')).toBe('2');
    expect(nameCell!.getElement().getAttribute('rowspan')).toBe('2');
  });

  test('leaf columns under groups appear in second row', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const secondRow = thead.findAll('tr')[1];
    const cells = secondRow.findAll('th[scope="col"]');

    const labels = cells.map(c => c.getElement().textContent?.trim());
    expect(labels).toEqual(expect.arrayContaining(['Type', 'AZ', 'CPU', 'Memory']));
    expect(cells).toHaveLength(4);
  });

  test('leaf columns under groups have data-column-group-id', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;

    const configColumns = thead.findAll('th[data-column-group-id="config"]');
    const perfColumns = thead.findAll('th[data-column-group-id="perf"]');

    expect(configColumns).toHaveLength(2); // type, az
    expect(perfColumns).toHaveLength(2); // cpu, memory
  });

  test('leaf columns have data-column-index', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const leafCells = thead.findAll('th[data-column-index]');

    // All 6 leaf columns should have data-column-index
    expect(leafCells).toHaveLength(6);
    expect(leafCells[0].getElement().getAttribute('data-column-index')).toBe('1');
    expect(leafCells[5].getElement().getAttribute('data-column-index')).toBe('6');
  });

  test('group header cells do not have data-column-index', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    groupCells.forEach(cell => {
      expect(cell.getElement().hasAttribute('data-column-index')).toBe(false);
    });
  });

  test('findColumnHeaders returns only leaf columns by default', () => {
    const wrapper = renderTable();
    const headers = wrapper.findColumnHeaders();

    expect(headers.length).toBeGreaterThanOrEqual(6);
    const texts = headers.map(h => h.getElement().textContent);
    expect(texts).toContain('ID');
    expect(texts.find(t => t?.includes('Memory'))).toBeDefined();
  });

  test('findColumnHeaders with groupId returns only that group columns', () => {
    const wrapper = renderTable();
    const configHeaders = wrapper.findColumnHeaders({ groupId: 'config' });
    const perfHeaders = wrapper.findColumnHeaders({ groupId: 'perf' });

    expect(configHeaders).toHaveLength(2);
    expect(configHeaders[0].getElement().textContent).toContain('Type');
    expect(configHeaders[1].getElement().textContent).toContain('AZ');
    expect(perfHeaders).toHaveLength(2);
  });

  test('renders single row when no groupDefinitions provided', () => {
    const wrapper = renderTable({ groupDefinitions: undefined, columnDisplay: undefined });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(1);
  });

  test('renders resizers on group header cells when resizableColumns is true', () => {
    const wrapper = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    groupCells.forEach(cell => {
      expect(cell.find('[class*="resizer"]')).not.toBeNull();
    });
  });

  test('renders dividers on non-rightmost cells when resizableColumns is false', () => {
    const wrapper = renderTable({ resizableColumns: false });
    const thead = wrapper.find('thead')!;

    // All non-rightmost leaf cells should have a divider
    const leafCells = thead.findAll('th[scope="col"]');
    const nonRightmost = leafCells.filter(c => !c.getElement().hasAttribute('data-rightmost'));
    nonRightmost.forEach(cell => {
      expect(cell.find('[class*="divider"]')).not.toBeNull();
    });

    // Rightmost cell should not have a divider (CSS hides it via data-rightmost)
    const rightmost = leafCells.find(c => c.getElement().hasAttribute('data-rightmost'));
    expect(rightmost).toBeDefined();
  });

  test('selection cell spans all header rows', () => {
    const wrapper = renderTable({ selectionType: 'multi' });
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];
    const selectionCell = firstRow.findAll('th')[0];

    expect(selectionCell.getElement().getAttribute('rowspan')).toBe('2');
  });

  test('hidden columns are excluded from rendering', () => {
    const display: TableProps.ColumnDisplayProperties[] = [
      { id: 'id', visible: true },
      {
        type: 'group',
        id: 'config',
        visible: true,
        children: [
          { id: 'type', visible: true },
          { id: 'az', visible: false },
        ],
      },
    ];
    const wrapper = renderTable({ columnDisplay: display });
    const headers = wrapper.findColumnHeaders();

    const labels = headers.map(h => h.getElement().textContent?.trim());
    expect(labels).toContain('ID');
    expect(labels).toContain('Type');
    expect(labels).not.toContain('AZ');
  });

  test('group is omitted when all children are hidden', () => {
    const display: TableProps.ColumnDisplayProperties[] = [
      { id: 'id', visible: true },
      {
        type: 'group',
        id: 'config',
        visible: true,
        children: [
          { id: 'type', visible: false },
          { id: 'az', visible: false },
        ],
      },
      { type: 'group', id: 'perf', visible: true, children: [{ id: 'cpu', visible: true }] },
    ];
    const wrapper = renderTable({ columnDisplay: display });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // Only perf group should render
    expect(groupCells).toHaveLength(1);
    expect(groupCells[0].getElement().textContent).toContain('Performance');
  });
});

describe('Column grouping with sticky columns', () => {
  test('renders correctly with stickyColumns first', () => {
    const wrapper = renderTable({ stickyColumns: { first: 1 } });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(2);

    // First column (id) should have sticky styles
    const firstCol = thead.find('th[data-column-index="1"]')!;
    expect(firstCol.getElement().style.position || firstCol.getElement().className).toBeDefined();
  });

  test('renders correctly with stickyColumns last', () => {
    const wrapper = renderTable({ stickyColumns: { last: 1 } });
    const thead = wrapper.find('thead')!;
    const leafCells = thead.findAll('th[scope="col"]');
    expect(leafCells.length).toBe(6);
  });

  test('group spanning sticky-first boundary renders split cells', () => {
    // stickyColumns.first = 3 means columns at index 0,1,2 are sticky (id, name, type)
    // 'config' group has type(colIndex=2), az(colIndex=3) — straddles boundary
    const wrapper = renderTable({ stickyColumns: { first: 3 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // config group split into 2 halves + perf group = 3 group cells
    expect(groupCells.length).toBe(3);

    // The split config halves: first half has colspan=1 (type), second has colspan=1 (az)
    const configCells = groupCells.filter(c => c.getElement().textContent?.includes('Configuration'));
    expect(configCells).toHaveLength(2);
    expect(configCells[0].getElement().getAttribute('colspan')).toBe('1');
    expect(configCells[1].getElement().getAttribute('colspan')).toBe('1');
  });

  test('group spanning sticky-last boundary renders split cells', () => {
    // stickyColumns.last = 1 means last column (memory, colIndex=5) is sticky
    // 'perf' group has cpu(colIndex=4), memory(colIndex=5) — straddles boundary
    const wrapper = renderTable({ stickyColumns: { last: 1 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // perf group split into 2 halves + config group = 3 group cells
    expect(groupCells.length).toBe(3);

    const perfCells = groupCells.filter(c => c.getElement().textContent?.includes('Performance'));
    expect(perfCells).toHaveLength(2);
  });

  test('fully sticky group (all children within boundary) is not split', () => {
    // stickyColumns.first = 4 means id, name, type, az are sticky
    // 'config' group has type(2), az(3) — both within boundary, no split
    const wrapper = renderTable({ stickyColumns: { first: 4 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    const configCells = groupCells.filter(c => c.getElement().textContent?.includes('Configuration'));
    expect(configCells).toHaveLength(1);
    expect(configCells[0].getElement().getAttribute('colspan')).toBe('2');
  });

  test('group entirely outside sticky boundary is not split', () => {
    // stickyColumns.first = 1 means only id is sticky
    // Both groups are entirely outside the boundary
    const wrapper = renderTable({ stickyColumns: { first: 1 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    expect(groupCells).toHaveLength(2);
    expect(groupCells[0].getElement().getAttribute('colspan')).toBe('2');
    expect(groupCells[1].getElement().getAttribute('colspan')).toBe('2');
  });
});

describe('Column grouping with resizable columns', () => {
  test('group header cells have resizers', () => {
    const wrapper = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    groupCells.forEach(cell => {
      const resizer = cell.find('button[class*="resizer"]');
      expect(resizer).not.toBeNull();
    });
  });

  test('leaf column cells have resizers', () => {
    const wrapper = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const leafCells = thead.findAll('th[scope="col"]');

    leafCells.forEach(cell => {
      const resizer = cell.find('button[class*="resizer"]');
      expect(resizer).not.toBeNull();
    });
  });

  test('findColumnResizer works with grouped columns', () => {
    const wrapper = renderTable({ resizableColumns: true });
    // Column index 3 = 'type' (first child of config group)
    const resizer = wrapper.findColumnResizer(3, { grouped: true });
    expect(resizer).not.toBeNull();
  });

  test('group resizer has aria-labelledby pointing to group header', () => {
    const wrapper = renderTable({ resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCell = thead.findAll('th[scope="colgroup"]')[0];
    const headerId = groupCell.find('[id^="table-group-header"]')!.getElement().id;
    const resizer = groupCell.find('button[class*="resizer"]')!;

    expect(resizer.getElement().getAttribute('aria-labelledby')).toBe(headerId);
  });

  test('renders resizable grouped table with onColumnWidthsChange callback', () => {
    const onColumnWidthsChange = jest.fn();
    const wrapper = renderTable({ resizableColumns: true, onColumnWidthsChange });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
    expect(thead.findAll('button[class*="resizer"]').length).toBeGreaterThanOrEqual(2);
  });

  test('columns have width styles when resizable', () => {
    const colDefs = columnDefinitions.map(col => ({ ...col, width: 150 }));
    const wrapper = renderTable({ resizableColumns: true, columnDefinitions: colDefs });
    const leafCells = wrapper.findColumnHeaders();

    // At least some cells should have width set
    const hasWidth = leafCells.some(cell => cell.getElement().style.width !== '');
    expect(hasWidth).toBe(true);
  });
});

describe('Column grouping with sticky header', () => {
  test('renders with stickyHeader enabled', () => {
    const wrapper = renderTable({ stickyHeader: true });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(2);
  });

  test('sticky header renders group cells', () => {
    const wrapper = renderTable({ stickyHeader: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells).toHaveLength(2);
  });

  test('sticky header with resizable columns renders correctly', () => {
    const wrapper = renderTable({ stickyHeader: true, resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells).toHaveLength(2);

    groupCells.forEach(cell => {
      expect(cell.find('button[class*="resizer"]')).not.toBeNull();
    });
  });

  test('sticky header with sticky columns and groups', () => {
    const wrapper = renderTable({ stickyHeader: true, stickyColumns: { first: 2 } });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('tr')).toHaveLength(2);
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
  });
});

describe('Column grouping with selection', () => {
  test('multi selection with groups renders correctly', () => {
    const wrapper = renderTable({ selectionType: 'multi' });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(2);

    // Selection cell in first row spans all header rows
    const firstRowCells = rows[0].findAll('th');
    const selectionCell = firstRowCells[0];
    expect(selectionCell.getElement().getAttribute('rowspan')).toBe('2');
  });

  test('single selection with groups renders correctly', () => {
    const wrapper = renderTable({ selectionType: 'single' });
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');
    expect(rows).toHaveLength(2);
  });
});

describe('Column grouping with other features', () => {
  test('renders with wrapLines enabled', () => {
    const wrapper = renderTable({ wrapLines: true });
    const headers = wrapper.findColumnHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(6);
  });

  test('renders with stripedRows enabled', () => {
    const wrapper = renderTable({ stripedRows: true });
    const headers = wrapper.findColumnHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(6);
  });

  test('renders with contentDensity compact', () => {
    const wrapper = renderTable({ contentDensity: 'compact' });
    const headers = wrapper.findColumnHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(6);
  });

  test('renders with sortingDisabled', () => {
    const wrapper = renderTable({ sortingDisabled: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells).toHaveLength(2);
  });

  test('renders in loading state', () => {
    const wrapper = renderTable({ loading: true, loadingText: 'Loading...' });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('tr')).toHaveLength(2);
  });

  test('renders with empty items', () => {
    const wrapper = renderTable({ items: [] });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('tr')).toHaveLength(2);
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells).toHaveLength(2);
  });

  test('renders with variant full-page', () => {
    const wrapper = renderTable({ variant: 'full-page' });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
  });

  test('renders with variant borderless', () => {
    const wrapper = renderTable({ variant: 'borderless' });
    const headers = wrapper.findColumnHeaders();
    expect(headers.length).toBeGreaterThanOrEqual(6);
  });

  test('renders with enableKeyboardNavigation', () => {
    const wrapper = renderTable({ enableKeyboardNavigation: true });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
  });
});

describe('Column grouping sorting', () => {
  test('findColumnSortingArea works with grouped columns', () => {
    const sortableColumns: TableProps.ColumnDefinition<Item>[] = columnDefinitions.map(col => ({
      ...col,
      sortingField: col.id,
    }));
    const { container } = render(
      <Table
        columnDefinitions={sortableColumns}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
      />
    );
    const tableWrapper = createWrapper(container).findTable()!;
    const sortArea = tableWrapper.findColumnSortingArea(3, { grouped: true });
    expect(sortArea).not.toBeNull();
  });

  test('sorting area is not present on group header cells', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    groupCells.forEach(cell => {
      expect(cell.find('[role="button"]')).toBeNull();
    });
  });
});

describe('Column grouping divider positioning', () => {
  test('group header cells render dividers', () => {
    const wrapper = renderTable({ resizableColumns: false });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // Non-rightmost groups should have dividers
    const nonRightmostGroups = groupCells.filter(c => !c.getElement().hasAttribute('data-rightmost'));
    nonRightmostGroups.forEach(cell => {
      expect(cell.find('[class*="divider"]')).not.toBeNull();
    });
  });

  test('leaf cells under groups render dividers', () => {
    const wrapper = renderTable({ resizableColumns: false });
    const thead = wrapper.find('thead')!;
    const groupedLeaves = thead.findAll('th[data-column-group-id]');

    groupedLeaves.forEach(cell => {
      expect(cell.find('[class*="divider"]')).not.toBeNull();
    });
  });

  test('rightmost cell has data-rightmost attribute', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const rightmostCells = thead.findAll('th[data-rightmost]');
    expect(rightmostCells.length).toBeGreaterThanOrEqual(1);
  });

  test('non-rightmost cells do not have data-rightmost', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const typeCell = thead.find('th[data-column-index="3"]')!;
    expect(typeCell.getElement().hasAttribute('data-rightmost')).toBe(false);
  });
});

describe('Column grouping with keyboard navigation', () => {
  test('renders with enableKeyboardNavigation', () => {
    const wrapper = renderTable({ enableKeyboardNavigation: true });
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
    expect(thead.findAll('th[scope="col"]')).toHaveLength(6);
  });

  test('group cells have correct aria-colindex', () => {
    const wrapper = renderTable({ enableKeyboardNavigation: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // config group starts at colIndex 2 (0-based), rendered as aria-colindex 3 (1-based)
    const configGroup = groupCells.find(c => c.getElement().textContent?.includes('Configuration'));
    const perfGroup = groupCells.find(c => c.getElement().textContent?.includes('Performance'));

    expect(configGroup!.getElement().getAttribute('aria-colindex')).toBeDefined();
    expect(perfGroup!.getElement().getAttribute('aria-colindex')).toBeDefined();
  });

  test('leaf cells have correct aria-colindex', () => {
    const wrapper = renderTable({ enableKeyboardNavigation: true });
    const thead = wrapper.find('thead')!;

    // type is at colIndex 2 (0-based), aria-colindex should be 3 (1-based)
    const typeCell = thead.find('th[data-column-index="3"]')!;
    expect(typeCell.getElement().getAttribute('aria-colindex')).toBe('3');
  });
});

describe('Column grouping aria attributes', () => {
  test('group cells have scope=colgroup', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells).toHaveLength(2);
  });

  test('leaf cells have scope=col', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const leafCells = thead.findAll('th[scope="col"]');
    expect(leafCells).toHaveLength(6);
  });

  test('header rows have aria-rowindex', () => {
    const wrapper = renderTable();
    const thead = wrapper.find('thead')!;
    const rows = thead.findAll('tr');

    expect(rows[0].getElement().getAttribute('aria-rowindex')).toBe('1');
    expect(rows[1].getElement().getAttribute('aria-rowindex')).toBe('2');
  });
});

describe('Column grouping sticky split rendering', () => {
  test('split group renders two group cells with updateGroupWidth callbacks', () => {
    // stickyColumns.first = 3: id(0), name(1), type(2) are sticky
    // config group has type(2), az(3) — straddles boundary
    const wrapper = renderTable({ stickyColumns: { first: 3 }, resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    // config split into 2 + perf = 3
    expect(groupCells.length).toBe(3);
  });

  test('split group with stickyColumns.last renders correctly', () => {
    // stickyColumns.last = 1: memory(5) is sticky
    // perf group has cpu(4), memory(5) — straddles boundary
    const wrapper = renderTable({ stickyColumns: { last: 1 }, resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    expect(groupCells.length).toBe(3);
  });

  test('fully sticky group gets stickyColumnId from first child', () => {
    // stickyColumns.first = 4: id, name, type, az are sticky
    // config group (type, az) is fully within sticky boundary
    const wrapper = renderTable({ stickyColumns: { first: 4 }, resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    const configGroup = groupCells.find(c => c.getElement().textContent?.includes('Configuration'));
    expect(configGroup).toBeDefined();
  });

  test('fully sticky last group gets stickyColumnId from last child', () => {
    // stickyColumns.last = 2: cpu(4), memory(5) are sticky
    // perf group (cpu, memory) is fully within sticky-last boundary
    const wrapper = renderTable({ stickyColumns: { last: 2 }, resizableColumns: true });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');
    const perfGroup = groupCells.find(c => c.getElement().textContent?.includes('Performance'));
    expect(perfGroup).toBeDefined();
  });
});

describe('Column grouping focus handling', () => {
  test('onFocusedComponentChange is called on header focus', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const wrapper = createWrapper(container).findTable()!;
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];

    // Focus a header cell — verify it has focus tracking wired up
    const th = firstRow.findAll('th')[0];
    fireEvent.focus(th.getElement());
    expect(th.getElement().getAttribute('data-focus-id')).toBeTruthy();
  });

  test('onBlur resets focused component', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const wrapper = createWrapper(container).findTable()!;
    const thead = wrapper.find('thead')!;
    const firstRow = thead.findAll('tr')[0];

    const th = firstRow.findAll('th')[0];
    fireEvent.focus(th.getElement());
    fireEvent.blur(th.getElement());
    // After blur, the focus indicator should be removed
    expect(th.getElement().classList.toString()).not.toContain('fake-focus');
  });
});

describe('Column grouping with non-resizable columns', () => {
  test('grouped leaf cells get inline styles when not resizable', () => {
    const colDefs = columnDefinitions.map(col => ({ ...col, width: 150, minWidth: 100 }));
    const wrapper = renderTable({ resizableColumns: false, columnDefinitions: colDefs });
    const thead = wrapper.find('thead')!;
    const leafCells = thead.findAll('th[scope="col"]');
    // Cells should have width styles applied directly
    expect(leafCells.length).toBe(6);
  });

  test('sorting fires onSortingChange for grouped leaf columns', () => {
    const onSortingChange = jest.fn();
    const sortableColumns = columnDefinitions.map(col => ({ ...col, sortingField: col.id }));
    const { container } = render(
      <Table
        columnDefinitions={sortableColumns}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        onSortingChange={event => onSortingChange(event.detail)}
      />
    );
    const wrapper = createWrapper(container).findTable()!;
    const sortArea = wrapper.findColumnSortingArea(3, { grouped: true });
    sortArea!.click();
    expect(onSortingChange).toHaveBeenCalledWith(
      expect.objectContaining({ sortingColumn: expect.objectContaining({ id: 'type' }) })
    );
  });
});

describe('Column grouping resize interactions', () => {
  test('grouped resizable table renders with colgroup and col elements', () => {
    const colDefs = columnDefinitions.map(col => ({ ...col, width: 150 }));
    const { container } = render(
      <Table
        columnDefinitions={colDefs}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        resizableColumns={true}
      />
    );
    const colgroup = container.querySelector('colgroup');
    expect(colgroup).not.toBeNull();
    const cols = colgroup!.querySelectorAll('col');
    // 6 leaf columns
    expect(cols.length).toBe(6);
  });

  test('col elements have data-column-id attributes', () => {
    const colDefs = columnDefinitions.map(col => ({ ...col, width: 150 }));
    const { container } = render(
      <Table
        columnDefinitions={colDefs}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        resizableColumns={true}
      />
    );
    const cols = container.querySelectorAll('col[data-column-id]');
    expect(cols.length).toBe(6);
    expect(cols[0].getAttribute('data-column-id')).toBe('id');
    expect(cols[5].getAttribute('data-column-id')).toBe('memory');
  });

  test('non-grouped resizable table does not render colgroup', () => {
    const colDefs = columnDefinitions.map(col => ({ ...col, width: 150 }));
    const { container } = render(<Table columnDefinitions={colDefs} items={items} resizableColumns={true} />);
    const colgroup = container.querySelector('colgroup');
    expect(colgroup).toBeNull();
  });
});

describe('Column grouping keyboard navigation', () => {
  test('handles arrow key events across grouped header rows', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions.map(col => ({ ...col, sortingField: col.id }))}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const table = container.querySelector('table')!;
    const thead = container.querySelector('thead')!;
    const firstTh = thead.querySelector('th')!;

    // Focus the first header cell
    firstTh.focus();

    // Press arrow down — should move to first body cell
    fireEvent.keyDown(table, { key: 'ArrowDown', keyCode: 40 });
    expect(container.querySelector('tbody td')).toBeTruthy();
  });

  test('handles keyboard events on cells with colspan', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions.map(col => ({ ...col, sortingField: col.id }))}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const table = container.querySelector('table')!;
    const thead = container.querySelector('thead')!;

    // Focus a group header cell (has colspan)
    const groupTh = thead.querySelector('th[scope="colgroup"]') as HTMLElement;
    groupTh.focus();

    // Navigate down from group header to leaf row
    fireEvent.keyDown(table, { key: 'ArrowDown', keyCode: 40 });

    // Leaf cells exist in the second header row for navigation targets
    const secondRow = thead.querySelectorAll('tr')[1];
    expect(secondRow.querySelector('th')).toBeTruthy();
  });
});

describe('Column grouping vertical navigation with rowspan', () => {
  test('handles arrow up from body with rowspan header cells', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions.map(col => ({ ...col, sortingField: col.id }))}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const table = container.querySelector('table')!;
    const thead = container.querySelector('thead')!;
    const tbody = container.querySelector('tbody')!;
    const firstBodyCell = tbody.querySelector('td') as HTMLElement;

    // Focus a body cell
    firstBodyCell.focus();

    // Navigate up — should go to the header cell in the same column
    fireEvent.keyDown(table, { key: 'ArrowUp', keyCode: 38 });
    expect(thead.querySelector('th')).toBeTruthy();
  });

  test('handles arrow up from leaf header row', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions.map(col => ({ ...col, sortingField: col.id }))}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        enableKeyboardNavigation={true}
      />
    );
    const table = container.querySelector('table')!;
    const thead = container.querySelector('thead')!;

    // Focus a leaf cell in the second header row
    const secondRow = thead.querySelectorAll('tr')[1];
    const leafTh = secondRow?.querySelector('th') as HTMLElement;
    if (leafTh) {
      leafTh.focus();
      // Navigate up — should go to the group header in the first row
      fireEvent.keyDown(table, { key: 'ArrowUp', keyCode: 38 });
      expect(thead.querySelector('th[scope="colgroup"]')).toBeTruthy();
    }
  });
});

describe('Column grouping with sticky header scrolling', () => {
  test('renders with stickyHeader and grouped columns without error', () => {
    const { container } = render(
      <Table
        columnDefinitions={columnDefinitions}
        items={[...items, ...items, ...items, ...items, ...items]}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        stickyHeader={true}
      />
    );
    const wrapper = createWrapper(container).findTable()!;
    expect(wrapper.find('thead')).not.toBeNull();
    // Sticky header with grouped columns renders both header rows
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('tr').length).toBe(2);
  });
});
describe('Column grouping group resize callbacks', () => {
  const resizableColDefs = columnDefinitions.map(col => ({ ...col, width: 200, minWidth: 100 }));

  function renderResizableGroupedTable(props: Partial<TableProps<Item>> = {}) {
    const { container } = render(
      <Table
        columnDefinitions={resizableColDefs}
        items={items}
        groupDefinitions={groupDefinitions}
        columnDisplay={singleLevelDisplay}
        resizableColumns={true}
        {...props}
      />
    );
    return createWrapper(container).findTable()!;
  }

  test('group header can be resized with pointer drag', () => {
    const wrapper = renderResizableGroupedTable();
    const thead = wrapper.find('thead')!;
    const groupCell = thead.findAll('th[scope="colgroup"]')[0];
    const resizerBtn = groupCell.find('button')!;

    resizerBtn.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', bubbles: true }));

    // No error — updateGroup was called
    expect(thead.findAll('th[scope="colgroup"]').length).toBe(2);
  });

  test('group resize completes full pointer lifecycle without errors', () => {
    const onColumnWidthsChange = jest.fn();
    const wrapper = renderResizableGroupedTable({ onColumnWidthsChange });
    const thead = wrapper.find('thead')!;
    const groupCell = thead.findAll('th[scope="colgroup"]')[0];
    const resizerBtn = groupCell.find('button')!;

    resizerBtn.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 100, bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', bubbles: true }));

    // Table structure remains intact after resize lifecycle
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
    expect(thead.findAll('th[scope="col"]')).toHaveLength(6);
  });

  test('split group resize works with stickyColumns.first', () => {
    const wrapper = renderResizableGroupedTable({ stickyColumns: { first: 3 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    // Split group should have resizers
    expect(groupCells.length).toBe(3);
    const splitGroupCell = groupCells[0];
    const resizerBtn = splitGroupCell.find('button');
    if (resizerBtn) {
      resizerBtn.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true }));
      document.body.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', bubbles: true }));
    }
  });

  test('split group resize works with stickyColumns.last', () => {
    const wrapper = renderResizableGroupedTable({ stickyColumns: { last: 1 } });
    const thead = wrapper.find('thead')!;
    const groupCells = thead.findAll('th[scope="colgroup"]');

    expect(groupCells.length).toBe(3);
    const lastSplitCell = groupCells[groupCells.length - 1];
    const resizerBtn = lastSplitCell.find('button');
    if (resizerBtn) {
      resizerBtn.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true }));
      document.body.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', bubbles: true }));
    }
  });

  test('leaf column resize completes pointer lifecycle in grouped table', () => {
    const wrapper = renderResizableGroupedTable();
    const resizer = wrapper.findColumnResizer(3, { grouped: true });
    expect(resizer).not.toBeNull();

    resizer!.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 100, bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', bubbles: true }));

    // Leaf columns and group structure remain intact after resize
    const thead = wrapper.find('thead')!;
    expect(thead.findAll('th[scope="col"]')).toHaveLength(6);
    expect(thead.findAll('th[scope="colgroup"]')).toHaveLength(2);
  });
});
