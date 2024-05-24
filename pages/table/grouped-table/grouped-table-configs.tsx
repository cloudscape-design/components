// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  CollectionPreferences,
  CollectionPreferencesProps,
  Link,
  PropertyFilterProps,
  SpaceBetween,
  TableProps,
} from '~components';
import { TransactionRow } from './grouped-table-common';
import { columnLabel } from '../shared-configs';
import { contentDisplayPreferenceI18nStrings } from '../../common/i18n-strings';
import { format } from 'date-fns';

export function createColumns(): TableProps.ColumnDefinition<TransactionRow>[] {
  return [
    {
      id: 'group',
      header: 'Group',
      cell: item => (
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          {item.children.length === 0 ? <Link href={`#${item.group}`}>{item.group}</Link> : item.group}
          {item.children.length > 0 && <Box color="text-body-secondary">({item.transactions})</Box>}
        </SpaceBetween>
      ),
      ariaLabel: columnLabel('Group'),
      minWidth: 200,
      width: 300,
      isRowHeader: true,
    },
    {
      id: 'type',
      header: 'Type',
      cell: item => (typeof item.type === 'string' ? item.type : `${item.type.uniqueTypes} types`),
      ariaLabel: columnLabel('Type'),
      sortingField: 'type',
    },
    {
      id: 'date',
      header: 'Date',
      cell: item =>
        item.date instanceof Date
          ? format(item.date, 'yyyy-MM-dd HH:mm')
          : `${format(item.date[0], 'yyyy-MM-dd')} - ${format(item.date[1], 'yyyy-MM-dd')}`,
      ariaLabel: columnLabel('Date'),
      sortingField: 'date',
      width: 200,
    },
    {
      id: 'origin',
      header: 'Origin',
      cell: item => (typeof item.origin === 'string' ? item.origin : `${item.origin.uniqueOrigins} origins`),
      ariaLabel: columnLabel('Origin'),
      sortingField: 'origin',
    },
    {
      id: 'recipient',
      header: 'Recipient',
      cell: item =>
        typeof item.recipient === 'string' ? item.recipient : `${item.recipient.uniqueRecipients} recipients`,
      ariaLabel: columnLabel('Recipient'),
      sortingField: 'recipient',
    },
    {
      id: 'currency',
      header: 'Currency',
      cell: item =>
        typeof item.currency === 'string' ? item.currency : `${item.currency.uniqueCurrencies} currencies`,
      ariaLabel: columnLabel('Currency'),
      sortingField: 'currency',
    },
    {
      id: 'amountEur',
      header: 'Amount EUR (Total / Average)',
      cell: item =>
        typeof item.amountEur === 'number'
          ? item.amountEur
          : `${item.amountEur.totalAmount.toFixed(2)} / ${item.amountEur.averageAmount.toFixed(2)}`,
      ariaLabel: columnLabel('Amount EUR'),
      sortingField: 'amountEur',
    },
    {
      id: 'amountUsd',
      header: 'Amount USD (Total / Average)',
      cell: item =>
        typeof item.amountUsd === 'number'
          ? item.amountUsd
          : `${item.amountUsd.totalAmount.toFixed(2)} / ${item.amountUsd.averageAmount.toFixed(2)}`,
      ariaLabel: columnLabel('Amount USD'),
      sortingField: 'amountUsd',
    },
    {
      id: 'paymentMethod',
      header: 'Payment Method',
      cell: item =>
        typeof item.paymentMethod === 'string'
          ? item.paymentMethod
          : `${item.paymentMethod.uniquePaymentMethods} payment methods`,
      ariaLabel: columnLabel('Payment method'),
      sortingField: 'paymentMethod',
    },
  ];
}

export function createPreferences({
  preferences,
  setPreferences,
}: {
  preferences: CollectionPreferencesProps.Preferences;
  setPreferences: (next: CollectionPreferencesProps.Preferences) => void;
}) {
  return (
    <CollectionPreferences
      title="Preferences"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      onConfirm={({ detail }) => setPreferences(detail)}
      preferences={preferences}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Customize the columns visibility and order.',
        options: [
          {
            id: 'group',
            label: 'Group',
            alwaysVisible: true,
          },
          {
            id: 'type',
            label: 'Type',
          },
          {
            id: 'date',
            label: 'Date',
          },
          {
            id: 'origin',
            label: 'Origin',
          },
          {
            id: 'recipient',
            label: 'Recipient',
          },
          {
            id: 'currency',
            label: 'Currency',
          },
          {
            id: 'amountEur',
            label: 'Amount EUR',
          },
          {
            id: 'amountUsd',
            label: 'Amount USD',
          },
          {
            id: 'paymentMethod',
            label: 'Payment Method',
          },
        ],
        ...contentDisplayPreferenceI18nStrings,
      }}
      wrapLinesPreference={{
        label: 'Wrap lines',
        description: 'Wrap lines description',
      }}
      stickyColumnsPreference={{
        firstColumns: {
          title: 'First column(s)',
          description: 'Keep the first column(s) visible while horizontally scrolling table content.',
          options: [
            { label: 'None', value: 0 },
            { label: 'First column', value: 1 },
            { label: 'First two columns', value: 2 },
          ],
        },
        lastColumns: {
          title: 'Stick last visible column',
          description: 'Keep the last column visible when tables are wider than the viewport.',
          options: [
            { label: 'Last column', value: 1 },
            { label: 'Last two columns', value: 2 },
          ],
        },
      }}
    />
  );
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
    propertyLabel: 'origin',
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
