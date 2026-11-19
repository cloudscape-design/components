// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataButtonTriggerExpand {
  action: 'expand';
  detail: {
    label: string | LabelIdentifier;
  };
}

export interface GeneratedAnalyticsMetadataButtonTriggerCollapse {
  action: 'collapse';
  detail: {
    label: string | LabelIdentifier;
  };
}
