// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Shared fixtures for column-grouping tests.
import { TableProps } from '../interfaces';

export interface Item {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  networkIn: number;
  type: string;
  az: string;
  cost: number;
}

export const ITEMS: Item[] = [
  { id: 1, name: 'web-1', cpu: 45, memory: 62, networkIn: 1250, type: 't3.medium', az: 'us-east-1a', cost: 30 },
  { id: 2, name: 'api-1', cpu: 78, memory: 81, networkIn: 3420, type: 't3.large', az: 'us-east-1b', cost: 60 },
];

export const COLUMN_DEFS: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id, isRowHeader: true },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'cpu', header: 'CPU', cell: item => item.cpu },
  { id: 'memory', header: 'Memory', cell: item => item.memory },
  { id: 'networkIn', header: 'Network In', cell: item => item.networkIn },
  { id: 'type', header: 'Type', cell: item => item.type },
  { id: 'az', header: 'AZ', cell: item => item.az },
  { id: 'cost', header: 'Cost', cell: item => `$${item.cost}` },
];

export const GROUP_DEFS: TableProps.GroupDefinition<Item>[] = [
  { id: 'performance', header: 'Performance' },
  { id: 'config', header: 'Configuration' },
  { id: 'pricing', header: 'Pricing' },
];

/** Flat columnDisplay: id+name ungrouped, cpu/memory/networkIn under performance, type/az under config, cost under pricing */
export const FLAT_DISPLAY: TableProps.ColumnDisplayProperties[] = [
  { id: 'id', visible: true },
  { id: 'name', visible: true },
  {
    type: 'group',
    id: 'performance',
    children: [
      { id: 'cpu', visible: true },
      { id: 'memory', visible: true },
      { id: 'networkIn', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'config',
    children: [
      { id: 'type', visible: true },
      { id: 'az', visible: true },
    ],
  },
  { type: 'group', id: 'pricing', children: [{ id: 'cost', visible: true }] },
];

/** Nested: metrics → performance → cpu/memory */
export const NESTED_GROUPS: TableProps.GroupDefinition<any>[] = [
  { id: 'metrics', header: 'Metrics' },
  { id: 'performance', header: 'Performance' },
];

export const NESTED_DISPLAY: TableProps.ColumnDisplayProperties[] = [
  {
    type: 'group',
    id: 'metrics',
    children: [
      {
        type: 'group',
        id: 'performance',
        children: [
          { id: 'cpu', visible: true },
          { id: 'memory', visible: true },
        ],
      },
    ],
  },
];
