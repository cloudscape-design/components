// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, RefObject, useContext } from 'react';

export interface FilterRef {
  filterText?: string;
}

export interface PaginationRef {
  currentPageIndex?: number;
  totalPageCount?: number;
}
export interface TableComponentsContextProps {
  filterRef: RefObject<FilterRef>;
  paginationRef: RefObject<PaginationRef>;
}

export const TableComponentsContext = createContext<TableComponentsContextProps | null>(null);

export const TableComponentsContextProvider = TableComponentsContext.Provider;

export const useTableComponentsContext = () => {
  const tableComponentContext = useContext(TableComponentsContext);
  return tableComponentContext;
};
