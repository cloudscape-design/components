// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const eventBuffer: FunnelLogEventDetail[] = [];

export type Action =
  | 'funnel-started'
  | 'funnel-completed'
  | 'funnel-submitted'
  | 'funnel-completed'
  | 'funnel-validating'
  | 'funnel-validated'
  | 'funnel-interaction'
  | 'funnel-configuration-changed'
  | 'funnel-step-navigation'
  | 'funnel-step-started'
  | 'funnel-step-completed'
  | 'funnel-step-configuration-changed'
  | 'funnel-step-error'
  | 'funnel-step-error-cleared'
  | 'funnel-step-validating'
  | 'funnel-substep-started'
  | 'funnel-substep-completed'
  | 'funnel-substep-error'
  | 'funnel-substep-error-cleared';

export type Status = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';
export type Metadata = Record<string, string | number | boolean | undefined>;
export interface FunnelLogEventDetail {
  action: Action;
  status: Status;
  header: string;
  details?: {
    fullContext?: string[];
    context?: string;
    message?: string;
    metadata?: Metadata;
  };
}

function flushEventBuffer() {
  while (eventBuffer.length > 0) {
    const logEventDetails = eventBuffer.shift();
    document.dispatchEvent(
      new CustomEvent('log-funnel-event', {
        detail: logEventDetails,
      })
    );
  }
}

export function dispatchFunnelEvent({ action, status, header, details }: FunnelLogEventDetail) {
  eventBuffer.push({ action, status, header, details });

  if (!(window as any).__funnelLogAttached) {
    setTimeout(flushEventBuffer, 0);
    return;
  }

  flushEventBuffer();
}
