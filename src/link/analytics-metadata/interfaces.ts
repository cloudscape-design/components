// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

interface GeneratedAnalyticsMetadataLinkClick {
  action: 'click';
  detail: {
    label: string | LabelIdentifier;
    href?: string;
    external: string;
  };
}

interface GeneratedAnalyticsMetadataLinkComponent {
  name: 'awsui.Link';
  label: string | LabelIdentifier;
  properties: {
    variant: string;
  };
}

export interface GeneratedAnalyticsMetadataLinkFragment extends GeneratedAnalyticsMetadataLinkClick {
  component?: GeneratedAnalyticsMetadataLinkComponent;
}
