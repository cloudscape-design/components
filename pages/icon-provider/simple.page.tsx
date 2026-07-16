// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Alert,
  Button,
  CollectionPreferences,
  Icon,
  IconProvider,
  SpaceBetween,
  StatusIndicator,
  TextFilter,
} from '~components';

import { SimplePage } from '../app/templates';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from '../collection-preferences/shared-configs';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

const CUSTOM_SVG = (
  <svg focusable={false}>
    <circle cx="8" cy="8" r="7" />
    <circle cx="8" cy="8" r="3.5" />
  </svg>
);

const CUSTOM_SIMPLE_SVG = (
  <svg focusable={false}>
    <circle cx="8" cy="8" r="7" />
  </svg>
);

export default function Page() {
  const [filteringText, setFilteringText] = useState('Icon test');
  return (
    <SimplePage title="Icon Provider: simple" i18n={{}} screenshotArea={{}}>
      {/* Global icon override */}
      <IconProvider
        icons={{
          close: CUSTOM_SIMPLE_SVG,
        }}
      >
        <SpaceBetween size="m">
          {/* Basic icon override */}
          <IconProvider
            icons={{
              search: CUSTOM_SVG,
            }}
          >
            <TextFilter
              filteringText={filteringText}
              filteringAriaLabel="Test filter"
              onChange={({ detail }) => setFilteringText(detail.filteringText)}
            />
          </IconProvider>

          {/* Multi-component icon override */}
          <IconProvider
            icons={{
              'status-positive': CUSTOM_SVG,
              'status-negative': CUSTOM_SVG,
            }}
          >
            <SpaceBetween size="m">
              <SpaceBetween size="s" direction="horizontal" alignItems="center">
                {/* Use close override from parent Provider */}
                <Button iconName="close">Icon test</Button>
                <StatusIndicator type="success">Icon test</StatusIndicator>
              </SpaceBetween>
              <Alert type="error" dismissible={true}>
                Icon test
              </Alert>
            </SpaceBetween>
          </IconProvider>

          {/* Icon reset */}
          <IconProvider icons={{ 'add-plus': CUSTOM_SVG, close: CUSTOM_SIMPLE_SVG }}>
            <SpaceBetween direction="vertical" size="l">
              <Icon name={'add-plus'} />
              <Icon name={'close'} />
              {/* Restore icons in the below Provider back to the built-in set */}
              <IconProvider icons={null}>
                <SpaceBetween direction="horizontal" size="s">
                  <Icon name={'add-plus'} />
                  <Icon name={'close'} />
                </SpaceBetween>
              </IconProvider>
              {/* Restore specific icons in the below Provider back to the built-in icons */}
              <IconProvider icons={{ close: null }}>
                <SpaceBetween direction="horizontal" size="s">
                  <Icon name={'add-plus'} />
                  <Icon name={'close'} />
                </SpaceBetween>
              </IconProvider>
            </SpaceBetween>
          </IconProvider>

          {/* Modal icon override */}
          <IconProvider
            icons={{
              'drag-indicator': CUSTOM_SVG,
              close: CUSTOM_SIMPLE_SVG,
            }}
          >
            <CollectionPreferences
              {...baseProperties}
              pageSizePreference={pageSizePreference}
              wrapLinesPreference={wrapLinesPreference}
              contentDensityPreference={contentDensityPreference}
              customPreference={customPreference}
              contentDisplayPreference={{
                title: 'Column preferences',
                description: 'Customize the columns visibility and order.',
                options: [
                  { id: 'id1', label: 'Item 1' },
                  { id: 'id2', label: 'Item 2' },
                  { id: 'id3', label: 'Item 3' },
                  { id: 'id4', label: 'Item 4' },
                ],
                ...contentDisplayPreferenceI18nStrings,
              }}
            />
          </IconProvider>
        </SpaceBetween>
      </IconProvider>
    </SimplePage>
  );
}
