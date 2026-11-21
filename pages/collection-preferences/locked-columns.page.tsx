// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import ScreenshotArea from '../utils/screenshot-area';
import { baseProperties, pageSizePreference, wrapLinesPreference } from './shared-configs';

const optionsWithLockedColumns: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'id1', label: 'ID (locked)', locked: true },
  { id: 'id2', label: 'Name (locked)', locked: true },
  { id: 'id3', label: 'Status' },
  { id: 'id4', label: 'Created date' },
  { id: 'id5', label: 'Modified date' },
  { id: 'id6', label: 'Owner' },
];

const defaultContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = optionsWithLockedColumns.map(
  ({ id }) => ({ id, visible: true })
);

function LockedColumnsDemo() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultContentDisplay,
  });

  return (
    <CollectionPreferences
      {...baseProperties}
      pageSizePreference={pageSizePreference}
      wrapLinesPreference={wrapLinesPreference}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Customize the columns visibility and order. Locked columns always appear first.',
        options: optionsWithLockedColumns,
        ...contentDisplayPreferenceI18nStrings,
      }}
      preferences={preferences}
      onConfirm={({ detail }) => setPreferences(detail)}
    />
  );
}

const mixedOptions: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'id1', label: 'Resource ID (locked)', locked: true },
  { id: 'id2', label: 'Name (always visible)', alwaysVisible: true },
  { id: 'id3', label: 'Type' },
  { id: 'id4', label: 'Region' },
  { id: 'id5', label: 'Status' },
];

const defaultMixedContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = mixedOptions.map(({ id }) => ({
  id,
  visible: true,
}));

function MixedConstraintsDemo() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultMixedContentDisplay,
  });

  return (
    <CollectionPreferences
      {...baseProperties}
      pageSizePreference={pageSizePreference}
      wrapLinesPreference={wrapLinesPreference}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Mix of locked, alwaysVisible, and regular columns.',
        options: mixedOptions,
        ...contentDisplayPreferenceI18nStrings,
      }}
      preferences={preferences}
      onConfirm={({ detail }) => setPreferences(detail)}
    />
  );
}

const filterableOptions: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'id1', label: 'ID (locked)', locked: true },
  ...Array.from({ length: 10 }, (_, i) => ({ id: `col${i + 2}`, label: `Column ${i + 2}` })),
];

const defaultFilterableContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = filterableOptions.map(
  ({ id }) => ({ id, visible: true })
);

function FilterableWithLockedDemo() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultFilterableContentDisplay,
  });

  return (
    <CollectionPreferences
      {...baseProperties}
      pageSizePreference={pageSizePreference}
      wrapLinesPreference={wrapLinesPreference}
      contentDisplayPreference={{
        enableColumnFiltering: true,
        title: 'Column preferences',
        description: 'Locked columns remain visible even when filtering.',
        options: filterableOptions,
        ...contentDisplayPreferenceI18nStrings,
      }}
      preferences={preferences}
      onConfirm={({ detail }) => setPreferences(detail)}
    />
  );
}

export default function App() {
  return (
    <ScreenshotArea>
      <h1>CollectionPreferences — locked columns</h1>

      <h2>Locked columns (cannot be reordered or hidden)</h2>
      <LockedColumnsDemo />

      <h2>Mixed constraints (locked + alwaysVisible + regular)</h2>
      <MixedConstraintsDemo />

      <h2>Locked columns with column filtering</h2>
      <FilterableWithLockedDemo />
    </ScreenshotArea>
  );
}
