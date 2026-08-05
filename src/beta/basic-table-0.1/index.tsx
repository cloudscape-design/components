// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Entry point for the beta BasicTable component, published at the versioned export path
// `@cloudscape-design/components/beta/basic-table-0.1`. The path is the versioning escape-hatch:
// breaking API changes bump the directory (…-0.2) rather than the package semver. Beta is opt-in via
// this explicit path and is intentionally NOT part of the stable top-level package barrel.
//
// The surface is FLAT: `BasicTable` (the root, default export) plus the `BasicTable*` parts as named
// exports, so each part is individually importable, tree-shakeable, and documentable.

export { default } from './basic-table';
export { default as BasicTableHeader } from './basic-table-header';
export { default as BasicTableHeaderCell } from './basic-table-header-cell';
export { default as BasicTableBody } from './basic-table-body';
export { default as BasicTableRow } from './basic-table-row';
export { default as BasicTableCell } from './basic-table-cell';
export { default as BasicTableExpandedContent } from './basic-table-expanded-content';

export { useBasicTable, useVirtualization, useColumnVirtualization } from './basic-table';

export type { BasicTableProps } from './basic-table';
export type { BasicTableHeaderProps } from './basic-table-header';
export type { BasicTableHeaderCellProps } from './basic-table-header-cell';
export type { BasicTableBodyProps } from './basic-table-body';
export type { BasicTableRowProps } from './basic-table-row';
export type { BasicTableCellProps } from './basic-table-cell';
export type { BasicTableExpandedContentProps } from './basic-table-expanded-content';

export type {
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
