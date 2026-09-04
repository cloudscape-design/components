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
   * * `{ type: 'grid'; columns }` - Renders a CSS grid and applies each column's `size`, `minWidth`,
   *   and `maxWidth`. Provide one `columns` entry per column, in display order; cells bind to columns
   *   by position. Virtualization requires this layout.
   *   * `size` (number | { flex: number }) - A number sets a fixed pixel width; `{ flex }` gives the
   *     column a weight that shares the remaining space in proportion. Omit it for a flexible column
   *     with the default weight of 1.
   *   * `minWidth` (number) - The minimum width in pixels, for a flexible column.
   *   * `maxWidth` (number) - The maximum width in pixels.
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
   * The total number of rows in the full dataset, set on the table's `aria-rowcount`. Provide it
   * only when you render a subset of rows, such as with virtualization, so assistive technologies
   * report the whole table. Omit it when you render every row, and the count is derived from the DOM.
   */
  ariaRowcount?: number;
}

export namespace TableRootProps {
  export type ColumnLayout = { type: 'auto' } | { type: 'grid'; columns: ReadonlyArray<ColumnDefinition> };

  export interface ColumnDefinition {
    /**
     * A number sets a fixed pixel width; `{ flex }` gives the column a weight that shares the
     * remaining space in proportion. Omit it for a flexible column with the default weight of 1.
     */
    size?: number | { flex: number };
    /** The minimum width in pixels, for a flexible column. */
    minWidth?: number;
    /** The maximum width in pixels. */
    maxWidth?: number;
  }
}
