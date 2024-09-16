// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataFragment } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { GeneratedAnalyticsMetadataFlashbarComponent } from './interfaces';

import analyticsSelectors from './styles.css.js';

export const getComponentsAnalyticsMetadata = (
  itemsCount: number,
  stackItems: boolean,
  expanded?: boolean
): { component: GeneratedAnalyticsMetadataFlashbarComponent } => {
  const metadata: { component: GeneratedAnalyticsMetadataFlashbarComponent } = {
    component: {
      name: 'awsui.Flashbar',
      label: stackItems ? { root: 'self', selector: 'ul' } : { root: 'self' },
      properties: {
        itemsCount: `${itemsCount}`,
        stackItems: `${stackItems}`,
      },
    },
  };

  if (expanded !== undefined) {
    metadata.component.properties.expanded = `${expanded}`;
  }
  return metadata;
};

export const getItemAnalyticsMetadata = (
  position: number,
  type: string,
  id?: string
): GeneratedAnalyticsMetadataFragment => {
  const baseMetadata: GeneratedAnalyticsMetadataFlashbarComponent['innerContext'] = {
    itemLabel: `.${analyticsSelectors['flash-header']}`,
    itemPosition: `${position}`,
    itemType: type,
  };
  if (id) {
    baseMetadata.itemId = id;
  }
  return {
    component: { innerContext: baseMetadata },
  };
};
