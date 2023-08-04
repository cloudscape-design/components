// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export { TableRole, GridNavigationProps, GridNavigationAPI } from '../table-role/interfaces';

export {
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
} from './table-role-helper';

export { useGridNavigation } from '../table-role/use-grid-navigation';

/**
 * TODO: implement single tab stop mechanism:
 *
 * 1. Every element rendered to a grid table is altered to suppress user focus.
 * 2. Every focusable element is annotated or recorded in memory so that it can be found when needed.
 * 3. Arrow keys navigate between focusable elements same as before.
 * 4. TAB/Shift+TAB exit the table.
 * 5. Currently focused element has tabIndex=0.
 */
