// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { TableRootProps } from './interfaces';

export interface UseTableRootResult {
  columnLayout: TableRootProps.ColumnLayout;
  /** The `grid-template-columns` value for `grid` layout, compiled from each column's `size` union; `undefined` in `auto` layout. */
  gridTemplateColumns?: string;
}

// Clamp negatives to 0 so one malformed dimension can't invalidate the whole
// grid-template-columns string; a non-finite value (NaN/Infinity) returns undefined
// so the caller drops that dimension and falls back to a sensible track.
function clamp(value: number | undefined): number | undefined {
  return value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, value);
}

export function useTableRoot(columnLayout: TableRootProps.ColumnLayout): UseTableRootResult {
  const gridTemplateColumns = useMemo(() => {
    if (columnLayout.type !== 'grid') {
      return undefined;
    }
    return columnLayout.columns
      .map(column => {
        const size = typeof column.size === 'number' ? clamp(column.size) : undefined;
        if (size !== undefined) {
          return `${size}px`;
        }
        const min = `${clamp(column.minWidth) ?? 0}px`;
        const flex = typeof column.size === 'object' ? clamp(column.size.flex) : undefined;
        if (flex !== undefined) {
          // Weighted track — `{ flex: number }`. The type forbids a maxWidth here (can't cap an fr track).
          return `minmax(${min}, ${flex}fr)`;
        }
        // No explicit size: a hard-capped track (maxWidth) or the default growable track.
        const max = clamp(column.maxWidth);
        if (max !== undefined) {
          return `minmax(${min}, ${max}px)`;
        }
        return `minmax(${min}, 1fr)`;
      })
      .join(' ');
  }, [columnLayout]);

  return useMemo(() => ({ columnLayout, gridTemplateColumns }), [columnLayout, gridTemplateColumns]);
}
