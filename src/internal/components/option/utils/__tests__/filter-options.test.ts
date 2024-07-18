// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { filterOptions, matchesString } from '../filter-options';

describe('matchesString', () => {
  test('should return false when value is undefined', () => {
    expect(matchesString(undefined, 'x', false)).toBe(false);
  });

  test('should return false when value is empty', () => {
    expect(matchesString('', '', false)).toBe(false);
  });

  test('should return false when the input string does not include a text', () => {
    expect(matchesString('abc', 'x', false)).toBe(false);
  });

  test('should return true when the input string includes a text', () => {
    expect(matchesString('abxc', 'x', false)).toBe(true);
  });

  test('should do case-insensitive matches', () => {
    expect(matchesString('ABC', 'a', false)).toBe(true);
  });

  test('should do strict matches, from the string start only', () => {
    expect(matchesString('abc', 'ab', true)).toBe(true);
    expect(matchesString('abc', 'bc', true)).toBe(false);
  });
});

describe('filterOptions - non-strict matching', () => {
  const options = [
    {
      option: {
        label: 'Group 1',
      },
      type: 'parent',
    },
    {
      option: {
        label: 'Child 1',
        description: 'ax',
      },
      type: 'child',
    },
    {
      option: {
        label: 'Option 1',
        labelTag: 'bx',
      },
    },
    {
      option: {
        label: 'Option 2',
        tags: ['x'],
      },
    },
  ];

  test('should return all items when an empty search text provided', () => {
    expect(filterOptions(options, '')).toEqual(options);
  });

  test('should return empty array when no matches', () => {
    expect(filterOptions(options, '0')).toEqual([]);
  });

  test('should return an item with its group when there is a match', () => {
    expect(filterOptions(options, 'a')).toEqual([options[0], options[1]]);
  });

  test('should return all items with matches', () => {
    expect(filterOptions(options, 'x')).toEqual([options[0], options[1], options[2], options[3]]);
  });

  test('should match values in filteringTags', () => {
    const options = [{ option: { label: 'Example', filteringTags: ['o'] } }, { option: { label: 'Example 2' } }];
    expect(filterOptions(options, 'o')).toEqual([options[0]]);
  });
});

describe('filterOptions - strict matching', () => {
  test('should match labels from the beginning of the string', () => {
    const options = [{ option: { label: 'Example' } }, { option: { label: 'Second Example' } }];
    expect(filterOptions(options, 'ex', true)).toEqual([options[0]]);
  });

  test('should match descriptions starting from the string', () => {
    const options = [
      { option: { label: '1', description: 'Not second' } },
      { option: { label: '2', description: 'Second' } },
    ];
    expect(filterOptions(options, 'sec', true)).toEqual([options[1]]);
  });

  test('should match tags and not filtering tags', () => {
    const options = [{ option: { label: '1', tags: ['match'] } }, { option: { label: '2', filteringTags: ['match'] } }];
    expect(filterOptions(options, 'match', true)).toEqual([options[0]]);
  });
});

describe('filterOptions - Group matching', () => {
  const options = [
    {
      option: {
        label: 'Group 1',
      },
      type: 'parent',
    },
    {
      option: {
        label: 'Child 1',
        description: 'ax',
      },
      type: 'child',
    },
    {
      option: {
        label: 'Child 2',
        description: 'zy',
      },
      type: 'child',
    },
    {
      option: {
        label: 'Option 1',
        labelTag: 'bx',
      },
    },
    {
      option: {
        label: 'Option 2',
        tags: ['x'],
      },
    },
  ];

  test('should return all items when an empty search text provided', () => {
    expect(filterOptions(options, '')).toEqual(options);
  });

  test('should return empty array when no matches', () => {
    expect(filterOptions(options, '0')).toEqual([]);
  });

  test('should return the entire group when the parent matches', () => {
    expect(filterOptions(options, 'Group 1')).toEqual([options[0], options[1], options[2]]);
  });

  test('should return only the children that match if the parent is not matched', () => {
    expect(filterOptions(options, 'z')).toEqual([options[0], options[2]]);
  });
  test('should return the entire group when the parent and some children matches (parent match precedence)', () => {
    expect(filterOptions(options, '1')).toEqual([options[0], options[1], options[2], options[3]]);
  });
});
