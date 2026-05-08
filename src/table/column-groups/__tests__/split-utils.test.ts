// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../interfaces';
import { getChildColumnIds, getGroupSplit } from '../split-utils';
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

describe('getChildColumnIds', () => {
  test('returns leaf column IDs for a group', () => {
    const structure = buildStructure();
    expect(getChildColumnIds(structure, 'config')).toEqual(['type', 'az']);
    expect(getChildColumnIds(structure, 'perf')).toEqual(['cpu', 'memory']);
  });

  test('returns empty array for unknown group', () => {
    const structure = buildStructure();
    expect(getChildColumnIds(structure, 'nonexistent')).toEqual([]);
  });
});

describe('getGroupSplit', () => {
  test('returns null when group is fully within sticky-first boundary', () => {
    const structure = buildStructure();
    // config group is at colIndex 2-3, stickyFirst=4 means all within boundary
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    expect(getGroupSplit(configGroup, 4, 0, 6)).toBeNull();
  });

  test('returns null when group is fully outside sticky boundary', () => {
    const structure = buildStructure();
    // config group is at colIndex 2-3, stickyFirst=1 means only id is sticky
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    expect(getGroupSplit(configGroup, 1, 0, 6)).toBeNull();
  });

  test('detects split by sticky-first boundary', () => {
    const structure = buildStructure();
    // config group is at colIndex 2-3, stickyFirst=3 means columns 0,1,2 are sticky
    // type(2) is sticky, az(3) is not — group is split
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    const split = getGroupSplit(configGroup, 3, 0, 6);
    expect(split).toEqual({ stickyColspan: 1, nonStickyColspan: 1, side: 'first' });
  });

  test('detects split by sticky-last boundary', () => {
    const structure = buildStructure();
    // perf group is at colIndex 4-5, stickyLast=1 means column 5 (memory) is sticky
    // cpu(4) is not sticky, memory(5) is — group is split
    const perfGroup = structure.rows[0].columns.find(c => c.id === 'perf')!;
    const split = getGroupSplit(perfGroup, 0, 1, 6);
    expect(split).toEqual({ stickyColspan: 1, nonStickyColspan: 1, side: 'last' });
  });

  test('returns null for non-group cells', () => {
    const structure = buildStructure();
    const leafCol = structure.rows[1].columns[0];
    expect(getGroupSplit(leafCol, 3, 0, 6)).toBeNull();
  });

  test('returns null when no sticky columns configured', () => {
    const structure = buildStructure();
    const configGroup = structure.rows[0].columns.find(c => c.id === 'config')!;
    expect(getGroupSplit(configGroup, 0, 0, 6)).toBeNull();
  });
});
