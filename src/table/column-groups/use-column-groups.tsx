// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { TableProps } from '../interfaces';
import { calculateHierarchyTree } from './utils';

export function useColumnGroups<T>(
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>,
  visibleColumns: string[],
  groupDefinitions?: ReadonlyArray<TableProps.GroupDefinition>,
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>
) {
  return useMemo(() => {
    const layout = calculateHierarchyTree(columnDefinitions, visibleColumns, groupDefinitions ?? [], columnDisplay);

    const layout = calculateHierarchyTree(columnDefinitions, visibleIds, groupDefinitions ?? [], columnDisplay);

    let groupLeafMap: Map<string, string[]> | undefined;
    if (layout.rows.length > 1) {
      groupLeafMap = new Map();
      const columnsRow = layout.rows[layout.rows.length - 1];
      for (const row of layout.rows) {
        for (const col of row.columns) {
          if (col.isGroup) {
            const leafIds = columnsRow.columns
              .filter(l => !l.isGroup && l.parentGroupIds.includes(col.id))
              .map(l => l.id);
            groupLeafMap.set(col.id, leafIds);
          }
        }
      }
    }

    return { ...layout, groupLeafMap };
  }, [columnDefinitions, groupDefinitions, visibleColumns, columnDisplay]);
}
