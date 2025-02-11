// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GeneratedAnalyticsMetadataExpandableSectionExpand } from '../../expandable-section/analytics-metadata/interfaces';

export interface GeneratedAnalyticsMetadataSideNavigationClick {
  action: 'click';
  detail: {
    label: string;
    position?: string;
    href?: string;
    external: string;
  };
}

export type GeneratedAnalyticsMetadataSideNavigationExpand = GeneratedAnalyticsMetadataExpandableSectionExpand;

export interface GeneratedAnalyticsMetadataSideNavigationComponent {
  name: 'awsui.SideNavigation';
  label: string;
  properties: {
    activeHref: string;
  };
}
