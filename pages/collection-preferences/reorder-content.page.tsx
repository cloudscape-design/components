// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import CollectionPreferences from '~components/collection-preferences';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

const shortOptionsList = [
  {
    id: 'id1',
    label: 'Item 1',
  },
  { id: 'id2', label: 'Item 2' },
  {
    id: 'id3',
    label: 'Item 3',
  },
  {
    id: 'id4',
    label: 'Item 4',
  },
  {
    id: 'id5',
    label:
      'Item with long text to make sure that the reordering feature behaves as expected and that the placeholder behind always has the same size as the item being dragged',
  },
  {
    id: 'id6',
    label: 'ExtremelyLongLabelTextWithoutSpacesToVerifyThatItWrapsToTheNextLine',
  },
];

const longOptionsList = Array(50)
  .fill(1)
  .map((item, index) => ({ id: `id_${index}`, label: `Item ${index + 1}` }));

export default function App() {
  return (
    <ScreenshotArea>
      <h1>CollectionPreferences page with content reordering</h1>
      <CollectionPreferences
        className={`cp-1`}
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        contentDisplayPreference={{
          title: 'Column preferences',
          description: 'Customize the columns visibility and order.',
          options: shortOptionsList,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />
      <CollectionPreferences
        className={`cp-2`}
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        contentDisplayPreference={{
          title: 'Column preferences',
          description: 'Customize the columns visibility and order.',
          options: longOptionsList,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />
    </ScreenshotArea>
  );
}
