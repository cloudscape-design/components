// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ColumnLayoutBreakpoint } from './internal';

export interface ColumnLayoutProps extends BaseComponentProps {
  /**
   * Specifies the number of columns in each grid row.
   * When `minColumnWidth` is not set, only up to 4 columns are supported.
   */
  columns?: number;

  /**
   * Specifies the content type. This determines the spacing of the grid.
   */
  variant?: ColumnLayoutProps.Variant;

  /**
   * Controls whether dividers are placed between rows and columns.
   *
   * Note: This is not supported when used with `minColumnWidth`.
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
   */
  minColumnWidth?: number;

  /**
   * The columns to render.
   */
  children?: React.ReactNode;
  /**
   * Overrides the default wrapper HTML tag.
   */
  tagOverride?: string;
}

export namespace ColumnLayoutProps {
  export type Variant = 'default' | 'text-grid';
  export type Borders = 'none' | 'vertical' | 'horizontal' | 'all';
}

export interface InternalColumnLayoutProps extends ColumnLayoutProps, InternalBaseComponentProps {
  __breakpoint?: ColumnLayoutBreakpoint;
}
