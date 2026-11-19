// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

export interface GeneratedAnalyticsMetadataTokenListShowMore {
  action: 'showMore';
  detail: {
    label: string | LabelIdentifier;
  };
}

export interface GeneratedAnalyticsMetadataTokenListShowLess {
  action: 'showLess';
  detail: {
    label: string | LabelIdentifier;
  };
}
