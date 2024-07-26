// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/interfaces';

export interface GeneratedAnalyticsMetadataRadioGroupSelect {
  action: 'click';
  detail: {
    label: string;
    position: string;
    value: string;
  };
}

export interface GeneratedAnalyticsMetadataRadioGroupComponent {
  name: 'awsui.RadioGroup';
  label: string | LabelIdentifier;
}
