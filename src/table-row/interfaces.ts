// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders a single data row, inside `TableBody`. */
export interface TableRowProps extends BaseComponentProps {
  /**
   * The row's visual state. Visual only — it does not set `aria-selected`; convey selection to
   * assistive technologies via the selection control in a leading cell.
   * * `default` - A standard row.
   * * `selected` - Applies selected-row styling.
   * * `shaded` - Applies a shaded background for alternating row colors.
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
  /**
   * Sets the row's `aria-rowindex`, its position in the full dataset counting the header row. Set
   * this only when virtualizing; otherwise it is derived from DOM order.
   */
  ariaRowindex?: number;
  /**
   * Applies inline styles to the row element for positioning, such as virtualization or draggable
   * rows. Not intended for general styling.
   */
  positionStyle?: TableRowProps.PositionStyle;
  /** The row's cells, one per column, in order. */
  children?: React.ReactNode;
}

export namespace TableRowProps {
  export type Variant = 'default' | 'selected' | 'shaded';
  /** Inline styles supported on a row element, for row positioning (for example, virtualization). */
  export interface PositionStyle {
    position?: React.CSSProperties['position'];
    transform?: React.CSSProperties['transform'];
    height?: React.CSSProperties['height'];
  }
}
