// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataInputClearInput } from '../../input/analytics-metadata/interfaces';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from '../../internal/components/selectable-item/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataAutosuggestSelect = GeneratedAnalyticsMetadataSelectableItemSelect;

export type GeneratedAnalyticsMetadataAutosuggestClearInput = GeneratedAnalyticsMetadataInputClearInput;

export interface GeneratedAnalyticsMetadataAutosuggestComponent {
  name: 'awsui.Autosuggest';
  label: string;
  properties: {
    disabled: string;
  };
}
