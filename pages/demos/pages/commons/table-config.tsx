// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import CollectionPreferences, {
  CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Select from '@cloudscape-design/components/select';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { TableProps } from '@cloudscape-design/components/table';

import { Distribution } from '../../fake-server/types';
import { createTableSortLabelFn } from '../../i18n-strings';

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
    isRowHeader: true,
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
  {
    id: 'actions',
    header: 'Actions',
    minWidth: 100,
    cell: item => (
      <ButtonDropdown
        variant="inline-icon"
        ariaLabel={`${item.id} actions`}
        expandToViewport={true}
        items={[
          { id: 'view', text: 'View details' },
          { id: 'edit', text: 'Edit' },
          { id: 'delete', text: 'Delete' },
        ]}
      />
    ),
  },
];

export const COLUMN_DEFINITIONS = rawColumns.map(column => ({
  ...column,
  ariaLabel: createTableSortLabelFn<Distribution>(column),
}));

export const serverSideErrorsStore = new Map();

// Please do not use this in any real code, this is not a good regular expression for domain names
// A better regex would be something like: /^((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/
// or one of the regular expressions mentioned here:
//    https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
export const domainNameRegex = /^(?:[\w_-]+\.){1,3}(?:com|net|org)$/i;
export const INVALID_DOMAIN_MESSAGE = 'Valid domain name ends with .com, .org, or .net.';

const editableColumns: Record<string, Partial<TableProps.ColumnDefinition<Distribution>>> = {
  state: {
    minWidth: 200,
    editConfig: {
      ariaLabel: 'Edit state',
      errorIconAriaLabel: 'State Validation Error',
      editIconAriaLabel: 'editable',
      editingCell: (item, { setValue, currentValue }) => {
        const options = [
          { value: 'Activated', label: 'Activated' },
          { value: 'Deactivated', label: 'Deactivated' },
        ];
        return (
          <Select
            autoFocus={true}
            expandToViewport={true}
            ariaLabel="Select desired state"
            options={options}
            onChange={event => {
              setValue(event.detail.selectedOption.value);
            }}
            selectedOption={options.find(option => option.value === (currentValue ?? item.state)) ?? null}
          />
        );
      },
    },
    cell: item => {
      return <StatusIndicator type={item.state === 'Deactivated' ? 'error' : 'success'}>{item.state}</StatusIndicator>;
    },
  },
  domainName: {
    minWidth: 180,
    editConfig: {
      ariaLabel: 'Edit domain name',
      errorIconAriaLabel: 'Domain Name Validation Error',
      editIconAriaLabel: 'editable',
      validation(item, value) {
        if (serverSideErrorsStore.has(item)) {
          if (value) {
            serverSideErrorsStore.set(item, domainNameRegex.test(value) ? undefined : INVALID_DOMAIN_MESSAGE);
          }
          return serverSideErrorsStore.get(item);
        }
      },
      editingCell: (item, { setValue, currentValue }) => {
        return (
          <Input
            autoFocus={true}
            ariaLabel="Edit domain name"
            value={currentValue ?? item.domainName}
            onChange={event => {
              setValue(event.detail.value);
            }}
            placeholder="Enter domain name"
          />
        );
      },
      disabledReason: item => {
        if (item.deliveryMethod === 'RTMP') {
          return 'You cannot change the domain name of an RTMP distribution.';
        }
        return undefined;
      },
    },
    cell: item => {
      return item.domainName;
    },
  },
  sslCertificate: {
    minWidth: 180,
    editConfig: {
      ariaLabel: 'Edit SSL certificate',
      errorIconAriaLabel: 'Certificate Validation Error',
      editIconAriaLabel: 'editable',
      editingCell: (item, { setValue, currentValue }) => {
        const options = [
          { value: 'Default', label: 'Default ' },
          { value: 'ACM', label: 'ACM' },
          { value: 'Custom', label: 'Custom' },
        ];
        return (
          <Autosuggest
            autoFocus={true}
            value={currentValue ?? item.sslCertificate}
            onChange={event => setValue(event.detail.value)}
            options={options}
            enteredTextLabel={value => `Use custom certificate "${value}"`}
            expandToViewport={true}
            ariaLabel="SSL Certificate"
            clearAriaLabel="clear"
            placeholder="Select an SSL certificate"
          />
        );
      },
    },
    cell: item => {
      return item.sslCertificate;
    },
  },
};

export const EDITABLE_COLUMN_DEFINITIONS = COLUMN_DEFINITIONS.map(column => {
  if (editableColumns[column.id!]) {
    return {
      ...column,
      minWidth: Math.max(Number(column.minWidth) || 0, 176),
      ...editableColumns[column.id!],
    };
  }
  return column;
});

const CONTENT_DISPLAY_OPTIONS: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'id', label: 'Distribution ID', alwaysVisible: true },
  { id: 'state', label: 'State' },
  { id: 'domainName', label: 'Domain name' },
  { id: 'deliveryMethod', label: 'Delivery method' },
  { id: 'sslCertificate', label: 'SSL certificate' },
  { id: 'priceClass', label: 'Price class' },
  { id: 'logging', label: 'Logging' },
  { id: 'origin', label: 'Origin' },
  { id: 'actions', label: 'Actions' },
];

export const PAGE_SIZE_OPTIONS: CollectionPreferencesProps.PageSizePreference['options'] = [
  { value: 10, label: '10 Distributions' },
  { value: 30, label: '30 Distributions' },
  { value: 50, label: '50 Distributions' },
];

export const DEFAULT_PREFERENCES: CollectionPreferencesProps.Preferences = {
  pageSize: 30,
  contentDisplay: [
    { id: 'id', visible: true },
    { id: 'state', visible: true },
    { id: 'domainName', visible: true },
    { id: 'deliveryMethod', visible: true },
    { id: 'sslCertificate', visible: true },
    { id: 'priceClass', visible: false },
    { id: 'logging', visible: false },
    { id: 'origin', visible: false },
    { id: 'actions', visible: true },
  ],
  wrapLines: false,
  stripedRows: false,
  contentDensity: 'comfortable',
  stickyColumns: { first: 0, last: 1 },
};

export interface PreferencesProps {
  preferences: CollectionPreferencesProps<unknown>['preferences'];
  setPreferences: (preferences: CollectionPreferencesProps<unknown>['preferences']) => void;
  disabled?: boolean;
  pageSizeOptions?: CollectionPreferencesProps.PageSizePreference['options'];
  contentDisplayOptions?: CollectionPreferencesProps.ContentDisplayOption[];
}
export const Preferences = ({
  preferences,
  setPreferences,
  disabled,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  contentDisplayOptions = CONTENT_DISPLAY_OPTIONS,
}: PreferencesProps) => (
  <CollectionPreferences
    disabled={disabled}
    preferences={preferences}
    onConfirm={({ detail }) => setPreferences(detail)}
    pageSizePreference={{ options: pageSizeOptions }}
    wrapLinesPreference={{}}
    stripedRowsPreference={{}}
    contentDensityPreference={{}}
    contentDisplayPreference={{ options: contentDisplayOptions }}
    stickyColumnsPreference={{
      firstColumns: {
        title: 'Stick first column(s)',
        description: 'Keep the first column(s) visible while horizontally scrolling the table content.',
        options: [
          { label: 'None', value: 0 },
          { label: 'First column', value: 1 },
          { label: 'First two columns', value: 2 },
        ],
      },
      lastColumns: {
        title: 'Stick last column',
        description: 'Keep the last column visible while horizontally scrolling the table content.',
        options: [
          { label: 'None', value: 0 },
          { label: 'Last column', value: 1 },
        ],
      },
    }}
  />
);
