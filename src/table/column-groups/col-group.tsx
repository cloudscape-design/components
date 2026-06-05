// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TableProps } from '../interfaces';
import { useColumnWidths } from '../use-column-widths';
import { getColumnKey } from '../utils';

/*
 * Renders a <colgroup> with <col> elements for each column.
 * With table-layout:fixed, <col> widths control actual column widths,
 * which makes colspan headers automatically span the correct width.
 * Must be rendered inside ColumnWidthsProvider.
 */
export function TableColGroup({
  visibleColumnDefinitions,
  hasSelection,
  sticky = false,
  selectionColumnId,
}: {
  visibleColumnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  hasSelection: boolean;
  sticky?: boolean;
  selectionColumnId?: PropertyKey;
}) {
  const { getColumnStyles, setCol } = useColumnWidths();
  return (
    <colgroup>
      {hasSelection && (
        <col
          style={sticky && selectionColumnId ? { width: getColumnStyles(true, selectionColumnId).width } : undefined}
        />
      )}
      {visibleColumnDefinitions.map((column, colIndex) => {
        const columnId = getColumnKey(column, colIndex);
        if (sticky) {
          return <col key={String(columnId)} style={{ width: getColumnStyles(true, columnId).width }} />;
        }
        return <col key={columnId} data-column-id={String(columnId)} ref={node => setCol(columnId, node)} />;
      })}
    </colgroup>
  );
}
