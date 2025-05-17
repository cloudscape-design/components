// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { TableComponentsContextProvider, useTableComponentsContext } from '../table-component-context';

describe('Verify TableComponentsContext', () => {
  test('returns the correct tableComponentsContext context value to child component', () => {
    const ChildComponent = () => {
      const tableComponentsContext = useTableComponentsContext();
      return (
        <div>
          <div data-testid="filterText">{tableComponentsContext?.filterRef?.current?.filterText}</div>
          <div data-testid="filterCount">{tableComponentsContext?.filterRef?.current?.filterCount}</div>
          <div data-testid="filtered">{`${tableComponentsContext?.filterRef?.current?.filtered}`}</div>
          <div data-testid="totalPageCount">{tableComponentsContext?.paginationRef?.current?.totalPageCount}</div>
          <div data-testid="currentPageIndex">{tableComponentsContext?.paginationRef?.current?.currentPageIndex}</div>
        </div>
      );
    };
    const { getByTestId } = render(
      <TableComponentsContextProvider
        value={{
          paginationRef: {
            current: { totalPageCount: 10, currentPageIndex: 1 },
          },
          filterRef: { current: { filterText: 'test', filterCount: 10, filtered: true } },
        }}
      >
        <ChildComponent />
      </TableComponentsContextProvider>
    );
    expect(getByTestId('filterText')).toHaveTextContent('test');
    expect(getByTestId('filterCount')).toHaveTextContent('10');
    expect(getByTestId('filtered')).toHaveTextContent('true');
    expect(getByTestId('totalPageCount')).toHaveTextContent('10');
    expect(getByTestId('currentPageIndex')).toHaveTextContent('1');
  });

  test('child component is able to update the tableComponentsContext context value', () => {
    const updatedFilterText = 'updatedText';
    const updatedFilterCount = 20;
    const updatedFiltered = false;
    const updatedCurrentPage = 20;
    const updatedTotalPageCount = 100;
    const ChildComponent = () => {
      const tableComponentsContext = useTableComponentsContext();
      if (tableComponentsContext?.filterRef.current && tableComponentsContext?.paginationRef.current) {
        tableComponentsContext.filterRef.current.filterText = updatedFilterText;
        tableComponentsContext.filterRef.current.filterCount = updatedFilterCount;
        tableComponentsContext.filterRef.current.filtered = updatedFiltered;
        tableComponentsContext.paginationRef.current.currentPageIndex = updatedCurrentPage;
        tableComponentsContext.paginationRef.current.totalPageCount = updatedTotalPageCount;
      }
      return (
        <div>
          <div data-testid="filterText">{tableComponentsContext?.filterRef?.current?.filterText}</div>
          <div data-testid="filterCount">{tableComponentsContext?.filterRef?.current?.filterCount}</div>
          <div data-testid="filtered">{`${tableComponentsContext?.filterRef?.current?.filtered}`}</div>
          <div data-testid="totalPageCount">{tableComponentsContext?.paginationRef?.current?.totalPageCount}</div>
          <div data-testid="currentPageIndex">{tableComponentsContext?.paginationRef?.current?.currentPageIndex}</div>
        </div>
      );
    };
    const { getByTestId } = render(
      <TableComponentsContextProvider
        value={{
          paginationRef: {
            current: { totalPageCount: 10, currentPageIndex: 1 },
          },
          filterRef: { current: { filterText: 'test', filterCount: 10, filtered: true } },
        }}
      >
        <ChildComponent />
      </TableComponentsContextProvider>
    );
    expect(getByTestId('filterText')).toHaveTextContent(updatedFilterText);
    expect(getByTestId('filterCount')).toHaveTextContent(`${updatedFilterCount}`);
    expect(getByTestId('filtered')).toHaveTextContent(`${updatedFiltered}`);
    expect(getByTestId('totalPageCount')).toHaveTextContent(`${updatedTotalPageCount}`);
    expect(getByTestId('currentPageIndex')).toHaveTextContent(`${updatedCurrentPage}`);
  });
});
