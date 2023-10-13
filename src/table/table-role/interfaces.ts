// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';

export type TableRole = 'table' | 'grid' | 'grid-default';

export interface GridNavigationProps {
  keyboardNavigation: TableProps.KeyboardNavigation;
  suppressNavigation?: (focusedElement: HTMLElement) => boolean;
  pageSize: number;
  getTable: () => null | HTMLTableElement;
  isSuppressed?: (focusedElement: HTMLElement) => void;
}

export interface FocusedCell {
  rowIndex: number;
  colIndex: number;
  elementIndex: number;
  rowElement: HTMLTableRowElement;
  cellElement: HTMLTableCellElement;
  element: HTMLElement;
}
