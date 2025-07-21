// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataCheckboxSelect {
  action: 'select';
  detail: {
    label: string;
  };
}
export interface GeneratedAnalyticsMetadataCheckboxDeselect {
  action: 'deselect';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataCheckboxComponent {
  name: 'awsui.Checkbox';
  label: string | LabelIdentifier;
  properties: {
    checked: string;
  };
}
