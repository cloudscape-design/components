// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataSelectableItemSelect {
  action: 'select';
  detail: {
    label: string | LabelIdentifier;
    position?: string;
    value?: string;
    groupLabel?: string | LabelIdentifier;
  };
}
