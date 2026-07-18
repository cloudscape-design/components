// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

// Shared state Root provides to the compound sub-components. Root — not the sub-components
// — owns the grid-level and cross-cell ARIA (role, aria-rowcount / aria-colcount, and every
// element's aria-colindex derived from the HeaderCell column authority), the windowing
// positions, and the measurement callback. HeaderCell / Cell / Row render the role-bearing
// DOM but read their index, style, absolute position, and measure ref from here so they
// never choose their own indices or offsets (design NB1a). Header<->body reconciliation is
// driven from the ordered `columns` list so body Cells are placed in header order.

/** Absolute-position + measurement descriptor for a windowed row's data and expanded slots. */
export interface RowPosition {
  dataStart: number;
  expandedStart?: number;
}

export interface DerivedColumn {
  columnId: string;
  stretch?: boolean;
  width?: number;
  minWidth?: number;
  /** Present when the column is sortable; Root reflects sort state and emits intent (it never sorts data). */
  sortingField?: string;
}

export interface VirtualTableContextValue<T = unknown> {
  baseId: string;
  /** True when the row template renders an ExpandedContent child (enables the disclosure column). */
  hasDisclosureColumn: boolean;
  /** Total column count including the materialised disclosure column. */
  columnCount: number;
  /** Ordered data columns from the HeaderCell authority; body Cells are placed in this order. */
  columns: ReadonlyArray<DerivedColumn>;
  /** 1-based aria-colindex for a data column id (disclosure column, when present, is 1). */
  columnIndexOf: (columnId: string) => number;
  /** Fixed-layout flex style for a column by id (width / stretch / share). */
  columnStyleOf: (columnId: string) => React.CSSProperties;
  /**
   * aria-sort for a column: `'ascending'`/`'descending'` when it is the active sort column,
   * `'none'` when sortable but inactive, and `undefined` when the column declares no
   * `sortingField` (not sortable -> no aria-sort attribute and no sort trigger).
   */
  ariaSortOf: (columnId: string) => 'ascending' | 'descending' | 'none' | undefined;
  /** Activate/toggle sort on a column; Root reflects state and fires onSortingChange (it never sorts data). */
  onSort: (columnId: string) => void;
  /** Accessible name for a column's sort trigger. */
  activateSortLabel?: (columnId: string) => string;
  /** Windowed absolute position for a row id (undefined when the row is outside the window). */
  positionOf: (id: string) => RowPosition | undefined;
  /** Measurement callback ref factory; `auto=false` slots are never observed. */
  measureRef: (key: string, auto: boolean) => (node: HTMLElement | null) => void;
  /** Per-row DATA height strategy (mirrors the engine): 'auto' -> the data row is measured. */
  getRowHeight?: (item: T) => number | 'auto';
  /** DOM id of the row that currently holds the roving active-descendant, or null. */
  activeDescendantId: string | null;
  ariaLabels?: {
    expandButtonLabel?: (item: T, expanded: boolean) => string;
    expandedRegionLabel?: (item: T) => string;
  };
  trackBy: (item: T) => string;
  isExpanded: (id: string) => boolean;
  toggle: (item: T) => void;
  rowDomId: (id: string) => string;
  toggleId: (id: string) => string;
  regionId: (id: string) => string;
}

const VirtualTableContext = createContext<VirtualTableContextValue | null>(null);

export const VirtualTableContextProvider = VirtualTableContext.Provider;

export function useVirtualTableContext<T = unknown>(component: string): VirtualTableContextValue<T> {
  const context = useContext(VirtualTableContext);
  if (!context) {
    throw new Error(`VirtualTable.${component} must be used within VirtualTable.Root.`);
  }
  return context as VirtualTableContextValue<T>;
}
