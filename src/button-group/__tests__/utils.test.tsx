// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonGroupProps } from '../../../lib/components/button-group/interfaces';
import {
  findItemById,
  getFirstLoadingItem,
  isItemGroup,
  splitItems,
  toDropdownItems,
} from '../../../lib/components/button-group/utils';

describe('isItemGroup', () => {
  test('should return true if item is a group', () => {
    const itemGroup: ButtonGroupProps.ItemOrGroup = {
      id: '1',
      text: 'Item Group 1',
      items: [
        { id: '1', text: 'Item 1' },
        { id: '2', text: 'Item 2' },
      ],
    };

    expect(isItemGroup(itemGroup)).toBe(true);
  });

  test('should return false if item is not a group', () => {
    const item: ButtonGroupProps.ItemOrGroup = {
      id: '1',
      text: 'Item 1',
    };

    expect(isItemGroup(item)).toBe(false);
  });

  test('should split items into primary and secondary based on the limit', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
      { id: '4', text: 'Item 4' },
      { id: '5', text: 'Item 5' },
      { id: '6', text: 'Item 6' },
    ];

    const result = splitItems(items, 5);
    expect(result.primary.length).toBe(5);
    expect(result.secondary.length).toBe(1);
  });

  test('should place all items in secondary if limit is 0', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
      { id: '4', text: 'Item 4' },
      { id: '5', text: 'Item 5' },
      { id: '6', text: 'Item 6' },
    ];

    const result = splitItems(items, 0);
    expect(result.primary.length).toBe(0);
    expect(result.secondary.length).toBe(6);
  });

  test('should find item by id in a flat structure', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
    ];

    expect(findItemById(items, '1')).toEqual({ id: '1', text: 'Item 1' });
  });

  test('should return null if item is not found', () => {
    expect(findItemById([], '5')).toBe(null);
  });

  test('should find item by id in a nested structure', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
      {
        id: '4',
        text: 'Group',
        items: [
          { id: '5', text: 'Item 5' },
          { id: '6', text: 'Item 6' },
        ],
      },
    ];

    expect(findItemById(items, '5')).toEqual({ id: '5', text: 'Item 5' });
  });

  test('should convert items to dropdown items', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
    ];

    const result = toDropdownItems(items);
    expect(result).toEqual([
      {
        id: '1',
        text: 'Item 1',
      },
      {
        id: '2',
        text: 'Item 2',
      },
    ]);
  });

  test('should return the first loading item', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2', loading: true },
      { id: '3', text: 'Item 3', loading: true },
    ];

    expect(getFirstLoadingItem(items)).toEqual({ id: '2', text: 'Item 2', loading: true });
  });

  test('should return null if no item is loading', () => {
    const items: ButtonGroupProps.ItemOrGroup[] = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
    ];

    expect(getFirstLoadingItem(items)).toBe(null);
  });
});
