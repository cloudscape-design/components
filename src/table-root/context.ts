// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export interface TableContextValue {
  /** Whether the table uses `grid` layout (vs `auto`). */
  isGrid: boolean;
  /** The `grid-template-columns` value for `grid` layout; `undefined` in `auto` layout. */
  gridTemplateColumns?: string;
}

// A part rendered outside `TableRoot` reads this default (auto layout) instead of throwing. It is also
// the value the existing `Table` resets to at its root, so a Table nested inside an atomic grid cell
// renders from auto layout rather than inheriting the outer table's.
export const defaultTableContext: TableContextValue = {
  isGrid: false,
  gridTemplateColumns: undefined,
};

const TableContext = createContext<TableContextValue>(defaultTableContext);

export const TableContextProvider = TableContext.Provider;

export function useTableContext(): TableContextValue {
  return useContext(TableContext);
}
