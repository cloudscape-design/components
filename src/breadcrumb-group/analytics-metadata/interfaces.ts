// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataBreadcrumbGroupClick {
  action: 'click';
  detail: {
    label: string;
    position: string;
    href: string;
  };
}

export interface GeneratedAnalyticsMetadataBreadcrumbGroupExpand {
  action: 'expand';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataBreadcrumbGroupCollapse {
  action: 'collapse';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataBreadcrumbGroupComponent {
  name: 'awsui.BreadcrumbGroup';
  label: string | LabelIdentifier;
}
