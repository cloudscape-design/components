// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataPropertyFilterClearFilters {
  action: 'clearFilters';
  detail: {
    label: string;
  };
}

interface TokenAction {
  detail: {
    tokenLabel: string;
    tokenPosition: string;
    label?: string;
  };
}

export interface GeneratedAnalyticsMetadataPropertyEditStart extends TokenAction {
  action: 'editStart';
}

export interface GeneratedAnalyticsMetadataPropertyEditCancel extends TokenAction {
  action: 'editCancel';
}

export interface GeneratedAnalyticsMetadataPropertyEditConfirm extends TokenAction {
  action: 'editConfirm';
}

export interface GeneratedAnalyticsMetadataPropertyFilterComponent {
  name: 'awsui.PropertyFilter';
  label: string;
  properties: {
    disabled: string;
    queryTokensCount: string;
  };
}
