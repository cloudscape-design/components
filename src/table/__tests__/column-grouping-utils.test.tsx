// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CalculateHierarchyTree, TableHeaderNode } from '../column-grouping-utils';
import { TableProps } from '../interfaces';

describe('column-grouping-utils', () => {
  describe('TableHeaderNode', () => {
    it('creates node with basic properties', () => {
      const node = new TableHeaderNode('test-id');

      expect(node.id).toBe('test-id');
      expect(node.colspan).toBe(1);
      expect(node.rowspan).toBe(1);
      expect(node.subtreeHeight).toBe(1);
      expect(node.children).toEqual([]);
      expect(node.rowIndex).toBe(-1);
      expect(node.colIndex).toBe(-1);
      expect(node.isRoot).toBe(false);
    });

    it('creates node with options', () => {
      const columnDef: TableProps.ColumnDefinition<any> = {
        id: 'test',
        header: 'Test',
        cell: () => 'test',
      };

      const node = new TableHeaderNode('test', {
        colspan: 2,
        rowspan: 3,
        columnDefinition: columnDef,
        rowIndex: 1,
        colIndex: 2,
      });

      expect(node.colspan).toBe(2);
      expect(node.rowspan).toBe(3);
      expect(node.columnDefinition).toBe(columnDef);
      expect(node.rowIndex).toBe(1);
      expect(node.colIndex).toBe(2);
    });

    it('creates root node', () => {
      const node = new TableHeaderNode('root', { isRoot: true });

      expect(node.isRoot).toBe(true);
      expect(node.isRootNode).toBe(true);
    });

    it('identifies group nodes correctly', () => {
      const groupNode = new TableHeaderNode('group', {
        groupDefinition: { id: 'group', header: 'Group' },
      });
      const colNode = new TableHeaderNode('col', {
        columnDefinition: { id: 'col', header: 'Col', cell: () => 'col' },
      });

      expect(groupNode.isGroup).toBe(true);
      expect(colNode.isGroup).toBe(false);
    });

    it('identifies leaf nodes correctly', () => {
      const parent = new TableHeaderNode('parent');
      const child = new TableHeaderNode('child');
      const root = new TableHeaderNode('root', { isRoot: true });

      parent.addChild(child);

      expect(parent.isLeaf).toBe(false);
      expect(child.isLeaf).toBe(true);
      expect(root.isLeaf).toBe(false); // root is never a leaf
    });

    it('adds child and sets parent relationship', () => {
      const parent = new TableHeaderNode('parent');
      const child = new TableHeaderNode('child');

      parent.addChild(child);

      expect(parent.children).toHaveLength(1);
      expect(parent.children[0]).toBe(child);
      expect(child.parentNode).toBe(parent);
    });

    it('maintains children order', () => {
      const parent = new TableHeaderNode('parent');
      const child1 = new TableHeaderNode('child1');
      const child2 = new TableHeaderNode('child2');
      const child3 = new TableHeaderNode('child3');

      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      expect(parent.children[0]).toBe(child1);
      expect(parent.children[1]).toBe(child2);
      expect(parent.children[2]).toBe(child3);
    });
  });

  describe('CalculateHierarchyTree', () => {
    describe('no grouping', () => {
      it('returns single row with all visible columns', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'col1', header: 'Col 1', cell: () => 'col1' },
          { id: 'col2', header: 'Col 2', cell: () => 'col2' },
          { id: 'col3', header: 'Col 3', cell: () => 'col3' },
        ];

        const result = CalculateHierarchyTree(columns, ['col1', 'col2', 'col3'], []);

        expect(result?.maxDepth).toBe(1);
        expect(result?.rows).toHaveLength(1);
        expect(result?.rows[0].columns).toHaveLength(3);
        expect(result?.rows[0].columns.map(c => c.id)).toEqual(['col1', 'col2', 'col3']);
      });

      it('all columns have rowspan=1, colspan=1', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'col1', header: 'Col 1', cell: () => 'col1' },
          { id: 'col2', header: 'Col 2', cell: () => 'col2' },
        ];

        const result = CalculateHierarchyTree(columns, ['col1', 'col2'], []);

        result?.rows[0].columns.forEach(col => {
          expect(col.rowspan).toBe(1);
          expect(col.colspan).toBe(1);
          expect(col.isGroup).toBe(false);
        });
      });

      it('assigns sequential colIndex values', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'a', header: 'A', cell: () => 'a' },
          { id: 'b', header: 'B', cell: () => 'b' },
          { id: 'c', header: 'C', cell: () => 'c' },
        ];

        const result = CalculateHierarchyTree(columns, ['a', 'b', 'c'], []);

        expect(result?.rows[0].columns[0].colIndex).toBe(0);
        expect(result?.rows[0].columns[1].colIndex).toBe(1);
        expect(result?.rows[0].columns[2].colIndex).toBe(2);
      });

      it('columnToParentIds is empty for ungrouped columns', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [{ id: 'col1', header: 'Col 1', cell: () => 'col1' }];

        const result = CalculateHierarchyTree(columns, ['col1'], []);

        expect(result?.columnToParentIds.size).toBe(0);
      });
    });

    describe('flat grouping', () => {
      const columns: TableProps.ColumnDefinition<any>[] = [
        { id: 'id', header: 'ID', cell: () => 'id' },
        { id: 'name', header: 'Name', cell: () => 'name' },
        { id: 'cpu', header: 'CPU', groupId: 'perf', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', groupId: 'perf', cell: () => 'memory' },
        { id: 'type', header: 'Type', groupId: 'config', cell: () => 'type' },
      ];

      const groups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'perf', header: 'Performance' },
        { id: 'config', header: 'Configuration' },
      ];

      it('creates two rows', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        expect(result?.maxDepth).toBe(2);
        expect(result?.rows).toHaveLength(2);
      });

      it('row 0 has ungrouped columns with rowspan=2', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row0 = result?.rows[0].columns;
        const idCol = row0?.find(c => c.id === 'id');
        const nameCol = row0?.find(c => c.id === 'name');

        expect(idCol?.rowspan).toBe(2);
        expect(idCol?.colspan).toBe(1);
        expect(nameCol?.rowspan).toBe(2);
        expect(nameCol?.colspan).toBe(1);
      });

      it('row 0 has group headers with rowspan=1 and correct colspan', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row0 = result?.rows[0].columns;
        const perfGroup = row0?.find(c => c.id === 'perf');
        const configGroup = row0?.find(c => c.id === 'config');

        expect(perfGroup?.isGroup).toBe(true);
        expect(perfGroup?.rowspan).toBe(1);
        expect(perfGroup?.colspan).toBe(2); // cpu + memory

        expect(configGroup?.isGroup).toBe(true);
        expect(configGroup?.rowspan).toBe(1);
        expect(configGroup?.colspan).toBe(1); // type only
      });

      it('row 1 has only grouped columns', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row1 = result?.rows[1].columns;

        expect(row1?.length).toBe(3); // cpu, memory, type
        expect(row1?.map(c => c.id)).toEqual(['cpu', 'memory', 'type']);
        row1?.forEach(col => {
          expect(col.isGroup).toBe(false);
          expect(col.rowspan).toBe(1);
          expect(col.colspan).toBe(1);
        });
      });

      it('maintains correct column order', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row0 = result?.rows[0].columns;
        expect(row0?.map(c => c.id)).toEqual(['id', 'name', 'perf', 'config']);
      });

      it('assigns correct colIndex across rows', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row0 = result?.rows[0].columns;
        expect(row0?.find(c => c.id === 'id')?.colIndex).toBe(0);
        expect(row0?.find(c => c.id === 'name')?.colIndex).toBe(1);
        expect(row0?.find(c => c.id === 'perf')?.colIndex).toBe(2);
        expect(row0?.find(c => c.id === 'config')?.colIndex).toBe(4);

        const row1 = result?.rows[1].columns;
        expect(row1?.find(c => c.id === 'cpu')?.colIndex).toBe(2);
        expect(row1?.find(c => c.id === 'memory')?.colIndex).toBe(3);
        expect(row1?.find(c => c.id === 'type')?.colIndex).toBe(4);
      });

      it('tracks parent IDs for grouped columns', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        expect(result?.columnToParentIds.get('cpu')).toEqual(['perf']);
        expect(result?.columnToParentIds.get('memory')).toEqual(['perf']);
        expect(result?.columnToParentIds.get('type')).toEqual(['config']);
        expect(result?.columnToParentIds.has('id')).toBe(false);
        expect(result?.columnToParentIds.has('name')).toBe(false);
      });

      it('includes parentGroupIds in column metadata', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['id', 'name', 'cpu', 'memory', 'type'],
          groups
          // []
        );

        const row1 = result?.rows[1].columns;
        const cpuCol = row1?.find(c => c.id === 'cpu');

        expect(cpuCol?.parentGroupIds).toEqual(['perf']);
      });
    });

    describe('nested grouping', () => {
      const columns: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', groupId: 'perf', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', groupId: 'perf', cell: () => 'memory' },
      ];

      const groups: TableProps.ColumnGroupsDefinition<any>[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'perf', header: 'Performance', groupId: 'metrics' },
      ];

      it('creates correct number of rows for 2-level nesting', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['cpu', 'memory'],
          groups
          // []
        );

        expect(result?.maxDepth).toBe(3);
        expect(result?.rows).toHaveLength(3);
      });

      it('places groups in correct rows', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['cpu', 'memory'],
          groups
          // []
        );

        // Row 0: metrics (top-level group)
        expect(result?.rows[0].columns).toHaveLength(1);
        expect(result?.rows[0].columns[0].id).toBe('metrics');
        expect(result?.rows[0].columns[0].rowIndex).toBe(0);

        // Row 1: perf (nested group)
        expect(result?.rows[1].columns).toHaveLength(1);
        expect(result?.rows[1].columns[0].id).toBe('perf');
        expect(result?.rows[1].columns[0].rowIndex).toBe(1);

        // Row 2: leaf columns
        expect(result?.rows[2].columns).toHaveLength(2);
        expect(result?.rows[2].columns.map(c => c.id)).toEqual(['cpu', 'memory']);
      });

      it('calculates correct colspan for nested groups', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['cpu', 'memory'],
          groups
          // []
        );

        expect(result?.rows[0].columns[0].colspan).toBe(2); // metrics spans both columns
        expect(result?.rows[1].columns[0].colspan).toBe(2); // perf spans both columns
        expect(result?.rows[2].columns[0].colspan).toBe(1); // cpu
        expect(result?.rows[2].columns[1].colspan).toBe(1); // memory
      });

      it('tracks full parent chain for nested groups', () => {
        const result = CalculateHierarchyTree(
          columns,
          ['cpu', 'memory'],
          groups
          // []
        );

        expect(result?.columnToParentIds.get('cpu')).toEqual(['metrics', 'perf']);
        expect(result?.columnToParentIds.get('memory')).toEqual(['metrics', 'perf']);
      });

      it('handles 3-level nesting', () => {
        const deepGroups: TableProps.ColumnGroupsDefinition<any>[] = [
          { id: 'level1', header: 'Level 1' },
          { id: 'level2', header: 'Level 2', groupId: 'level1' },
          { id: 'level3', header: 'Level 3', groupId: 'level2' },
        ];
        const deepCols: TableProps.ColumnDefinition<any>[] = [
          { id: 'col', header: 'Col', groupId: 'level3', cell: () => 'col' },
        ];

        const result = CalculateHierarchyTree(deepCols, ['col'], deepGroups);

        expect(result?.maxDepth).toBe(4);
        expect(result?.rows).toHaveLength(4);
        expect(result?.columnToParentIds.get('col')).toEqual(['level1', 'level2', 'level3']);
      });

      it('handles mixed nested and flat groups', () => {
        const mixedGroups: TableProps.ColumnGroupsDefinition<any>[] = [
          { id: 'metrics', header: 'Metrics' },
          { id: 'perf', header: 'Performance', groupId: 'metrics' },
          { id: 'config', header: 'Config' }, // flat
        ];
        const mixedCols: TableProps.ColumnDefinition<any>[] = [
          { id: 'cpu', header: 'CPU', groupId: 'perf', cell: () => 'cpu' },
          { id: 'type', header: 'Type', groupId: 'config', cell: () => 'type' },
        ];

        const result = CalculateHierarchyTree(mixedCols, ['cpu', 'type'], mixedGroups);

        expect(result?.maxDepth).toBe(3);

        console.log(JSON.stringify(result?.rows));

        // Row 0: metrics and config
        expect(result?.rows[0].columns.map(c => c.id)).toEqual(['metrics', 'config']);

        // Row 1: perf only (config's children in row 2)
        expect(result?.rows[1].columns.map(c => c.id)).toEqual(['perf']);

        // Row 2: both leaf columns
        expect(result?.rows[2].columns.map(c => c.id)).toEqual(['cpu', 'type']);
      });

      it('handles multiple trees at same level', () => {
        const parallelGroups: TableProps.ColumnGroupsDefinition<any>[] = [
          { id: 'tree1', header: 'Tree 1' },
          { id: 'tree1child', header: 'Tree 1 Child', groupId: 'tree1' },
          { id: 'tree2', header: 'Tree 2' },
          { id: 'tree2child', header: 'Tree 2 Child', groupId: 'tree2' },
        ];
        const parallelCols: TableProps.ColumnDefinition<any>[] = [
          { id: 'col1', header: 'Col 1', groupId: 'tree1child', cell: () => 'col1' },
          { id: 'col2', header: 'Col 2', groupId: 'tree2child', cell: () => 'col2' },
        ];

        const result = CalculateHierarchyTree(parallelCols, ['col1', 'col2'], parallelGroups);

        expect(result?.maxDepth).toBe(3);
        expect(result?.rows[0].columns.map(c => c.id)).toEqual(['tree1', 'tree2']);
        expect(result?.rows[1].columns.map(c => c.id)).toEqual(['tree1child', 'tree2child']);
        expect(result?.rows[2].columns.map(c => c.id)).toEqual(['col1', 'col2']);
      });
    });

    describe('mixed ungrouped and grouped columns', () => {
      it('ungrouped columns span all rows', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'group1', header: 'Group 1' }];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'ungrouped', header: 'Ungrouped', cell: () => 'ungrouped' },
          { id: 'grouped', header: 'Grouped', groupId: 'group1', cell: () => 'grouped' },
        ];

        const result = CalculateHierarchyTree(columns, ['ungrouped', 'grouped'], groups);

        const ungroupedCol = result?.rows[0].columns.find(c => c.id === 'ungrouped');
        expect(ungroupedCol?.rowspan).toBe(2); // spans both rows
        expect(ungroupedCol?.rowIndex).toBe(0);
      });

      it('maintains correct column order with mixed types', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'group1', header: 'Group 1' }];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'a', header: 'A', cell: () => 'a' },
          { id: 'b', header: 'B', groupId: 'group1', cell: () => 'b' },
          { id: 'c', header: 'C', cell: () => 'c' },
          { id: 'd', header: 'D', groupId: 'group1', cell: () => 'd' },
        ];

        const result = CalculateHierarchyTree(columns, ['a', 'b', 'c', 'd'], groups);

        expect(result?.rows[0].columns.map(c => c.id)).toEqual(['a', 'group1', 'c']);
        expect(result?.rows[1].columns.map(c => c.id)).toEqual(['b', 'd']);
      });
    });

    describe('visibility filtering', () => {
      const columns: TableProps.ColumnDefinition<any>[] = [
        { id: 'col1', header: 'Col 1', cell: () => 'col1' },
        { id: 'col2', header: 'Col 2', cell: () => 'col2' },
        { id: 'col3', header: 'Col 3', groupId: 'group1', cell: () => 'col3' },
        { id: 'col4', header: 'Col 4', groupId: 'group1', cell: () => 'col4' },
      ];

      const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'group1', header: 'Group 1' }];

      it('only includes visible columns', () => {
        const result = CalculateHierarchyTree(columns, ['col1', 'col3'], groups);

        const allColumnIds = result?.rows.flatMap(row => row.columns.map(c => c.id));
        expect(allColumnIds).toContain('col1');
        expect(allColumnIds).toContain('col3');
        expect(allColumnIds).toContain('group1');
        expect(allColumnIds).not.toContain('col2');
        expect(allColumnIds).not.toContain('col4');
      });

      it('adjusts group colspan when some children hidden', () => {
        const result = CalculateHierarchyTree(columns, ['col1', 'col3'], groups);

        const group = result?.rows[0].columns.find(c => c.id === 'group1');
        expect(group?.colspan).toBe(1); // only col3 visible
      });

      it('hides group when all children hidden', () => {
        const result = CalculateHierarchyTree(columns, ['col1', 'col2'], groups);

        const allIds = result?.rows[0].columns.map(c => c.id);
        expect(allIds).not.toContain('group1');
      });

      it('respects columnDisplay visibility settings', () => {
        const columnDisplay: TableProps.ColumnDisplayProperties[] = [
          { id: 'col1', visible: true },
          { id: 'col2', visible: false },
          { id: 'col3', visible: true },
          { id: 'col4', visible: true },
        ];

        const result = CalculateHierarchyTree(columns, ['col1', 'col2', 'col3', 'col4'], groups, columnDisplay);

        const leafColumns = result?.rows[result.rows.length - 1].columns;
        expect(leafColumns?.map(c => c.id)).not.toContain('col2');
      });
    });

    describe('edge cases', () => {
      it('handles empty column list', () => {
        const result = CalculateHierarchyTree([], [], []);

        expect(result?.rows).toHaveLength(0);
        expect(result?.maxDepth).toBe(0);
        // expect(result?.rows[0].columns).toHaveLength(0);
      });

      it('handles column without id', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [
          { header: 'No ID', cell: () => 'noid' } as any,
          { id: 'withid', header: 'With ID', cell: () => 'withid' },
        ];

        const result = CalculateHierarchyTree(columns, ['withid'], []);

        // Column without id should be skipped
        expect(result?.rows[0].columns).toHaveLength(1);
        expect(result?.rows[0].columns[0].id).toBe('withid');
      });

      it('handles group without id', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [
          { header: 'No ID' } as any,
          { id: 'valid', header: 'Valid' },
        ];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'col', header: 'Col', groupId: 'valid', cell: () => 'col' },
        ];

        const result = CalculateHierarchyTree(columns, ['col'], groups);

        // Group without id should be skipped
        const groupIds = result?.rows[0].columns.filter(c => c.isGroup).map(c => c.id);
        expect(groupIds).toEqual(['valid']);
      });

      it('handles column referencing non-existent group', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'orphan', header: 'Orphan', groupId: 'nonexistent', cell: () => 'orphan' },
        ];

        const result = CalculateHierarchyTree(columns, ['orphan'], []);

        // Should treat as ungrouped
        expect(result?.rows).toHaveLength(1);
        expect(result?.rows[0].columns[0]).toMatchObject({
          id: 'orphan',
          rowspan: 1,
          isGroup: false,
        });
        expect(result?.columnToParentIds.has('orphan')).toBe(false);
      });

      it('handles group referencing non-existent parent', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [
          { id: 'orphan', header: 'Orphan', groupId: 'nonexistent' },
        ];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'col', header: 'Col', groupId: 'orphan', cell: () => 'col' },
        ];

        const result = CalculateHierarchyTree(columns, ['col'], groups);

        // Orphan group should be top-level
        expect(result?.rows[0].columns.find(c => c.id === 'orphan')).toBeDefined();
        expect(result?.columnToParentIds.get('col')).toEqual(['orphan']);
      });

      it('handles all columns in one group', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'all', header: 'All' }];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'a', header: 'A', groupId: 'all', cell: () => 'a' },
          { id: 'b', header: 'B', groupId: 'all', cell: () => 'b' },
        ];

        const result = CalculateHierarchyTree(columns, ['a', 'b'], groups);

        expect(result?.rows).toHaveLength(2);
        expect(result?.rows[0].columns).toHaveLength(1); // only group header
        expect(result?.rows[1].columns).toHaveLength(2); // both columns
      });

      it('handles single column', () => {
        const columns: TableProps.ColumnDefinition<any>[] = [{ id: 'only', header: 'Only', cell: () => 'only' }];

        const result = CalculateHierarchyTree(columns, ['only'], []);

        expect(result?.maxDepth).toBe(1);
        expect(result?.rows).toHaveLength(1);
        expect(result?.rows[0].columns).toHaveLength(1);
        expect(result?.rows[0].columns[0]).toMatchObject({
          id: 'only',
          colspan: 1,
          rowspan: 1,
          colIndex: 0,
        });
      });

      it('handles group with no visible children', () => {
        const groups: TableProps.ColumnGroupsDefinition<any>[] = [{ id: 'empty', header: 'Empty' }];
        const columns: TableProps.ColumnDefinition<any>[] = [
          { id: 'hidden', header: 'Hidden', groupId: 'empty', cell: () => 'hidden' },
        ];

        const result = CalculateHierarchyTree(columns, [], groups);

        // Group with no visible children should not appear
        expect(result?.rows.length).toEqual(0);
        // expect(result?.rows[0].columns.find(c => c.id === 'empty')).toBeUndefined();
      });
    });
  });
});
