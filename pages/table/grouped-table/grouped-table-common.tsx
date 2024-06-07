// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '~components';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  origin: string;
  recipient: string;
  currency: string;
  amountEur: number;
  amountUsd: number;
  paymentMethod: string;
}

export interface TransactionRow {
  key: string;
  group: string;
  groupKey: string;
  transactions: number;
  parent: null | string;
  children: TransactionRow[];
  type: TransactionType | { uniqueTypes: number };
  date: Date | [from: Date, until: Date];
  origin: string | { uniqueOrigins: number };
  recipient: string | { uniqueRecipients: number };
  currency: string | { uniqueCurrencies: number };
  amountEur: number | { totalAmount: number; averageAmount: number };
  amountUsd: number | { totalAmount: number; averageAmount: number };
  paymentMethod: string | { uniquePaymentMethods: number };
}

export const ariaLabels: TableProps<{ group: string }>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  // TODO: compute considering the group type of selection
  allItemsSelectionLabel: ({ selectedItems }) =>
    `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
  itemSelectionLabel: ({ selectedItems }, item) => {
    const isItemSelected = selectedItems.filter(i => i.group === item.group).length;
    return `${item.group} is ${isItemSelected ? '' : 'not'} selected`;
  },
  tableLabel: 'Transactions table',
};

export function getHeaderCounterText<T>(items: number, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items})` : `(${items})`;
}
