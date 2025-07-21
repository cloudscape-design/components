// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataToggleSelect {
  action: 'select';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataToggleDeselect {
  action: 'deselect';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataToggleComponent {
  name: 'awsui.Toggle';
  label: string | LabelIdentifier;
  properties: {
    checked: string;
  };
}
