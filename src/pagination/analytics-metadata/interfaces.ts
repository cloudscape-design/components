// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataPaginationClick {
  action: 'click';
  detail: {
    label: string | LabelIdentifier;
    position?: string;
  };
}

export interface GeneratedAnalyticsMetadataPaginationComponent {
  name: 'awsui.Pagination';
  label: string | LabelIdentifier;
  properties: {
    openEnd: string;
    pagesCount: string;
    currentPageIndex: string;
  };
}
