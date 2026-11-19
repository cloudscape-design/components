// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '~components';

export type InstanceType = 'global' | 'cluster' | 'instance';

export type InstanceState = 'RUNNING' | 'STOPPED' | 'TERMINATED';

export interface Instance extends InstanceDetail {
  selectsPerSecond: null | number;
  stateGrouped: Record<InstanceState, number>;
  sizeGrouped: string;
  regionGrouped: string;
  parentName: null | string;
  path: string[];
  children: number;
  level: number;
}

export interface InstanceDetail {
  name: string;
  type: InstanceType;
  role: string;
  state: InstanceState;
  engine: string;
  size: null | string;
  region: null | string;
  terminationReason: null | string;
}

export const ariaLabels: TableProps<{ name: string }>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  allItemsSelectionLabel: ({ selectedItems }) =>
    `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
  itemSelectionLabel: ({ selectedItems }, item) => {
    const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
    return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
  },
  tableLabel: 'Databases table',
  expandButtonLabel: () => 'expand row',
  collapseButtonLabel: () => 'collapse row',
};

export function getHeaderCounterText<T>(items: ReadonlyArray<T>, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items.length})` : `(${items.length})`;
}
