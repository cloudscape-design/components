// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataAppLayoutToolbarOpen {
  action: 'open';
  detail: {
    label: string | LabelIdentifier;
  };
}

export interface GeneratedAnalyticsMetadataAppLayoutToolbarClose {
  action: 'close';
  detail: {
    label: string | LabelIdentifier;
  };
}

export interface GeneratedAnalyticsMetadataAppLayoutToolbarComponent {
  name: 'awsui.AppLayoutToolbar';
  label: LabelIdentifier;
}
