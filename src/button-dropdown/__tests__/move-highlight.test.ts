// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import moveHighlight from '../utils/move-highlight';

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

describe('move-highlight util', () => {
  test('moves to the next item', () => {
    expect(
      moveHighlight({
        startIndex: [0],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: false,
        isInRestrictedView: false,
      })
    ).toEqual([1]);
  });

  test('returns null when cannot move further', () => {
    expect(
      moveHighlight({
        startIndex: [5],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: false,
        isInRestrictedView: false,
      })
    ).toBe(null);
  });

  test('includes disabled items', () => {
    expect(
      moveHighlight({
        startIndex: [1],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: false,
      })
    ).toEqual([2]);
  });

  test('includes disabled nested group items', () => {
    expect(
      moveHighlight({
        startIndex: [3],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: false,
        isInRestrictedView: false,
      })
    ).toEqual([3, 0]);
  });

  test('skip disabled group when expandable group', () => {
    expect(
      moveHighlight({
        startIndex: [4],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: false,
      })
    ).toEqual([5]);
  });

  test('skip disabled group when expandable group and restricted view', () => {
    expect(
      moveHighlight({
        startIndex: [4],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: true,
      })
    ).toEqual([5]);
  });

  test('navigates disabled nested group', () => {
    expect(
      moveHighlight({
        startIndex: [4],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: false,
        isInRestrictedView: false,
      })
    ).toEqual([4, 0]);
  });

  test('skips expandable group in restricted', () => {
    expect(
      moveHighlight({
        startIndex: [3],
        expandedIndex: [],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: true,
      })
    ).toEqual([4]);
  });

  test('cannot exit group when not restricted', () => {
    expect(
      moveHighlight({
        startIndex: [3, 0],
        expandedIndex: [3],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: false,
      })
    ).toEqual(null);
  });

  test('can exit group when restricted', () => {
    expect(
      moveHighlight({
        startIndex: [3, 0],
        expandedIndex: [3],
        getNext,
        hasExpandableGroups: true,
        isInRestrictedView: true,
      })
    ).toEqual([4]);
  });
});
