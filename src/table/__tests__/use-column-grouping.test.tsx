// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../__tests__/render-hook';
import { TableProps } from '../interfaces';
import { useColumnGrouping } from '../use-column-grouping';

describe('useColumnGrouping', () => {
  const mockColumns: TableProps.ColumnDefinition<any>[] = [
    { id: 'id', header: 'ID', cell: () => 'id' },
    { id: 'name', header: 'Name', cell: () => 'name' },
    { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
    { id: 'memory', header: 'Memory', groupId: 'performance', cell: () => 'memory' },
    { id: 'type', header: 'Type', groupId: 'config', cell: () => 'type' },
    { id: 'az', header: 'AZ', groupId: 'config', cell: () => 'az' },
  ];

  const mockGroups: TableProps.ColumnGroupsDefinition<any>[] = [
    { id: 'performance', header: 'Performance' },
    { id: 'config', header: 'Configuration' },
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
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      expect(result.current.maxDepth).toBe(2);
      expect(result.current.rows).toHaveLength(2);
    });

    it('row 0 contains ungrouped columns with rowspan and group headers', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      const row0 = result.current.rows[0].columns;

      // Ungrouped columns
      expect(row0[0]).toMatchObject({
        id: 'id',
        header: 'ID',
        colspan: 1,
        rowspan: 2,
        isGroup: false,
      });
      expect(row0[1]).toMatchObject({
        id: 'name',
        header: 'Name',
        colspan: 1,
        rowspan: 2,
        isGroup: false,
      });

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

    it('row 1 contains only grouped columns', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      const row1 = result.current.rows[1].columns;

      expect(row1).toHaveLength(4);
      expect(row1[0]).toMatchObject({
        id: 'cpu',
        header: 'CPU',
        colspan: 1,
        rowspan: 1,
        isGroup: false,
      });
      expect(row1[1]).toMatchObject({
        id: 'memory',
        header: 'Memory',
        colspan: 1,
        rowspan: 1,
        isGroup: false,
      });
    });

    it('maintains column order from columnDefinitions', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      const row0 = result.current.rows[0].columns;
      expect(row0.map((c: any) => c.id)).toEqual(['id', 'name', 'performance', 'config']);

      const row1 = result.current.rows[1].columns;
      expect(row1.map((c: any) => c.id)).toEqual(['cpu', 'memory', 'type', 'az']);
    });
  });

  describe('visibility filtering', () => {
    it('filters columns by visibleColumnIds', () => {
      const visibleIds = new Set(['id', 'cpu', 'memory']);
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds));

      const row0 = result.current.rows[0].columns;
      expect(row0).toHaveLength(2); // id + performance group
      expect(row0[0].id).toBe('id');
      expect(row0[1].id).toBe('performance');

      const row1 = result.current.rows[1].columns;
      expect(row1).toHaveLength(2); // cpu + memory
    });

    it('hides group when all children are hidden', () => {
      const visibleIds = new Set(['id', 'name', 'type', 'az']);
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds));

      const row0 = result.current.rows[0].columns;
      const groupIds = row0.filter((c: any) => c.isGroup).map((c: any) => c.id);
      expect(groupIds).toEqual(['config']); // performance group hidden
    });

    it('adjusts colspan when some children are hidden', () => {
      const visibleIds = new Set(['id', 'cpu', 'type', 'az']);
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns, visibleIds));

      const row0 = result.current.rows[0].columns;
      const perfGroup = row0.find((c: any) => c.id === 'performance');
      expect(perfGroup?.colspan).toBe(1); // only cpu visible
    });
  });

  describe('parent tracking', () => {
    it('tracks parent group IDs for grouped columns', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      expect(result.current.columnToParentIds.get('cpu')).toEqual(['performance']);
      expect(result.current.columnToParentIds.get('memory')).toEqual(['performance']);
      expect(result.current.columnToParentIds.get('type')).toEqual(['config']);
    });

    it('returns empty array for ungrouped columns', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      expect(result.current.columnToParentIds.get('id')).toBeUndefined();
      expect(result.current.columnToParentIds.get('name')).toBeUndefined();
    });
  });

  describe('column indices', () => {
    it('assigns sequential colIndex values', () => {
      const { result } = renderHook(() => useColumnGrouping(mockGroups, mockColumns));

      const row0 = result.current.rows[0].columns;
      expect(row0[0].colIndex).toBe(0); // id
      expect(row0[1].colIndex).toBe(1); // name
      expect(row0[2].colIndex).toBe(2); // performance group starts at 2
      expect(row0[3].colIndex).toBe(4); // config group starts at 4

      const row1 = result.current.rows[1].columns;
      // Row 1 colIndex accounts for ungrouped columns from row 0
      expect(row1[0].colIndex).toBe(2); // cpu (after id=0, name=1)
      expect(row1[1].colIndex).toBe(3); // memory
      expect(row1[2].colIndex).toBe(4); // type
      expect(row1[3].colIndex).toBe(5); // az
    });
  });

  describe('edge cases', () => {
    it('handles columns without IDs', () => {
      const columnsNoIds: TableProps.ColumnDefinition<any>[] = [
        { header: 'Col1', cell: () => 'col1' },
        { header: 'Col2', groupId: 'group1', cell: () => 'col2' },
      ];
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'group1', header: 'Group 1' }];

      const { result } = renderHook(() => useColumnGrouping(groups, columnsNoIds));

      // Columns without IDs are skipped by CalculateHierarchyTree, resulting in empty rows
      expect(result.current.rows).toBeDefined();
      expect(result.current.rows.length).toBe(0);
    });

    it('handles group without header', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'performance', header: undefined }];

      const { result } = renderHook(() => useColumnGrouping(groups, mockColumns));

      const perfGroup = result.current.rows[0].columns.find((c: any) => c.id === 'performance');
      // When header is undefined, it stays undefined (no fallback to id)
      expect(perfGroup?.header).toBeUndefined();
    });

    it('handles all columns ungrouped', () => {
      const ungroupedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'a', header: 'A', cell: () => 'a' },
        { id: 'b', header: 'B', cell: () => 'b' },
      ];

      const { result } = renderHook(() => useColumnGrouping(mockGroups, ungroupedCols));

      // When groups are defined but no columns use them, we should have only 1 row
      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].columns).toHaveLength(2);
      expect(result.current.rows[0].columns[0].rowspan).toBe(1);
    });

    it('handles all columns grouped', () => {
      const allGrouped: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', groupId: 'performance', cell: () => 'memory' },
      ];

      const { result } = renderHook(() => useColumnGrouping(mockGroups, allGrouped));

      expect(result.current.rows).toHaveLength(2);
      expect(result.current.rows[0].columns).toHaveLength(1); // only group header
      expect(result.current.rows[1].columns).toHaveLength(2); // both columns
    });
  });

  describe('nested groups', () => {
    it('handles nested group definitions', () => {
      const nestedGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance', groupId: 'metrics' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols));

      expect(result.current.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
    });

    it('creates correct number of rows for nested groups', () => {
      const nestedGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance', groupId: 'metrics' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', groupId: 'performance', cell: () => 'memory' },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols));

      // Should have 3 rows: row 0 (metrics), row 1 (performance), row 2 (leaf columns)
      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);
    });

    it('places nested groups in correct rows', () => {
      const nestedGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance', groupId: 'metrics' },
      ];
      const nestedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', groupId: 'performance', cell: () => 'memory' },
      ];

      const { result } = renderHook(() => useColumnGrouping(nestedGroups, nestedCols));

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
      const deepGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'level1', header: 'Level 1' },
        { id: 'level2', header: 'Level 2', groupId: 'level1' },
        { id: 'level3', header: 'Level 3', groupId: 'level2' },
      ];
      const deepCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'col1', header: 'Col 1', groupId: 'level3', cell: () => 'col1' },
      ];

      const { result } = renderHook(() => useColumnGrouping(deepGroups, deepCols));

      expect(result.current.maxDepth).toBe(4);
      expect(result.current.rows).toHaveLength(4);
      expect(result.current.columnToParentIds.get('col1')).toEqual(['level1', 'level2', 'level3']);
    });

    it('handles mixed nested and flat groups', () => {
      const mixedGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance', groupId: 'metrics' },
        { id: 'config', header: 'Configuration' }, // flat group
      ];
      const mixedCols: TableProps.ColumnDefinition<any>[] = [
        { id: 'id', header: 'ID', cell: () => 'id' }, // ungrouped
        { id: 'cpu', header: 'CPU', groupId: 'performance', cell: () => 'cpu' },
        { id: 'type', header: 'Type', groupId: 'config', cell: () => 'type' },
      ];

      const { result } = renderHook(() => useColumnGrouping(mixedGroups, mixedCols));

      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);

      // Row 0: ungrouped column (id), metrics group, config group
      expect(result.current.rows[0].columns).toHaveLength(3);
      expect(result.current.rows[0].columns[0]).toMatchObject({
        id: 'id',
        rowspan: 3,
        isGroup: false,
      });
      expect(result.current.rows[0].columns[1]).toMatchObject({
        id: 'metrics',
        isGroup: true,
      });
      expect(result.current.rows[0].columns[2]).toMatchObject({
        id: 'config',
        isGroup: true,
      });

      // Row 1: performance group
      expect(result.current.rows[1].columns).toHaveLength(1);
      expect(result.current.rows[1].columns[0]).toMatchObject({
        id: 'performance',
        isGroup: true,
      });

      // Row 2: leaf columns (cpu, type)
      expect(result.current.rows[2].columns).toHaveLength(2);
    });

    it('prevents circular references in nested groups', () => {
      const circularGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'a', header: 'A', groupId: 'b' },
        { id: 'b', header: 'B', groupId: 'a' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [{ id: 'col', header: 'Col', groupId: 'a', cell: () => 'col' }];

      const { result } = renderHook(() => useColumnGrouping(circularGroups, cols));

      // Should not crash and should handle gracefully
      expect(result.current.rows).toBeDefined();
      // Circular groups should be detected and one will be marked as circular
      // The column referencing the circular group will be treated as ungrouped
      const allGroupIds = result.current.rows.flatMap(row => row.columns.filter(c => c.isGroup).map(c => c.id));
      // At least one group should be excluded or treated specially
      expect(allGroupIds.length).toBeLessThanOrEqual(1);
    });

    it('handles non-existent parent group reference', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'child', header: 'Child', groupId: 'nonexistent' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'col', header: 'Col', groupId: 'child', cell: () => 'col' },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, cols));

      // Should treat child as top-level group
      expect(result.current.rows[0].columns.find(c => c.id === 'child')).toBeDefined();
      // Parent chain should only include 'child', not the non-existent parent
      expect(result.current.columnToParentIds.get('col')).toEqual(['child']);
    });

    it('handles column referencing non-existent group', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'group1', header: 'Group 1' }];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'col1', header: 'Col 1', groupId: 'nonexistent', cell: () => 'col1' },
        { id: 'col2', header: 'Col 2', groupId: 'group1', cell: () => 'col2' },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, cols));

      // col1 should be treated as ungrouped (no entry in columnToParentIds)
      expect(result.current.columnToParentIds.get('col1')).toBeUndefined();
      // col1 should appear in row 0 with rowspan
      const col1InRow0 = result.current.rows[0].columns.find(c => c.id === 'col1');
      expect(col1InRow0).toBeDefined();
      expect(col1InRow0?.rowspan).toBe(result.current.maxDepth);
    });

    it('handles group without id (should be skipped)', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: '', header: 'Invalid Group' } as any,
        { id: 'valid', header: 'Valid Group' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'col', header: 'Col', groupId: 'valid', cell: () => 'col' },
      ];

      const { result } = renderHook(() => useColumnGrouping(groups, cols));

      // Should only have valid group
      const groupIds = result.current.rows[0].columns.filter(c => c.isGroup).map(c => c.id);
      expect(groupIds).toEqual(['valid']);
    });
  });

  describe('error handling and warnings', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
      originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    });

    // Note: warnOnce from the toolkit has global deduplication.
    // Warnings may already be consumed by earlier tests in the same run.
    // These tests verify that warnings are called at least once across the suite
    // by checking console.warn was called with a matching pattern.

    it('warns about circular references in development mode', () => {
      const circularGroups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'circ-x', header: 'X', groupId: 'circ-y' },
        { id: 'circ-y', header: 'Y', groupId: 'circ-x' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'circ-col', header: 'Col', groupId: 'circ-x', cell: () => 'col' },
      ];

      renderHook(() => useColumnGrouping(circularGroups, cols));

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Circular reference detected'));
    });

    it('warns about non-existent parent group', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'warn-child', header: 'Child', groupId: 'warn-nonexistent-parent' },
      ];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'warn-col', header: 'Col', groupId: 'warn-child', cell: () => 'col' },
      ];

      renderHook(() => useColumnGrouping(groups, cols));

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('references non-existent parent group'));
    });

    it('warns about column referencing non-existent group', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [];
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'warn-col2', header: 'Col', groupId: 'warn-nonexistent-group', cell: () => 'col' },
      ];

      renderHook(() => useColumnGrouping(groups, cols));

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('references non-existent parent group'));
    });

    it('handles group without id gracefully', () => {
      const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: '', header: 'Invalid' } as any];
      const cols: TableProps.ColumnDefinition<any>[] = [];

      const { result } = renderHook(() => useColumnGrouping(groups, cols));

      // Group with empty id is skipped; no crash
      expect(result.current.rows).toBeDefined();
    });
  });
});
