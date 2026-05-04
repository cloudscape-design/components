// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../../__tests__/render-hook';
import { TableProps } from '../../interfaces';
import { useColumnGroups } from '../use-column-groups';
import { COLUMN_DEFS, FLAT_DISPLAY, GROUP_DEFS, NESTED_DISPLAY, NESTED_GROUPS } from './fixtures';

describe('useColumnGroups', () => {
  describe('no grouping', () => {
    test('returns a single flat row when no groups are defined', () => {
      const { result } = renderHook(() => useColumnGroups(COLUMN_DEFS, undefined));
      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].columns).toHaveLength(COLUMN_DEFS.length);
    });

    test('treats empty groups array the same as no groups', () => {
      const { result } = renderHook(() => useColumnGroups(COLUMN_DEFS, []));
      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
    });
  });

  describe('grouped columns', () => {
    test('creates two rows for flat grouping', () => {
      const { result } = renderHook(() => useColumnGroups(COLUMN_DEFS, GROUP_DEFS, undefined, FLAT_DISPLAY));
      expect(result.current.maxDepth).toBe(2);
      expect(result.current.rows).toHaveLength(2);
    });

    test('creates three rows for nested grouping', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', cell: () => 'memory' },
      ];
      const { result } = renderHook(() => useColumnGroups(cols, NESTED_GROUPS, undefined, NESTED_DISPLAY));
      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);
      expect(result.current.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
    });
  });

  describe('visibleColumnIds filtering', () => {
    test('excludes hidden columns via visibleColumnIds', () => {
      const visibleIds = new Set(['id', 'cpu']);
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { type: 'group', id: 'performance', visible: true, children: [{ id: 'cpu', visible: true }] },
      ];
      const { result } = renderHook(() => useColumnGroups(COLUMN_DEFS, GROUP_DEFS, visibleIds, display));
      const allIds = result.current.rows.flatMap(r => r.columns.map(c => c.id));
      expect(allIds).toContain('cpu');
      expect(allIds).not.toContain('memory');
      expect(allIds).not.toContain('type');
    });

    test('hides a group entirely when all its children are outside visibleColumnIds', () => {
      const visibleIds = new Set(['id', 'name']);
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { id: 'name', visible: true },
        { type: 'group', id: 'performance', visible: true, children: [{ id: 'cpu', visible: false }] },
      ];
      const { result } = renderHook(() => useColumnGroups(COLUMN_DEFS, GROUP_DEFS, visibleIds, display));
      const groupIds = result.current.rows.flatMap(r => r.columns.filter(c => c.isGroup).map(c => c.id));
      expect(groupIds).not.toContain('performance');
    });
  });

  describe('edge cases', () => {
    test('handles columns without IDs gracefully', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [{ header: 'No ID', cell: () => 'x' } as any];
      const { result } = renderHook(() => useColumnGroups(cols, []));
      expect(result.current.rows).toBeDefined();
    });

    test('warns in dev when a group referenced in columnDisplay is not in groupDefinitions', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', id: 'ghost-group', visible: true, children: [{ id: 'cpu', visible: true }] },
      ];
      renderHook(() => useColumnGroups(COLUMN_DEFS, [], undefined, display));

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ghost-group'));
      warnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
});
