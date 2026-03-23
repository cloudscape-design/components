// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterProps, TableProps } from '~components';

interface QueryBuilderProps<T> {
  getId: (item: T) => string;
  getGroup: (item: T) => [string, string];
  getChildren: (item: T) => T[];
  selection: TableProps.GroupSelectionState<T>;
  filter: PropertyFilterProps.Query;
}

export function createWysiwygQuery<T>(
  items: readonly T[],
  { getId, getGroup, getChildren, selection, filter }: QueryBuilderProps<T>
): string {
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

  // Filter clause.
  if (filter.tokens.length > 0) {
    const filterTokens: string[] = [];
    for (const token of filter.tokens) {
      filterTokens.push(`${token.propertyKey} ${token.operator} ${JSON.stringify(token.value)}`);
    }
    whereTokens.push(joinTokens(filterTokens, filter.operation));
  }

  // Selection clause.
  if (selection.toggledItems.length > 0) {
    const generateQuery = (items: readonly T[], isParentSelected: boolean): string[] => {
      const itemTokens: string[] = [];

      for (const item of items) {
        const isSelected = !!selection.toggledItems.find(selected => getId(selected) === getId(item));
        const [groupKey, groupValue] = getGroup(item);
        const token = `${groupKey} ${isParentSelected ? '!=' : '='} ${JSON.stringify(groupValue)}`;
        if (isSelected) {
          const childrenTokens = joinTokens(
            generateQuery(getChildren(item), !isParentSelected),
            isParentSelected ? 'OR' : 'AND'
          );
          if (childrenTokens) {
            itemTokens.push(joinTokens([token, childrenTokens], isParentSelected ? 'OR' : 'AND'));
          } else {
            itemTokens.push(token);
          }
        } else {
          itemTokens.push(...generateQuery(getChildren(item), isParentSelected));
        }
      }

      return itemTokens;
    };

    const selectionTokens = joinTokens(generateQuery(items, selection.inverted), selection.inverted ? 'AND' : 'OR');

    whereTokens.push(selectionTokens);
  }

  const whereClause = whereTokens.length > 0 ? ` WHERE ${joinTokens(whereTokens, 'AND')}` : '';
  return `UPDATE transactions SET updated = true${whereClause}`;
}
