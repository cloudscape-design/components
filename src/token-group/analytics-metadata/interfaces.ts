// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  GeneratedAnalyticsMetadataTokenListShowLess,
  GeneratedAnalyticsMetadataTokenListShowMore,
} from '../../internal/components/token-list/analytics-metadata/interfaces';

export type GeneratedAnalyticsMetadataTokenGroupShowMore = GeneratedAnalyticsMetadataTokenListShowMore;
export type GeneratedAnalyticsMetadataTokenGroupShowLess = GeneratedAnalyticsMetadataTokenListShowLess;

export interface GeneratedAnalyticsMetadataTokenGroupComponent {
  name: 'awsui.TokenGroup';
  label: string;
  properties: {
    itemsCount: string;
  };
}
