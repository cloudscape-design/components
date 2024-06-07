// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterProps } from '~components';
import { TransactionRow } from './grouped-table-common';
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
  allPageItems: items,
  selectionInverted,
  selectedItems,
  propertyFilterProps: { query: filter },
  getItemChildren,
}: {
  allPageItems: readonly TransactionRow[];
  selectionInverted: boolean;
  selectedItems: TransactionRow[];
  propertyFilterProps: PropertyFilterProps;
  getItemChildren?: (row: TransactionRow) => TransactionRow[];
}): string {
  if (!getItemChildren) {
    throw new Error('Missing getItemChildren');
  }

  const whereTokens: string[] = [];

  function joinTokens(tokens: string[], operation: string) {
    tokens = tokens.filter(Boolean);
    if (tokens.length === 0) {
      return '';
    }
    if (tokens.length === 1) {
      return tokens[0];
    }
    return `(${tokens.join(' ' + operation.toUpperCase() + ' ')})`;
  }

  if (filter.tokens.length > 0) {
    const filterTokens: string[] = [];
    for (const token of filter.tokens) {
      filterTokens.push(`${token.propertyKey} ${token.operator} ${JSON.stringify(token.value)}`);
    }
    whereTokens.push(joinTokens(filterTokens, filter.operation));
  }

  if (selectedItems.length > 0) {
    const generateQuery = (items: readonly TransactionRow[], isParentSelected: boolean): string[] => {
      const itemTokens: string[] = [];

      for (const item of items) {
        const isSelected = !!selectedItems.find(selected => selected.key === item.key);
        const token = `${item.groupKey} ${isParentSelected ? '!=' : '='} ${JSON.stringify(item.group)}`;
        if (isSelected) {
          const childrenTokens = joinTokens(
            generateQuery(getItemChildren(item), !isParentSelected),
            isParentSelected ? 'OR' : 'AND'
          );
          if (childrenTokens) {
            itemTokens.push(joinTokens([token, childrenTokens], isParentSelected ? 'OR' : 'AND'));
          } else {
            itemTokens.push(token);
          }
        } else {
          itemTokens.push(...generateQuery(getItemChildren(item), isParentSelected));
        }
      }

      return itemTokens;
    };

    const selectionTokens = joinTokens(generateQuery(items, selectionInverted), selectionInverted ? 'AND' : 'OR');

    whereTokens.push(selectionTokens);
  }

  const whereClause = whereTokens.length > 0 ? ` WHERE ${joinTokens(whereTokens, 'AND')}` : '';
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
