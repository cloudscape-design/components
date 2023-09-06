// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type TableRole = 'table' | 'grid' | 'grid-default';

export interface GridNavigationProps {
  active: boolean;
  pageSize: number;
  getTable: () => null | HTMLTableElement;
  isSuppressed?: (focusedElement: HTMLElement) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GridNavigationAPI {}

export interface FocusedCell {
  rowIndex: number;
  colIndex: number;
  elementIndex: number;
  rowElement: HTMLTableRowElement;
  cellElement: HTMLTableCellElement;
  element: HTMLElement;
}
