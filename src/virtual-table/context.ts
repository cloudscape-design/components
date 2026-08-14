// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

import { VirtualGrid, VirtualGridColumn, VirtualRow } from './interfaces';

// Shared state `VirtualTable.Root` provides to the compound sub-components. In cell F3-A2
// the a11y/windowing engine lives in the CORE (`useVirtualGrid`); Root calls it once and
// puts the returned `VirtualGrid` here. Header / HeaderCell / Row / Cell / ExpandedContent
// then SPREAD the core's role/ARIA props onto their Cloudscape-styled DOM — they never
// author ARIA of their own ("skin cannot silently regress core a11y"). The only things the
// skin adds here are visual: the shared `grid-template-columns` (one template applied to the
// header row and every body row so columns align), the resize wiring, and the per-row lookup
// so a windowed Row can fetch its core props by trackBy id.

export interface VirtualTableContextValue<T = unknown> {
  /** The core result (`useVirtualGrid`). The seam: everything below is the core's props. */
  grid: VirtualGrid<T>;
  /** True when the row template renders an `ExpandedContent` child (probed by Root). */
  hasDisclosureColumn: boolean;
  /** Ordered data columns (the HeaderCell authority); body Cells are placed in this order. */
  columns: ReadonlyArray<VirtualGridColumn>;
  /** The SINGLE shared `grid-template-columns` string, computed once from the HeaderCell set
   *  (+ the disclosure column). Applied identically to `.header-row` and EVERY body `.row`
   *  so columns align across rows deterministically (content-independent). */
  gridTemplateColumns: string;
  /** True when `resizableColumns` is set: the skin renders a drag handle per HeaderCell. */
  resizableColumns: boolean;
  /** Ref callback so Root can measure a header cell's rendered width (freeze-on-first-resize). */
  registerHeaderCell: (columnId: string, node: HTMLElement | null) => void;
  /** Begin a pointer-driven column resize for `columnId` from a HeaderCell's drag handle. */
  startColumnResize: (columnId: string, event: React.PointerEvent<HTMLElement>) => void;
  /** Look up a windowed row's core props by its `trackBy` id (undefined outside the window). */
  rowById: (id: string) => VirtualRow<T> | undefined;
  trackBy: (item: T) => string;
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
