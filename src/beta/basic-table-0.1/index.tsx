// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Entry point for the beta BasicTable component, published at the versioned export path
// `@cloudscape-design/components/beta/basic-table-0.1`. The path is the versioning escape-hatch:
// breaking API changes bump the directory (…-0.2) rather than the package semver. Beta is opt-in via
// this explicit path and is intentionally NOT part of the stable top-level package barrel.
//
// The surface is FLAT: `BasicTable` (the root, default export) plus the `BasicTable*` parts as named
// exports, so each part is individually importable, tree-shakeable, and documentable.

export { default, BasicTableHeader, BasicTableHeaderCell, BasicTableBody, BasicTableRow, BasicTableCell, BasicTableExpandedContent, useBasicTable, useVirtualization, useColumnVirtualization } from './basic-table';

export type {
  BasicTableProps,
  BasicTableHeaderProps,
  BasicTableHeaderCellProps,
  BasicTableBodyProps,
  BasicTableRowProps,
  BasicTableCellProps,
  BasicTableExpandedContentProps,
  UseBasicTableConfig,
  UseBasicTableResult,
  BasicTableGetters,
  StickyColumnsModel,
  VirtualizationConfig,
  VirtualizationResult,
  VirtualizationWindowItem,
  VirtualizationRowProps,
  VirtualizationVisibleRange,
  ColumnVirtualizationConfig,
  ColumnVirtualizationResult,
} from './basic-table';
