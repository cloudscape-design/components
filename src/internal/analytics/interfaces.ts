// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type FunnelType = 'single-page' | 'multi-page';

// Common properties for all funnels
export interface BaseFunnelProps {
  funnelInteractionId: string;
}

export interface FunnelProps extends BaseFunnelProps {
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
}

export interface FunnelStartProps {
  funnelNameSelector: string;
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
  funnelVersion: string;
  componentVersion: string;
  theme: string;
}

// A function type for a generic funnel method
export type FunnelMethod<T extends BaseFunnelProps> = (props: T) => void;

// A function type specifically for funnelStart
export type FunnelStartMethod = (props: FunnelStartProps) => string;

// Define individual method props by extending the base
export interface FunnelStepProps extends BaseFunnelProps {
  stepNumber: number;
  stepNameSelector: string;
  subStepAllSelector: string;
}

export interface FunnelStepNavigationProps extends FunnelStepProps {
  destinationStepNumber: number;
  navigationType: string;
}

export interface FunnelSubStepProps extends FunnelStepProps {
  subStepSelector: string;
  subStepNameSelector: string;
}

export interface FunnelSubStepErrorProps extends FunnelSubStepProps {
  fieldLabelSelector: string;
  fieldErrorSelector: string;
}

export interface OptionalFunnelSubStepErrorProps extends FunnelSubStepProps {
  fieldLabelSelector?: string;
  fieldErrorSelector?: string;
}

export interface FunnelLinkInteractionProps extends FunnelSubStepProps {
  elementSelector: string;
}

// Define the interface using the method type
export interface IFunnelMetrics {
  funnelStart: FunnelStartMethod;
  funnelError: FunnelMethod<BaseFunnelProps>;
  funnelComplete: FunnelMethod<BaseFunnelProps>;
  funnelSuccessful: FunnelMethod<BaseFunnelProps>;
  funnelCancelled: FunnelMethod<BaseFunnelProps>;
  funnelStepStart: FunnelMethod<FunnelStepProps>;
  funnelStepComplete: FunnelMethod<FunnelStepProps>;
  funnelStepNavigation: FunnelMethod<FunnelStepNavigationProps>;
  funnelSubStepStart: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepComplete: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepError: FunnelMethod<OptionalFunnelSubStepErrorProps>;
  helpPanelInteracted: FunnelMethod<FunnelLinkInteractionProps>;
  externalLinkInteracted: FunnelMethod<FunnelLinkInteractionProps>;
}
