// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableRootProps } from './interfaces';

// Clamp negatives to 0 so one malformed dimension can't invalidate the whole
// grid-template-columns string; a non-finite value (NaN/Infinity) returns undefined
// so the caller drops that dimension and falls back to a sensible track.
function clamp(value: number | undefined): number | undefined {
  return value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, value);
}

// Compiles a `grid` layout's columns into a `grid-template-columns` value; `undefined` in `auto` layout.
export function computeGridTemplateColumns(columnLayout: TableRootProps.ColumnLayout): string | undefined {
  if (columnLayout.type !== 'grid') {
    return undefined;
  }
  return columnLayout.columns.map(compileColumnTrack).join(' ');
}

function compileColumnTrack(column: TableRootProps.ColumnDefinition): string {
  const { size, minWidth, maxWidth }: { size?: number | { flex: number }; minWidth?: number; maxWidth?: number } =
    column;
  const min = `${clamp(minWidth) ?? 0}px`;
  if (typeof size === 'number') {
    const px = clamp(size);
    if (px !== undefined) {
      return `${px}px`; // fixed track — minWidth/maxWidth don't apply.
    }
  } else if (size) {
    const flex = clamp(size.flex);
    if (flex !== undefined) {
      return `minmax(${min}, ${flex}fr)`; // weighted track — the type forbids a maxWidth (can't cap an fr track).
    }
  }
  // No (or non-finite) size: a hard-capped track (maxWidth) or the default growable track.
  const max = clamp(maxWidth);
  return max !== undefined ? `minmax(${min}, ${max}px)` : `minmax(${min}, 1fr)`;
}
