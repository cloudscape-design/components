// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders a single data row, inside `TableBody`. */
export interface TableRowProps extends BaseComponentProps {
  /**
   * The row's visual state. This is visual only — set `ariaSelected` to convey selection to
   * assistive technologies.
   * * `default` - A standard row.
   * * `selected` - Applies the selected-row styling. Pair it with `ariaSelected` and a selection
   *   control, such as a checkbox, in a leading cell.
   * * `shaded` - Applies a shaded background, to create alternating row colors. Choose which rows
   *   are shaded, typically with `variant={index % 2 === 1 ? 'shaded' : 'default'}`.
   *
   * Defaults to `'default'`.
   */
  variant?: TableRowProps.Variant;
  /** Provides an accessible name for the row. Use this or `ariaLabelledby`. */
  ariaLabel?: string;
  /** Sets `aria-labelledby`. Use the ID(s) of visible element(s) that label the row. */
  ariaLabelledby?: string;
  /** Sets `aria-describedby`. Use the ID(s) of visible element(s) that describe the row. */
  ariaDescribedby?: string;
  /** Sets `aria-selected` to reflect the row's selection state. */
  ariaSelected?: boolean;
  /**
   * Sets the row's `aria-rowindex` — its 1-based position in the full dataset, counting the header
   * row (so a data row's value is its dataset index plus 2). Set this only when virtualizing, so
   * assistive technologies report the row's true position while you render a subset of rows; in a
   * standard table the position is derived from DOM order.
   */
  ariaRowindex?: number;
  /**
   * Applies inline styles to the row element. Use this for row positioning, for example for
   * virtualization or draggable rows. It is not supported to use this for general styling purposes.
   */
  style?: TableRowProps.Style;
  /** The row's cells, one per column, in order. */
  children?: React.ReactNode;
}

export namespace TableRowProps {
  export type Variant = 'default' | 'selected' | 'shaded';
  /** Inline styles supported on a row element, for row positioning (for example, virtualization). */
  export type Style = Pick<React.CSSProperties, 'transform' | 'position' | 'height'>;
}
