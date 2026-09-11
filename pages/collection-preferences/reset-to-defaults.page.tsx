// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

import ScreenshotArea from '../utils/screenshot-area';
import { contentDensityPreference, pageSizePreference, wrapLinesPreference } from './shared-configs';

const defaultPreferences: CollectionPreferencesProps.Preferences = {
  pageSize: 10,
  wrapLines: false,
  contentDensity: 'comfortable',
};

const resetToDefaults: CollectionPreferencesProps.ResetToDefaults = {
  label: 'Reset to defaults',
  preferences: defaultPreferences,
};

export default function CollectionPreferencesResetToDefaults() {
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    pageSize: 50,
    wrapLines: true,
    contentDensity: 'compact',
  });
  const [lastReset, setLastReset] = React.useState<CollectionPreferencesProps.Preferences | null>(null);

  return (
    <>
      <h1>CollectionPreferences with reset to defaults</h1>
      <ScreenshotArea disableAnimations={true}>
        <Box margin={{ bottom: 's' }}>
          Current preferences: <span id="current-preferences">{JSON.stringify(preferences)}</span>
        </Box>
        <Box margin={{ bottom: 's' }}>
          Last reset detail: <span id="last-reset">{lastReset ? JSON.stringify(lastReset) : 'none'}</span>
        </Box>
        <CollectionPreferences
          className="cp-reset"
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          preferences={preferences}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          contentDensityPreference={contentDensityPreference}
          resetToDefaults={resetToDefaults}
          onReset={({ detail }) => setLastReset(detail)}
          onConfirm={({ detail }) => setPreferences(detail)}
        />
      </ScreenshotArea>
    </>
  );
}
