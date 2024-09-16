// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataAlertDismiss {
  action: 'dismiss';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataAlertButtonClick {
  action: 'buttonClick';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataAlertComponent {
  name: 'awsui.Alert';
  label: string;
  properties: {
    type: string;
  };
}
