// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataTilesSelect {
  action: 'click';
  detail: {
    label: string;
    position: string;
    value: string;
  };
}

export interface GeneratedAnalyticsMetadataTilesComponent {
  name: 'awsui.Tiles';
  label: string | LabelIdentifier;
}
