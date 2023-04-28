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

export const customPreference = (customState: boolean) => (
  <Checkbox checked={customState} onChange={() => {}}>
    View as
  </Checkbox>
);
