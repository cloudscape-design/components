// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import BaseCollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../../common/i18n-strings';

import styles from './collection-preferences.scss';

const pageSizeOptions: ReadonlyArray<CollectionPreferencesProps.PageSizeOption> = [
  { value: 10, label: '10 instances' },
  { value: 20, label: '20 instances' },
  { value: 50, label: '50 instances' },
];

const contentDisplayOptions: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption> = [
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'role', label: 'Role' },
  { id: 'state', label: 'State' },
  { id: 'engine', label: 'Engine' },
  { id: 'region', label: 'Region' },
  { id: 'size', label: 'Size' },
  { id: 'selectsPerSecond', label: 'Selects / sec' },
];

export function CollectionPreferences({ preferences, onConfirm, ...rest }: CollectionPreferencesProps) {
  return (
    <BaseCollectionPreferences
      title="Preferences"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      preferences={preferences}
      onConfirm={onConfirm}
      classNames={{
        trigger: styles.trigger,
        modal: {
          dialog: styles['modal-dialog'],
          header: styles['modal-header'],
          overlay: styles['modal-overlay'],
          dismissButton: styles['modal-dismiss'],
        },
        confirmButton: clsx(styles.button, styles['button-confirm']),
        cancelButton: clsx(styles.button, styles['button-cancel']),
        checkbox: { control: styles.control },
        radioGroup: { radioButton: styles.control },
        toggle: { root: styles.control },
        list: { root: styles['list-root'], dragHandle: styles['list-drag-handle'] },
      }}
      pageSizePreference={{ title: 'Page size', options: pageSizeOptions }}
      wrapLinesPreference={{ label: 'Wrap lines', description: 'Wrap long text onto multiple lines.' }}
      stickyColumnsPreference={{
        firstColumns: {
          title: 'Stick first columns',
          description: 'Keep the first columns visible while scrolling.',
          options: [
            { label: 'None', value: 0 },
            { label: 'First column', value: 1 },
            { label: 'First two columns', value: 2 },
          ],
        },
        lastColumns: {
          title: 'Stick last column',
          description: 'Keep the last column visible while scrolling.',
          options: [
            { label: 'None', value: 0 },
            { label: 'Last column', value: 1 },
          ],
        },
      }}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Customize the columns visibility and order.',
        options: contentDisplayOptions,
        ...contentDisplayPreferenceI18nStrings,
      }}
      {...rest}
    />
  );
}
