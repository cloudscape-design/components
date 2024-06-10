// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { groupBy, orderBy, sumBy, uniq } from 'lodash';
import pseudoRandom from '../../utils/pseudo-random';
import { id as generateId } from '../generate-data';
import { Transaction, TransactionRow } from './grouped-table-common';
import {
  addMonths,
  addSeconds,
  addWeeks,
  format,
  max,
  min,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';

export interface GroupDefinition {
  property: string;
  sorting: 'asc' | 'desc';
}

type TransactionDefinition = Pick<Transaction, 'type' | 'origin' | 'recipient' | 'currency' | 'paymentMethod'> & {
  amount: () => number;
};

export const allTransactions: Transaction[] = [];

let currentMoment = new Date('2000-01-01T12:00:00');
const reset = (date = new Date('2000-01-01T12:00:00')) => (currentMoment = date);

function addTransaction({ amount: getAmount, ...t }: TransactionDefinition) {
  let amountUsd = 0;
  let amountEur = 0;
  const amount = getAmount();
  switch (t.currency) {
    case 'EUR':
      amountUsd = amount * 1.1;
      amountEur = amount;
      break;
    case 'USD':
      amountUsd = amount;
      amountEur = amount * 0.9;
      break;
    default:
      throw new Error('Unsupported currency');
  }
  allTransactions.push({
    id: generateId(),
    ...t,
    date: currentMoment,
    date_year: getDateBase(currentMoment, 'year'),
    date_quarter: getDateBase(currentMoment, 'quarter'),
    date_month: getDateBase(currentMoment, 'month'),
    date_day: getDateBase(currentMoment, 'day'),
    amountUsd,
    amountEur,
    amountUsd_100: getNumericBase(amountUsd, 100),
    amountUsd_500: getNumericBase(amountUsd, 500),
    amountUsd_1000: getNumericBase(amountUsd, 1000),
    amountEur_100: getNumericBase(amountEur, 100),
    amountEur_500: getNumericBase(amountEur, 500),
    amountEur_1000: getNumericBase(amountEur, 1000),
  });
}
function getNumericBase(value: number, basis: number): number {
  return parseInt((Math.ceil(value / basis) * basis).toFixed(0));
}
function getDateBase(value: Date, basis: string) {
  switch (basis) {
    case 'year':
      return format(startOfYear(value), 'yyyy');
    case 'quarter':
      return format(startOfQuarter(value), 'QQQ yyyy');
    case 'month':
      return format(startOfMonth(value), 'MMMM yyyy');
    case 'day':
      return format(startOfDay(value), 'yyyy-MM-dd');
    default:
      throw new Error('Unsupported date base.');
  }
}
function transfer(from: string, to: string, currency: string, amount: () => number): TransactionDefinition {
  return { type: 'TRANSFER', origin: from, recipient: to, currency, amount, paymentMethod: 'Bank transfer' };
}
function withdraw(from: string, currency: string, amount: () => number): TransactionDefinition {
  return {
    type: 'WITHDRAWAL',
    origin: from,
    recipient: 'Cash',
    currency,
    amount,
    paymentMethod: 'Cash withdrawal',
  };
}

function repeat(transaction: TransactionDefinition, increment: (date: Date) => Date, until = new Date('2015-01-01')) {
  while (currentMoment < until && currentMoment < new Date('2015-01-01')) {
    addTransaction(transaction);
    currentMoment = increment(currentMoment);
  }
}

const monthly = (date: Date) => addMonths(date, 1);
const everyWeekOrSo = (date: Date) =>
  addSeconds(addWeeks(date, 1), Math.floor(pseudoRandom() * 3600 * 24 * 3 - 3600 * 24 * 1.5));

// John Doe Salary
reset();
repeat(
  transfer('Lovers GmbH', 'John Doe', 'EUR', () => 2500),
  monthly,
  new Date('2008-05-01')
);
repeat(
  transfer('Haters GmbH', 'John Doe', 'EUR', () => 3100),
  monthly,
  new Date('2012-01-01')
);
repeat(
  transfer('Lovers International', 'John Doe', 'USD', () => 4500),
  monthly
);

// Jane Doe Salary
reset();
repeat(
  transfer('Haters International', 'Jane Freeman', 'USD', () => 5000),
  monthly,
  new Date('2012-01-01')
);
repeat(
  transfer('Lowers International', 'Jane Doe', 'USD', () => 4500),
  monthly
);

// John -> Jane compensation
reset(new Date('2012-01-01T13:00:00'));
repeat(
  transfer('John Doe', 'Jane Doe', 'USD', () => 500),
  monthly
);

// John spending
reset();
repeat(
  withdraw('John Doe', 'EUR', () => pseudoRandom() * 100),
  everyWeekOrSo
);

// Jane spending
reset();
repeat(
  withdraw('Jane Freeman', 'EUR', () => pseudoRandom() * 90),
  everyWeekOrSo,
  new Date('2012-01-01')
);
repeat(
  withdraw('Jane Doe', 'EUR', () => pseudoRandom() * 120),
  everyWeekOrSo
);
allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

export function getGroupedTransactions(data: readonly Transaction[], groups: GroupDefinition[]): TransactionRow[] {
  function makeGroups(
    transactions: readonly Transaction[],
    groupIndex: number,
    parent: null | string
  ): TransactionRow[] {
    const group = groups[groupIndex];
    if (!group) {
      return transactions.map(t => ({
        ...t,
        key: parent ? `${parent}-${t.id}` : t.id,
        group: t.id,
        groupKey: 'id',
        transactions: [t],
        children: [],
        parent,
      }));
    }
    const byProperty = groupBy(transactions, group.property);
    const rows = orderBy(
      Object.entries(byProperty).map(([groupKey, groupTransactions]) => {
        const key = parent ? `${parent}-${groupKey}` : groupKey;
        return {
          key: key,
          group: groupKey,
          groupKey: group.property,
          parent,
          transactions: groupTransactions,
          children: makeGroups(groupTransactions, groupIndex + 1, key),
          type: { uniqueTypes: uniq(groupTransactions.map(t => t.type)).length },
          date: [min(groupTransactions.map(t => t.date)), max(groupTransactions.map(t => t.date))],
          origin: { uniqueOrigins: uniq(groupTransactions.map(t => t.origin)).length },
          recipient: { uniqueRecipients: uniq(groupTransactions.map(t => t.recipient)).length },
          currency: { uniqueCurrencies: uniq(groupTransactions.map(t => t.currency)).length },
          amountEur: {
            totalAmount: sumBy(groupTransactions, 'amountEur'),
            averageAmount: averageBy(groupTransactions, 'amountEur'),
          },
          amountUsd: {
            totalAmount: sumBy(groupTransactions, 'amountUsd'),
            averageAmount: averageBy(groupTransactions, 'amountUsd'),
          },
          paymentMethod: { uniquePaymentMethods: uniq(groupTransactions.map(t => t.paymentMethod)).length },
          __property: (groupTransactions[0] as any)[group.property],
        } as TransactionRow & { __property: any };
      }),
      '__property',
      group.sorting
    );
    return rows;
  }

  const roots = makeGroups(data, 0, null);

  const allRows: TransactionRow[] = [];
  function traverse(rows: TransactionRow[]) {
    for (const row of rows) {
      allRows.push(row);
      traverse(row.children);
    }
  }
  traverse(roots);

  return allRows;
}

function averageBy(transactions: Transaction[], property: 'amountEur' | 'amountUsd'): number {
  if (transactions.length === 0) {
    return 0;
  }
  const total = sumBy(transactions, property);
  return total / transactions.length;
}
