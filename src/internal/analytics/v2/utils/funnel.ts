// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { funnelCache } from '../cache';
import { Funnel } from '../funnel';
import { FunnelSubStepConfig } from '../interfaces';
import { getParentFunnelElement, getParentSubStepElement } from './browser';

export function getSubstepConfig(element: HTMLElement): FunnelSubStepConfig | undefined {
  const substepEl = getParentSubStepElement(element);
  if (!substepEl) {
    return undefined;
  }

  return substepEl.__analytics__ as FunnelSubStepConfig;
}

export function getFunnel(element: HTMLElement): Funnel | undefined {
  const funnelEl = getParentFunnelElement(element);
  if (!funnelEl) {
    return undefined;
  }

  return funnelCache.get(funnelEl) as Funnel;
}
