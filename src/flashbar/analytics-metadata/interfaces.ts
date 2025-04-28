// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataFlashbarDismiss {
  action: 'dismiss';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataFlashbarButtonClick {
  action: 'buttonClick';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataFlashbarExpand {
  action: 'expand';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataFlashbarCollapse {
  action: 'collapse';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataFlashbarComponent {
  name: 'awsui.Flashbar';
  label: LabelIdentifier;
  properties: {
    itemsCount: string;
    stackItems: string;
    expanded?: string;
  };
  innerContext?: {
    itemPosition: string;
    itemLabel: string;
    itemType: string;
    itemId?: string;
  };
}
