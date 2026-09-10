// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { UseTableRootResult } from './use-table-root';

// A part rendered outside `TableRoot` reads this default (auto layout) instead of throwing.
const defaultTableContext: UseTableRootResult = { columnLayout: { type: 'auto' }, gridTemplateColumns: undefined };

const TableContext = createContext<UseTableRootResult>(defaultTableContext);

export const TableContextProvider = TableContext.Provider;

export function useTableContext(): UseTableRootResult {
  return useContext(TableContext);
}
