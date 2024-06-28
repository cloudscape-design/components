// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';
import { AutoCaptureMetadata } from '../internal/analytics/autocapture/interfaces';
import { LinkProps } from './interfaces';

export const getLinkAnalyticsMetadataAttribute = ({ href, external, variant }: LinkProps) => {
  const autocaptureAnalyticsAtrributes: AutoCaptureMetadata = {
    action: 'click',
    detail: {
      label: '&',
    },
    component: {
      name: 'Link',
      label: '&',
      properties: { external: external ? `${external}` : 'false', variant: variant || 'secondary' },
    },
  };
  if (href && autocaptureAnalyticsAtrributes.detail) {
    autocaptureAnalyticsAtrributes.detail.href = href;
  }

  return getAnalyticsMetadataAttribute(autocaptureAnalyticsAtrributes);
};
