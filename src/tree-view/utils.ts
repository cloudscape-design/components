// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface IndecesByItemId {
  [key: string]: number;
}

export function getAllVisibleItemsIndeces<T>({
  items,
  expandedItems,
  getItemId,
  getItemChildren,
}: {
  items: ReadonlyArray<T>;
  expandedItems?: ReadonlyArray<string>;
  getItemId: (item: T, index: number) => string;
  getItemChildren: (item: T, index: number) => ReadonlyArray<T> | undefined;
}) {
  const allIndecesByItemId: IndecesByItemId = {};
  let currentIndex = 0;

  const traverse = (item: T, index: number) => {
    const itemId = getItemId(item, index);
    const children = getItemChildren(item, index);

    allIndecesByItemId[itemId] = currentIndex;
    currentIndex += 1;

    const isExpanded = children && children.length > 0 && expandedItems?.includes(itemId);
    if (isExpanded) {
      children.forEach((child, index) => traverse(child, index));
    }
  };

  items.forEach((item, index) => traverse(item, index));

  return allIndecesByItemId;
}
