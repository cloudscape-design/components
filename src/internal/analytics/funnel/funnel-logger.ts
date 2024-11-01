// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const eventBuffer: FunnelLogEventDetail[] = [];

export type Metadata = Record<string, string | number | boolean | undefined>;
export interface FunnelLogEventDetail {
  status: Status;
  header: string;
  details?: {
    fullContext?: string[];
    context?: string;
    message?: string;
    metadata?: Metadata;
  };
}
export type Status = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';

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

export function dispatchFunnelEvent({ status, header, details }: FunnelLogEventDetail) {
  eventBuffer.push({ status, header, details });

  if (!(window as any).__funnelLogAttached) {
    setTimeout(flushEventBuffer, 0);
    return;
  }

  flushEventBuffer();
}
