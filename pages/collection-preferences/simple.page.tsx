// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import CollectionPreferences from '~components/collection-preferences';

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
        <CollectionPreferences
          className={`cp-1`}
          {...baseProperties}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          contentDensityPreference={contentDensityPreference}
          visibleContentPreference={visibleContentPreference}
          stickyColumnsPreference={stickyColumnsPreference}
          customPreference={customPreference}
          contentBefore={
            <Box margin={{ bottom: 's' }}>
              <Alert type={'warning'} header={'Local storage not enabled'}>
                Go to your browser settings to enable local storage. This will persist your settings across sessions
                unless your local storage is cleared. If local storage is not enabled preferences are saved in session
                storage as a fallback.
              </Alert>
            </Box>
          }
        />
        <CollectionPreferences className={`cp-2`} {...baseProperties} customPreference={customPreference} />
        <CollectionPreferences
          className={`cp-3`}
          {...baseProperties}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          customPreference={customPreference}
        />
        <CollectionPreferences
          className="cp-4"
          {...baseProperties}
          visibleContentPreference={visibleContentPreference}
        />
      </ScreenshotArea>
    </>
  );
}
