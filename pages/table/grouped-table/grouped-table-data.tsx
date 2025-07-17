// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { addDays, addMonths, max, min, startOfDay, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { groupBy, orderBy, sumBy, uniq } from 'lodash';

import { id as generateId } from '../generate-data';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEES';

// The interface for transaction data entry. It includes precomputed group bases like date_quarter
// that are used as keys for data grouping.
export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  date_year: number;
  date_quarter: number;
  date_month: number;
  date_day: number;
  origin: string;
  recipient: string;
  amount: number;
  amount_100k: number;
  amount_500k: number;
  amount_1000k: number;
  purpose: string;
}

// The interface for grouped table row. The row can represent a data entry (transaction, includes a single transaction in
// the transactions array, and zero children), or a transaction group (includes one or more transactions and children).
// It includes precomputed aggregations for all properties.
export type TransactionRow = TransactionRowItem | TransactionRowGroup;

export interface TransactionRowItem extends Transaction {
  key: string;
  group: string;
  groupKey: string;
  parent: null | string;
}

export interface TransactionRowGroup {
  key: string;
  group: string;
  groupKey: string;
  parent: null | string;
  transactions: Transaction[];
  children: TransactionRow[];
  dateRange: [from: Date, until: Date];
  uniqueTypes: number;
  uniqueOrigins: number;
  uniqueRecipients: number;
  amount: number; // Using the same property name as in TransactionRowItem to make sorting apply
}

export interface GroupDefinition {
  property: string;
  sorting: 'asc' | 'desc';
}

export function isGroupRow(row: TransactionRow): row is TransactionRowGroup {
  return 'children' in row;
}

export const allTransactions: Transaction[] = [];

function addTransaction(t: Pick<Transaction, 'date' | 'type' | 'origin' | 'recipient' | 'amount' | 'purpose'>) {
  const numBase = (value: number, basis: number) => parseInt((Math.ceil(value / basis) * basis).toFixed(0));
  allTransactions.push({
    id: generateId(),
    ...t,
    date_year: startOfYear(t.date).getTime(),
    date_quarter: startOfQuarter(t.date).getTime(),
    date_month: startOfMonth(t.date).getTime(),
    date_day: startOfDay(t.date).getTime(),
    amount_100k: numBase(t.amount, 100_000),
    amount_500k: numBase(t.amount, 500_000),
    amount_1000k: numBase(t.amount, 1_000_000),
  });
}

const t = (type: TransactionType, origin: string, recipient: string, amount: number, purpose: string) => (date: Date) =>
  addTransaction({ date, type, origin, recipient, amount, purpose });

const y = (year: number) => ({ start: new Date(`${year}-01-01`), end: new Date(`${year}-12-31`) });

const monthly = (from: Date, to: Date, dayOffset: number, cb: (d: Date) => void) => {
  for (let d = from; d <= to; d = addMonths(d, 1)) {
    cb(addDays(d, dayOffset));
  }
};
const weekly = (from: Date, to: Date, cb: (d: Date) => void) => {
  for (let d = from; d <= to; d = addDays(d, 7)) {
    cb(d);
  }
};

// 2023:
t('TRANSFER', 'Investor', 'BuzzAI', 1_200_000, 'Seed investment')(new Date('2023-02-15'));
monthly(y(2023).start, y(2023).end, 25, d => t('TRANSFER', 'BuzzAI', 'Payroll', 120_000, 'Payroll')(d));
monthly(y(2023).start, y(2023).end, 2, d => t('TRANSFER', 'BuzzAI', 'Rent', 12_000, 'Office rent')(d));
monthly(y(2023).start, y(2023).end, 8, d => t('FEES', 'BuzzAI', 'Cloud', 25_000, 'Cloud costs')(d));
weekly(new Date('2023-05-01'), y(2023).end, d => t('DEPOSIT', 'Customer A', 'BuzzAI', 18_000, 'Subscription')(d));
t('TRANSFER', 'FizzAI', 'BuzzAI', 600_000, 'Strategic note (convertible)')(new Date('2023-10-03'));

// 2024:
t('TRANSFER', 'Investor', 'BuzzAI', 3_000_000, 'Series A')(new Date('2024-03-10'));
t('TRANSFER', 'FizzAI', 'BuzzAI', 2_000_000, 'Investment (round participation)')(new Date('2024-04-01'));
t('TRANSFER', 'BuzzAI', 'FizzAI', 1_800_000, 'Investment (swap agreement)')(new Date('2024-04-08'));
monthly(y(2024).start, y(2024).end, 25, d => t('TRANSFER', 'BuzzAI', 'Payroll', 170_000, 'Payroll')(d));
monthly(y(2024).start, y(2024).end, 8, d => t('FEES', 'BuzzAI', 'Cloud', 45_000, 'Cloud costs')(d));
weekly(new Date('2024-01-01'), y(2024).end, d => t('DEPOSIT', 'Customer A', 'BuzzAI', 26_000, 'Usage billing')(d));
weekly(new Date('2024-06-01'), y(2024).end, d => t('DEPOSIT', 'Customer B', 'BuzzAI', 34_000, 'Enterprise plan')(d));
monthly(y(2024).start, y(2024).end, 6, d => t('TRANSFER', 'BuzzAI', 'FizzAI', 180_000, 'Platform licensing')(d));
monthly(y(2024).start, y(2024).end, 20, d => t('TRANSFER', 'FizzAI', 'BuzzAI', 55_000, 'Revenue share')(d));

// 2025:
t('TRANSFER', 'BuzzAI', 'FizzAI', 2_500_000, 'Investment (structured note)')(new Date('2025-02-12'));
t('TRANSFER', 'FizzAI', 'BuzzAI', 2_700_000, 'Investment (SAFE)')(new Date('2025-02-19'));
monthly(y(2025).start, y(2025).end, 12, d => t('TRANSFER', 'BuzzAI', 'Vendor', 90_000, 'Operations')(d));
monthly(y(2025).start, y(2025).end, 25, d => t('TRANSFER', 'BuzzAI', 'Payroll', 210_000, 'Payroll')(d));
monthly(y(2025).start, y(2025).end, 8, d => t('FEES', 'BuzzAI', 'Cloud', 70_000, 'Cloud costs')(d));
weekly(new Date('2025-01-01'), y(2025).end, d => t('DEPOSIT', 'Customer B', 'BuzzAI', 40_000, 'Enterprise plan')(d));
t('DEPOSIT', 'BuzzAI', 'Bank', 800_000, 'Cash sweep')(new Date('2025-12-15'));
t('FEES', 'Bank', 'BuzzAI', 9_840.5, 'Interest payment')(new Date('2025-12-31'));

allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

export function getGroupedTransactions(
  filteredTransactions: readonly Transaction[],
  groups: GroupDefinition[]
): TransactionRow[] {
  function makeGroups(
    transactions: readonly Transaction[],
    groupIndex: number,
    parent: null | string
  ): TransactionRow[] {
    // The values in these columns are aggregated so that it is possible to sort groups by them.
    const nextKey = (key: string) => (parent ? `${parent}-${key}` : key);
    const group = groups[groupIndex];
    if (!group) {
      return transactions.map(t => ({ ...t, key: nextKey(t.id), group: t.id, groupKey: 'id', parent }));
    }
    const byProperty = groupBy(transactions, group.property);
    const rows = orderBy(
      Object.entries(byProperty).map(
        ([groupKey, groupTransactions]) =>
          ({
            key: nextKey(groupKey),
            group: groupKey,
            groupKey: group.property,
            parent,
            transactions: groupTransactions,
            children: makeGroups(groupTransactions, groupIndex + 1, nextKey(groupKey)),
            dateRange: [min(groupTransactions.map(t => t.date)), max(groupTransactions.map(t => t.date))],
            uniqueTypes: uniq(groupTransactions.map(t => t.type)).length,
            uniqueOrigins: uniq(groupTransactions.map(t => t.origin)).length,
            uniqueRecipients: uniq(groupTransactions.map(t => t.recipient)).length,
            amount: sumBy(groupTransactions, 'amount'),
            __sortingProperty: groupTransactions[0][group.property as keyof Transaction],
          }) as TransactionRow & { __sortingProperty: any }
      ),
      '__sortingProperty',
      group.sorting
    );
    return rows;
  }

  const roots = makeGroups(filteredTransactions, 0, null);

  const allRows: TransactionRow[] = [];
  function traverse(rows: TransactionRow[]) {
    for (const row of rows) {
      allRows.push(row);
      if (isGroupRow(row)) {
        traverse(row.children);
      }
    }
  }
  traverse(roots);

  return allRows;
}
