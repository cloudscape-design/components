// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

const shortOptionsList: ReadonlyArray<CollectionPreferencesProps.VisibleContentOptionsGroup> = [
  {
    label: 'Main properties',
    options: [
      {
        id: 'id1',
        label: 'Item 1',
        editable: false,
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
        label: 'Item 6',
      },
    ],
  },
];

const longOptionsList: ReadonlyArray<CollectionPreferencesProps.VisibleContentOptionsGroup> = [
  {
    label: 'Main properties',
    options: new Array(50).fill(1).map((item, index) => ({ id: `id_${index}`, label: `Item ${index}` })),
  },
];

export default function App() {
  return (
    <ScreenshotArea>
      <h1>CollectionPreferences page with content reordering</h1>
      <CollectionPreferences
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        reorderContent={true}
        visibleContentPreference={{
          title: 'Select visible columns',
          options: shortOptionsList,
          i18nStrings: {
            liveAnnouncementDndStarted: 'Dragging',
            liveAnnouncementDndDiscarded: 'Reordering canceled',
            liveAnnouncementDndItemReordered: i => `Item moved to position ${i}`,
          },
        }}
      />
      <CollectionPreferences
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        reorderContent={true}
        visibleContentPreference={{
          title: 'Select visible columns',
          options: longOptionsList,
          i18nStrings: {
            liveAnnouncementDndStarted: 'Dragging',
            liveAnnouncementDndDiscarded: 'Reordering canceled',
            liveAnnouncementDndItemReordered: i => `Item moved to position ${i}`,
          },
        }}
      />
    </ScreenshotArea>
  );
}
