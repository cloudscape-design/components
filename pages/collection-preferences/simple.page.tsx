// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';

const visibleContentPreference: CollectionPreferencesProps.VisibleContentPreference = {
  title: 'Content Selection',
  options: [
    {
      label: 'Main distribution properties',
      options: [
        { id: 'id', label: 'Distribution ID', editable: false },
        {
          id: 'domainName',
          label:
            'Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name Domain name',
        },
      ],
    },
    {
      label: 'Secondary distribution properties',
      options: [
        {
          id: 'deliveryMethod',
          label: 'Deliverymethod',
          editable: true,
        },
        { id: 'priceClass', label: 'Price class', editable: false },
        { id: 'sslCertificate', label: 'SSL certificate' },
        {
          id: 'origin',
          label:
            'OriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOriginOrigin',
        },
      ],
    },
  ],
};

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
