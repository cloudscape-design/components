// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { generateTestIndexes, getTestOptionIndexes } from '../utils/test-indexes';

interface ListItem {
  type?: string;
  value?: string;
  options?: ListItem[];
}
const parentMap = new Map();
const getParentGroup = (item: ListItem) => parentMap.get(item);
const options = [...Array(4)].map((_, index) => ({
  value: `value${index + 1}`,
  ...(index > 0 ? { type: 'child' } : {}),
}));
const groups = [...Array(2)].map((_, index) => ({
  label: `group${index + 1}`,
  options: [],
  type: 'parent',
}));
parentMap.set(options[1], groups[0]);
parentMap.set(options[2], groups[0]);
parentMap.set(options[3], groups[1]);

describe('Test indexes', () => {
  test('generates indexes', () => {
    generateTestIndexes(options, getParentGroup);
    const indexes = options.map((option: ListItem) => getTestOptionIndexes(option));
    expect(indexes).toEqual([
      { throughIndex: 1 },
      { groupIndex: 1, inGroupIndex: 1, throughIndex: 2 },
      { groupIndex: 1, inGroupIndex: 2, throughIndex: 3 },
      { groupIndex: 2, inGroupIndex: 1, throughIndex: 4 },
    ]);
  });
  test('skips "use-entered" option but not group headers', () => {
    const allOptions: ListItem[] = [
      { type: 'use-entered', value: '' },
      options[0],
      groups[0],
      options[1],
      options[2],
      groups[1],
      options[3],
    ];
    generateTestIndexes(allOptions, getParentGroup);
    const indexes = allOptions.map(getTestOptionIndexes);
    expect(indexes).toEqual([
      undefined,
      { throughIndex: 1 },
      { groupIndex: 1 },
      { groupIndex: 1, inGroupIndex: 1, throughIndex: 2 },
      { groupIndex: 1, inGroupIndex: 2, throughIndex: 3 },
      { groupIndex: 2 },
      { groupIndex: 2, inGroupIndex: 1, throughIndex: 4 },
    ]);
  });
});
