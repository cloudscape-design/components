// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Checkbox from '~components/checkbox';

const baseProperties: CollectionPreferencesProps<boolean> = {
  title: 'Preferences',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: () => {},

  preferences: {
    wrapLines: true,
    pageSize: 10,
    visibleContent: ['id', 'sslCertificate', 'origin'],
    custom: true,
  },
};

const pageSizePreference: CollectionPreferencesProps.PageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
  ],
};

const wrapLinesPreference: CollectionPreferencesProps.WrapLinesPreference = {
  label: 'Wrap lines',
  description: 'Wrap lines description',
};

const contentDensityPreference: CollectionPreferencesProps.ContentDensityPreference = {
  label: 'Compact mode',
  description: 'Content density description',
};

const visibleContentPreference: CollectionPreferencesProps.VisibleContentPreference = {
  title: 'Content Selection',
  options: [
    {
      label: 'Main distribution properties',
      options: [
        { id: 'id', label: 'Distribution ID', editable: false },
        { id: 'a', label: 'Some column' },
        { id: 'b', label: 'Different column' },
        { id: 'c', label: 'Column C' },
        { id: 'd', label: 'Column D' },
        { id: 'e', label: 'Something else' },
        { id: 'f', label: 'A column' },
        { id: 'g', label: 'Property G' },
        { id: 'h', label: 'Column H' },
        { id: 'i', label: 'Another property' },
        { id: 'j', label: 'State' },
        { id: 'k', label: 'Visibility' },
        { id: 'l', label: 'Column L' },
        { id: 'a2', label: 'Some column' },
        { id: 'b2', label: 'Different column' },
        { id: 'c2', label: 'Another column C' },
        { id: 'd2', label: 'Another column D' },
        { id: 'e2', label: 'Something else' },
        { id: 'f2', label: 'A column' },
      ],
    },
  ],
};

const customPreference = (customState: boolean) => (
  <Checkbox checked={customState} onChange={() => {}}>
    View as
  </Checkbox>
);

export default function CollectionPreferencesPermutations() {
  return (
    <>
      <h1>CollectionPreferences page for new features</h1>
      <ScreenshotArea disableAnimations={true}>
        <ul>
          <li>
            With sticky footer (vertical scroll):
            <CollectionPreferences
              {...baseProperties}
              stickyModalFooter={true}
              pageSizePreference={pageSizePreference}
              wrapLinesPreference={wrapLinesPreference}
              contentDensityPreference={contentDensityPreference}
              visibleContentPreference={visibleContentPreference}
              customPreference={customPreference}
            />
          </li>
          <li>
            With multiple columns:
            <CollectionPreferences
              {...baseProperties}
              multiColumnVisibleContent={true}
              pageSizePreference={pageSizePreference}
              wrapLinesPreference={wrapLinesPreference}
              contentDensityPreference={contentDensityPreference}
              visibleContentPreference={visibleContentPreference}
              customPreference={customPreference}
            />
          </li>
        </ul>
      </ScreenshotArea>
    </>
  );
}
