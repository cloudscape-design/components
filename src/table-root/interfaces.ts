// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/**
 * A composable table. You render the head and rows as children, and TableRoot provides the column
 * layout and accessibility semantics.
 */
export interface TableRootProps extends BaseComponentProps {
  /**
   * The table's content. Provide a `TableHead` followed by a `TableBody` that contains the rows.
   */
  children: React.ReactNode;

  /**
   * Determines how column widths are calculated.
   * * `{ type: 'auto' }` - Renders a standard HTML table whose columns size to their content. No
   *   column configuration is required.
   * * `{ type: 'grid'; columns: ColumnDefinition[] }` - Renders a CSS grid. The columns are then provided as
   * an array of objects with the following properties:
   *   * `size` (number | { flex: number }) - A number sets a fixed pixel width; `{ flex }` gives the
   *     column a weight that shares the remaining space in proportion. Omit it for a flexible column
   *     with the default weight of 1.
   *   * `minWidth` (number) - The minimum width in pixels for a flexible column. We recommend setting one;
   *     without it the column can shrink until its content clips or overlaps at narrow widths.
   *   * `maxWidth` (number) - Caps a flexible column's width in pixels (it grows up to the cap). A capped
   *     column can't also carry a proportional `flex` weight, so weighting applies to the uncapped columns.
   *
   * Defaults to `{ type: 'auto' }`.
   */
  columnLayout?: TableRootProps.ColumnLayout;

  /** Provides an accessible name for the table. Use this or `ariaLabelledby` to label the table. */
  ariaLabel?: string;
  /** Sets the `aria-labelledby` attribute. Use the ID of a visible element that labels the table. */
  ariaLabelledby?: string;
  /** Sets the `aria-describedby` attribute. Use the ID of a visible element that describes the table. */
  ariaDescribedby?: string;

  /**
   * Sets the table's `aria-rowcount`, counting the header row. Provide it only when you render a
   * subset of rows, such as with virtualization; otherwise it is derived from the DOM.
   */
  ariaRowcount?: number;
}

export namespace TableRootProps {
  export type ColumnLayout = { type: 'auto' } | { type: 'grid'; columns: ReadonlyArray<ColumnDefinition> };

  // A grid column is sized in one of two mutually exclusive ways. `flex` (weighted) and `maxWidth`
  // (hard cap) are intentionally exclusive: a CSS grid track cannot be both fr-weighted and px-capped. The
  // `maxWidth?: never` on the flex variant enforces this — without it, a union's excess-property check would
  // still permit `maxWidth` (since it is valid on the other variant) and silently drop the weight.
  export type ColumnDefinition =
    | { size?: number; minWidth?: number; maxWidth?: number }
    | { size: { flex: number }; minWidth?: number; maxWidth?: never };
}
