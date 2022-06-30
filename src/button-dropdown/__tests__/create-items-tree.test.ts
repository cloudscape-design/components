// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import createItemsTree from '../utils/create-items-tree';

const itemGroup1: ButtonDropdownProps.ItemGroup = {
  text: 'category1',
  items: [
    { id: 'i2', text: 'cat 1 item1' },
    { id: 'i3', text: 'cat 1 item2' },
  ],
};
const itemGroup2: ButtonDropdownProps.ItemGroup = {
  text: 'category2',
  items: [
    { id: 'i5', text: 'cat 2 item1' },
    { id: 'i6', text: 'cat 2 item2' },
  ],
};
const items: ButtonDropdownProps.Items = [
  { id: 'i0', text: 'item', disabled: true },
  { id: 'i1', text: 'item1' },
  itemGroup1,
  { id: 'i4', text: 'item4' },
  itemGroup2,
];

describe('create-items-tree util', () => {
  test('returns item by index', () => {
    const tree = createItemsTree(items);

    expect(tree.getItem([2, 1])).toBe(itemGroup1.items[1]);
  });

  test('returns item index', () => {
    const tree = createItemsTree(items);

    expect(tree.getItemIndex(itemGroup2.items[0])).toEqual([4, 0]);
  });

  test('returns item parent index', () => {
    const tree = createItemsTree(items);
    expect(tree.getParentIndex(itemGroup1.items[0])).toEqual([2]);
  });

  test('throws if item is not present', () => {
    const tree = createItemsTree(items);

    expect(() => tree.getItemIndex({ id: 'i4', text: 'item4' })).toThrowError();
    expect(() => tree.getParentIndex({ id: 'i4', text: 'item4' })).toThrowError();
  });

  test('increments index', () => {
    const tree = createItemsTree(items);

    expect(tree.getSequentialIndex([2, 1], 1)).toEqual([3]);
    expect(tree.getSequentialIndex([4, 1], 1)).toEqual(null);
  });

  test('decrements index', () => {
    const tree = createItemsTree(items);

    expect(tree.getSequentialIndex([2, 0], -1)).toEqual([2]);
    expect(tree.getSequentialIndex([0, 0], -1)).toEqual(null);
  });
});
