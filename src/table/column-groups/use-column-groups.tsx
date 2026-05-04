// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { TableProps } from '../interfaces';
import { calculateHierarchyTree } from './utils';

export function useColumnGroups<T>(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  groupDefinitions?: ReadonlyArray<TableProps.GroupDefinition>,
  visibleColumns?: Set<string>,
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>
) {
  return useMemo(() => {
    // use column definition if
    const visibleIds = visibleColumns
      ? Array.from(visibleColumns)
      : columnDefinitions.map((col, idx) => col.id || `column-${idx}`);

    // Convert readonly arrays to mutable for CalculateHierarchyTree
    const groups = groupDefinitions ? [...groupDefinitions] : [];
    const columns = [...columnDefinitions];
    const columnDisplayMutable = columnDisplay ? [...columnDisplay] : undefined;

    // Call the CalculateHierarchyTree function
    return calculateHierarchyTree(columns, visibleIds, groups, columnDisplayMutable);
  }, [columnDefinitions, groupDefinitions, visibleColumns, columnDisplay]);
}
