// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import CollectionPreferences, { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import createWrapper from '../../../lib/components/test-utils/dom';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';

export function renderCollectionPreferences(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  render(<CollectionPreferences title="Preferences title" confirmLabel="Confirm" cancelLabel="Cancel" {...props} />);
  return createWrapper().findCollectionPreferences()!;
}

export const visibleContentPreference: CollectionPreferencesProps.VisibleContentPreference = {
  title: 'Content selection title',
  options: [
    {
      label: 'Group label one',
      options: [
        { id: 'id', label: 'Distribution ID', editable: false },
        { id: 'domainName', label: 'Domain name' },
      ],
    },
    {
      label: 'Group label two',
      options: [
        { id: 'priceClass', label: 'Price class' },
        { id: 'origin', label: 'Origin' },
        { id: 'status', label: 'Status' },
        { id: 'state', label: 'State' },
        { id: 'logging', label: 'Logging' },
      ],
    },
  ],
};

export const pageSizePreference: CollectionPreferencesProps.PageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 items' },
    { value: 20, label: '20 items' },
    { value: 50, label: '50 items' },
  ],
};

export const wrapLinesPreference: CollectionPreferencesProps.WrapLinesPreference = {
  label: 'Wrap lines label',
  description: 'Wrap lines description',
};

export const stripedRowsPreference: CollectionPreferencesProps.StripedRowsPreference = {
  label: 'Striped rows label',
  description: 'Striped rows description',
};

export const contentDensityPreference: CollectionPreferencesProps.ContentDensityPreference = {
  label: 'Compact mode',
  description: 'Display the content in a denser, more compact mode',
};

export const contentDisplayPreference: CollectionPreferencesProps.ContentDisplayPreference = {
  title: 'Content display title',
  label: 'Content display label',
  options: [
    { id: 'id1', label: 'Item 1', alwaysVisible: true },
    { id: 'id2', label: 'Item 2' },
    { id: 'id3', label: 'Item 3' },
    { id: 'id4', label: 'Item 4' },
  ],
  dragHandleAriaLabel: 'Drag handle',
};
