// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { CollectionPreferencesProps } from '../interfaces';
import { GeneratedAnalyticsMetadataCollectionPreferencesComponent } from './interfaces';

import analyticsSelectors from './styles.css.js';

export const getComponentAnalyticsMetadata = (
  disabled: boolean,
  preferences: CollectionPreferencesProps['preferences'] = {}
): GeneratedAnalyticsMetadataCollectionPreferencesComponent => {
  const metadata: GeneratedAnalyticsMetadataCollectionPreferencesComponent = {
    name: 'awsui.CollectionPreferences',
    label: `.${analyticsSelectors['trigger-button']}`,
    properties: {
      disabled: `${!!disabled}`,
    },
  };
  if (preferences.pageSize) {
    metadata.properties.pageSize = `${preferences.pageSize}`;
  }
  if (preferences.wrapLines !== undefined) {
    metadata.properties.wrapLines = `${!!preferences.wrapLines}`;
  }
  if (preferences.stripedRows !== undefined) {
    metadata.properties.stripedRows = `${!!preferences.stripedRows}`;
  }
  if (preferences.contentDensity !== undefined) {
    metadata.properties.contentDensity = preferences.contentDensity;
  }
  if (preferences.visibleContent) {
    metadata.properties.visibleContentCount = `${preferences.visibleContent.length}`;
  }
  if (preferences.stickyColumns) {
    metadata.properties.stickyColumns = `${preferences.stickyColumns.first || 0}-${preferences.stickyColumns.last || 0}`;
  }
  if (preferences.contentDisplay) {
    metadata.properties.contentDisplayVisibleCount = `${preferences.contentDisplay.filter(({ visible }) => !!visible).length}`;
  }
  return metadata;
};

export const getAnalyticsInnerContextAttribute = (preference: string) =>
  getAnalyticsMetadataAttribute({
    component: {
      innerContext: {
        preference,
      },
    },
  });
