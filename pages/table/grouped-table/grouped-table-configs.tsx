// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { format } from 'date-fns';

import { Link, PropertyFilterProps, TableProps } from '~components';

import { columnLabel } from '../shared-configs';
import { TransactionRow } from './grouped-table-common';

export const createColumnDefinitions = ({
  getCounterText,
  groups,
}: {
  getCounterText: (item: TransactionRow) => string;
  groups: string[];
}): TableProps.ColumnDefinition<TransactionRow>[] => {
  const propNames: Record<string, string> = {
    group: 'Group',
    type: 'Type',
    date: 'Date',
    date_year: 'Year',
    date_quarter: 'Quarter',
    date_month: 'Month',
    date_day: 'Day',
    origin: 'Origin',
    recipient: 'Recipient',
    currency: 'Currency',
    amountEur: 'Amount EUR',
    amountEur_100: 'Amount (€100)',
    amountEur_500: 'Amount (€500)',
    amountEur_1000: 'Amount (€1k)',
    amountUsd: 'Amount USD',
    amountUsd_100: 'Amount ($100)',
    amountUsd_500: 'Amount ($500)',
    amountUsd_1000: 'Amount ($1k)',
    paymentMethod: 'Payment method',
  };
  const getColumnProps = (id: string) => ({ id, header: propNames[id] ?? id });
  return [
    {
      id: 'group',
      header: [...groups.map(g => propNames[g] ?? g), 'ID'].join(' / '),
      cell: item => (item.children.length === 0 ? <Link href={`#${item.group}`}>{item.group}</Link> : item.group),
      counter: item => (item.children.length === 0 ? '' : getCounterText(item)),
      minWidth: 200,
      width: 350,
      isRowHeader: true,
    },
    {
      ...getColumnProps('type'),
      cell: item => (typeof item.type === 'string' ? item.type : `${item.type.uniqueTypes} types`),
      ariaLabel: columnLabel('Type'),
      sortingField: 'type',
    },
    {
      ...getColumnProps('date'),
      cell: item =>
        item.date instanceof Date
          ? format(item.date, 'yyyy-MM-dd HH:mm')
          : `${format(item.date[0], 'yyyy-MM-dd')} - ${format(item.date[1], 'yyyy-MM-dd')}`,
      ariaLabel: columnLabel('Date'),
      sortingField: 'date',
      width: 200,
    },
    {
      ...getColumnProps('origin'),
      cell: item => (typeof item.origin === 'string' ? item.origin : `${item.origin.uniqueOrigins} origin(s)`),
      ariaLabel: columnLabel('Origin'),
      sortingField: 'origin',
    },
    {
      ...getColumnProps('recipient'),
      cell: item =>
        typeof item.recipient === 'string' ? item.recipient : `${item.recipient.uniqueRecipients} recipient(s)`,
      ariaLabel: columnLabel('Recipient'),
      sortingField: 'recipient',
    },
    {
      ...getColumnProps('currency'),
      cell: item =>
        typeof item.currency === 'string' ? item.currency : `${item.currency.uniqueCurrencies} currency(es)`,
      ariaLabel: columnLabel('Currency'),
      sortingField: 'currency',
    },
    {
      ...getColumnProps('amountEur'),
      header: 'Amount EUR (total)',
      cell: item =>
        typeof item.amountEur === 'number' ? eurFormatter(item.amountEur) : eurFormatter(item.amountEur.totalAmount),
      ariaLabel: columnLabel('Amount EUR'),
      sortingField: 'amountEur',
    },
    {
      ...getColumnProps('amountUsd'),
      header: 'Amount USD (total)',
      cell: item =>
        typeof item.amountUsd === 'number' ? usdFormatter(item.amountUsd) : usdFormatter(item.amountUsd.totalAmount),
      ariaLabel: columnLabel('Amount USD'),
      sortingField: 'amountUsd',
    },
    {
      ...getColumnProps('paymentMethod'),
      cell: item =>
        typeof item.paymentMethod === 'string'
          ? item.paymentMethod
          : `${item.paymentMethod.uniquePaymentMethods} payment method(s)`,
      ariaLabel: columnLabel('Payment method'),
      sortingField: 'paymentMethod',
    },
  ];
};

function usdFormatter(value: number) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function eurFormatter(value: number) {
  return '€' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'type',
    propertyLabel: 'Type',
    groupValuesLabel: 'Type values',
    operators: ['=', '!='],
  },
  {
    key: 'origin',
    propertyLabel: 'Origin',
    groupValuesLabel: 'Origin values',
    operators: ['=', '!='],
  },
  {
    key: 'recipient',
    propertyLabel: 'Recipient',
    groupValuesLabel: 'Recipient values',
    operators: ['=', '!='],
  },
  {
    key: 'currency',
    propertyLabel: 'Currency',
    groupValuesLabel: 'Currency values',
    operators: ['=', '!='],
  },
  {
    key: 'paymentMethod',
    propertyLabel: 'Payment Method',
    groupValuesLabel: 'Payment Method values',
    operators: ['=', '!='],
  },
];
