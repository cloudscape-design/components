// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import {
  GeneratedAnalyticsMetadataTokenListShowLess,
  GeneratedAnalyticsMetadataTokenListShowMore,
} from '../../internal/components/token-list/analytics-metadata/interfaces';

export interface GeneratedAnalyticsMetadataTokenGroupDismiss {
  action: 'dismiss';
  detail: {
    label: LabelIdentifier;
    position?: string;
  };
}

export type GeneratedAnalyticsMetadataTokenGroupShowMore = GeneratedAnalyticsMetadataTokenListShowMore;
export type GeneratedAnalyticsMetadataTokenGroupShowLess = GeneratedAnalyticsMetadataTokenListShowLess;

export interface GeneratedAnalyticsMetadataTokenGroupComponent {
  name: 'awsui.TokenGroup';
  label: string;
  properties: {
    itemsCount: string;
  };
}
