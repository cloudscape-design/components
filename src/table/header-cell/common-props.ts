// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';

export interface BaseHeaderCellProps {
  tabIndex: number;
  colIndex: number;
  focusedComponent?: null | string;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  onResizeFinish: () => void;
  sticky?: boolean;
  hidden?: boolean;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  tableRole: TableRole;
  resizerRoleDescription?: string;
  resizerTooltipText?: string;
  variant: TableProps.Variant;
  tableVariant?: TableProps.Variant;
  wrapLines?: boolean;
}
