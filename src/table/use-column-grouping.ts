// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { CalculateHierarchyTree, TableGroupedTypes } from './column-grouping-utils';
import { TableProps } from './interfaces';

/**
 * Processes flat group definitions and column definitions to create a hierarchical
 * structure that represents multiple header rows for grouped columns.
 *
 * @param columnGroupingDefinitions - Optional flat array of group definitions
 * @param columnDefinitions - Array of column definitions (with optional groupId)
 * @param visibleColumnIds - Optional set of visible column IDs for filtering
 */
export function useColumnGrouping<T>(
  columnGroupingDefinitions: ReadonlyArray<TableProps.ColumnGroupsDefinition<T>> | undefined,
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  visibleColumnIds?: Set<string>,
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>
): TableGroupedTypes.HierarchicalStructure<T> {
  return useMemo(() => {
    // Convert Set to Array for CalculateHierarchyTree
    const visibleIds = visibleColumnIds
      ? Array.from(visibleColumnIds)
      : columnDefinitions.map((col, idx) => col.id || `column-${idx}`);

    // Convert readonly arrays to mutable for CalculateHierarchyTree
    const groups = columnGroupingDefinitions ? [...columnGroupingDefinitions] : [];
    const columns = [...columnDefinitions];
    const columnDisplayMutable = columnDisplay ? [...columnDisplay] : undefined;

    // Call the CalculateHierarchyTree function
    return CalculateHierarchyTree(columns, visibleIds, groups, columnDisplayMutable);
  }, [columnGroupingDefinitions, columnDefinitions, visibleColumnIds, columnDisplay]);
}
