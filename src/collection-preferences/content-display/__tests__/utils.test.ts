// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { collectVisibleIds } from '../../../../lib/components/collection-preferences/utils';
import {
  buildOptionTree,
  getFilteredOptions,
  getFilteredTree,
  getSortedOptions,
  OptionGroupNode,
  toContentDisplayItems,
  walkLeaves,
} from '../utils';

describe('getSortedOptions', () => {
  it('returns the passed-in options with the desired order and visibility', () => {
    const options = [
      {
        id: 'a',
        label: 'a',
      },
      { id: 'b', label: 'b' },
    ];
    const contentDisplay = [
      { id: 'b', visible: false },
      { id: 'a', visible: true },
    ];
    const result = getSortedOptions({ options, contentDisplay });
    expect(result).toEqual([
      { id: 'b', label: 'b', visible: false },
      {
        id: 'a',
        label: 'a',
        visible: true,
      },
    ]);
  });

  it('keeps the value of the alwaysVisible property', () => {
    const options = [
      {
        id: 'a',
        label: 'a',
        alwaysVisible: true,
      },
      { id: 'b', label: 'b' },
    ];
    const contentDisplay = [
      { id: 'b', visible: false },
      { id: 'a', visible: true },
    ];
    const result = getSortedOptions({ options, contentDisplay });
    expect(result).toEqual([
      { id: 'b', label: 'b', visible: false },
      {
        id: 'a',
        label: 'a',
        alwaysVisible: true,
        visible: true,
      },
    ]);
  });

  it('adds options not in the state at the end of the list', () => {
    const options = [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b' },
      { id: 'c', label: 'c' },
      { id: 'd', label: 'd' },
    ];
    const contentDisplay = [
      { id: 'c', visible: false },
      { id: 'b', visible: true },
    ];
    const result = getSortedOptions({ options, contentDisplay });
    expect(result).toEqual([
      { id: 'c', label: 'c', visible: false },
      { id: 'b', label: 'b', visible: true },
      { id: 'a', label: 'a', visible: false },
      { id: 'd', label: 'd', visible: false },
    ]);
  });
});

describe('walkLeaves', () => {
  it('extracts leaves from flat list', () => {
    const items = [
      { id: 'a', visible: true },
      { id: 'b', visible: false },
    ];
    expect(walkLeaves(items)).toEqual([
      { id: 'a', visible: true },
      { id: 'b', visible: false },
    ]);
  });

  it('extracts leaves from nested groups', () => {
    const items = [
      { id: 'a', visible: true },
      {
        type: 'group' as const,
        id: 'g1',
        visible: true,
        children: [
          { id: 'b', visible: true },
          { id: 'c', visible: false },
        ],
      },
    ];
    expect(walkLeaves(items)).toEqual([
      { id: 'a', visible: true },
      { id: 'b', visible: true },
      { id: 'c', visible: false },
    ]);
  });
});

describe('buildOptionTree', () => {
  it('returns flat leaf nodes when no groups provided', () => {
    const options = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    const contentDisplay = [
      { id: 'a', visible: true },
      { id: 'b', visible: false },
    ];
    const tree = buildOptionTree(options, [], contentDisplay);
    expect(tree).toHaveLength(2);
    expect(tree[0]).toMatchObject({ type: 'leaf' as const, id: 'a', label: 'A', visible: true });
    expect(tree[1]).toMatchObject({ type: 'leaf' as const, id: 'b', label: 'B', visible: false });
  });

  it('builds grouped tree from contentDisplay', () => {
    const options = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ];
    const groups = [{ id: 'g1', label: 'Group 1' }];
    const contentDisplay = [
      { id: 'a', visible: true },
      {
        type: 'group' as const,
        id: 'g1',
        visible: true,
        children: [
          { id: 'b', visible: true },
          { id: 'c', visible: false },
        ],
      },
    ];
    const tree = buildOptionTree(options, groups, contentDisplay);
    expect(tree).toHaveLength(2);
    expect(tree[0]).toMatchObject({ type: 'leaf' as const, id: 'a', label: 'A' });
    expect(tree[1]).toMatchObject({ type: 'group' as const, id: 'g1', label: 'Group 1', visible: true });
    expect((tree[1] as OptionGroupNode).children).toHaveLength(2);
    expect((tree[1] as OptionGroupNode).children[0]).toMatchObject({ type: 'leaf' as const, id: 'b', visible: true });
    expect((tree[1] as OptionGroupNode).children[1]).toMatchObject({ type: 'leaf' as const, id: 'c', visible: false });
  });

  it('uses group id as label when group definition not found', () => {
    const options = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    const groups = [{ id: 'existing', label: 'Existing' }];
    const contentDisplay = [
      { id: 'a', visible: true },
      { type: 'group' as const, id: 'nonexistent', visible: true, children: [{ id: 'b', visible: true }] },
    ];
    const tree = buildOptionTree(options, groups, contentDisplay);
    expect(tree).toHaveLength(2);
    expect(tree[1]).toMatchObject({ type: 'group' as const, id: 'nonexistent', label: 'nonexistent' });
  });
});

describe('toContentDisplayItems', () => {
  it('converts leaf nodes back to ContentDisplayItem', () => {
    const tree = [
      { type: 'leaf' as const, id: 'a', label: 'A', visible: true },
      { type: 'leaf' as const, id: 'b', label: 'B', visible: false },
    ];
    const result = toContentDisplayItems(tree);
    expect(result).toEqual([
      { id: 'a', visible: true },
      { id: 'b', visible: false },
    ]);
  });

  it('converts group nodes back to ContentDisplayGroup', () => {
    const tree = [
      { type: 'leaf' as const, id: 'a', label: 'A', visible: true },
      {
        type: 'group' as const,
        id: 'g1',
        label: 'G1',
        visible: true,
        children: [
          { type: 'leaf' as const, id: 'b', label: 'B', visible: true },
          { type: 'leaf' as const, id: 'c', label: 'C', visible: false },
        ],
      },
    ];
    const result = toContentDisplayItems(tree);
    expect(result).toEqual([
      { id: 'a', visible: true },
      {
        type: 'group' as const,
        id: 'g1',
        visible: true,
        children: [
          { id: 'b', visible: true },
          { id: 'c', visible: false },
        ],
      },
    ]);
  });
});

describe('getFilteredTree', () => {
  it('returns full tree when filter is empty', () => {
    const tree = [
      { type: 'leaf' as const, id: 'a', label: 'Alpha', visible: true },
      {
        type: 'group' as const,
        id: 'g',
        label: 'Group',
        visible: true,
        children: [{ type: 'leaf' as const, id: 'b', label: 'Beta', visible: true }],
      },
    ];
    expect(getFilteredTree(tree, '')).toEqual(tree);
    expect(getFilteredTree(tree, '  ')).toEqual(tree);
  });

  it('filters leaf nodes by label', () => {
    const tree = [
      { type: 'leaf' as const, id: 'a', label: 'Alpha', visible: true },
      { type: 'leaf' as const, id: 'b', label: 'Beta', visible: true },
    ];
    const result = getFilteredTree(tree, 'alp');
    expect(result).toEqual([{ type: 'leaf', id: 'a', label: 'Alpha', visible: true }]);
  });

  it('keeps groups with matching descendants', () => {
    const tree = [
      {
        type: 'group' as const,
        id: 'g',
        label: 'Group',
        visible: true,
        children: [
          { type: 'leaf' as const, id: 'a', label: 'Alpha', visible: true },
          { type: 'leaf' as const, id: 'b', label: 'Beta', visible: true },
        ],
      },
    ];
    const result = getFilteredTree(tree, 'alpha');
    expect(result).toEqual([
      {
        type: 'group',
        id: 'g',
        label: 'Group',
        visible: true,
        children: [{ type: 'leaf', id: 'a', label: 'Alpha', visible: true }],
      },
    ]);
  });

  it('removes groups with no matching descendants', () => {
    const tree = [
      {
        type: 'group' as const,
        id: 'g',
        label: 'Group',
        visible: true,
        children: [{ type: 'leaf' as const, id: 'a', label: 'Alpha', visible: true }],
      },
    ];
    const result = getFilteredTree(tree, 'xyz');
    expect(result).toHaveLength(0);
  });
});

describe('getFilteredOptions', () => {
  it('returns all options when filter is empty', () => {
    const options = [
      { id: 'a', label: 'Alpha', visible: true },
      { id: 'b', label: 'Beta', visible: true },
    ];
    expect(getFilteredOptions(options, '')).toEqual(options);
  });

  it('filters by label', () => {
    const options = [
      { id: 'a', label: 'Alpha', visible: true },
      { id: 'b', label: 'Beta', visible: true },
    ];
    const result = getFilteredOptions(options, 'bet');
    expect(result).toEqual([{ id: 'b', label: 'Beta', visible: true }]);
  });
});

describe('collectVisibleIds', () => {
  it('collects visible leaf ids from grouped content display', () => {
    const items = [
      { id: 'id1', visible: true },
      {
        type: 'group' as const,
        id: 'g1',
        visible: true,
        children: [
          { id: 'id2', visible: true },
          { id: 'id3', visible: false },
        ],
      },
      { type: 'group' as const, id: 'g2', visible: true, children: [{ id: 'id4', visible: true }] },
    ];
    expect(collectVisibleIds(items, true)).toEqual(['id1', 'id2', 'id4']);
  });

  it('excludes children of non-visible groups', () => {
    const items = [
      {
        type: 'group' as const,
        id: 'g1',
        visible: false,
        children: [{ id: 'id1', visible: true }],
      },
    ];
    expect(collectVisibleIds(items, true)).toEqual([]);
  });
});
