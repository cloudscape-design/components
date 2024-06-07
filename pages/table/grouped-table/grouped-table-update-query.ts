// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterProps } from '~components';
import { TransactionRow } from './grouped-table-common';
import { GroupDefinition } from './grouped-table-data';
import { ItemSelectionTree } from '~components/table/selection/utils';

export function findSelectionIds({
  allPageItems: items,
  selectionInverted,
  selectedItems,
  trackBy,
  getItemChildren,
}: {
  allPageItems: readonly TransactionRow[];
  selectionInverted: boolean;
  selectedItems: TransactionRow[];
  trackBy: (row: TransactionRow) => string;
  getItemChildren?: (row: TransactionRow) => TransactionRow[];
}) {
  if (!getItemChildren) {
    throw new Error('Missing getItemChildren');
  }

  const isComplete = () => true;
  const selectionTree = new ItemSelectionTree(
    items,
    selectedItems,
    selectionInverted,
    trackBy,
    getItemChildren,
    isComplete
  );
  const allIds: string[] = [];

  function traverseItem(item: TransactionRow) {
    if (typeof item.type === 'string' && selectionTree.isItemSelected(item)) {
      allIds.push(item.group);
    }
    getItemChildren!(item).forEach(traverseItem);
  }
  items.forEach(traverseItem);

  return allIds;
}

export function createWysiwygQuery({
  selectionInverted,
  selectedItems,
  groups,
  filter,
}: {
  selectionInverted: boolean;
  selectedItems: TransactionRow[];
  groups: GroupDefinition[];
  filter: PropertyFilterProps.Query;
}): string {
  const whereTokens: string[] = [];

  if (filter.tokens.length > 0) {
    const filterTokens: string[] = [];
    for (const token of filter.tokens) {
      filterTokens.push(`${token.propertyKey} ${token.operator} ${JSON.stringify(token.value)}`);
    }
    whereTokens.push(`(${filterTokens.join(' ' + filter.operation.toUpperCase() + ' ')})`);
  }

  const whereClause = whereTokens.length > 0 ? ` WHERE ${whereTokens.join(' AND ')}` : '';
  return `UPDATE transactions SET reviewed = true${whereClause}`;
}

export function createIdsQuery(selectedIds: string[]): string {
  const limit = 100;
  let whereClause = selectedIds
    .slice(0, limit)
    .map(id => `id = "${id}"`)
    .join(' AND ');
  if (selectedIds.length > limit) {
    whereClause += ` AND ...${selectedIds.length - limit} more`;
  }
  return `UPDATE transactions SET reviewed = true WHERE ${whereClause}`;
}
