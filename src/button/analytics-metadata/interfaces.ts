// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

interface GeneratedAnalyticsMetadataButtonClick {
  action: 'click';
  detail: {
    label: string | LabelIdentifier;
  };
}

interface GeneratedAnalyticsMetadataButtonComponent {
  name: 'awsui.Button';
  label: string | LabelIdentifier;
  properties: {
    variant: string;
    disabled: string;
  };
}

export interface GeneratedAnalyticsMetadataButtonFragment extends Partial<GeneratedAnalyticsMetadataButtonClick> {
  component?: GeneratedAnalyticsMetadataButtonComponent;
}
