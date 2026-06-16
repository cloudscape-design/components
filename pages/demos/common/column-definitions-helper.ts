// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { TableProps } from '@cloudscape-design/components/table';

export function addToColumnDefinitions<T, K extends keyof TableProps.ColumnDefinition<T>>(
  columnDefinitions: TableProps.ColumnDefinition<T>[],
  propertyName: K,
  columns: Partial<TableProps.ColumnDefinition<T>>[] = []
) {
  return columnDefinitions.map(colDef => {
    const column = columns.find(col => col.id === colDef.id);
    return {
      ...colDef,
      [propertyName]: (column && column[propertyName]) || colDef[propertyName],
    };
  });
}

export function mapWithColumnDefinitionIds<T, K extends keyof TableProps.ColumnDefinition<T>>(
  columnDefinitions: TableProps.ColumnDefinition<T>[],
  propertyName: K,
  items: TableProps.ColumnDefinition<T>[K][]
) {
  return columnDefinitions.map(({ id }, i) => ({
    id,
    [propertyName]: items[i],
  }));
}
