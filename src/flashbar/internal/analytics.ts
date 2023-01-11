// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Metrics } from '../../internal/metrics';
import { FlashbarProps } from '../interfaces';
import { getFlashTypeCount } from '../utils';

const eventContext = 'csa_flashbar';

export const sendRenderMetric = (items: FlashbarProps['items']) => {
  const countByType = getFlashTypeCount(items);

  Metrics.sendPanoramaMetric({
    eventContext,
    eventType: 'render',
    eventValue: items.length.toString(),
    eventDetail: countByType,
  });
};

export const sendToggleMetric = (itemsCount: number, expanded: boolean) => {
  Metrics.sendPanoramaMetric({
    eventContext,
    eventType: expanded ? 'expand' : 'collapse',
    eventValue: itemsCount.toString(),
  });
};

export const sendDismissMetric = (itemType: string) => {
  Metrics.sendPanoramaMetric({
    eventContext,
    eventType: 'dismiss',
    eventValue: itemType,
  });
};
