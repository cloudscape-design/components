// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataTokenGroupDismiss {
  action: 'dismiss';
  detail: {
    label: LabelIdentifier;
    position?: string;
  };
}

export interface GeneratedAnalyticsMetadataTokenGroupComponent {
  name: 'awsui.TokenGroup';
  label: string;
  properties: {
    itemsCount: string;
  };
}
