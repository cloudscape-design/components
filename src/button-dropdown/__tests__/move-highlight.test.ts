// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { TreeIndex } from '../utils/create-items-tree';
import moveHighlight from '../utils/move-highlight';
import { isItemGroup } from '../utils/utils';

const items: { index: number[]; item: ButtonDropdownProps.ItemOrGroup; parent?: ButtonDropdownProps.ItemOrGroup }[] = [
  { index: [0], item: { id: '00', text: 'item-00' } },
  { index: [1], item: { id: '01', text: 'item-01' } },
  { index: [2], item: { id: '02', text: 'item-02', disabled: true } },
  { index: [3], item: { id: '03', text: 'group-03', items: [] } },
  {
    index: [3, 0],
    item: { id: '30', text: 'item-30', disabled: true },
    parent: { id: '03', text: 'group-03', items: [] },
  },
  { index: [4], item: { id: '04', text: 'group-04', items: [], disabled: true } },
  {
    index: [4, 0],
    item: { id: '40', text: 'item-40' },
    parent: { id: '04', text: 'group-04', items: [], disabled: true },
  },
  { index: [5], item: { id: '05', text: 'item-05' } },
];

function getNext(index: number[]) {
  const joined = index.join('-');
  const seqIndex = items.findIndex(it => it.index.join('-') === joined);

  return items[seqIndex + 1];
}

function itemAt(index: TreeIndex): ButtonDropdownProps.ItemOrGroup | undefined {
  const joined = index.join('-');
  return items.find(it => it.index.join('-') === joined)?.item;
}

// Reproduces the former global `hasExpandableGroups` flag on top of the per-node engine:
// when expandable, every group is expandable; when not, none are. This lets the existing
// cases keep asserting the uniform behavior while exercising the new isExpandable/planeOf API.
function runMove(params: {
  startIndex: TreeIndex;
  expandedIndex: TreeIndex;
  hasExpandableGroups: boolean;
  isInRestrictedView: boolean;
}) {
  const isExpandable = (item: ButtonDropdownProps.ItemOrGroup) => params.hasExpandableGroups && isItemGroup(item);
  const planeOf = (index: TreeIndex): TreeIndex => {
    if (index.length <= 1) {
      return [];
    }
    const parentIndex = index.slice(0, -1);
    const parent = itemAt(parentIndex);
    return parent && isItemGroup(parent) && isExpandable(parent) ? parentIndex : [];
  };

  return moveHighlight({
    startIndex: params.startIndex,
    expandedIndex: params.expandedIndex,
    getNext,
    isExpandable,
    planeOf,
    isInRestrictedView: params.isInRestrictedView,
  });
}

describe('move-highlight util', () => {
  test('moves to the next item', () => {
    expect(
      runMove({ startIndex: [0], expandedIndex: [], hasExpandableGroups: false, isInRestrictedView: false })
    ).toEqual([1]);
  });

  test('returns null when cannot move further', () => {
    expect(runMove({ startIndex: [5], expandedIndex: [], hasExpandableGroups: false, isInRestrictedView: false })).toBe(
      null
    );
  });

  test('includes disabled items', () => {
    expect(
      runMove({ startIndex: [1], expandedIndex: [], hasExpandableGroups: true, isInRestrictedView: false })
    ).toEqual([2]);
  });

  test('includes disabled nested group items', () => {
    expect(
      runMove({ startIndex: [3], expandedIndex: [], hasExpandableGroups: false, isInRestrictedView: false })
    ).toEqual([3, 0]);
  });

  test('skip disabled group when expandable group', () => {
    expect(
      runMove({ startIndex: [4], expandedIndex: [], hasExpandableGroups: true, isInRestrictedView: false })
    ).toEqual([5]);
  });

  test('skip disabled group when expandable group and restricted view', () => {
    expect(
      runMove({ startIndex: [4], expandedIndex: [], hasExpandableGroups: true, isInRestrictedView: true })
    ).toEqual([5]);
  });

  test('navigates disabled nested group', () => {
    expect(
      runMove({ startIndex: [4], expandedIndex: [], hasExpandableGroups: false, isInRestrictedView: false })
    ).toEqual([4, 0]);
  });

  test('skips expandable group in restricted', () => {
    expect(
      runMove({ startIndex: [3], expandedIndex: [], hasExpandableGroups: true, isInRestrictedView: true })
    ).toEqual([4]);
  });

  test('cannot exit group when not restricted', () => {
    expect(
      runMove({ startIndex: [3, 0], expandedIndex: [3], hasExpandableGroups: true, isInRestrictedView: false })
    ).toEqual(null);
  });

  test('can exit group when restricted', () => {
    expect(
      runMove({ startIndex: [3, 0], expandedIndex: [3], hasExpandableGroups: true, isInRestrictedView: true })
    ).toEqual([4]);
  });
});

describe('move-highlight util - mixed expandable and flat groups', () => {
  // A dropdown where group-03 is expandable but group-04 opts out (flat).
  const mixedItems: {
    index: number[];
    item: ButtonDropdownProps.ItemOrGroup;
    parent?: ButtonDropdownProps.ItemOrGroup;
  }[] = [
    { index: [0], item: { id: '00', text: 'item-00' } },
    { index: [1], item: { id: '03', text: 'group-03', items: [] } },
    { index: [1, 0], item: { id: '30', text: 'item-30' }, parent: { id: '03', text: 'group-03', items: [] } },
    {
      index: [2],
      item: { id: '04', text: 'group-04', expandable: false, items: [] },
    },
    {
      index: [2, 0],
      item: { id: '40', text: 'item-40' },
      parent: { id: '04', text: 'group-04', expandable: false, items: [] },
    },
    { index: [3], item: { id: '05', text: 'item-05' } },
  ];

  const getNextMixed = (index: number[]) => {
    const joined = index.join('-');
    const seqIndex = mixedItems.findIndex(it => it.index.join('-') === joined);
    return mixedItems[seqIndex + 1];
  };

  const itemAtMixed = (index: TreeIndex) => mixedItems.find(it => it.index.join('-') === index.join('-'))?.item;

  const isExpandable = (item: ButtonDropdownProps.ItemOrGroup) => isItemGroup(item) && item.expandable !== false;

  const planeOf = (index: TreeIndex): TreeIndex => {
    if (index.length <= 1) {
      return [];
    }
    const parentIndex = index.slice(0, -1);
    const parent = itemAtMixed(parentIndex);
    return parent && isItemGroup(parent) && isExpandable(parent) ? parentIndex : [];
  };

  const run = (startIndex: TreeIndex, expandedIndex: TreeIndex = [], isInRestrictedView = false) =>
    moveHighlight({ startIndex, expandedIndex, getNext: getNextMixed, isExpandable, planeOf, isInRestrictedView });

  test('highlights an expandable group header', () => {
    // From the top item, the next highlight is the expandable group-03 header.
    expect(run([0])).toEqual([1]);
  });

  test("skips a collapsed expandable group's children on the top plane", () => {
    // group-03 is collapsed: its child [1,0] is in group-03's plane and is skipped;
    // the flat group-04 header is skipped too, landing on its hoisted child [2,0].
    expect(run([1])).toEqual([2, 0]);
  });

  test("navigates the flat group's hoisted children inline", () => {
    // Flat group-04's children share the top plane, so [2,0] flows to the next top item.
    expect(run([2, 0])).toEqual([3]);
  });

  test("confines navigation to an expanded group's plane", () => {
    // With group-03 expanded, from its child [1,0] there is no same-plane successor.
    expect(run([1, 0], [1])).toEqual(null);
  });

  describe('restricted (mobile) view', () => {
    test("reaches a flat group's hoisted children (top plane)", () => {
      // Mobile: from the collapsed expandable header the expandable child is gated, but the
      // flat group's children live on the top plane and must remain keyboard-reachable.
      expect(run([1], [], true)).toEqual([2, 0]);
    });

    test('continues from a flat child to the next top-level item', () => {
      expect(run([2, 0], [], true)).toEqual([3]);
    });

    test("still gates a collapsed expandable group's children", () => {
      // group-03 collapsed: its own child [1,0] must NOT be the next landing spot.
      expect(run([1], [], true)).not.toEqual([1, 0]);
    });

    test("enters an expanded group's children", () => {
      expect(run([1], [1], true)).toEqual([1, 0]);
    });
  });
});
