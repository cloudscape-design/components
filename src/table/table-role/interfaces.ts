// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

export type TableRole = 'table' | 'grid' | 'grid-default';

export interface GridNavigationProviderProps {
  children: ReactNode;
  keyboardNavigation: boolean;
  pageSize: number;
  getTable: () => null | HTMLTableElement;
}

export interface FocusedCell {
  rowIndex: number;
  colIndex: number;
  elementIndex: number;
  rowElement: HTMLTableRowElement;
  cellElement: HTMLTableCellElement;
  element: HTMLElement;
}

export type FocusableDefinition = (() => null | HTMLElement) | React.RefObject<HTMLElement>;

export interface GridNavigationFocusState {
  focusableId: null | string;
  focusTarget: null | HTMLElement;
}

export interface FocusableOptions {
  navigable?: boolean;
  suppressNavigation?: boolean;
}
