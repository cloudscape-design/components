// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AttributeEditorProps } from './interfaces';

interface GridColumns {
  gridColumnStart: number;
  gridColumnEnd: number;
}

export function getItemGridColumns(layout: AttributeEditorProps.GridLayout, itemIndex: number): GridColumns {
  let i = 0;
  for (const row of layout.rows) {
    let gridColumnStart = 1;
    for (const columnWidth of row) {
      if (i === itemIndex) {
        return { gridColumnStart, gridColumnEnd: gridColumnStart + columnWidth };
      } else {
        gridColumnStart += columnWidth;
      }
      i++;
    }
  }
  return { gridColumnStart: 1, gridColumnEnd: 1 };
}

export function getRemoveButtonGridColumns(
  layout: AttributeEditorProps.GridLayout,
  previousGridColumnEnd: number
): GridColumns {
  const maxColumns = layout.rows.reduce(
    (max, columns) =>
      Math.max(
        max,
        columns.reduce((sum, col) => sum + col, 0)
      ),
    0
  );
  if (isRemoveButtonOnSameLine(layout)) {
    const removeButtonWidth = typeof layout.removeButton?.width === 'number' ? layout.removeButton?.width : 1;
    return {
      gridColumnStart: previousGridColumnEnd,
      gridColumnEnd: previousGridColumnEnd + removeButtonWidth,
    };
  }
  return { gridColumnStart: 1, gridColumnEnd: maxColumns + 1 };
}

export function isRemoveButtonOnSameLine(layout: AttributeEditorProps.GridLayout) {
  return layout.rows.length === 1 && !layout.removeButton?.ownRow;
}

export function getGridTemplateColumns(layout: AttributeEditorProps.GridLayout) {
  const totalColumnUnits = layout.rows.reduce(
    (maxCols, row) =>
      Math.max(
        maxCols,
        row.reduce((cols, col) => cols + col, 0)
      ),
    0
  );

  const removeButtonColumn = isRemoveButtonOnSameLine(layout)
    ? layout.removeButton?.width === 'auto'
      ? 'max-content'
      : `${layout.removeButton?.width ?? 1}fr`
    : '';

  return `repeat(${totalColumnUnits}, 1fr) ${removeButtonColumn}`;
}
