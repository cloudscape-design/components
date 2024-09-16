// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* istanbul ignore file */

import { IFunnelMetrics, IPerformanceMetrics } from './interfaces';

export function setFunnelMetrics(funnelMetrics: IFunnelMetrics) {
  FunnelMetrics = funnelMetrics;
}
export function setPerformanceMetrics(performanceMetrics: IPerformanceMetrics) {
  PerformanceMetrics = performanceMetrics;
}

/**
 * This is a stub implementation of the FunnelMetrics interface and will be replaced during
 * build time with the actual implementation.
 */
export let FunnelMetrics: IFunnelMetrics = {
  funnelStart(): string {
    return '';
  },

  funnelError(): void {},
  funnelComplete(): void {},
  funnelSuccessful(): void {},
  funnelCancelled(): void {},
  funnelChange(): void {},
  funnelStepStart(): void {},
  funnelStepComplete(): void {},
  funnelStepNavigation(): void {},
  funnelStepError(): void {},
  funnelStepChange(): void {},
  funnelSubStepStart(): void {},
  funnelSubStepComplete(): void {},
  funnelSubStepError(): void {},
  helpPanelInteracted(): void {},
  externalLinkInteracted(): void {},
};

/**
 * This is a stub implementation of the PerformanceMetrics interface and will be replaced during
 * build time with the actual implementation.
 */
export let PerformanceMetrics: IPerformanceMetrics = {
  tableInteraction(): void {},
  taskCompletionData(): void {},
};
