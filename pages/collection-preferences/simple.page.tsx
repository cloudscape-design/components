// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import CollectionPreferences from '~components/collection-preferences';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
  visibleContentPreference,
  stickyColumnsPreference,
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
