// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { metrics } from '../../internal/analytics/metrics';
import { FlashbarProps } from '../interfaces';
import { getFlashTypeCount } from '../utils';

const eventContext = 'csa_flashbar';

export const sendRenderMetric = (items: FlashbarProps['items']) => {
  const countByType = getFlashTypeCount(items);

  metrics.sendPanoramaMetric({
    eventContext,
    eventType: 'render',
    eventValue: items.length.toString(),
    eventDetail: countByType,
  });
};

export const sendToggleMetric = (itemsCount: number, expanded: boolean) => {
  metrics.sendPanoramaMetric({
    eventContext,
    eventType: expanded ? 'expand' : 'collapse',
    eventValue: itemsCount.toString(),
  });
};

export const sendDismissMetric = (itemType: string) => {
  metrics.sendPanoramaMetric({
    eventContext,
    eventType: 'dismiss',
    eventValue: itemType,
  });
};
