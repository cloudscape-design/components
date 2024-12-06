// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, CollectionPreferences, SpaceBetween } from '~components';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import ScreenshotArea from '../utils/screenshot-area';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';

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

const optionListWithGroups = [
  {
    id: 'id',
    label: 'Item ID',
    alwaysVisible: true,
  },
  { id: 'name', label: 'Item name' },
  {
    id: 'prices',
    label: 'Prices',
    options: [
      {
        id: 'price-de',
        label: 'Price DE',
      },
      {
        id: 'price-pl',
        label: 'Price PL',
      },
      {
        id: 'price-uk',
        label: 'Price UK',
      },
      {
        id: 'price-fr',
        label: 'Price FR',
      },
      {
        id: 'price-it',
        label: 'Price IT',
      },
    ],
  },
  {
    id: 'attributes',
    label: 'Attributes',
    options: [
      {
        id: 'size',
        label: 'Size',
      },
      {
        id: 'weight',
        label: 'Weight',
      },
      {
        id: 'battery',
        label: 'Battery',
      },
      {
        id: 'power',
        label: 'Power',
      },
      {
        id: 'condition',
        label: 'Condition',
      },
    ],
  },
];

export default function App() {
  return (
    <ScreenshotArea>
      <h1>CollectionPreferences page with content reordering</h1>

      <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
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

        <Box>No groups and no column filter</Box>
      </SpaceBetween>

      <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
        <CollectionPreferences
          className={`cp-2`}
          {...baseProperties}
          pageSizePreference={pageSizePreference}
          wrapLinesPreference={wrapLinesPreference}
          contentDensityPreference={contentDensityPreference}
          customPreference={customPreference}
          contentDisplayPreference={{
            enableColumnFiltering: true,
            title: 'Column preferences',
            description: 'Customize the columns visibility and order.',
            options: longOptionsList,
            ...contentDisplayPreferenceI18nStrings,
          }}
        />

        <Box>No groups with column filter</Box>
      </SpaceBetween>

      <SpaceBetween size="xxs" direction="horizontal" alignItems="center">
        <CollectionPreferences
          className="cp-3"
          {...baseProperties}
          contentDisplayPreference={{
            enableColumnFiltering: true,
            title: 'Column preferences',
            description: 'Customize the columns visibility and order.',
            options: optionListWithGroups,
            ...contentDisplayPreferenceI18nStrings,
          }}
        />

        <Box>With groups with column filter</Box>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
