// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { UseBasicTableResult } from './use-basic-table';

// Shared state `BasicTable.Root` provides to its compound components. The context carries the WHOLE
// `useBasicTable` hook instance — the pure prop-getters plus the column config and the shared
// models (sticky-columns, resize wiring). The
// Header/HeaderCell/Body/Row/Cell/ExpandedContent components read the getters + config from here
// and self-render their DOM; there is no JSX harvesting and no second behaviour implementation.

const BasicTableContext = createContext<UseBasicTableResult | null>(null);

export const BasicTableContextProvider = BasicTableContext.Provider;

export function useBasicTableContext(component: string): UseBasicTableResult {
  const context = useContext(BasicTableContext);
  if (!context) {
    throw new Error(`BasicTable.${component} must be used within BasicTable.Root.`);
  }
  return context;
}

// Row-scoped context so `Cell` learns its row index (for `getCellProps`) and `ExpandedContent`
// learns its row's `expanded`/`id`/`onToggleExpand` — all WITHOUT the parent probing child types.
export interface BasicRowContextValue {
  index: number;
  id?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const BasicRowContext = createContext<BasicRowContextValue | null>(null);

export const BasicRowContextProvider = BasicRowContext.Provider;

export function useBasicRowContext(component: string): BasicRowContextValue {
  const context = useContext(BasicRowContext);
  if (!context) {
    throw new Error(`BasicTable.${component} must be used within BasicTable.Row.`);
  }
  return context;
}

// Positional column index. `Header` and `Row` wrap each of their
// children in this Provider (a Context.Provider emits NO DOM, so the `<th>`/`<td>` stays a direct
// grid child), giving the Nth `HeaderCell`/`Cell` its column index WITHOUT the parent probing
// `child.type`. A cell that sets an explicit `columnId` ignores this and resolves by id instead.
export const ColumnIndexContext = createContext<number | null>(null);
export const ColumnIndexProvider = ColumnIndexContext.Provider;

export function useColumnIndexContext(): number | null {
  return useContext(ColumnIndexContext);
}
