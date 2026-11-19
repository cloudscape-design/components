// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../../lib/components/table/interfaces';
import {
  appendSort,
  buildSortLiveAnnouncement,
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

describe('buildSortLiveAnnouncement', () => {
  const renderSortColumn = ({ columnLabel, isDescending }: { columnLabel: string; isDescending: boolean }) =>
    `${columnLabel} ${isDescending ? 'desc' : 'asc'}`;
  const renderSortOrder = ({ columns }: { columns: string }) => `sorted by ${columns}`;
  const columnDefinitions = [colA, colB, colComparator];
  const base = { columnDefinitions, renderSortColumn, renderSortOrder, sortCleared: 'cleared' };

  test('returns the cleared string when there is no active sort', () => {
    expect(buildSortLiveAnnouncement({ ...base, sortingColumns: [] })).toBe('cleared');
  });

  test('returns an empty string when there is no sort and no cleared string', () => {
    expect(buildSortLiveAnnouncement({ ...base, sortCleared: undefined, sortingColumns: [] })).toBe('');
  });

  test('returns an empty string when the render functions are missing', () => {
    const sortingColumns: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(buildSortLiveAnnouncement({ columnDefinitions, sortingColumns, renderSortOrder })).toBe('');
    expect(buildSortLiveAnnouncement({ columnDefinitions, sortingColumns, renderSortColumn })).toBe('');
  });

  test('does not throw when sortingColumns is omitted', () => {
    expect(buildSortLiveAnnouncement({ ...base } as Parameters<typeof buildSortLiveAnnouncement>[0])).toBe('cleared');
  });

  test('joins per-column fragments (default comma join) and wraps them', () => {
    const sortingColumns: Sort = [
      { sortingColumn: colA, isDescending: false },
      { sortingColumn: colB, isDescending: true },
    ];
    expect(buildSortLiveAnnouncement({ ...base, sortingColumns })).toBe('sorted by A asc, B desc');
  });

  test('uses the provided list formatter instead of the default comma join', () => {
    const sortingColumns: Sort = [
      { sortingColumn: colA, isDescending: false },
      { sortingColumn: colB, isDescending: true },
    ];
    const formatList = (parts: readonly string[]) => parts.join(' | ');
    expect(buildSortLiveAnnouncement({ ...base, sortingColumns, formatList })).toBe('sorted by A asc | B desc');
  });

  test('prefers resolveColumnLabel over the column-definition label', () => {
    const sortingColumns: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(buildSortLiveAnnouncement({ ...base, sortingColumns, resolveColumnLabel: () => 'Resolved' })).toBe(
      'sorted by Resolved asc'
    );
  });

  test('falls back to the column-definition label when resolveColumnLabel returns undefined', () => {
    const sortingColumns: Sort = [{ sortingColumn: colA, isDescending: false }];
    expect(buildSortLiveAnnouncement({ ...base, sortingColumns, resolveColumnLabel: () => undefined })).toBe(
      'sorted by A asc'
    );
  });

  test('falls back to sortingField when the header is not a string', () => {
    const nodeHeaderColumn: TableProps.ColumnDefinition<Item> = {
      id: 'a',
      header: 5 as unknown as TableProps.ColumnDefinition<Item>['header'],
      cell: i => i.a,
      sortingField: 'a',
    };
    const sortingColumns: Sort = [{ sortingColumn: nodeHeaderColumn, isDescending: true }];
    expect(buildSortLiveAnnouncement({ ...base, columnDefinitions: [nodeHeaderColumn], sortingColumns })).toBe(
      'sorted by a desc'
    );
  });

  test('falls back to the column id for comparator columns with a non-string header', () => {
    const nodeHeaderComparator: TableProps.ColumnDefinition<Item> = {
      id: 'c',
      header: 5 as unknown as TableProps.ColumnDefinition<Item>['header'],
      cell: i => i.a,
      sortingComparator: comparator,
    };
    const sortingColumns: Sort = [{ sortingColumn: nodeHeaderComparator, isDescending: false }];
    expect(buildSortLiveAnnouncement({ ...base, columnDefinitions: [nodeHeaderComparator], sortingColumns })).toBe(
      'sorted by c asc'
    );
  });
});
