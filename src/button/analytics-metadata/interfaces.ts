// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface GeneratedAnalyticsMetadataButtonClick {
  action: 'click';
  detail: {
    label: string;
  };
}

interface GeneratedAnalyticsMetadataButtonComponent {
  name: 'awsui.Button';
  label: string;
  properties: {
    variant: string;
    disabled: string;
  };
}

export interface GeneratedAnalyticsMetadataButtonFragment extends Partial<GeneratedAnalyticsMetadataButtonClick> {
  component?: GeneratedAnalyticsMetadataButtonComponent;
}
