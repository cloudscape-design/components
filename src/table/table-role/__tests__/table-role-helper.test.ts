// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
} from '../../../../lib/components/table/table-role';

test('non-scrollable table props', () => {
  const tableRole = 'table';
  const ariaLabel = 'table';
  const totalItemsCount = 5;
  const totalColumnsCount = 4;

  const tableWrapper = getTableWrapperRoleProps({ tableRole, ariaLabel, isScrollable: false });
  const tableProps = getTableRoleProps({ tableRole, ariaLabel, totalItemsCount, totalColumnsCount });

  expect(tableWrapper).toEqual({});
  expect(tableProps).toEqual({ role: tableRole, 'aria-label': ariaLabel, 'aria-rowcount': 6 });
});

test('scrollable table props', () => {
  const tableRole = 'table';
  const ariaLabel = 'table';
  const totalItemsCount = 5;
  const totalColumnsCount = 4;

  const tableWrapper = getTableWrapperRoleProps({ tableRole, ariaLabel, isScrollable: true });
  const tableProps = getTableRoleProps({ tableRole, ariaLabel, totalItemsCount, totalColumnsCount });

  expect(tableWrapper).toEqual({ role: 'region', 'aria-label': ariaLabel, tabIndex: 0 });
  expect(tableProps).toEqual({ role: tableRole, 'aria-label': ariaLabel, 'aria-rowcount': 6 });
});

test.each(['grid', 'treegrid'] as const)('non-scrollable %s props', tableRole => {
  const ariaLabel = 'table';
  const totalItemsCount = 5;
  const totalColumnsCount = 4;

  const tableWrapper = getTableWrapperRoleProps({ tableRole, ariaLabel, isScrollable: false });
  const tableProps = getTableRoleProps({ tableRole, ariaLabel, totalItemsCount, totalColumnsCount });

  expect(tableWrapper).toEqual({});
  expect(tableProps).toEqual({
    role: tableRole,
    'aria-label': ariaLabel,
    tabIndex: -1,
    'aria-rowcount': 6,
    'aria-colcount': 4,
  });
});

test.each(['grid', 'treegrid'] as const)('scrollable %s props', tableRole => {
  const ariaLabel = 'table';
  const totalItemsCount = 5;
  const totalColumnsCount = 4;

  const tableWrapper = getTableWrapperRoleProps({ tableRole, ariaLabel, isScrollable: true });
  const tableProps = getTableRoleProps({ tableRole, ariaLabel, totalItemsCount, totalColumnsCount });

  expect(tableWrapper).toEqual({ 'aria-label': 'table', role: 'region', tabIndex: 0 });
  expect(tableProps).toEqual({
    role: tableRole,
    'aria-label': ariaLabel,
    tabIndex: -1,
    'aria-rowcount': 6,
    'aria-colcount': 4,
  });
});

test('table row and cell props', () => {
  const tableRole = 'table';

  const headerRow = getTableHeaderRowRoleProps({ tableRole });
  const headerCell1 = getTableColHeaderRoleProps({ tableRole, colIndex: 0, sortingStatus: 'ascending' });
  const headerCell2 = getTableColHeaderRoleProps({ tableRole, colIndex: 1 });
  const bodyRow = getTableRowRoleProps({ tableRole, rowIndex: 0 });
  const bodyCell1 = getTableCellRoleProps({ tableRole, colIndex: 0, isRowHeader: true });
  const bodyCell2 = getTableCellRoleProps({ tableRole, colIndex: 1 });

  expect(headerRow).toEqual({});
  expect(bodyRow).toEqual({});
  expect(headerCell1).toEqual({ scope: 'col', 'aria-sort': 'ascending' });
  expect(headerCell2).toEqual({ scope: 'col' });
  expect(bodyCell1).toEqual({ scope: 'row' });
  expect(bodyCell2).toEqual({});
});

test.each(['grid', 'treegrid'] as const)('%s row and cell props', tableRole => {
  const headerRow = getTableHeaderRowRoleProps({ tableRole });
  const headerCell1 = getTableColHeaderRoleProps({ tableRole, colIndex: 0, sortingStatus: 'ascending' });
  const headerCell2 = getTableColHeaderRoleProps({ tableRole, colIndex: 1 });
  const bodyRow = getTableRowRoleProps({ tableRole, rowIndex: 0 });
  const bodyCell1 = getTableCellRoleProps({ tableRole, colIndex: 0, isRowHeader: true });
  const bodyCell2 = getTableCellRoleProps({ tableRole, colIndex: 1 });

  expect(headerRow).toEqual({ 'aria-rowindex': 1 });
  expect(bodyRow).toEqual({ 'aria-rowindex': 2 });
  expect(headerCell1).toEqual({ 'aria-colindex': 1, scope: 'col', 'aria-sort': 'ascending' });
  expect(headerCell2).toEqual({ 'aria-colindex': 2, scope: 'col' });
  expect(bodyCell1).toEqual({ 'aria-colindex': 1, scope: 'row' });
  expect(bodyCell2).toEqual({ 'aria-colindex': 2 });
});

test('treegrid row props', () => {
  const bodyRow = getTableRowRoleProps({
    tableRole: 'treegrid',
    rowIndex: 0,
    level: 2,
    setSize: 3,
    posInSet: 2,
  });

  expect(bodyRow).toEqual({ 'aria-rowindex': 2, 'aria-level': 2, 'aria-setsize': 3, 'aria-posinset': 2 });
});
