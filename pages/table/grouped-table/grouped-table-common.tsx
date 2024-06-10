// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  amountEur_100: number;
  amountEur_500: number;
  amountEur_1000: number;
  amountUsd: number;
  amountUsd_100: number;
  amountUsd_500: number;
  amountUsd_1000: number;
  paymentMethod: string;
}

export interface TransactionRow {
  key: string;
  group: string;
  groupKey: string;
  transactions: Transaction[];
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

export function getHeaderCounterText<T>(items: number, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items})` : `(${items})`;
}
