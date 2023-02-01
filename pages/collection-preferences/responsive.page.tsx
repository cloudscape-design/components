// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import SpaceBetween from '~components/space-between';

const baseProperties: CollectionPreferencesProps<boolean> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: () => {},

  preferences: {
    wrapLines: true,
    pageSize: 10,
    visibleContent: ['a', 'b', 'c', 'd', 'e'],
    custom: true,
  },
};

const pageSizePreference = {
  title: 'Page size',
  options: [
    { label: '20 items', value: 20 },
    { label: '50 items', value: 50 },
    { label: '100 items', value: 100 },
  ],
};

const wrapLinesPreference = {
  label: 'Wrap lines',
  description: 'Wrap lines description',
};

export default function CollectionPreferencesPage() {
  return (
    <SpaceBetween size="l">
      <h1>Collection preferences</h1>

      <label>
        No columns <CollectionPreferences {...baseProperties} pageSizePreference={pageSizePreference} />
      </label>

      <label>
        One column group{' '}
        <CollectionPreferences
          {...baseProperties}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          visibleContentPreference={{
            title: 'Select visible columns',
            options: [
              {
                label: 'Main resource properties',
                options: [
                  { id: 'a', label: 'Column A' },
                  { id: 'b', label: 'Column B' },
                  { id: 'c', label: 'Column C' },
                  { id: 'd', label: 'Column D' },
                  { id: 'e', label: 'Column E' },
                ],
              },
            ],
          }}
        />
      </label>
      <label>
        Two column groups{' '}
        <CollectionPreferences
          {...baseProperties}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          visibleContentPreference={{
            title: 'Select visible columns',
            options: [
              {
                label: 'Main resource properties',
                options: [
                  { id: 'a', label: 'Column A' },
                  { id: 'b', label: 'Column B' },
                  { id: 'c', label: 'Column C' },
                  { id: 'd', label: 'Column D' },
                  { id: 'e', label: 'Column E' },
                ],
              },
              {
                label: 'Secondary resource properties',
                options: [
                  { id: 'f', label: 'Column F' },
                  { id: 'g', label: 'Column G' },
                  { id: 'h', label: 'Column H' },
                  { id: 'i', label: 'Column I' },
                  { id: 'j', label: 'Column J' },
                ],
              },
            ],
          }}
        />
      </label>
    </SpaceBetween>
  );
}
