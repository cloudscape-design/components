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

const visibleContentOptions: ReadonlyArray<CollectionPreferencesProps.VisibleContentOptionsGroup> = [
  {
    label: 'Instance properties',
    options: [
      {
        id: 'id',
        label: 'ID',
        editable: false,
      },
      { id: 'type', label: 'Type' },
      {
        id: 'dnsName',
        label: 'DNS name',
      },
      {
        id: 'imageId',
        label: 'Image ID',
      },
      {
        id: 'longText',
        label: 'Long text long text long text long text long text long text long text long text long text long text',
      },
      {
        id: 'state',
        label: 'State',
      },
    ],
  },
];

export default function App() {
  return (
    <ScreenshotArea>
      <CollectionPreferences
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        reorderContent={true}
        visibleContentPreference={{
          title: 'Select visible columns',
          options: visibleContentOptions,
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
