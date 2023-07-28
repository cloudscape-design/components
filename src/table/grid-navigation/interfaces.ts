// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableRole } from '../table-role';

export interface GridNavigationProps {
  tableRole: TableRole;
  rows: number;
  columns: number;
  pageSize: number;
  getContainer: () => null | HTMLElement;
}

export interface GridNavigationAPI {
  focusCell: (coordinates: { rowIndex: number; colIndex: number }) => void;
}

export interface FocusedItem {
  rowIndex: number;
  colIndex: number;
  element: HTMLElement;
}
