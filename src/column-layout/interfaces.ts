// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

export interface ColumnLayoutProps extends BaseComponentProps {
  /**
   * Specifies the number of columns in each grid row.
   *
   * The number of columns is reduced as the available space narrows. One of two layout systems is
   * used, and which one applies determines how that reduction works:
   *   * Grid - used for up to 4 columns when `minColumnWidth` is not set. Columns are reduced at
   *     fixed breakpoints, to 2 and then to 1 as the container narrows. `borders` are supported.
   *   * Flexible grid - used in all other cases. Columns are reduced based on the available width
   *     and the desired column width, which is `minColumnWidth` when set and 150px otherwise.
   *     `borders` are not supported.
   */
  columns?: number;

  /**
   * Specifies the content type. This determines the spacing of the grid.
   */
  variant?: ColumnLayoutProps.Variant;

  /**
   * Controls whether dividers are placed between rows and columns.
   *
   * Note: This is not supported when used with `minColumnWidth`, or with more than 4 columns.
   */
  borders?: ColumnLayoutProps.Borders;

  /**
   * Determines whether the default gutters between columns are removed.
   */
  disableGutters?: boolean;

  /**
   * Use together with `columns` to specify the desired minimum width for each column in pixels.
   *
   * The number of columns is determined by the value of this property, the available space,
   * and the maximum number of columns as defined by the `columns` property.
   *
   * While reducing the count, odd numbers are skipped, so 5 columns becomes 4 and then 2.
   * A requested odd count is kept when it fits.
   */
  minColumnWidth?: number;

  /**
   * The columns to render.
   */
  children?: React.ReactNode;
}

export namespace ColumnLayoutProps {
  export type Variant = 'default' | 'text-grid';
  export type Borders = 'none' | 'vertical' | 'horizontal' | 'all';
}
