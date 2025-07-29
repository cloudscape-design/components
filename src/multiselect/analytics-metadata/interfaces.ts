// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  GeneratedAnalyticsMetadataButtonTriggerCollapse,
  GeneratedAnalyticsMetadataButtonTriggerExpand,
} from '../../internal/components/button-trigger/analytics-metadata/interfaces';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from '../../internal/components/selectable-item/analytics-metadata/interfaces';
import {
  GeneratedAnalyticsMetadataTokenListShowLess,
  GeneratedAnalyticsMetadataTokenListShowMore,
} from '../../internal/components/token-list/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataMultiselectSelect = GeneratedAnalyticsMetadataSelectableItemSelect;

export type GeneratedAnalyticsMetadataMultiselectExpand = GeneratedAnalyticsMetadataButtonTriggerExpand;
export type GeneratedAnalyticsMetadataMultiselectCollapse = GeneratedAnalyticsMetadataButtonTriggerCollapse;

export type GeneratedAnalyticsMetadataMultiselectShowMore = GeneratedAnalyticsMetadataTokenListShowMore;
export type GeneratedAnalyticsMetadataMultiselectShowLess = GeneratedAnalyticsMetadataTokenListShowLess;

export interface GeneratedAnalyticsMetadataMultiselectComponent {
  name: 'awsui.Multiselect';
  label: string;
  properties: {
    disabled: string;
    selectedOptionsCount: string;
    selectedOptionsValues: Array<string>;
  };
}
