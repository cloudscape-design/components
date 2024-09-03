// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataSelectableItemSelect } from '../../internal/components/selectable-item/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataAutosuggestSelect = GeneratedAnalyticsMetadataSelectableItemSelect;

export interface GeneratedAnalyticsMetadataAutosuggestClearInput {
  action: 'clearInput';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataAutosuggestComponent {
  name: 'awsui.Autosuggest';
  label: string;
  properties: {
    disabled: string;
  };
}
