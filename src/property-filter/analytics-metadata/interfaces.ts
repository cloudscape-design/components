// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataButtonTriggerExpand } from '../../internal/components/button-trigger/analytics-metadata/interfaces';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from '../../internal/components/selectable-item/analytics-metadata/interfaces';
import { GeneratedAnalyticsMetadataTokenListShowMore } from '../../internal/components/token-list/analytics-metadata/interfaces';

export interface GeneratedAnalyticsMetadataPropertyFilterClearFilters {
  action: 'clearFilters';
  detail: {
    label: string;
  };
}

export type GeneratedAnalyticsMetadataPropertyFilterSelect = GeneratedAnalyticsMetadataSelectableItemSelect;

export interface GeneratedAnalyticsMetadataPropertyFilterExpand extends GeneratedAnalyticsMetadataButtonTriggerExpand {
  tokenLabel: string;
  tokenPosition: string;
}

interface TokenAction {
  detail: {
    tokenLabel: string;
    tokenPosition: string;
    label?: string;
  };
}
export interface GeneratedAnalyticsMetadataPropertyFilterDismiss extends TokenAction {
  action: 'dismiss';
}

export interface GeneratedAnalyticsMetadataPropertyEditStart extends TokenAction {
  action: 'editStart';
}

export interface GeneratedAnalyticsMetadataPropertyEditClose extends TokenAction {
  action: 'editClose';
}

export interface GeneratedAnalyticsMetadataPropertyEditCancel extends TokenAction {
  action: 'editCancel';
}

export interface GeneratedAnalyticsMetadataPropertyEditConfirm extends TokenAction {
  action: 'editConfirm';
}

export type GeneratedAnalyticsMetadataPropertyShowMore = GeneratedAnalyticsMetadataTokenListShowMore;

export interface GeneratedAnalyticsMetadataPropertyFilterComponent {
  name: 'awsui.PropertyFilter';
  label: string;
  properties: {
    disabled: string;
    queryTokensCount: string;
  };
}
