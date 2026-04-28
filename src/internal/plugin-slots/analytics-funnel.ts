// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunnelMetrics } from '../analytics/interfaces';

export const stub: IFunnelMetrics = {
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

export let value: IFunnelMetrics = stub;

export function set(provider: IFunnelMetrics) {
  value = provider;
}
