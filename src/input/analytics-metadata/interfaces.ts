// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface GeneratedAnalyticsMetadataInputClearInput {
  action: 'clearInput';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataInputComponent {
  name: 'awsui.Input';
  label: string;
  properties: {
    value: string;
  };
}
