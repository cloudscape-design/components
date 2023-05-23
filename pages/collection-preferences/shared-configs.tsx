// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { CollectionPreferencesProps } from '~components/collection-preferences';
import Checkbox from '~components/checkbox';

export const baseProperties: CollectionPreferencesProps<boolean> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: () => {},

  preferences: {
    wrapLines: true,
    pageSize: 10,
    visibleContent: ['id', 'sslCertificate', 'origin'],
    custom: true,
  },
};

export const pageSizePreference: CollectionPreferencesProps.PageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
  ],
};

export const wrapLinesPreference: CollectionPreferencesProps.WrapLinesPreference = {
  label: 'Wrap lines',
  description: 'Wrap lines description',
};

export const contentDensityPreference: CollectionPreferencesProps.ContentDensityPreference = {
  label: 'Compact mode',
  description: 'Content density description',
};

export const visibleContentPreference: CollectionPreferencesProps.VisibleContentPreference = {
  title: 'Content Selection',
  options: [
    {
      label: 'Main distribution properties',
      options: [
        { id: 'id', label: 'Distribution ID', editable: false },
        {
          id: 'domainName',
          label:
            'Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name',
        },
      ],
    },
    {
      label: 'Secondary distribution properties',
      options: [
        {
          id: 'deliveryMethod',
          label: 'Deliverymethod',
          editable: true,
        },
        { id: 'priceClass', label: 'Price class', editable: false },
        { id: 'sslCertificate', label: 'SSL certificate' },
        {
          id: 'origin',
          label:
            'OriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOrigin',
        },
      ],
    },
  ],
};

export const stickyColumnsPreference: CollectionPreferencesProps.StickyColumnsPreference = {
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
};

export const customPreference = (customState: boolean) => (
  <Checkbox checked={customState} onChange={() => {}}>
    View as
  </Checkbox>
);
