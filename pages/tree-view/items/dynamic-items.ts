// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import pseudoRandom from '../../utils/pseudo-random';

const MAX_LEVEL = 5;

export interface Item {
  id: string;
  name: string;
  level: number;
  status?: 'error' | 'success' | 'warning';
  tagName?: string;
  errorCount?: number;
  warningCount?: number;
  successCount?: number;
  children?: Item[];
  hasActions?: boolean;
  parentId: string;
  isExpanded?: boolean;
}

function id() {
  const id = Math.ceil(pseudoRandom() * Math.pow(16, 8)).toString(16);
  return padStart(id, 8, '0');
}

function database() {
  const randomNumber = 1 + Math.floor(pseudoRandom() * 256);
  return `database-${randomNumber}`;
}

function tagName() {
  const randomNumber = 1 + Math.floor(pseudoRandom() * 256);
  return `tag-${randomNumber}`;
}

export function subnet() {
  const randomNumber = 1 + Math.floor(pseudoRandom() * 256);
  return `subnet-abcdh12345${randomNumber}`;
}

function yesOrNo() {
  return Math.random() < 0.5;
}

function statusCount() {
  return yesOrNo() ? Math.floor(pseudoRandom() * 5) : 0;
}

function getChildren({
  level,
  parentId,
  count = 0,
  errorCount = 0,
  warningCount = 0,
  successCount = 0,
}: {
  level: number;
  parentId: string;
  count?: number;
  errorCount?: number;
  warningCount?: number;
  successCount?: number;
}): Item[] {
  if (level + 1 === MAX_LEVEL) {
    return [];
  }

  return yesOrNo()
    ? getStatusIndicatorItems({ level: level + 1, parentId, errorCount, warningCount, successCount })
    : getSubnetItems({ level: level + 1, parentId, count });
}

function getStatusIndicatorItems({
  level,
  parentId,
  errorCount = 0,
  warningCount = 0,
  successCount = 0,
}: {
  level: number;
  parentId: string;
  errorCount: number;
  warningCount: number;
  successCount: number;
}) {
  const items: Item[] = [];

  if (errorCount > 0) {
    const itemId = `${parentId}-${id()}`;
    items.push({
      id: itemId,
      parentId,
      name: `${errorCount} error`,
      level,
      status: 'error',
      children: getChildren({ parentId: itemId, level, count: errorCount }),
    });
  }

  if (warningCount > 0) {
    const itemId = `${parentId}-${id()}`;
    items.push({
      id: itemId,
      parentId,
      name: `${warningCount} warning`,
      level,
      status: 'warning',
      children: getChildren({ parentId: itemId, level, count: warningCount }),
    });
  }

  if (successCount > 0) {
    const itemId = `${parentId}-${id()}`;
    items.push({
      id: itemId,
      parentId,
      name: `${successCount} success`,
      level,
      status: 'success',
      children: getChildren({ parentId: itemId, level, count: successCount }),
    });
  }

  return items;
}

function getSubnetItems({ level, parentId, count }: { level: number; parentId: string; count: number }) {
  return range(count).map(() => {
    const itemId = `${parentId}-${id()}`;
    return {
      id: itemId,
      parentId,
      name: subnet(),
      children: yesOrNo() ? getChildren({ parentId: itemId, level, count }) : [],
      tagName: yesOrNo() ? tagName() : undefined,
      level,
      hasActions: yesOrNo(),
    };
  });
}

export default function getItems(rootItemCount = 20): Item[] {
  return range(rootItemCount).map(() => {
    const errorCount = statusCount();
    const warningCount = statusCount();
    const successCount = statusCount();

    const itemId = id();

    return {
      id: itemId,
      parentId: 'root',
      name: database(),
      level: 0,
      tagName: yesOrNo() ? tagName() : undefined,
      errorCount,
      warningCount,
      successCount,
      hasActions: yesOrNo(),
      children: yesOrNo()
        ? getChildren({ level: 0, parentId: itemId, count: rootItemCount / 2, errorCount, warningCount, successCount })
        : [],
    };
  });
}

function flattenItems(items: Item[]) {
  const allItems: Item[] = [];

  const pushItem = (item: Item) => {
    allItems.push(item);
    if (item.children) {
      item.children.forEach(pushItem);
    }
  };

  items.forEach(pushItem);
  return allItems;
}

export const items = getItems(15);
export const allItems = flattenItems(items);
