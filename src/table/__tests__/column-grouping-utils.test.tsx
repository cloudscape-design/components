// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CalculateHierarchyTree, TableHeaderNode } from '../column-grouping-utils';
import { TableProps } from '../interfaces';
import { FLAT_DISPLAY, GROUP_DEFS, NESTED_DISPLAY, NESTED_GROUPS } from './column-grouping-fixtures';

// Minimal column set used across most tests
const COLS: TableProps.ColumnDefinition<any>[] = [
  { id: 'id', header: 'ID', cell: () => 'id' },
  { id: 'name', header: 'Name', cell: () => 'name' },
  { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
  { id: 'memory', header: 'Memory', cell: () => 'memory' },
  { id: 'networkIn', header: 'Network In', cell: () => 'networkIn' },
  { id: 'type', header: 'Type', cell: () => 'type' },
  { id: 'az', header: 'AZ', cell: () => 'az' },
  { id: 'cost', header: 'Cost', cell: () => 'cost' },
];

const ALL_IDS = COLS.map(c => c.id!);

describe('column-grouping-utils', () => {
  describe('TableHeaderNode', () => {
    it('creates node with default properties', () => {
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

    it('accepts constructor options and identifies node types', () => {
      const colDef: TableProps.ColumnDefinition<any> = { id: 'col', header: 'Col', cell: () => 'col' };
      const groupDef = { id: 'grp', header: 'Grp' };

      const colNode = new TableHeaderNode('col', {
        colspan: 2,
        rowspan: 3,
        columnDefinition: colDef,
        rowIndex: 1,
        colIndex: 2,
      });
      const groupNode = new TableHeaderNode('grp', { groupDefinition: groupDef });
      const rootNode = new TableHeaderNode('root', { isRoot: true });

      expect(colNode.colspan).toBe(2);
      expect(colNode.rowspan).toBe(3);
      expect(colNode.columnDefinition).toBe(colDef);
      expect(colNode.isGroup).toBe(false);
      expect(groupNode.isGroup).toBe(true);
      expect(rootNode.isRoot).toBe(true);
      expect(rootNode.isRootNode).toBe(true);
    });

    it('manages parent/child relationships and leaf detection', () => {
      const parent = new TableHeaderNode('parent');
      const child1 = new TableHeaderNode('child1');
      const child2 = new TableHeaderNode('child2');
      const root = new TableHeaderNode('root', { isRoot: true });

      parent.addChild(child1);
      parent.addChild(child2);

      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(child1);
      expect(parent.children[1]).toBe(child2);
      expect(child1.parentNode).toBe(parent);
      expect(parent.isLeaf).toBe(false);
      expect(child1.isLeaf).toBe(true);
      expect(root.isLeaf).toBe(false); // root is never a leaf
    });
  });

  describe('CalculateHierarchyTree', () => {
    describe('no grouping', () => {
      it('returns a single row with all visible columns, rowspan=1, sequential colIndex', () => {
        const result = CalculateHierarchyTree(COLS, ALL_IDS, []);

        expect(result.maxDepth).toBe(1);
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].columns).toHaveLength(COLS.length);
        result.rows[0].columns.forEach((col, i) => {
          expect(col.rowspan).toBe(1);
          expect(col.colspan).toBe(1);
          expect(col.isGroup).toBe(false);
          expect(col.colIndex).toBe(i);
        });
        expect(result.columnToParentIds.size).toBe(0);
      });
    });

    describe('flat grouping', () => {
      it('creates two rows with correct structure', () => {
        const result = CalculateHierarchyTree(COLS, ALL_IDS, GROUP_DEFS, FLAT_DISPLAY);

        expect(result.maxDepth).toBe(2);
        expect(result.rows).toHaveLength(2);

        // Row 0: ungrouped columns span all rows (rowspan=2), plus group headers
        const row0 = result.rows[0].columns;
        expect(row0.map(c => c.id)).toEqual(['id', 'name', 'performance', 'config', 'pricing']);
        expect(row0.find(c => c.id === 'id')).toMatchObject({ rowspan: 2 });
        expect(row0.find(c => c.id === 'name')).toMatchObject({ rowspan: 2 });
        expect(row0.find(c => c.id === 'performance')).toMatchObject({ isGroup: true, colspan: 3, rowspan: 1 });
        expect(row0.find(c => c.id === 'config')).toMatchObject({ isGroup: true, colspan: 2 });
        expect(row0.find(c => c.id === 'pricing')).toMatchObject({ isGroup: true, colspan: 1 });

        // Row 1: only leaf columns under groups (ungrouped columns are not repeated)
        const row1 = result.rows[1].columns;
        expect(row1.map(c => c.id)).toEqual(['cpu', 'memory', 'networkIn', 'type', 'az', 'cost']);
        expect(row1.find(c => c.id === 'cpu')).toMatchObject({ isGroup: false, rowspan: 1, colspan: 1 });
      });

      it('tracks parent IDs and colIndex correctly', () => {
        const result = CalculateHierarchyTree(COLS, ALL_IDS, GROUP_DEFS, FLAT_DISPLAY);

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

      it('creates three rows and calculates colspan/parentIds correctly', () => {
        const result = CalculateHierarchyTree(nestedCols, ['cpu', 'memory'], NESTED_GROUPS, NESTED_DISPLAY);

        expect(result.maxDepth).toBe(3);
        expect(result.rows).toHaveLength(3);
        expect(result.rows[0].columns[0]).toMatchObject({ id: 'metrics', colspan: 2, rowIndex: 0 });
        expect(result.rows[1].columns[0]).toMatchObject({ id: 'performance', colspan: 2, rowIndex: 1 });
        expect(result.rows[2].columns.map(c => c.id)).toEqual(['cpu', 'memory']);
        expect(result.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
      });

      it('handles 3-level nesting', () => {
        const groups: TableProps.GroupDefinition<any>[] = [
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
                children: [
                  {
                    type: 'group',
                    visible: true,
                    id: 'l3',
                    children: [{ id: 'cpu', visible: true }],
                  },
                ],
              },
            ],
          },
        ];
        const result = CalculateHierarchyTree(nestedCols, ['cpu'], groups, display);
        expect(result.maxDepth).toBe(4);
        expect(result.columnToParentIds.get('cpu')).toEqual(['l1', 'l2', 'l3']);
      });

      it('handles mixed nested and flat groups', () => {
        const groups: TableProps.GroupDefinition<any>[] = [
          { id: 'metrics', header: 'Metrics' },
          { id: 'performance', header: 'Performance' },
          { id: 'config', header: 'Config' },
        ];
        const display: TableProps.ColumnDisplayProperties[] = [
          {
            type: 'group',
            id: 'metrics',
            visible: true,
            children: [
              {
                type: 'group',
                id: 'performance',
                visible: true,
                children: [{ id: 'cpu', visible: true }],
              },
            ],
          },
          { type: 'group', visible: true, id: 'config', children: [{ id: 'memory', visible: true }] },
        ];
        const result = CalculateHierarchyTree(nestedCols, ['cpu', 'memory'], groups, display);

        expect(result.maxDepth).toBe(3);
        // Row 0: metrics + config spanning all rows (rowspan=2, not hidden)
        const row0 = result.rows[0].columns;
        expect(row0.map(c => c.id)).toEqual(['metrics', 'config']);
        expect(row0.find(c => c.id === 'config')).toMatchObject({ rowspan: 2 });
        // Row 1: only performance (config is already in row 0 with rowspan=2, not repeated)
        expect(result.rows[1].columns.map(c => c.id)).toEqual(['performance']);
      });
    });

    describe('visibility filtering', () => {
      it('includes only visible columns and adjusts group colspan', () => {
        const groups: TableProps.GroupDefinition<any>[] = [{ id: 'g', header: 'G' }];
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
        const result = CalculateHierarchyTree(COLS, ['id', 'cpu'], groups, display);

        const allIds = result.rows.flatMap(r => r.columns.map(c => c.id));
        expect(allIds).toContain('cpu');
        expect(allIds).not.toContain('memory');
        expect(result.rows[0].columns.find(c => c.id === 'g')?.colspan).toBe(1);
      });

      it('omits a group entirely when all its children are hidden', () => {
        const groups: TableProps.GroupDefinition<any>[] = [{ id: 'g', header: 'G' }];
        const display: TableProps.ColumnDisplayProperties[] = [
          { id: 'id', visible: true },
          { type: 'group', visible: true, id: 'g', children: [{ id: 'cpu', visible: false }] },
        ];
        const result = CalculateHierarchyTree(COLS, ['id'], groups, display);
        expect(result.rows[0].columns.map(c => c.id)).not.toContain('g');
      });
    });

    describe('edge cases', () => {
      it('returns empty structure for empty column list', () => {
        const result = CalculateHierarchyTree([], [], []);
        expect(result.rows).toHaveLength(0);
        expect(result.maxDepth).toBe(0);
      });

      it('skips columns without id and groups without id', () => {
        const colsNoId: TableProps.ColumnDefinition<any>[] = [
          { header: 'No ID', cell: () => 'x' } as any,
          { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        ];
        const groupsNoId: TableProps.GroupDefinition<any>[] = [
          { header: 'No ID' } as any,
          { id: 'valid', header: 'Valid' },
        ];
        const display: TableProps.ColumnDisplayProperties[] = [
          {
            type: 'group',
            visible: true,
            id: 'valid',
            children: [{ id: 'cpu', visible: true }],
          },
        ];
        const result = CalculateHierarchyTree(colsNoId, ['cpu'], groupsNoId, display);
        const groupIds = result.rows[0].columns.filter(c => c.isGroup).map(c => c.id);
        expect(groupIds).toEqual(['valid']);
        expect(result.rows[1].columns[0].id).toBe('cpu');
      });

      it('skips entire subtree when group id is not in groupDefinitions', () => {
        const display: TableProps.ColumnDisplayProperties[] = [
          { type: 'group', visible: true, id: 'nonexistent', children: [{ id: 'cpu', visible: true }] },
        ];
        const result = CalculateHierarchyTree(COLS, ['cpu'], [], display);
        expect(result.rows).toHaveLength(0);
        expect(result.columnToParentIds.has('cpu')).toBe(false);
      });

      it('treats a group with no visible children as absent', () => {
        const groups: TableProps.GroupDefinition<any>[] = [{ id: 'g', header: 'G' }];
        const display: TableProps.ColumnDisplayProperties[] = [
          { type: 'group', visible: true, id: 'g', children: [{ id: 'cpu', visible: false }] },
        ];
        const result = CalculateHierarchyTree(COLS, [], groups, display);
        expect(result.rows).toHaveLength(0);
      });
    });
  });
});
