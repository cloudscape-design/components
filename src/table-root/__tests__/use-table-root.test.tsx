// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../__tests__/render-hook';
import { TableRootProps } from '../interfaces';
import { useTableRoot } from '../use-table-root';

const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 200 }, {}, { size: 100 }];

function gridTemplate(columns: ReadonlyArray<TableRootProps.ColumnDefinition>) {
  return renderHook(() => useTableRoot({ type: 'grid', columns })).result.current.gridTemplateColumns;
}

describe('useTableRoot', () => {
  test('auto layout exposes the layout and no grid template', () => {
    const { result } = renderHook(() => useTableRoot({ type: 'auto' }));
    expect(result.current.columnLayout.type).toBe('auto');
    expect(result.current.gridTemplateColumns).toBeUndefined();
  });

  test('grid layout exposes the layout', () => {
    const { result } = renderHook(() => useTableRoot({ type: 'grid', columns: COLUMNS }));
    expect(result.current.columnLayout.type).toBe('grid');
  });

  describe('gridTemplateColumns compiled from the size union', () => {
    test('multiple columns join into one template', () => {
      expect(gridTemplate(COLUMNS)).toBe('200px minmax(0px, 1fr) 100px');
    });

    test('a fixed pixel size becomes a px track', () => {
      expect(gridTemplate([{ size: 200 }])).toBe('200px');
    });

    test('an absent size becomes a flexible minmax(0px, 1fr) track', () => {
      expect(gridTemplate([{}])).toBe('minmax(0px, 1fr)');
    });

    test('a flex weight becomes minmax(0px, <weight>fr)', () => {
      expect(gridTemplate([{ size: { flex: 2 } }])).toBe('minmax(0px, 2fr)');
    });

    test('minWidth floors a flexible track', () => {
      expect(gridTemplate([{ minWidth: 150 }])).toBe('minmax(150px, 1fr)');
    });

    test('a fixed size ignores minWidth (redundant on a fixed track)', () => {
      expect(gridTemplate([{ size: 200, minWidth: 150 }])).toBe('200px');
    });

    test('maxWidth caps a flexible track at a px ceiling', () => {
      expect(gridTemplate([{ maxWidth: 300 }])).toBe('minmax(0px, 300px)');
      expect(gridTemplate([{ minWidth: 100, maxWidth: 300 }])).toBe('minmax(100px, 300px)');
    });
  });
});
