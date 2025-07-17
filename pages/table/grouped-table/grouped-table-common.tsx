// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';

// The interface for transaction data entry. It includes precomputed group bases like date_quarter
// or amountEur_500 that are used as keys for data grouping.
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

// The interface for grouped table row. The row can represent a data entry (transaction, includes a single transaction in
// the transactions array, and zero children), or a transaction group (includes one or more transactions and children).
// It includes precomputed aggregations for all properties, such as amountEur (total or average), or type (unique count).
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
