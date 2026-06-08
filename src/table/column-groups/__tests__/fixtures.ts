// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TableProps } from '../../interfaces';

export const COLUMN_DEFS: TableProps.ColumnDefinition<any>[] = [
  { id: 'id', header: 'ID', cell: () => 'id' },
  { id: 'name', header: 'Name', cell: () => 'name' },
  { id: 'cpu', header: 'CPU', cell: () => 'cpu' },
  { id: 'memory', header: 'Memory', cell: () => 'memory' },
  { id: 'networkIn', header: 'Network In', cell: () => 'networkIn' },
  { id: 'type', header: 'Type', cell: () => 'type' },
  { id: 'az', header: 'AZ', cell: () => 'az' },
  { id: 'cost', header: 'Cost', cell: () => 'cost' },
];

export const ALL_IDS = COLUMN_DEFS.map(c => c.id!);

export const GROUP_DEFS: TableProps.GroupDefinition[] = [
  { id: 'performance', header: 'Performance' },
  { id: 'config', header: 'Config' },
  { id: 'pricing', header: 'Pricing' },
];

export const FLAT_DISPLAY: TableProps.ColumnDisplayProperties[] = [
  { id: 'id', visible: true },
  { id: 'name', visible: true },
  {
    type: 'group',
    id: 'performance',
    visible: true,
    children: [
      { id: 'cpu', visible: true },
      { id: 'memory', visible: true },
      { id: 'networkIn', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'config',
    visible: true,
    children: [
      { id: 'type', visible: true },
      { id: 'az', visible: true },
    ],
  },
  { type: 'group', id: 'pricing', visible: true, children: [{ id: 'cost', visible: true }] },
];

export const NESTED_GROUPS: TableProps.GroupDefinition[] = [
  { id: 'metrics', header: 'Metrics' },
  { id: 'performance', header: 'Performance' },
];

export const NESTED_DISPLAY: TableProps.ColumnDisplayProperties[] = [
  {
    type: 'group',
    id: 'metrics',
    visible: true,
    children: [
      {
        type: 'group',
        id: 'performance',
        visible: true,
        children: [
          { id: 'cpu', visible: true },
          { id: 'memory', visible: true },
        ],
      },
    ],
  },
];
