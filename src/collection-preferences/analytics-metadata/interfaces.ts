// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataCollectionPreferencesOpen {
  action: 'open';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataCollectionPreferencesDismiss {
  action: 'dismiss';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataCollectionPreferencesConfirm {
  action: 'confirm';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataCollectionPreferencesCancel {
  action: 'cancel';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataCollectionPreferencesComponent {
  name: 'awsui.CollectionPreferences';
  label: string;
  properties: {
    disabled: string;
    pageSize?: string;
    wrapLines?: string;
    stripedRows?: string;
    contentDensity?: string;
    visibleContentCount?: string;
    stickyColumnsFirst?: string;
    stickyColumnsLast?: string;
    contentDisplayVisibleCount?: string;
  };
  innerContext?: {
    preference: string;
  };
}
