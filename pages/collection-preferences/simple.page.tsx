// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Box, SpaceBetween } from '~components';
import CollectionPreferences from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import ScreenshotArea from '../utils/screenshot-area';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  stickyColumnsPreference,
  visibleContentPreference,
  wrapLinesPreference,
} from './shared-configs';

export default function CollectionPreferencesPermutations() {
  return (
    <>
      <h1>CollectionPreferences page for screenshot tests</h1>
      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <CollectionPreferences
            className={`cp-1`}
            {...baseProperties}
            pageSizePreference={pageSizePreference}
            wrapLinesPreference={wrapLinesPreference}
            contentDensityPreference={contentDensityPreference}
            visibleContentPreference={visibleContentPreference}
            stickyColumnsPreference={stickyColumnsPreference}
            customPreference={customPreference}
          />

          <Box>Table prefs with visible content</Box>
        </SpaceBetween>

        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <CollectionPreferences className={`cp-2`} {...baseProperties} customPreference={customPreference} />

          <Box>Custom prefs only</Box>
        </SpaceBetween>

        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <CollectionPreferences
            className={`cp-3`}
            {...baseProperties}
            pageSizePreference={pageSizePreference}
            wrapLinesPreference={wrapLinesPreference}
            customPreference={customPreference}
          />

          <Box>Single column with custom prefs</Box>
        </SpaceBetween>

        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <CollectionPreferences
            className="cp-4"
            {...baseProperties}
            visibleContentPreference={visibleContentPreference}
          />

          <Box>Single column visible content</Box>
        </SpaceBetween>

        <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
          <CollectionPreferences
            className="cp-5"
            {...baseProperties}
            contentDisplayPreference={{
              title: 'Column preferences',
              description: 'Customize the columns visibility and order.',
              options: [],
              ...contentDisplayPreferenceI18nStrings,
            }}
          />

          <Box>Single column content display with groups</Box>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
