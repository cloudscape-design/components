// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders a single column header cell. Put the column label, or a composed sort control, in `children`. */
export interface TableHeaderCellProps extends BaseComponentProps {
  /** Provides an accessible name for the header cell. Use this or `ariaLabelledby`. */
  ariaLabel?: string;
  /** Sets `aria-labelledby`. Use the ID(s) of visible element(s) that label the header cell. */
  ariaLabelledby?: string;
  /** Sets `aria-describedby`. Use the ID(s) of visible element(s) that describe the header cell. */
  ariaDescribedby?: string;
  /**
   * Sets the column's sort direction on the cell's `aria-sort` attribute. Use it on a sortable
   * column and render your own sort control in `children`; the table does not manage sort state.
   */
  ariaSort?: React.AriaAttributes['aria-sort'];
  /**
   * Removes the cell's built-in padding so you can compose your own spacing, for example to match a
   * selection-control column. Defaults to `false`.
   */
  disablePaddings?: boolean;
  /** The header content, such as a column label or a sort control. */
  children?: React.ReactNode;
}
