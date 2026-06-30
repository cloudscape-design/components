// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../../lib/components/table/interfaces';
import {
  appendSort,
  getSortIndex,
  removeSort,
  replaceSort,
  setDirection,
  toggleDirection,
} from '../../../lib/components/table/multi-column-sort/utils';

interface Item {
  a: number;
  b: number;
}

const colA: TableProps.ColumnDefinition<Item> = { id: 'a', header: 'A', cell: i => i.a, sortingField: 'a' };
const colB: TableProps.ColumnDefinition<Item> = { id: 'b', header: 'B', cell: i => i.b, sortingField: 'b' };
const comparator = (x: Item, y: Item) => x.a - y.a;
const colComparator: TableProps.ColumnDefinition<Item> = {
  id: 'c',
  header: 'C',
  cell: i => i.a,
  sortingComparator: comparator,
};

type Sort = ReadonlyArray<TableProps.SortingState<Item>>;

describe('getSortIndex', () => {
  test('returns null when the column is not in the sort', () => {
    expect(getSortIndex([], colA)).toBeNull();
    expect(getSortIndex([{ sortingColumn: colB, isDescending: false }], colA)).toBeNull();
  });

  test('returns the 1-based priority index', () => {
    const sort: Sort = [
      { sortingColumn: colB, isDescending: false },
      { sortingColumn: colA, isDescending: true },
    ];
    expect(getSortIndex(sort, colB)).toBe(1);
    expect(getSortIndex(sort, colA)).toBe(2);
  });

  test('matches by sortingField even with a different column-definition object', () => {
    const sort: Sort = [{ sortingColumn: { sortingField: 'a' }, isDescending: false }];
    expect(getSortIndex(sort, colA)).toBe(1);
  });

  test('matches by sortingComparator reference', () => {
    const sort: Sort = [{ sortingColumn: { sortingComparator: comparator }, isDescending: false }];
    expect(getSortIndex(sort, colComparator)).toBe(1);
  });

  test('matches by object identity', () => {
    const sort: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(getSortIndex(sort, colA)).toBe(1);
  });
});

describe('replaceSort', () => {
  test('returns a single-element array with the given column and direction', () => {
    expect(replaceSort(colA, true)).toEqual([{ sortingColumn: colA, isDescending: true }]);
    expect(replaceSort(colB, false)).toEqual([{ sortingColumn: colB, isDescending: false }]);
  });
});

describe('appendSort', () => {
  test('appends at the end, preserving existing entries and order', () => {
    const current: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(appendSort(current, colB, true)).toEqual([
      { sortingColumn: colA, isDescending: false },
      { sortingColumn: colB, isDescending: true },
    ]);
  });

  test('does not mutate the input array', () => {
    const current: Sort = [{ sortingColumn: colA, isDescending: false }];
    appendSort(current, colB, false);
    expect(current).toHaveLength(1);
  });
});

describe('toggleDirection', () => {
  test('flips only the matching column, keeping position and other entries', () => {
    const current: Sort = [
      { sortingColumn: colA, isDescending: false },
      { sortingColumn: colB, isDescending: true },
    ];
    expect(toggleDirection(current, colA)).toEqual([
      { sortingColumn: colA, isDescending: true },
      { sortingColumn: colB, isDescending: true },
    ]);
  });

  test('is a no-op when the column is not present', () => {
    const current: Sort = [{ sortingColumn: colB, isDescending: false }];
    expect(toggleDirection(current, colA)).toEqual(current);
  });
});

describe('setDirection', () => {
  test('sets the matching column to the explicit direction', () => {
    const current: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(setDirection(current, colA, true)).toEqual([{ sortingColumn: colA, isDescending: true }]);
  });

  test('is idempotent when already at the target direction', () => {
    const current: Sort = [{ sortingColumn: colA, isDescending: true }];
    expect(setDirection(current, colA, true)).toEqual(current);
  });
});

describe('removeSort', () => {
  test('removes the matching column and keeps the rest in order', () => {
    const current: Sort = [
      { sortingColumn: colA, isDescending: false },
      { sortingColumn: colB, isDescending: true },
    ];
    expect(removeSort(current, colA)).toEqual([{ sortingColumn: colB, isDescending: true }]);
  });

  test('is a no-op when the column is not present', () => {
    const current: Sort = [{ sortingColumn: colB, isDescending: false }];
    expect(removeSort(current, colA)).toEqual(current);
  });

  test('removes by sortingField match', () => {
    const current: Sort = [{ sortingColumn: { sortingField: 'a' }, isDescending: false }];
    expect(removeSort(current, colA)).toEqual([]);
  });
});
