// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders a single data cell, or a row header when `isRowHeader` is set. */
export interface TableBodyCellProps extends BaseComponentProps {
  /**
   * Renders the cell as a row header (`<th scope="row">`) instead of a data cell (`<td>`). A row header
   * keeps the data-cell styling; use it for the cell that names its row. Defaults to `false`.
   */
  isRowHeader?: boolean;
  /**
   * Removes the cell's built-in padding so you can compose your own spacing. Defaults to `false`.
   */
  disablePaddings?: boolean;
  /**
   * Makes the cell span the given number of columns.
   */
  colSpan?: number;
  /** The cell content. */
  children?: React.ReactNode;
}
