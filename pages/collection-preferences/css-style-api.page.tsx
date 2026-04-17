// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CollectionPreferences from '~components/collection-preferences';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import {
  baseProperties,
  contentDensityPreference,
  pageSizePreference,
  visibleContentPreference,
  wrapLinesPreference,
} from './shared-configs';

import './css-style-api.css';

export default function Page() {
  return (
    <SimplePage title="CSS Style API — CollectionPreferences">
      <SpaceBetween size="l" direction="horizontal">
        <div>
          <p>Default</p>
          <CollectionPreferences
            {...baseProperties}
            pageSizePreference={pageSizePreference}
            wrapLinesPreference={wrapLinesPreference}
            contentDensityPreference={contentDensityPreference}
            visibleContentPreference={visibleContentPreference}
          />
        </div>
        <div>
          <p>Custom styled</p>
          <CollectionPreferences
            {...baseProperties}
            className="custom-collection-preferences"
            pageSizePreference={pageSizePreference}
            wrapLinesPreference={wrapLinesPreference}
            contentDensityPreference={contentDensityPreference}
            visibleContentPreference={visibleContentPreference}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
