// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../interfaces';

export type FunnelType = 'single-page' | 'multi-page' | 'modal';
export interface FunnelStepConfig {
  index?: number;
  optional?: boolean;
  name?: string;
  metadata?: AnalyticsMetadata;
  status?: FunnelStepStatus;
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

export interface InteractionScope {
  componentName: string;
  metadata: Record<string, string | boolean | number>;
}

export type FunnelStepStatus = FunnelBaseStatus | 'validating';
export type FunnelStatus = FunnelBaseStatus | 'validating' | 'validated' | 'submitted';
export type FunnelResult = 'submitted' | 'successful' | 'cancelled' | undefined;

export interface Observer {
  update: (subject: any) => void;
}

export type CallbackFunction = () => void;
