// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
