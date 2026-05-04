// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../interfaces';
import { calculateHierarchyTree, TableHeaderNode } from '../utils';
import { ALL_IDS, COLUMN_DEFS, FLAT_DISPLAY, GROUP_DEFS, NESTED_DISPLAY, NESTED_GROUPS } from './fixtures';

describe('TableHeaderNode', () => {
  test('creates node with default properties', () => {
    const node = new TableHeaderNode('test-id');
    expect(node.id).toBe('test-id');
    expect(node.colSpan).toBe(1);
    expect(node.rowSpan).toBe(1);
    expect(node.children).toEqual([]);
    expect(node.rowIndex).toBe(-1);
    expect(node.colIndex).toBe(-1);
    expect(node.isRoot).toBe(false);
    expect(node.isLeaf).toBe(true);
    expect(node.isGroup).toBe(false);
  });

  test('accepts constructor props and identifies node types', () => {
    const colDef: TableProps.ColumnDefinition<any> = { id: 'col', header: 'Col', cell: () => 'col' };
    const groupDef: TableProps.GroupDefinition = { id: 'grp', header: 'Grp' };

    const colNode = new TableHeaderNode('col', {
      columnDefinition: colDef,
      colSpan: 2,
      rowSpan: 3,
      rowIndex: 1,
      colIndex: 2,
    });
    const groupNode = new TableHeaderNode('grp', { groupDefinition: groupDef });
    const rootNode = new TableHeaderNode('root', { isRoot: true });

    expect(colNode.colSpan).toBe(2);
    expect(colNode.rowSpan).toBe(3);
    expect(colNode.columnDefinition).toBe(colDef);
    expect(colNode.isGroup).toBe(false);
    expect(groupNode.isGroup).toBe(true);
    expect(rootNode.isRoot).toBe(true);
    expect(rootNode.isLeaf).toBe(false);
  });

  test('manages parent/child relationships', () => {
    const parent = new TableHeaderNode('parent');
    const child1 = new TableHeaderNode('child1');
    const child2 = new TableHeaderNode('child2');

    parent.addChild(child1);
    parent.addChild(child2);

    expect(parent.children).toHaveLength(2);
    expect(child1.parent).toBe(parent);
    expect(child2.parent).toBe(parent);
    expect(parent.isLeaf).toBe(false);
    expect(child1.isLeaf).toBe(true);
  });
});

describe('calculateHierarchyTree', () => {
  describe('no grouping', () => {
    test('returns a single row with all visible columns', () => {
      const result = calculateHierarchyTree(COLUMN_DEFS, ALL_IDS, []);

      expect(result.maxDepth).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].columns).toHaveLength(COLUMN_DEFS.length);
      result.rows[0].columns.forEach((col, i) => {
        expect(col.rowSpan).toBe(1);
        expect(col.colSpan).toBe(1);
        expect(col.isGroup).toBe(false);
        expect(col.colIndex).toBe(i);
      });
      expect(result.columnToParentIds.size).toBe(0);
    });
  });

  describe('flat grouping', () => {
    test('creates two rows with correct structure', () => {
      const result = calculateHierarchyTree(COLUMN_DEFS, ALL_IDS, GROUP_DEFS, FLAT_DISPLAY);

      expect(result.maxDepth).toBe(2);
      expect(result.rows).toHaveLength(2);

      // Row 0: ungrouped columns (rowSpan=2) + group headers
      const row0 = result.rows[0].columns;
      expect(row0.map(c => c.id)).toEqual(['id', 'name', 'performance', 'config', 'pricing']);
      expect(row0.find(c => c.id === 'id')).toMatchObject({ rowSpan: 2 });
      expect(row0.find(c => c.id === 'name')).toMatchObject({ rowSpan: 2 });
      expect(row0.find(c => c.id === 'performance')).toMatchObject({ isGroup: true, colSpan: 3, rowSpan: 1 });
      expect(row0.find(c => c.id === 'config')).toMatchObject({ isGroup: true, colSpan: 2 });
      expect(row0.find(c => c.id === 'pricing')).toMatchObject({ isGroup: true, colSpan: 1 });

      // Row 1: leaf columns under groups
      const row1 = result.rows[1].columns;
      expect(row1.map(c => c.id)).toEqual(['cpu', 'memory', 'networkIn', 'type', 'az', 'cost']);
      expect(row1.every(c => !c.isGroup && c.rowSpan === 1 && c.colSpan === 1)).toBe(true);
    });

    test('tracks parent IDs and colIndex correctly', () => {
      const result = calculateHierarchyTree(COLUMN_DEFS, ALL_IDS, GROUP_DEFS, FLAT_DISPLAY);

      expect(result.columnToParentIds.get('cpu')).toEqual(['performance']);
      expect(result.columnToParentIds.get('type')).toEqual(['config']);
      expect(result.columnToParentIds.has('id')).toBe(false);

      const row0 = result.rows[0].columns;
      expect(row0.find(c => c.id === 'performance')?.colIndex).toBe(2);
      expect(row0.find(c => c.id === 'config')?.colIndex).toBe(5);
    });
  });

  describe('nested grouping', () => {
    const nestedCols: TableProps.ColumnDefinition<any>[] = [
      { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
      { id: 'memory', header: 'Memory', cell: () => 'memory' },
    ];

    test('creates three rows for nested groups', () => {
      const result = calculateHierarchyTree(nestedCols, ['cpu', 'memory'], NESTED_GROUPS, NESTED_DISPLAY);

      expect(result.maxDepth).toBe(3);
      expect(result.rows).toHaveLength(3);
      expect(result.rows[0].columns[0]).toMatchObject({ id: 'metrics', colSpan: 2, rowIndex: 0 });
      expect(result.rows[1].columns[0]).toMatchObject({ id: 'performance', colSpan: 2, rowIndex: 1 });
      expect(result.rows[2].columns.map(c => c.id)).toEqual(['cpu', 'memory']);
      expect(result.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
    });

    test('handles 3-level nesting', () => {
      const groups: TableProps.GroupDefinition[] = [
        { id: 'l1', header: 'L1' },
        { id: 'l2', header: 'L2' },
        { id: 'l3', header: 'L3' },
      ];
      const display: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'l1',
          visible: true,
          children: [
            {
              type: 'group',
              id: 'l2',
              visible: true,
              children: [{ type: 'group', id: 'l3', visible: true, children: [{ id: 'cpu', visible: true }] }],
            },
          ],
        },
      ];
      const result = calculateHierarchyTree(nestedCols, ['cpu'], groups, display);
      expect(result.maxDepth).toBe(4);
      expect(result.columnToParentIds.get('cpu')).toEqual(['l1', 'l2', 'l3']);
    });

    test('handles mixed nested and flat groups', () => {
      const groups: TableProps.GroupDefinition[] = [
        { id: 'metrics', header: 'Metrics' },
        { id: 'performance', header: 'Performance' },
        { id: 'config', header: 'Config' },
      ];
      const display: TableProps.ColumnDisplayProperties[] = [
        {
          type: 'group',
          id: 'metrics',
          visible: true,
          children: [{ type: 'group', id: 'performance', visible: true, children: [{ id: 'cpu', visible: true }] }],
        },
        { type: 'group', id: 'config', visible: true, children: [{ id: 'memory', visible: true }] },
      ];
      const result = calculateHierarchyTree(nestedCols, ['cpu', 'memory'], groups, display);

      expect(result.maxDepth).toBe(3);
      const row0 = result.rows[0].columns;
      expect(row0.map(c => c.id)).toEqual(['metrics', 'config']);
      expect(row0.find(c => c.id === 'config')).toMatchObject({ rowSpan: 2 });
      expect(result.rows[1].columns.map(c => c.id)).toEqual(['performance']);
    });
  });

  describe('visibility filtering', () => {
    test('includes only visible columns and adjusts group colSpan', () => {
      const groups: TableProps.GroupDefinition[] = [{ id: 'g', header: 'G' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        {
          type: 'group',
          id: 'g',
          visible: true,
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: false },
          ],
        },
      ];
      const result = calculateHierarchyTree(COLUMN_DEFS, ['id', 'cpu'], groups, display);

      const allIds = result.rows.flatMap(r => r.columns.map(c => c.id));
      expect(allIds).toContain('cpu');
      expect(allIds).not.toContain('memory');
      expect(result.rows[0].columns.find(c => c.id === 'g')?.colSpan).toBe(1);
    });

    test('omits a group entirely when all its children are hidden', () => {
      const groups: TableProps.GroupDefinition[] = [{ id: 'g', header: 'G' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { type: 'group', id: 'g', visible: true, children: [{ id: 'cpu', visible: false }] },
      ];
      const result = calculateHierarchyTree(COLUMN_DEFS, ['id'], groups, display);
      expect(result.rows[0].columns.map(c => c.id)).not.toContain('g');
    });
  });

  describe('edge cases', () => {
    test('returns empty structure for empty column list', () => {
      const result = calculateHierarchyTree([], [], []);
      expect(result.rows).toHaveLength(0);
      expect(result.maxDepth).toBe(0);
    });

    test('skips columns without id', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [
        { header: 'No ID', cell: () => 'x' } as any,
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
      ];
      const groups: TableProps.GroupDefinition[] = [{ id: 'g', header: 'G' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'g', visible: true, children: [{ id: 'cpu', visible: true }] },
      ];
      const result = calculateHierarchyTree(cols, ['cpu'], groups, display);
      expect(result.rows[1].columns[0].id).toBe('cpu');
    });

    test('skips subtree when group id is not in groupDefinitions', () => {
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'nonexistent', visible: true, children: [{ id: 'cpu', visible: true }] },
      ];
      const result = calculateHierarchyTree(COLUMN_DEFS, ['cpu'], [], display);
      expect(result.rows).toHaveLength(0);
    });

    test('treats a group with no visible children as absent', () => {
      const groups: TableProps.GroupDefinition[] = [{ id: 'g', header: 'G' }];
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'g', visible: true, children: [{ id: 'cpu', visible: false }] },
      ];
      const result = calculateHierarchyTree(COLUMN_DEFS, [], groups, display);
      expect(result.rows).toHaveLength(0);
    });
  });
});
