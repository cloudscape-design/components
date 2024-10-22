// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  GeneratedAnalyticsMetadataFragment,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { WizardProps } from '../interfaces';

export const getNavigationActionDetail = (
  targetStepIndex: number,
  reason: WizardProps.NavigationReason,
  addAction = false,
  label?: string
) => {
  const metadata: GeneratedAnalyticsMetadataFragment = { detail: { targetStepIndex: `${targetStepIndex}`, reason } };
  if (addAction) {
    metadata.action = 'navigate';
  }
  if (label) {
    metadata.detail!.label = label;
  }
  return getAnalyticsMetadataAttribute(metadata);
};
