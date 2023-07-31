// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type TableRole = 'table' | 'grid';

export interface GridNavigationProps {
  tableRole: TableRole;
  pageSize: number;
  getTable: () => null | HTMLTableElement;
}

export interface GridNavigationAPI {
  focusCell: (coordinates: { rowIndex: number; colIndex: number }) => void;
}

export interface FocusedCell {
  rowIndex: number;
  colIndex: number;
  elementIndex: number;
  rowElement: HTMLTableRowElement;
  cellElement: HTMLTableCellElement;
  element: HTMLElement;
}
