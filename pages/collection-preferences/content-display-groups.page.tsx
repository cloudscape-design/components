// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import SpaceBetween from '~components/space-between';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import {
  baseProperties,
  contentDisplayGroups,
  groupedContentDisplay,
  groupedContentDisplayOptions,
} from './shared-configs';

export default function ContentDisplayGroupsPage() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: groupedContentDisplay,
  });

  return (
    <SpaceBetween size="l">
      <h1>Content Display with Groups</h1>

      <CollectionPreferences
        {...baseProperties}
        preferences={preferences}
        onConfirm={({ detail }) => setPreferences(detail)}
        contentDisplayPreference={{
          title: 'Column preferences',
          description: 'Customize column visibility and order.',
          options: groupedContentDisplayOptions,
          groups: contentDisplayGroups,
          enableColumnFiltering: true,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />

      <Box variant="h2">Current preferences.contentDisplay</Box>
      <pre
        tabIndex={0}
        style={{ background: '#f4f4f4', padding: '12px', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}
      >
        {JSON.stringify(preferences.contentDisplay, null, 2)}
      </pre>
    </SpaceBetween>
  );
}
