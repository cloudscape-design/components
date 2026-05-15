// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../interfaces';
import { getGroupColumnIds, getGroupSplit } from '../split-utils';
import { calculateHierarchyTree } from '../utils';

const COLUMN_DEFS: TableProps.ColumnDefinition<any>[] = [
  { id: 'id', header: 'ID', cell: () => 'id' },
  { id: 'name', header: 'Name', cell: () => 'name' },
  { id: 'type', header: 'Type', cell: () => 'type' },
  { id: 'az', header: 'AZ', cell: () => 'az' },
  { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
  { id: 'memory', header: 'Memory', cell: () => 'memory' },
];

const GROUP_DEFS: TableProps.GroupDefinition[] = [
  { id: 'config', header: 'Configuration' },
  { id: 'perf', header: 'Performance' },
];

const DISPLAY: TableProps.ColumnDisplayProperties[] = [
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

const ALL_IDS = COLUMN_DEFS.map(c => c.id!);

function buildStructure() {
  return calculateHierarchyTree(COLUMN_DEFS, ALL_IDS, GROUP_DEFS, DISPLAY);
}

describe('getGroupColumnIds', () => {
  test('returns leaf column IDs for a group', () => {
    const structure = buildStructure();
    expect(getGroupColumnIds(structure, 'config')).toEqual(['type', 'az']);
    expect(getGroupColumnIds(structure, 'perf')).toEqual(['cpu', 'memory']);
  });

  test('returns empty array for unknown group', () => {
    const structure = buildStructure();
    expect(getGroupColumnIds(structure, 'nonexistent')).toEqual([]);
  });
});

describe('getGroupSplit', () => {
  test('no split when group is fully within sticky-first boundary', () => {
    const structure = buildStructure();
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    const split = getGroupSplit({ col: configGroup, stickyCount: 4, side: 'first', totalLeafColumns: 6 });
    expect(split.stickyColspan).toBe(0);
    expect(split.staticColspan).toBe(0);
  });

  test('no split when group is fully outside sticky boundary', () => {
    const structure = buildStructure();
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    const split = getGroupSplit({ col: configGroup, stickyCount: 1, side: 'first', totalLeafColumns: 6 });
    expect(split.stickyColspan).toBe(0);
    expect(split.staticColspan).toBe(0);
  });

  test('detects split by sticky-first boundary', () => {
    const structure = buildStructure();
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    const split = getGroupSplit({ col: configGroup, stickyCount: 3, side: 'first', totalLeafColumns: 6 });
    expect(split).toEqual({ stickyColspan: 1, staticColspan: 1 });
  });

  test('detects split by sticky-last boundary', () => {
    const structure = buildStructure();
    const perfGroup = structure.rows[0].columns.find(c => c.id === 'perf')!;
    const split = getGroupSplit({ col: perfGroup, stickyCount: 1, side: 'last', totalLeafColumns: 6 });
    expect(split).toEqual({ stickyColspan: 1, staticColspan: 1 });
  });

  test('non-group cells return no split', () => {
    const structure = buildStructure();
    const leafCol = structure.rows[1].columns[0];
    const split = getGroupSplit({ col: leafCol, stickyCount: 3, side: 'first', totalLeafColumns: 6 });
    expect(split.stickyColspan).toBe(0);
  });

  test('no split when stickyCount is 0', () => {
    const structure = buildStructure();
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    const split = getGroupSplit({ col: configGroup, stickyCount: 0, side: 'first', totalLeafColumns: 6 });
    expect(split.stickyColspan).toBe(0);
    expect(split.staticColspan).toBe(0);
  });
});
