// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../../interfaces';

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
  context: ErrorContext;
  source: ErrorSource;
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

// Analytics plugin interface to allow different implementations
export interface AnalyticsPlugin {
  track(event: FunnelEvent): void;
}

// Base event interface
export interface FunnelEvent {
  name: FunnelEventName;
  metadata: FunnelMetadata | StepMetadata | SubstepMetadata;
  context: FunnelContext;
  details?: FunnelEventDetails;
}

export type FunnelEventName =
  | 'funnel:start'
  | 'funnel:complete'
  | 'funnel:error'
  | 'funnel:error-cleared'
  | 'funnel:validating'
  | 'funnel:navigation'
  | 'funnel:validated'
  | 'funnel:configuration-changed'
  | 'funnel:submitted'
  | 'funnel:interaction'
  | 'funnel:step:start'
  | 'funnel:step:complete'
  | 'funnel:step:error'
  | 'funnel:step:error-cleared'
  | 'funnel:step:validating'
  | 'funnel:step:configuration-changed'
  | 'funnel:substep:start'
  | 'funnel:substep:complete'
  | 'funnel:substep:error'
  | 'funnel:substep:error-cleared';

export type FlowType = 'create' | 'edit' | 'delete' | 'home' | 'dashboard' | 'view-resource';

export interface FunnelMetadata {
  funnelId: string;
  funnelName?: string;
  funnelResult?: string;

  flowType?: FlowType;
  resourceType?: string;
  instanceIdentifier?: string;

  funnelType?: FunnelType;
  totalSteps?: number;
  optionalStepNumbers?: number[];

  componentVersion?: string;
  componentTheme?: string;

  stepConfiguration?: Array<{
    number: number;
    name: string;
    isOptional: boolean;
    stepIdentifier?: string;
  }>;

  errorContext?: string;
}

export interface StepMetadata extends Pick<FunnelMetadata, 'instanceIdentifier'> {
  index: number;
  name: string;
  isOptional: boolean;
  totalSubsteps?: number;

  substepConfiguration?: Array<{
    number: number;
    name: string;
    substepIdentifier?: string;
  }>;
}

export interface SubstepMetadata extends Pick<FunnelMetadata, 'instanceIdentifier'> {
  index: number;
  name: string;
}

export interface FieldMetadata {
  label?: string;
}

export interface FunnelContext {
  path: string[];
  funnel?: FunnelMetadata;
  step?: StepMetadata;
  substep?: SubstepMetadata;
  field?: FieldMetadata;
}

export interface FunnelEventDetails {
  error?: {
    message: string;
    source: ErrorSource;
    label?: string;
  };

  interaction?: {
    type: InteractionType;
    target: string;
    metadata?: Record<string, unknown>;
  };

  navigation?: {
    from: string;
    to: string;
    reason: NavigationReason;
  };

  result?: any;
  configuration?: any;
}

export type ErrorContext = 'funnel' | 'funnel-step' | 'funnel-substep' | 'field';
export type ErrorSource = 'form' | 'form-field' | 'alert' | 'flashbar' | 'unknown';
export type InteractionType = 'info' | 'external-link';
export type NavigationReason = string;
