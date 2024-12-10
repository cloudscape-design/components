// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataSideNavigationClick {
  action: 'click';
  detail: {
    label: string;
    position?: string;
    href?: string;
    external: string;
  };
}

export interface GeneratedAnalyticsMetadataSideNavigationComponent {
  name: 'awsui.SideNavigation';
  label: string;
  properties: {
    activeHref: string;
  };
}
