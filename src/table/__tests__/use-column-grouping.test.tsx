// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../__tests__/render-hook';
import { TableProps } from '../interfaces';
import { useColumnGrouping } from '../use-column-grouping';
import { COLUMN_DEFS, FLAT_DISPLAY, GROUP_DEFS, NESTED_DISPLAY, NESTED_GROUPS } from './column-grouping-fixtures';

describe('useColumnGrouping', () => {
  describe('no grouping', () => {
    it('returns a single flat row when no groups are defined', () => {
      const { result } = renderHook(() => useColumnGrouping(undefined, COLUMN_DEFS));
      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].columns).toHaveLength(COLUMN_DEFS.length);
    });

    it('treats empty groups array the same as no groups', () => {
      const { result } = renderHook(() => useColumnGrouping([], COLUMN_DEFS));
      expect(result.current.maxDepth).toBe(1);
      expect(result.current.rows).toHaveLength(1);
    });
  });

  describe('grouped columns', () => {
    it('creates two rows for flat grouping', () => {
      const { result } = renderHook(() => useColumnGrouping(GROUP_DEFS, COLUMN_DEFS, undefined, FLAT_DISPLAY));
      expect(result.current.maxDepth).toBe(2);
      expect(result.current.rows).toHaveLength(2);
    });

    it('creates three rows for nested grouping', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [
        { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
        { id: 'memory', header: 'Memory', cell: () => 'memory' },
      ];
      const { result } = renderHook(() => useColumnGrouping(NESTED_GROUPS, cols, undefined, NESTED_DISPLAY));
      expect(result.current.maxDepth).toBe(3);
      expect(result.current.rows).toHaveLength(3);
      expect(result.current.columnToParentIds.get('cpu')).toEqual(['metrics', 'performance']);
    });
  });

  describe('visibleColumnIds filtering (hook-specific)', () => {
    it('uses the visibleColumnIds Set to exclude hidden columns', () => {
      const visibleIds = new Set(['id', 'cpu']);
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { type: 'group', id: 'performance', visible: true, children: [{ id: 'cpu', visible: true }] },
      ];
      const { result } = renderHook(() => useColumnGrouping(GROUP_DEFS, COLUMN_DEFS, visibleIds, display));
      const allIds = result.current.rows.flatMap(r => r.columns.map(c => c.id));
      expect(allIds).toContain('cpu');
      expect(allIds).not.toContain('memory');
      expect(allIds).not.toContain('type');
    });

    it('hides a group entirely when all its children are outside visibleColumnIds', () => {
      const visibleIds = new Set(['id', 'name']);
      const display: TableProps.ColumnDisplayProperties[] = [
        { id: 'id', visible: true },
        { id: 'name', visible: true },
        { type: 'group', visible: true, id: 'performance', children: [{ id: 'cpu', visible: false }] },
      ];
      const { result } = renderHook(() => useColumnGrouping(GROUP_DEFS, COLUMN_DEFS, visibleIds, display));
      const groupIds = result.current.rows.flatMap(r => r.columns.filter(c => c.isGroup).map(c => c.id));
      expect(groupIds).not.toContain('performance');
    });
  });

  describe('edge cases', () => {
    it('handles columns without IDs gracefully', () => {
      const cols: TableProps.ColumnDefinition<any>[] = [{ header: 'No ID', cell: () => 'x' }];
      const { result } = renderHook(() => useColumnGrouping([], cols));
      expect(result.current.rows).toBeDefined();
    });

    it('warns in dev when a group referenced in columnDisplay is not in groupDefinitions', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const display: TableProps.ColumnDisplayProperties[] = [
        { type: 'group', visible: true, id: 'ghost-group', children: [{ id: 'cpu', visible: true }] },
      ];
      renderHook(() => useColumnGrouping([], COLUMN_DEFS, undefined, display));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ghost-group'));
      warnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
});
