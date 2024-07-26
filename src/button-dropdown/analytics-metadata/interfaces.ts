// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataButtonDropdownClick {
  action: 'click';
  detail: {
    label: string;
    position?: string;
    id?: string;
  };
}

export interface GeneratedAnalyticsMetadataButtonDropdownExpand {
  action: 'expand';
  detail: {
    label: string;
    expanded: string;
    position?: string;
    id?: string;
  };
}

export interface GeneratedAnalyticsMetadataButtonDropdownComponent {
  name: 'awsui.ButtonDropdown';
  label: string;
  properties: {
    variant: string;
    disabled: string;
  };
}
