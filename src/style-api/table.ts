// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StyleAPI } from './types';

export const tableStyleDictionary = {
  vars: {
    rowSelectionBorderColor: '--awsui-style-table-row-selection-border-color',
    rowSelectionBackgroundColor: '--awsui-style-table-row-selection-background-color',
  },
  classNames: {
    root: 'awsui-style-table-root',
    header: 'awsui-style-table-header',
    footer: 'awsui-style-table-footer',
    filter: 'awsui-style-table-filter',
    pagination: 'awsui-style-table-pagination',
    preferences: 'awsui-style-table-preferences',
    table: 'awsui-style-table-table',
    thead: 'awsui-style-table-table-thead',
    tbody: 'awsui-style-table-table-tbody',
    row: 'awsui-style-table-table-row',
    cell: 'awsui-style-table-table-cell',
    selectionCell: 'awsui-style-table-table-selection-cell',
    resizeHandle: 'awsui-style-table-table-resize-handle',
    expandToggle: 'awsui-style-table-table-expand-toggle',
  },
};

const styleApi: StyleAPI = {
  variables: [
    {
      name: tableStyleDictionary.vars.rowSelectionBorderColor,
      description: 'Border color of row selection frame',
    },
    {
      name: tableStyleDictionary.vars.rowSelectionBackgroundColor,
      description: 'Background color of row selection frame',
    },
  ],
  selectors: [
    {
      className: tableStyleDictionary.classNames.root,
      description: 'Table wrapper element that includes the table and its slots (header, footer, filter, etc.).',
    },
    {
      className: tableStyleDictionary.classNames.header,
      description: 'Table header slot.',
    },
    {
      className: tableStyleDictionary.classNames.footer,
      description: 'Table footer slot.',
    },
    {
      className: tableStyleDictionary.classNames.filter,
      description: 'Table filter slot.',
    },
    {
      className: tableStyleDictionary.classNames.pagination,
      description: 'Table pagination slot.',
    },
    {
      className: tableStyleDictionary.classNames.preferences,
      description: 'Table preferences slot.',
    },
    {
      className: tableStyleDictionary.classNames.table,
      description: 'The table element.',
      tags: ['table'],
    },
    {
      className: tableStyleDictionary.classNames.thead,
      description: 'Table thead element. Use it in combination with rows or cells to target table header styles.',
      tags: ['thead'],
    },
    {
      className: tableStyleDictionary.classNames.tbody,
      description:
        'Table table tbody element. Use it in combination with rows or cells to target table data cell styles.',
      tags: ['tbody'],
    },
    {
      className: tableStyleDictionary.classNames.row,
      description: 'Table tr element.',
      tags: ['tr'],
    },
    {
      className: tableStyleDictionary.classNames.cell,
      description: 'Table cell (td or th) element.',
      tags: ['td', 'th'],
    },
    {
      className: tableStyleDictionary.classNames.selectionCell,
      description: 'Table selection cell (first column cells in tables with selection).',
      tags: ['td'],
    },
    {
      className: tableStyleDictionary.classNames.resizeHandle,
      description: 'Table column resize handle.',
      tags: ['button'],
    },
    {
      className: tableStyleDictionary.classNames.expandToggle,
      description: 'Table expand toggle button in tables with expandable rows.',
      tags: ['button'],
    },
  ],
};

export default styleApi;
