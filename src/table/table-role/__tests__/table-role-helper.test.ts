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

test('non-scrollable grid props', () => {
  const tableRole = 'grid';
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

test('scrollable grid props', () => {
  const tableRole = 'grid';
  const ariaLabel = 'table';
  const totalItemsCount = 5;
  const totalColumnsCount = 4;

  const tableWrapper = getTableWrapperRoleProps({ tableRole, ariaLabel, isScrollable: true });
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
  expect(headerCell1).toEqual({ scope: 'col', 'aria-sort': 'ascending', tabIndex: -1 });
  expect(headerCell2).toEqual({ scope: 'col', tabIndex: -1 });
  expect(bodyCell1).toEqual({ scope: 'row', tabIndex: -1 });
  expect(bodyCell2).toEqual({ tabIndex: -1 });
});

test('grid row and cell props', () => {
  const tableRole = 'grid';

  const headerRow = getTableHeaderRowRoleProps({ tableRole });
  const headerCell1 = getTableColHeaderRoleProps({ tableRole, colIndex: 0, sortingStatus: 'ascending' });
  const headerCell2 = getTableColHeaderRoleProps({ tableRole, colIndex: 1 });
  const bodyRow = getTableRowRoleProps({ tableRole, rowIndex: 0 });
  const bodyCell1 = getTableCellRoleProps({ tableRole, colIndex: 0, isRowHeader: true });
  const bodyCell2 = getTableCellRoleProps({ tableRole, colIndex: 1 });

  expect(headerRow).toEqual({ 'aria-rowindex': 1 });
  expect(bodyRow).toEqual({ 'aria-rowindex': 2 });
  expect(headerCell1).toEqual({ 'aria-colindex': 1, scope: 'col', 'aria-sort': 'ascending', tabIndex: -1 });
  expect(headerCell2).toEqual({ 'aria-colindex': 2, scope: 'col', tabIndex: -1 });
  expect(bodyCell1).toEqual({ 'aria-colindex': 1, scope: 'row', tabIndex: -1 });
  expect(bodyCell2).toEqual({ 'aria-colindex': 2, tabIndex: -1 });
});
