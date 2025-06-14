// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, RefObject, useContext } from 'react';

export interface HeaderRef {
  totalCount?: number;
}

export interface FilterRef {
  filtered?: boolean;
  filterText?: string;
  filteredBy?: string[];
  filterCount?: number;
}

export interface PaginationRef {
  currentPageIndex?: number;
  totalPageCount?: number;
  openEnd?: boolean;
}

export interface PreferencesRef {
  pageSize?: number;
  visibleColumns?: string[];
}

interface TableComponentsContextProps {
  headerRef: RefObject<HeaderRef>;
  filterRef: RefObject<FilterRef>;
  paginationRef: RefObject<PaginationRef>;
  preferencesRef: RefObject<PreferencesRef>;
}

const TableComponentsContext = createContext<TableComponentsContextProps | null>(null);

export const TableComponentsContextProvider = TableComponentsContext.Provider;

export const useTableComponentsContext = () => {
  const tableComponentContext = useContext(TableComponentsContext);
  return tableComponentContext;
};
