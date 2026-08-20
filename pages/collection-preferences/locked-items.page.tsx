// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CollectionPreferences from '~components/collection-preferences';
import { CollectionPreferencesProps } from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import ScreenshotArea from '../utils/screenshot-area';
import { baseProperties } from './shared-configs';

const options: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'size', label: 'Size' },
  { id: 'modified', label: 'Last modified' },
  { id: 'owner', label: 'Owner' },
  { id: 'status', label: 'Status' },
];

const defaultContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = options.map(o => ({
  id: o.id,
  visible: true,
}));

export default function App() {
  const [preferences1, setPreferences1] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultContentDisplay,
  });
  const [preferences2, setPreferences2] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultContentDisplay,
  });

  return (
    <ScreenshotArea>
      <h1>CollectionPreferences – locked leading items</h1>

      <h2>1 locked item (Name is always first)</h2>
      <CollectionPreferences
        className="cp-locked-1"
        {...baseProperties}
        preferences={preferences1}
        onConfirm={({ detail }) => setPreferences1(detail)}
        contentDisplayPreference={{
          title: 'Column display',
          description: 'Customize column order and visibility. The first column is locked.',
          options,
          lockedItemsCount: 1,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />

      <h2>2 locked items (Name and Type are always first)</h2>
      <CollectionPreferences
        className="cp-locked-2"
        {...baseProperties}
        preferences={preferences2}
        onConfirm={({ detail }) => setPreferences2(detail)}
        contentDisplayPreference={{
          title: 'Column display',
          description: 'Customize column order and visibility. The first two columns are locked.',
          options,
          lockedItemsCount: 2,
          enableColumnFiltering: true,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />
    </ScreenshotArea>
  );
}
