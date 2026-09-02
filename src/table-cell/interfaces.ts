// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders a single data cell. */
export interface TableCellProps extends BaseComponentProps {
  /**
   * Removes the cell's built-in padding so you can compose your own spacing, for example to match a
   * selection-control column. Defaults to `false`.
   */
  disablePaddings?: boolean;
  /** The cell content. */
  children?: React.ReactNode;
}
