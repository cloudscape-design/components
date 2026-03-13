// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../__tests__/render-hook';
import { CalculateHierarchyTree } from '../column-grouping-utils';
import { TableProps } from '../interfaces';
import { useColumnGrouping } from '../use-column-grouping';

describe('useColumnGrouping', () => {
  const mockColumns: TableProps.ColumnDefinition<any>[] = [
    { id: 'id', header: 'ID', cell: () => 'id' },
    { id: 'name', header: 'Name', cell: () => 'name' },
    { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
    { id: 'memory', header: 'Memory', cell: () => 'memory' },
    { id: 'type', header: 'Type', cell: () => 'type' },
    { id: 'az', header: 'AZ', cell: () => 'az' },
  ];

  const mockGroups: TableProps.GroupDefinition<any>[] = [
    { id: 'performance', header: 'Performance' },
    { id: 'config', header: 'Configuration' },
  ];

  const mockColumnDisplay: TableProps.ColumnDisplayProperties[] = [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'performance',
      children: [
        { id: 'cpu', visible: true },
        { id: 'memory', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'config',
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
      ],
    },
  ];

  describe('no grouping', () => {
    it('returns single row when no groups defined', () => {
      const { result } = renderHook(() => useColumnGrouping(undefined, mockColumns));

      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].columns).toHaveLength(6);
      expect(result.current.rows[0].columns[0]).toMatchObject({
        id: 'id',
        colspan: 1,
        rowspan: 1,
        isGroup: false,
      });
    });

    it('returns single row when groups array is empty', () => {
      const { result } = renderHook(() => useColumnGrouping([], mockColumns));

      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
    });
  });

  describe('flat grouping', () => {
    it('creates two rows with grouped and ungrouped columns', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      expect(result.current.maxDepth).toBe(2);
      expect(result.current.rows).toHaveLength(2);
    });

    it('row 0 contains hidden placeholders for ungrouped columns and group headers', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      const row0 = result.current.rows[0].columns;

      // Hidden placeholders at top for ungrouped columns
      expect(row0[0]).toMatchObject({ id: 'id', isHidden: true, rowspan: 1 });
      expect(row0[1]).toMatchObject({ id: 'name', isHidden: true, rowspan: 1 });

      // Group headers
      expect(row0[2]).toMatchObject({
        id: 'performance',
        header: 'Performance',
        colspan: 2,
        rowspan: 1,
        isGroup: true,
      });
      expect(row0[3]).toMatchObject({
        id: 'config',
        header: 'Configuration',
        colspan: 2,
        rowspan: 1,
        isGroup: true,
      });
    });

    it('row 0 has hidden placeholders at top for ungrouped columns, row 1 has visible cells at bottom', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      // Row 0: hidden placeholders for id, name (at top) + group headers
      const row0 = result.current.rows[0].columns;
      expect(row0[0]).toMatchObject({ id: 'id', isHidden: true, rowspan: 1 });
      expect(row0[1]).toMatchObject({ id: 'name', isHidden: true, rowspan: 1 });

      const row1 = result.current.rows[1].columns;

      // Row 1: visible id + visible name (at bottom, aligned with leaf row) + 4 leaf columns
      const visibleId = row1.find(c => c.id === 'id' && !c.isHidden);
      const visibleName = row1.find(c => c.id === 'name' && !c.isHidden);
      expect(visibleId).toBeDefined();
      expect(visibleName).toBeDefined();

      // Leaf columns
      expect(row1.find(c => c.id === 'cpu' && !c.isHidden)).toMatchObject({
        id: 'cpu',
        header: 'CPU',
        colspan: 1,
        rowspan: 1,
        isGroup: false,
      });
      expect(row1.find(c => c.id === 'memory' && !c.isHidden)).toMatchObject({
        id: 'memory',
        header: 'Memory',
        colspan: 1,
        rowspan: 1,
        isGroup: false,
      });
    });

    it('maintains column order from columnDisplay', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      const row0 = result.current.rows[0].columns;
      expect(row0.map((c: any) => c.id)).toEqual(['id', 'name', 'performance', 'config']);

      const row1 = result.current.rows[1].columns;
      // Visible id and name now in row 1 (bottom) alongside leaf columns
      expect(row1.map((c: any) => c.id)).toEqual(['id', 'name', 'cpu', 'memory', 'type', 'az']);
    });
  });

  describe('visibility filtering', () => {
    it('filters columns by visibleColumnIds', () => {
      const visibleIds = new Set(['id', 'cpu', 'memory']);
      const columnDisplay: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        {
          type: 'group',
          id: 'performance',
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: true },
          ],
        },
      ];
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds, columnDisplay));

      const row0 = result.current.rows[0].columns;
      // Row 0: hidden placeholder for id (top) + performance group
      expect(row0).toHaveLength(2);
      expect(row0[0]).toMatchObject({ id: 'id', isHidden: true });
      expect(row0[1].id).toBe('performance');

      const row1 = result.current.rows[1].columns;
      // Row 1: visible id (bottom) + cpu + memory
      expect(row1).toHaveLength(3);
      const visibleId = row1.find(c => c.id === 'id' && !c.isHidden);
      expect(visibleId).toBeDefined();
    });

    it('hides group when all children are hidden', () => {
      const columnDisplay: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { id: 'name', visible: true },
        {
          type: 'group',
          id: 'performance',
          children: [
            { id: 'cpu', visible: false },
            { id: 'memory', visible: false },
          ],
        },
        {
          type: 'group',
          id: 'config',
          children: [
            { id: 'type', visible: true },
            { id: 'az', visible: true },
          ],
        },
      ];
      const visibleIds = new Set(['id', 'name', 'type', 'az']);
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds, columnDisplay));

      const row0 = result.current.rows[0].columns;
      const groupIds = row0.filter((c: any) => c.isGroup).map((c: any) => c.id);
      expect(groupIds).toEqual(['config']); // performance group hidden
    });

    it('adjusts colspan when some children are hidden', () => {
      const columnDisplay: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        {
          type: 'group',
          id: 'performance',
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: false },
          ],
        },
        {
          type: 'group',
          id: 'config',
          children: [
            { id: 'type', visible: true },
            { id: 'az', visible: true },
          ],
        },
      ];
      const visibleIds = new Set(['id', 'cpu', 'type', 'az']);
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds, columnDisplay));

      const row0 = result.current.rows[0].columns;
      const perfGroup = row0.find((c: any) => c.id === 'performance');
      expect(perfGroup?.colspan).toBe(1); // only cpu visible
    });
  });

  describe('parent tracking', () => {
    it('tracks parent group IDs for grouped columns', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      expect(result.current.columnToParentIds.get('cpu')).toEqual(['performance']);
      expect(result.current.columnToParentIds.get('memory')).toEqual(['performance']);
      expect(result.current.columnToParentIds.get('type')).toEqual(['config']);
    });

    it('ungrouped columns do not have parent group entries', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      // Ungrouped columns should not have group parent entries
      const idParents = result.current.columnToParentIds.get('id');
      const nameParents = result.current.columnToParentIds.get('name');
      expect(!idParents || idParents.length === 0).toBe(true);
      expect(!nameParents || nameParents.length === 0).toBe(true);
    });
  });

  describe('column indices', () => {
    it('assigns sequential colIndex values', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, undefined, mockColumnDisplay));

      const row0 = result.current.rows[0].columns;
      expect(row0[0].colIndex).toBe(0); // hidden id placeholder
      expect(row0[1].colIndex).toBe(1); // hidden name placeholder
      expect(row0[2].colIndex).toBe(2); // performance group starts at 2
      expect(row0[3].colIndex).toBe(4); // config group starts at 4

      const row1 = result.current.rows[1].columns;
      expect(row1[0].colIndex).toBe(0); // visible id
      expect(row1[1].colIndex).toBe(1); // visible name
      expect(row1[2].colIndex).toBe(2); // cpu
      expect(row1[3].colIndex).toBe(3); // memory
      expect(row1[4].colIndex).toBe(4); // type
      expect(row1[5].colIndex).toBe(5); // az
    });
  });

  describe('edge cases', () => {
    it('handles columns without IDs', () => {
      const columnsNoIds: TableProps.ColumnDefinition<any>[] = [
        { header: 'Col1', cell: () => 'col1' },
        { header: 'Col2', cell: () => 'col2' },
      ];

      const { result } = renderHook(() => useColumnGrouping([], columnsNoIds));

      // Columns without IDs are skipped; resulting in empty rows
      expect(result.current.rows).toBeDefined();
      expect(result.current.rows.length).toBe(0);
    });

    it('handles group without header', () => {
      const groups: TableProps.GroupDefinition<any>[] = [{ id: 'performance', header: undefined }];
      const columnDisplay: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'performance', children: [{ id: 'cpu', visible: true }] },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, mockColumns, undefined, columnDisplay));

      const perfGroup = result.current.rows[0].columns.find((c: any) => c.id === 'performance');
      expect(perfGroup?.header).toBeUndefined();
    });

    it('handles all columns ungrouped', () => {
      const ungroupedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'a', header: 'A', cell: () => 'a' },
        { id: 'b', header: 'B', cell: () => 'b' },
      ];

      // No columnDisplay provided → flat, no grouping
      const { result } = renderHook(() => useColumnGrouping(mockGroups, ungroupedCols));

      // Without columnDisplay, CalculateHierarchyTree uses flat fallback
      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].columns).toHaveLength(2);
      expect(result.current.rows[0].columns[0].rowspan).toBe(1);
    });

    it('handles all columns grouped', () => {
      const allGrouped: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', cell: () => 'memory' },
      ];
      const groups: TableProps.GroupDefinition<any>[] = [{ id: 'performance', header: 'Performance' }];
      const columnDisplay: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'performance',
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: true },
          ],
        },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, allGrouped, undefined, columnDisplay));

      expect(result.current.rows).toHaveLength(2);
      expect(result.current.rows[0].columns).toHaveLength(1); // only group header
      expect(result.current.rows[1].columns).toHaveLength(2); // both columns
    });
  });

  describe('nested groups', () => {
    it('handles nested group definitions', () => {
      const nestedGroups: TableProps.GroupDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [{ id: 'cpu', header: 'CPU', cell: () => 'cpu' }];
      const nestedDisplay: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'metrics',
          children: [{ type: 'group', id: 'performance', children: [{ id: 'cpu', visible: true }] }],
        },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols, undefined, nestedDisplay));

      expect(result.current.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
    });

    it('creates correct number of rows for nested groups', () => {
      const nestedGroups: TableProps.GroupDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', cell: () => 'memory' },
      ];
      const nestedDisplay: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'metrics',
          children: [
            {
              type: 'group',
              id: 'performance',
              children: [
                { id: 'cpu', visible: true },
                { id: 'memory', visible: true },
              ],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols, undefined, nestedDisplay));

      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);
    });

    it('places nested groups in correct rows', () => {
      const nestedGroups: TableProps.GroupDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', cell: () => 'memory' },
      ];
      const nestedDisplay: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'metrics',
          children: [
            {
              type: 'group',
              id: 'performance',
              children: [
                { id: 'cpu', visible: true },
                { id: 'memory', visible: true },
              ],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols, undefined, nestedDisplay));

      // Row 0 should have metrics group
      expect(result.current.rows[0].columns).toHaveLength(1);
      expect(result.current.rows[0].columns[0]).toMatchObject({
        id: 'metrics',
        isGroup: true,
        colspan: 2,
      });

      // Row 1 should have performance group
      expect(result.current.rows[1].columns).toHaveLength(1);
      expect(result.current.rows[1].columns[0]).toMatchObject({
        id: 'performance',
        isGroup: true,
        colspan: 2,
      });

      // Row 2 should have leaf columns
      expect(result.current.rows[2].columns).toHaveLength(2);
      expect(result.current.rows[2].columns[0].id).toBe('cpu');
      expect(result.current.rows[2].columns[1].id).toBe('memory');
    });

    it('handles 3-level nesting', () => {
      const deepGroups: TableProps.GroupDefinition<any>[] = [
        { id: 'level1', header: 'Level 1' },
        { id: 'level2', header: 'Level 2' },
        { id: 'level3', header: 'Level 3' },
      ];
      const deepCols: TableProps.ColumnDefinition<any>[] = [{ id: 'col1', header: 'Col 1', cell: () => 'col1' }];
      const deepDisplay: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'level1',
          children: [
            {
              type: 'group',
              id: 'level2',
              children: [{ type: 'group', id: 'level3', children: [{ id: 'col1', visible: true }] }],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useColumnGrouping(deepGroups, deepCols, undefined, deepDisplay));

      expect(result.current.maxDepth).toBe(4);
      expect(result.current.rows).toHaveLength(4);
      expect(result.current.columnToParentIds.get('col1')).toEqual(['level1', 'level2', 'level3']);
    });

    it('handles mixed nested and flat groups', () => {
      const mixedGroups: TableProps.GroupDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance' },
        { id: 'config', header: 'Configuration' },
      ];
      const mixedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'id', header: 'ID', cell: () => 'id' },
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'type', header: 'Type', cell: () => 'type' },
      ];
      const mixedDisplay: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        {
          type: 'group',
          id: 'metrics',
          children: [{ type: 'group', id: 'performance', children: [{ id: 'cpu', visible: true }] }],
        },
        { type: 'group', id: 'config', children: [{ id: 'type', visible: true }] },
      ];

      const { result } = renderHook(() => useColumnGrouping(mixedGroups, mixedCols, undefined, mixedDisplay));

      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);

      // Row 0: hidden placeholder for id (top), metrics group, hidden placeholder for config
      expect(result.current.rows[0].columns).toHaveLength(3);
      expect(result.current.rows[0].columns[0]).toMatchObject({ id: 'id', rowspan: 1, isHidden: true });
      expect(result.current.rows[0].columns[1]).toMatchObject({ id: 'metrics', isGroup: true });
      expect(result.current.rows[0].columns[2]).toMatchObject({ id: 'config', isHidden: true });

      // Row 1: hidden placeholder for id, performance group, real config group
      const row1Ids = result.current.rows[1].columns.map(c => c.id);
      expect(row1Ids).toContain('id');
      expect(row1Ids).toContain('performance');
      expect(row1Ids).toContain('config');

      // Row 2: leaf columns
      const row2 = result.current.rows[2].columns;
      const row2NonHidden = row2.filter(c => !c.isHidden);
      expect(row2NonHidden.length).toBeGreaterThanOrEqual(2);
    });

    it('handles non-existent parent group reference', () => {
      const groups: TableProps.GroupDefinition<any>[] = [];
      const cols: TableProps.ColumnDefinition<any>[] = [{ id: 'col', header: 'Col', cell: () => 'col' }];
      // Display references a group not in groupDefinitions — the whole subtree is skipped
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'nonexistent', children: [{ id: 'col', visible: true }] },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, cols, undefined, display));

      // Group not found → entire subtree (including col) is skipped → no rows
      expect(result.current.rows).toHaveLength(0);
    });

    it('handles group without id (should be skipped)', () => {
      const groups: TableProps.GroupDefinition<any>[] = [
        { id: '', header: 'Invalid Group' } as any,
        { id: 'valid', header: 'Valid Group' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [{ id: 'col', header: 'Col', cell: () => 'col' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'valid', children: [{ id: 'col', visible: true }] },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, cols, undefined, display));

      const groupIds = result.current.rows[0].columns.filter(c => c.isGroup).map(c => c.id);
      expect(groupIds).toEqual(['valid']);
    });
  });

  describe('CalculateHierarchyTree direct tests for edge cases', () => {
    it('skips columns with undefined id in visibleLeafColumns', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [{ header: 'No ID', cell: () => 'x' }];
      const result = CalculateHierarchyTree(cols, ['col-0'], [], undefined);
      expect(result.rows).toHaveLength(0);
    });

    it('skips columns whose id is not in the node map (not visible)', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'a', header: 'A', cell: () => 'a' },
        { id: 'b', header: 'B', cell: () => 'b' },
      ];
      const result = CalculateHierarchyTree(cols, ['a'], [], undefined);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].columns).toHaveLength(1);
      expect(result.rows[0].columns[0].id).toBe('a');
    });

    it('skips group definitions with undefined id', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [{ id: 'a', header: 'A', cell: () => 'a' }];
      const groups = [{ id: undefined, header: 'Bad Group' } as any];
      const result = CalculateHierarchyTree(cols, ['a'], groups, undefined);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].columns[0].id).toBe('a');
    });
  });

  describe('error handling and warnings', () => {
    it('warns about non-existent group in columnDisplay', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const groups: TableProps.GroupDefinition<any>[] = [];
      const cols: TableProps.ColumnDefinition<any>[] = [{ id: 'col', header: 'Col', cell: () => 'col' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'warn-nonexistent-99', children: [{ id: 'col', visible: true }] },
      ];

      renderHook(() => useColumnGrouping(groups, cols, undefined, display));

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('warn-nonexistent-99'));

      consoleWarnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it('handles group without id gracefully', () => {
      const groups: TableProps.GroupDefinition<any>[] = [{ id: '', header: 'Invalid' } as any];
      const cols: TableProps.ColumnDefinition<any>[] = [];

      const { result } = renderHook(() => useColumnGrouping(groups, cols));

      expect(result.current.rows).toBeDefined();
    });
  });
});
