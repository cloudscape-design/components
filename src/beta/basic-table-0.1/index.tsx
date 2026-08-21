// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Entry point for the beta BasicTable component, published at the versioned export path
// `@cloudscape-design/components/beta/basic-table-0.1`. The path is the versioning escape-hatch:
// breaking API changes bump the directory (…-0.2) rather than the package semver. Beta is opt-in via
// this explicit path and is intentionally NOT part of the stable top-level package barrel.
//
// FLAT surface: `BasicTable` (root, default export) + the `BasicTable*` parts as named exports (each
// individually importable, tree-shakeable, and documented as its own component). This entry also owns
// the hook + shared type re-exports so the per-component dirs stay single-component for the documenter.

export { default } from './basic-table';
export { default as BasicTableHeader } from './basic-table-header';
export { default as BasicTableHeaderCell } from './basic-table-header-cell';
export { default as BasicTableBody } from './basic-table-body';
export { default as BasicTableRow } from './basic-table-row';
export { default as BasicTableCell } from './basic-table-cell';
export { default as BasicTableExpandedContent } from './basic-table-expanded-content';

export { useBasicTable } from './basic-table/use-basic-table';

export type { BasicTableProps, UseBasicTableConfig, BasicTableGetters } from './basic-table/interfaces';
export type { UseBasicTableResult } from './basic-table/use-basic-table';
export type { StickyColumnsModel } from '../../table/sticky-columns';
export type { BasicTableHeaderProps } from './basic-table-header';
export type { BasicTableHeaderCellProps } from './basic-table-header-cell';
export type { BasicTableBodyProps } from './basic-table-body';
export type { BasicTableRowProps } from './basic-table-row';
export type { BasicTableCellProps } from './basic-table-cell';
export type { BasicTableExpandedContentProps } from './basic-table-expanded-content';
