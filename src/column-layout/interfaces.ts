// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ColumnLayoutBreakpoint } from './internal';

export interface ColumnLayoutProps extends BaseComponentProps {
  /**
   * Specifies the number of columns in each grid row.
   * Valid values are any integer between 1 and 4.
   */
  columns?: number;

  /**
   * Specifies the content type. This determines the spacing of the grid.
   */
  variant?: ColumnLayoutProps.Variant;

  /**
   * Controls whether dividers are placed between rows and columns.
   */
  borders?: ColumnLayoutProps.Borders;

  /**
   * Determines whether the default gutters between columns are removed.
   */
  disableGutters?: boolean;

  /**
   * Use together with `columns` to specify the desired minimum width for each column in pixels.
   *
   * The number of columns is determined based on the value of this property, the available space,
   * and the maximum number of columns as defined by the `columns` property.
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

export interface InternalColumnLayoutProps extends ColumnLayoutProps, InternalBaseComponentProps {
  __breakpoint?: ColumnLayoutBreakpoint;
}
