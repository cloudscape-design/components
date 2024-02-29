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
//retrieves the test indexes of the option for the findOption and findOptionInGroup test-utils
export const getTestOptionIndexes = <T extends ListItem>(item: T) => testIndexMap.get(item);
export const generateTestIndexes = <T extends ListItem, Group extends object>(
  filteredItems: ReadonlyArray<T>,
  getParentGroup: (item: T) => Group | undefined
) => {
  let throughIndex = 1;
  let groupIndex = 0;
  let inGroupIndex = 1;
  let currentGroup: ListItem | null = null;
  filteredItems.forEach(item => {
    if (!('type' in item)) {
      testIndexMap.set(item, { throughIndex: throughIndex++ });
    } else {
      const isGroup = item.type === 'parent';
      const group = isGroup ? item : getParentGroup(item);
      if (group && group !== currentGroup) {
        currentGroup = group;
        groupIndex += 1;
        inGroupIndex = 1;
      }
      if (isGroup) {
        testIndexMap.set(item, { groupIndex });
      } else if (item.type === 'child') {
        if (getParentGroup(item)) {
          testIndexMap.set(item, {
            throughIndex: throughIndex++,
            groupIndex,
            inGroupIndex: inGroupIndex++,
          });
        } else {
          testIndexMap.set(item, { throughIndex: throughIndex++ });
        }
      }
    }
  });
};
