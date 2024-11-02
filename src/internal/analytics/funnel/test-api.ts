// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export interface FunnelTestEvent {
  action: string;
  status: string;
  header: string;
  timestamp: number;
  details?: {
    fullContext?: string[];
    context?: string;
    message?: string;
    metadata?: Record<string, string | number | boolean | undefined>;
  };
}

export interface FunnelTestAPI {
  events: FunnelTestEvent[];
  getEventsByAction: (action: string) => FunnelTestEvent[];
  getLastEvent: () => FunnelTestEvent | undefined;
  clear: () => void;
}
