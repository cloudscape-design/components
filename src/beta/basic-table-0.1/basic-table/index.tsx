// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from './interfaces';
import { Body, Cell, ExpandedContent, Header, HeaderCell, InternalRoot, Row } from './internal';

// Public API of the BasicTable beta module. Exports are FLAT (BasicTable + BasicTable*): the parts
// are individually importable, tree-shakeable, and each is a normal documentable component with its
// own props type. `BasicTable` is the root/default export; the parts are named exports. The headless
// `useBasicTable` hook and the virtualization primitives are re-exported for convenience.

// `BasicTable` is the base component: it takes the positional `columns` config, drives the headless
// `useBasicTable` hook, provides its instance to the self-rendering parts, and renders the grid shell
// around the declarative header + rows it is given.
function BasicTable({
  columnLayout = 'fixed',
  role = 'grid',
  loading = false,
  resizableColumns = false,
  ...props
}: BasicTableProps) {
  const baseComponentProps = useBaseComponent('BasicTable', {
    props: { columnLayout, role, resizableColumns },
  });
  return (
    <InternalRoot
      columnLayout={columnLayout}
      role={role}
      loading={loading}
      resizableColumns={resizableColumns}
      {...props}
      {...baseComponentProps}
    />
  );
}

// Flat aliases for the self-rendering parts (defined in ./internal). Aliasing keeps one source of
// truth for the implementation while presenting a flat, documentable public surface.
const BasicTableHeader = Header;
const BasicTableHeaderCell = HeaderCell;
const BasicTableBody = Body;
const BasicTableRow = Row;
const BasicTableCell = Cell;
const BasicTableExpandedContent = ExpandedContent;

applyDisplayName(BasicTable, 'BasicTable');
applyDisplayName(BasicTableHeader, 'BasicTableHeader');
applyDisplayName(BasicTableHeaderCell, 'BasicTableHeaderCell');
applyDisplayName(BasicTableBody, 'BasicTableBody');
applyDisplayName(BasicTableRow, 'BasicTableRow');
applyDisplayName(BasicTableCell, 'BasicTableCell');
applyDisplayName(BasicTableExpandedContent, 'BasicTableExpandedContent');

export default BasicTable;
export { BasicTableHeader, BasicTableHeaderCell, BasicTableBody, BasicTableRow, BasicTableCell, BasicTableExpandedContent };

export { useBasicTable } from './use-basic-table';
export { useVirtualization } from '../use-virtualization/use-virtualization';
export { useColumnVirtualization } from '../use-virtualization/use-column-window';

// Root + headless types.
export type { BasicTableProps };
export type { UseBasicTableConfig, BasicTableGetters } from './interfaces';
export type { UseBasicTableResult } from './use-basic-table';
export type { StickyColumnsModel } from '../../../table/sticky-columns';

// Flat per-part props types (documenter keys on `<ComponentName>Props`).
export type BasicTableHeaderProps = BasicTableProps.HeaderProps;
export type BasicTableHeaderCellProps = BasicTableProps.HeaderCellProps;
export type BasicTableBodyProps = BasicTableProps.BodyProps;
export type BasicTableRowProps = BasicTableProps.RowProps;
export type BasicTableCellProps = BasicTableProps.CellProps;
export type BasicTableExpandedContentProps = BasicTableProps.ExpandedContentProps;

// Virtualization primitive types.
export type {
  VirtualizationConfig,
  VirtualizationResult,
  VirtualizationWindowItem,
  VirtualizationRowProps,
  VirtualizationVisibleRange,
  ColumnVirtualizationConfig,
  ColumnVirtualizationResult,
} from '../use-virtualization/interfaces';
