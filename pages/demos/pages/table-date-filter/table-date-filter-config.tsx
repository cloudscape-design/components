// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { PropertyFilterProperty } from '@cloudscape-design/collection-hooks';
import { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import Link from '@cloudscape-design/components/link';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { TableProps } from '@cloudscape-design/components/table';

import { enumOperators, stringOperators } from '../../common/property-filter-operators';
import { Distribution } from '../../fake-server/types';
import { createTableSortLabelFn } from '../../i18n-strings';
import { DateTimeForm, formatDateTime } from './table-date-filter-forms';

const rawColumns: TableProps.ColumnDefinition<Distribution>[] = [
  {
    id: 'id',
    sortingField: 'id',
    header: 'Distribution ID',
    cell: item => (
      <div>
        <Link href="#">{item.id}</Link>
      </div>
    ),
    minWidth: 180,
  },
  {
    id: 'state',
    sortingField: 'state',
    header: 'State',
    cell: item => (
      <StatusIndicator type={item.state === 'Deactivated' ? 'error' : 'success'}>{item.state}</StatusIndicator>
    ),
    minWidth: 120,
  },
  {
    id: 'domainName',
    sortingField: 'domainName',
    cell: item => item.domainName,
    header: 'Domain name',
    minWidth: 160,
  },
  {
    id: 'createdAt',
    sortingField: 'createdAt',
    cell: item => item.date.toISOString(),
    header: 'Created at',
    minWidth: 240,
  },
  {
    id: 'deliveryMethod',
    sortingField: 'deliveryMethod',
    header: 'Delivery method',
    cell: item => item.deliveryMethod,
    minWidth: 100,
  },
  {
    id: 'sslCertificate',
    sortingField: 'sslCertificate',
    header: 'SSL certificate',
    cell: item => item.sslCertificate,
    minWidth: 100,
  },
  {
    id: 'priceClass',
    sortingField: 'priceClass',
    header: 'Price class',
    cell: item => item.priceClass,
    minWidth: 100,
  },
  {
    id: 'logging',
    sortingField: 'logging',
    header: 'Logging',
    cell: item => item.logging,
    minWidth: 100,
  },
  {
    id: 'origin',
    sortingField: 'origin',
    header: 'Origin',
    cell: item => item.origin,
    minWidth: 100,
  },
];

export const COLUMN_DEFINITIONS = rawColumns.map(column => ({ ...column, ariaLabel: createTableSortLabelFn(column) }));

export const CONTENT_DISPLAY_OPTIONS = [
  { id: 'id', label: 'Distribution ID', alwaysVisible: true },
  { id: 'state', label: 'State' },
  { id: 'domainName', label: 'Domain name' },
  { id: 'createdAt', label: 'Created at' },
  { id: 'deliveryMethod', label: 'Delivery method' },
  { id: 'sslCertificate', label: 'SSL certificate' },
  { id: 'priceClass', label: 'Price class' },
  { id: 'logging', label: 'Logging' },
  { id: 'origin', label: 'Origin' },
];

export const DEFAULT_PREFERENCES: CollectionPreferencesProps.Preferences = {
  pageSize: 30,
  contentDisplay: [
    { id: 'id', visible: true },
    { id: 'state', visible: true },
    { id: 'domainName', visible: true },
    { id: 'createdAt', visible: true },
    { id: 'deliveryMethod', visible: true },
    { id: 'sslCertificate', visible: true },
    { id: 'priceClass', visible: false },
    { id: 'logging', visible: false },
    { id: 'origin', visible: false },
  ],
  wrapLines: false,
  stripedRows: false,
  contentDensity: 'comfortable',
};

export const FILTERING_PROPERTIES: PropertyFilterProperty[] = [
  {
    propertyLabel: 'Domain name',
    key: 'domainName',
    groupValuesLabel: 'Domain name values',
    operators: stringOperators,
  },
  {
    propertyLabel: 'Delivery method',
    key: 'deliveryMethod',
    groupValuesLabel: 'Delivery method values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Price class',
    key: 'priceClass',
    groupValuesLabel: 'Price class values',
    operators: enumOperators,
  },
  {
    propertyLabel: 'Origin',
    key: 'origin',
    groupValuesLabel: 'Origin values',
    operators: enumOperators,
  },
  { propertyLabel: 'State', key: 'state', groupValuesLabel: 'State values', operators: enumOperators },
  {
    propertyLabel: 'Logging',
    key: 'logging',
    groupValuesLabel: 'Logging values',
    operators: stringOperators,
  },
  {
    propertyLabel: 'SSL certificate',
    key: 'sslCertificate',
    groupValuesLabel: 'SSL certificate values',
    operators: enumOperators,
  },
  {
    key: 'date',
    propertyLabel: 'Created at',
    groupValuesLabel: 'Created at value',
    defaultOperator: '>',
    operators: ['<', '<=', '>', '>='].map(operator => ({
      operator,
      form: DateTimeForm,
      format: formatDateTime,
      match: 'datetime' as const,
    })),
  },
  // Example for date(only) property:
  // {
  //   key: 'createdAt',
  //   propertyLabel: 'Created at',
  //   groupValuesLabel: '',
  //   operators: ['=', '!=', '<', '<=', '>', '>='].map(operator => ({
  //     operator,
  //     form: DateForm,
  //     match: 'date',
  //   })),
  // },
].sort((a, b) => a.propertyLabel.localeCompare(b.propertyLabel));
