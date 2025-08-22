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

interface TreeItemRow<T> {
  id: string;
  item: T;
  index: number;
  level: number;
  hasChildren: boolean;
  parentId?: string;
  childrenIds?: string[];
}

export function getTreeItemRows<T>({
  items,
  expandedItems,
  getItemChildren,
  getItemId,
}: {
  items: ReadonlyArray<T>;
  expandedItems?: ReadonlyArray<string>;
  getItemChildren: (item: T, index: number) => ReadonlyArray<T> | undefined;
  getItemId: (item: T, index: number) => string;
}) {
  const rows: TreeItemRow<T>[] = [];

  const traverse = (item: T, index: number, level: number, parentId?: string) => {
    const itemId = getItemId(item, index);
    const children = getItemChildren(item, index);
    const hasChildren = !!children && children.length > 0;
    const childrenIds = hasChildren ? children.map((child, childIndex) => getItemId(child, childIndex)) : [];
    rows.push({ item, id: itemId, parentId, index, level, hasChildren, childrenIds });

    const isExpanded = hasChildren && expandedItems?.includes(itemId);
    if (isExpanded) {
      children.forEach((child, childIndex) => traverse(child, childIndex, level + 1, itemId));
    }
  };

  items.forEach((item: T, index: number) => traverse(item, index, 1));

  return rows;
}