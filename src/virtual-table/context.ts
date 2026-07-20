// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

import { VirtualGrid, VirtualGridColumn, VirtualRow } from './interfaces';

// Shared state `VirtualTable.Root` provides to the compound sub-components. In cell F3-A2
// the a11y/windowing engine lives in the CORE (`useVirtualGrid`); Root calls it once and
// puts the returned `VirtualGrid` here. Header / HeaderCell / Row / Cell / ExpandedContent
// then SPREAD the core's role/ARIA props onto their Cloudscape-styled DOM — they never
// author ARIA of their own ("skin cannot silently regress core a11y"). The only things the
// skin adds here are visual: the fixed-layout column style (density, stretch-last) and the
// per-row lookup so a windowed Row can fetch its core props by trackBy id.

export interface VirtualTableContextValue<T = unknown> {
  /** The core result (`useVirtualGrid`). The seam: everything below is the core's props. */
  grid: VirtualGrid<T>;
  /** True when the row template renders an `ExpandedContent` child (probed by Root). */
  hasDisclosureColumn: boolean;
  /** Ordered data columns (the HeaderCell authority); body Cells are placed in this order. */
  columns: ReadonlyArray<VirtualGridColumn>;
  /** Skin-owned fixed-layout flex style for a column by id (width / stretch / share). */
  columnStyleOf: (columnId: string) => React.CSSProperties;
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
