// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataPaginationClick {
  action: 'click';
  detail: {
    label: string;
    position?: string;
  };
}

export interface GeneratedAnalyticsMetadataPaginationComponent {
  name: 'awsui.Pagination';
  label: string;
  properties: {
    openEnd: string;
    pagesCount: string;
    currentPageIndex: string;
  };
}
