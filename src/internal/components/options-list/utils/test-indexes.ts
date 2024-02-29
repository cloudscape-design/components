// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
interface ListItem {
  type?: string;
}
interface TestIndexes {
  throughIndex?: number;
  groupIndex?: number;
  inGroupIndex?: number;
}
const testIndexMap = new WeakMap<ListItem, TestIndexes>();

// Retrieves the test indexes of the option for the findOption and findOptionInGroup test-utils
export const getTestOptionIndexes = <T extends ListItem>(item: T) => testIndexMap.get(item);

// Populates testIndexMap with entries where each item maps to an object with a set of 1-based indices:
// - throughIndex: index among all selectable options (does not apply to groups)
// - inGroupIndex: index among the selectable options in the same group (does not apply to groups)
// - groupIndex: in the case of selectable options, index of the parent group among all groups. In the case of groups, index of itself among all groups
//
// Assumes that filteredItems is a flattened array where all children appear after their parent group —just like they will appear in the dropdown.
export const generateTestIndexes = <T extends ListItem>(filteredItems: ReadonlyArray<T>) => {
  let throughIndex = 1;
  let groupIndex = 1;
  let inGroupIndex = 1;
  let currentGroup: ListItem | null = null;
  filteredItems.forEach(item => {
    if (!('type' in item)) {
      testIndexMap.set(item, { throughIndex: throughIndex++ });
    } else if (item.type === 'parent') {
      if (currentGroup && item !== currentGroup) {
        currentGroup = item;
        groupIndex++;
        inGroupIndex = 1;
      }
      testIndexMap.set(item, { groupIndex });
    } else if (item.type === 'child') {
      testIndexMap.set(item, { throughIndex: throughIndex++, groupIndex, inGroupIndex: inGroupIndex++ });
    }
  });
};
