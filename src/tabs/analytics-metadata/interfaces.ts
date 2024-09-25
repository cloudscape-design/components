// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataTabsSelect {
  action: 'select';
  detail: {
    label: string;
    id: string;
    position: string;
    originTabId: string;
  };
}

export interface GeneratedAnalyticsMetadataTabsDismiss {
  action: 'dismiss';
  detail: {
    label: string;
    id: string;
    position: string;
  };
}

export interface GeneratedAnalyticsMetadataTabsComponent {
  name: 'awsui.Tabs';
  label: string;
  properties?: {
    activeTabId: string;
    activeTabLabel: string;
    activeTabPosition: string;
    tabsCount: string;
  };
  innerContext?: {
    tabId: string;
    tabLabel: string;
    tabPosition: string;
  };
}
