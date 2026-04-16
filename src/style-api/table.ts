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
      description: 'Border color of a selected row.',
    },
    {
      name: tableStyleDictionary.vars.rowSelectionBackgroundColor,
      description: 'Background color of a selected row.',
    },
  ],
  selectors: [
    {
      className: tableStyleDictionary.classNames.root,
      description:
        'Root element of the table. Contains the table and its slots (header, footer, filter, pagination, preferences).',
    },
    {
      className: tableStyleDictionary.classNames.header,
      description: 'Header slot of the table.',
    },
    {
      className: tableStyleDictionary.classNames.footer,
      description: 'Footer slot of the table.',
    },
    {
      className: tableStyleDictionary.classNames.filter,
      description: 'Filter slot of the table.',
    },
    {
      className: tableStyleDictionary.classNames.pagination,
      description: 'Pagination slot of the table.',
    },
    {
      className: tableStyleDictionary.classNames.preferences,
      description: 'Preferences slot of the table.',
    },
    {
      className: tableStyleDictionary.classNames.table,
      description: 'The semantic table element.',
      tags: ['table'],
    },
    {
      className: tableStyleDictionary.classNames.thead,
      description: 'The thead element. Combine with row or cell selectors to target header-specific styles.',
      tags: ['thead'],
    },
    {
      className: tableStyleDictionary.classNames.tbody,
      description: 'The tbody element. Combine with row or cell selectors to target body-specific styles.',
      tags: ['tbody'],
    },
    {
      className: tableStyleDictionary.classNames.row,
      description: 'A table row element.',
      tags: ['tr'],
    },
    {
      className: tableStyleDictionary.classNames.cell,
      description: 'A table cell element. Present on both header (th) and data (td) cells.',
      tags: ['td', 'th'],
    },
    {
      className: tableStyleDictionary.classNames.selectionCell,
      description: 'The selection cell in the first column of tables with row selection enabled.',
      tags: ['td'],
    },
    {
      className: tableStyleDictionary.classNames.resizeHandle,
      description: 'The column resize handle in tables with resizable columns.',
      tags: ['button'],
    },
    {
      className: tableStyleDictionary.classNames.expandToggle,
      description: 'The row expand toggle button in tables with expandable rows.',
      tags: ['button'],
    },
  ],
};

export default styleApi;
