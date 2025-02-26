// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataButtonTriggerExpand } from '../../internal/components/button-trigger/analytics-metadata/interfaces';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from '../../internal/components/selectable-item/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataSelectSelect = GeneratedAnalyticsMetadataSelectableItemSelect;

export type GeneratedAnalyticsMetadataSelectExpand = GeneratedAnalyticsMetadataButtonTriggerExpand;

export interface GeneratedAnalyticsMetadataSelectComponent {
  name: 'awsui.Select';
  label: string;
  properties: {
    disabled: string;
  };
}
