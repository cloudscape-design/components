// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../interfaces';

export interface FunnelStepConfig {
  index?: number;
  optional?: boolean;
  name?: string;
  metadata?: AnalyticsMetadata;
  status?: FunnelBaseStatus;
}
export type FunnelStepProps = FunnelStepConfig & { index: number };
export type FunnelBaseStatus = 'initial' | 'started' | 'error' | 'completed';

export interface ErrorDetails {
  errorText?: string;
  scope: ErrorScope;
}
export interface ErrorScope {
  type: 'funnel' | 'funnel-step' | 'funnel-substep' | 'field';
  label?: string;
}

export type FunnelStatus = FunnelBaseStatus | 'validating' | 'validated' | 'submitted';
export type FunnelResult = 'submitted' | 'successful' | 'cancelled' | undefined;

export interface Observer {
  update: (subject: any) => void;
}
