// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  useStickyColumns,
  StickyColumnsModel,
  useStickyCellStyles,
} from '../../../../lib/components/table/sticky-columns';
import { updateCellOffsets } from '../../../../lib/components/table/sticky-columns/utils';
import { getStickyClassNames } from '../../../../lib/components/table/utils';
import { renderHook } from '../../../__tests__/render-hook';

function createElementWithWidth(tag: string, width = 0) {
  const element = document.createElement(tag);
  jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({ width } as DOMRect));
  return element;
}

function createMockTable(
  stickyColumns: StickyColumnsModel,
  wrapperWidth: number,
  tableWidth: number,
  ...cellWidths: number[]
) {
  const wrapper = createElementWithWidth('div', wrapperWidth);
  const table = createElementWithWidth('table', tableWidth);
  const cells = cellWidths.map(width => createElementWithWidth('td', width));

  stickyColumns.refs.wrapper(wrapper);
  stickyColumns.refs.table(table);
  cells.forEach((cell, index) => stickyColumns.refs.cell(index + 1, cell));

  return { wrapper, table, cells };
}

test('wrapper styles is empty and wrapper listener is not attached when feature is off', () => {
  const tableWrapper = document.createElement('div');
  const addTableWrapperOnScrollSpy = jest.spyOn(tableWrapper, 'addEventListener');
  const { result } = renderHook(() =>
    useStickyColumns({ visibleColumns: [], stickyColumnsFirst: 0, stickyColumnsLast: 0 })
  );
  result.current.refs.wrapper(tableWrapper);

  expect(result.current.style.wrapper).not.toBeDefined();
  expect(addTableWrapperOnScrollSpy).not.toHaveBeenCalled();
});

test('wrapper styles is not empty and wrapper listener is attached when feature is on', () => {
  const tableWrapper = document.createElement('div');
  const addTableWrapperOnScrollSpy = jest.spyOn(tableWrapper, 'addEventListener');
  const { result } = renderHook(() =>
    useStickyColumns({ visibleColumns: [], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  result.current.refs.wrapper(tableWrapper);

  expect(result.current.style.wrapper).toEqual({ scrollPaddingInlineStart: 0, scrollPaddingInlineEnd: 0 });
  expect(addTableWrapperOnScrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
});

test('styles update when sticky column properties change', () => {
  const emptyVisibleColumns = new Array<PropertyKey>();
  const allVisibleColumns = [1, 2, 3];
  const { result, rerender } = renderHook(useStickyColumns, {
    initialProps: { visibleColumns: emptyVisibleColumns, stickyColumnsFirst: 0, stickyColumnsLast: 0 },
  });
  createMockTable(result.current, 500, 500, 100, 200, 300);

  const updateCellStylesSpy = jest.spyOn(result.current.store, 'updateCellStyles' as any);

  expect(updateCellStylesSpy).not.toHaveBeenCalled();

  rerender({ visibleColumns: emptyVisibleColumns, stickyColumnsFirst: 1, stickyColumnsLast: 0 });
  expect(updateCellStylesSpy).toHaveBeenCalledTimes(1);

  rerender({ visibleColumns: emptyVisibleColumns, stickyColumnsFirst: 1, stickyColumnsLast: 1 });
  expect(updateCellStylesSpy).toHaveBeenCalledTimes(2);

  rerender({ visibleColumns: allVisibleColumns, stickyColumnsFirst: 1, stickyColumnsLast: 1 });
  expect(updateCellStylesSpy).toHaveBeenCalledTimes(3);

  rerender({ visibleColumns: allVisibleColumns, stickyColumnsFirst: 1, stickyColumnsLast: 1 });
  expect(updateCellStylesSpy).toHaveBeenCalledTimes(3);
});

test('styles update when wrapper scrolls', () => {
  const tableWrapper = document.createElement('div');
  const table = document.createElement('table');
  const { result } = renderHook(() =>
    useStickyColumns({ visibleColumns: [], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  result.current.refs.wrapper(tableWrapper);
  result.current.refs.table(table);
  const updateCellStylesSpy = jest.spyOn(result.current.store, 'updateCellStyles' as any);

  expect(updateCellStylesSpy).not.toHaveBeenCalled();

  tableWrapper.dispatchEvent(new UIEvent('scroll'));
  expect(updateCellStylesSpy).toHaveBeenCalledTimes(1);
});

test('generates non-empty sticky cell state', () => {
  const { result, rerender } = renderHook(() =>
    useStickyColumns({ visibleColumns: [1, 2, 3], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  createMockTable(result.current, 300, 500, 100, 200, 300);

  // Wait for effect
  rerender({});

  expect(result.current.store.get()).toEqual({
    cellState: new Map([
      [
        1,
        {
          lastInsetInlineStart: false,
          lastInsetInlineEnd: false,
          padInlineStart: false,
          offset: { insetInlineStart: 0 },
        },
      ],
    ]),
    wrapperState: { scrollPaddingInlineStart: 100, scrollPaddingInlineEnd: 0 },
  });
});

test('generates empty cell state if wrapper is not scrollable', () => {
  const { result, rerender } = renderHook(() =>
    useStickyColumns({ visibleColumns: [1, 2, 3], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  createMockTable(result.current, 500, 500, 100, 200, 300);

  // Wait for effect
  rerender({});

  expect(result.current.store.get()).toEqual({
    cellState: new Map(),
    wrapperState: { scrollPaddingInlineStart: 100, scrollPaddingInlineEnd: 0 },
  });
});

test('generates empty sticky cell state if not enough scrollable space', () => {
  const { result, rerender } = renderHook(() =>
    useStickyColumns({ visibleColumns: [1, 2, 3], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  createMockTable(result.current, 300, 500, 200, 300, 100);

  // Wait for effect
  rerender({});

  expect(result.current.store.get()).toEqual({
    cellState: new Map(),
    wrapperState: { scrollPaddingInlineStart: 200, scrollPaddingInlineEnd: 0 },
  });
});

test('generates non-empty styles for sticky cells', () => {
  const { result, rerender } = renderHook(() =>
    useStickyColumns({ visibleColumns: [1, 2, 3], stickyColumnsFirst: 0, stickyColumnsLast: 1 })
  );
  createMockTable(result.current, 300, 500, 300, 200, 100);

  const getClassName = jest.fn().mockImplementation(() => ({ 'sticky-cell': true }));
  const { result: cellStylesResult, rerender: rerenderCellStyles } = renderHook(() =>
    useStickyCellStyles({ stickyColumns: result.current, columnId: 3, getClassName })
  );

  // Wait for effect
  rerender({});
  rerenderCellStyles({});

  expect(getClassName).toHaveBeenCalledWith({
    lastInsetInlineStart: false,
    lastInsetInlineEnd: false,
    padInlineStart: false,
    offset: { insetInlineEnd: 0 },
  });
  expect(cellStylesResult.current.className).toBe('sticky-cell');
  expect(cellStylesResult.current.style).toEqual({ insetInlineEnd: 0 });
});

test('updates sticky cell styles', () => {
  const { result, rerender } = renderHook(() =>
    useStickyColumns({ visibleColumns: [1, 2, 3], stickyColumnsFirst: 1, stickyColumnsLast: 0 })
  );
  const elements = createMockTable(result.current, 300, 500, 100, 200, 300);

  const getClassName = jest.fn().mockImplementation(() => ({ 'sticky-cell': true }));
  const { result: cellStylesResult, rerender: rerenderCellStyles } = renderHook(() =>
    useStickyCellStyles({ stickyColumns: result.current, columnId: 1, getClassName })
  );
  cellStylesResult.current.ref(elements.cells[0]);

  // Wait for effect
  rerender({});
  rerenderCellStyles({});

  expect(elements.cells[0]).toHaveClass('sticky-cell');

  getClassName.mockImplementation(() => ({ 'sticky-cell': false, 'sticky-cell-updated': true }));

  // Trigger update w/o actual change
  elements.wrapper.dispatchEvent(new UIEvent('scroll'));

  expect(elements.cells[0]).toHaveClass('sticky-cell');
  expect(elements.cells[0]).not.toHaveClass('sticky-cell-updated');

  // Trigger update
  elements.wrapper.scrollLeft = 10;
  elements.wrapper.dispatchEvent(new UIEvent('scroll'));

  expect(elements.cells[0]).not.toHaveClass('sticky-cell');
  expect(elements.cells[0]).toHaveClass('sticky-cell-updated');
});

test('performs styles cleanup', () => {
  const visibleColumns = [1, 2, 3];
  const { result, rerender } = renderHook(useStickyColumns, {
    initialProps: { visibleColumns, stickyColumnsFirst: 1, stickyColumnsLast: 0 },
  });
  const elements = createMockTable(result.current, 300, 500, 100, 200, 300);

  const getClassName = jest.fn().mockImplementation(state => ({ 'sticky-cell': !!state }));
  const { result: cellStylesResult } = renderHook(() =>
    useStickyCellStyles({ stickyColumns: result.current, columnId: 1, getClassName })
  );
  cellStylesResult.current.ref(elements.cells[0]);

  // Trigger update
  elements.wrapper.dispatchEvent(new UIEvent('scroll'));

  expect(elements.cells[0]).toHaveClass('sticky-cell');

  rerender({ visibleColumns, stickyColumnsFirst: 0, stickyColumnsLast: 0 });

  expect(elements.cells[0]).not.toHaveClass('sticky-cell');
});

test('cell subscriptions are cleaned up on ref change', () => {
  const unsubscribe = jest.fn();
  const subscribe = jest.fn(() => unsubscribe);
  const stickyColumns = {
    store: {
      get: () => ({ cellState: new Map(), wrapperState: { scrollPaddingInlineStart: 0, scrollPaddingInlineEnd: 0 } }),
      subscribe,
      unsubscribe: () => {},
    },
    style: { wrapper: {} },
    refs: { table: () => {}, wrapper: () => {}, cell: () => {} },
  };
  const { result } = renderHook(() => useStickyCellStyles({ stickyColumns, columnId: 1, getClassName: () => ({}) }));

  result.current.ref(document.createElement('td'));

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(unsubscribe).toHaveBeenCalledTimes(0);

  result.current.ref(document.createElement('td'));

  expect(subscribe).toHaveBeenCalledTimes(2);
  expect(unsubscribe).toHaveBeenCalledTimes(1);

  result.current.ref(null);

  expect(subscribe).toHaveBeenCalledTimes(2);
  expect(unsubscribe).toHaveBeenCalledTimes(2);
});

describe('getStickyClassNames helper', () => {
  const styles = {
    'sticky-cell': 'sticky-cell',
    'sticky-cell-pad-inline-start': 'sticky-cell-pad-inline-start',
    'sticky-cell-last-inline-start': 'sticky-cell-last-inline-start',
    'sticky-cell-last-inline-end': 'sticky-cell-last-inline-end',
  };

  it('returns correct styles when props is null', () => {
    const result = getStickyClassNames(styles, null);
    expect(result).toEqual({
      'sticky-cell': false,
      'sticky-cell-pad-inline-start': false,
      'sticky-cell-last-inline-start': false,
      'sticky-cell-last-inline-end': false,
    });
  });

  it('returns correct styles when props has padInlineStart and lastInsetInlineStart property', () => {
    const props = {
      padInlineStart: true,
      lastInsetInlineStart: true,
      lastInsetInlineEnd: false,
      offset: {},
    };
    const result = getStickyClassNames(styles, props);
    expect(result).toEqual({
      'sticky-cell': true,
      'sticky-cell-pad-inline-start': true,
      'sticky-cell-last-inline-start': true,
      'sticky-cell-last-inline-end': false,
    });
  });

  it('returns correct styles when props has lastInsetInlineEnd property', () => {
    const props = {
      padInlineStart: false,
      lastInsetInlineStart: false,
      lastInsetInlineEnd: true,
      offset: {},
    };
    const result = getStickyClassNames(styles, props);
    expect(result).toEqual({
      'sticky-cell': true,
      'sticky-cell-pad-inline-start': false,
      'sticky-cell-last-inline-start': false,
      'sticky-cell-last-inline-end': true,
    });
  });
});

test('updateCellOffsets element widths fallback to 0 when elements are missing', () => {
  const { offsets } = updateCellOffsets(new Map(), {
    stickyColumnsFirst: 1,
    stickyColumnsLast: 1,
    visibleColumns: ['a', 'b', 'c'],
  });
  expect(offsets.get('a')).toEqual({ first: 0, last: 0 });
  expect(offsets.get('c')).toEqual({ first: 0, last: 0 });
});
