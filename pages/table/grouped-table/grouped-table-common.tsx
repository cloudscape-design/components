// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '~components';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  date_year: string;
  date_quarter: string;
  date_month: string;
  date_day: string;
  origin: string;
  recipient: string;
  currency: string;
  amountEur: number;
  amountEur_100: string;
  amountEur_500: string;
  amountEur_1000: string;
  amountUsd: number;
  amountUsd_100: string;
  amountUsd_500: string;
  amountUsd_1000: string;
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
  // TODO: compute considering selectionType="group"
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
