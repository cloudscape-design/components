// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataCardsSelect {
  action: 'select';
  detail: {
    label?: string | LabelIdentifier;
    position: string;
    item: string;
  };
}

export interface GeneratedAnalyticsMetadataCardsDeselect {
  action: 'deselect';
  detail: {
    label?: string | LabelIdentifier;
    position: string;
    item: string;
  };
}

export interface GeneratedAnalyticsMetadataCardsComponent {
  name: 'awsui.Cards';
  label: string;
  properties: {
    selectionType: string;
    itemsCount: string;
    selectedItemsCount: string;
    variant: string;
  };
  innerContext?: {
    position: string;
    item: string;
  };
}
