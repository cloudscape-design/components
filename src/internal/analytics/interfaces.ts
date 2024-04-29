// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO: Replace with correct type from component-toolkit
export interface AnalyticsMetadata {
  instanceIdentifier?: string;
  flowType?: 'create' | 'edit';
  errorContext?: string;
}

export type FunnelType = 'single-page' | 'multi-page';

// Common properties for all funnels
export interface BaseFunnelProps {
  funnelInteractionId: string;
}

export interface FunnelProps extends BaseFunnelProps {
  instanceIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  flowType?: AnalyticsMetadata['flowType'];
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
  funnelNameSelector?: string;
}

export interface FunnelStartProps {
  instanceIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  flowType?: AnalyticsMetadata['flowType'];
  funnelNameSelector: string;
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  stepConfiguration?: StepConfiguration[];
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
  instanceIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  stepNumber: number;
  stepName?: string | undefined;
  stepNameSelector: string;
  subStepAllSelector: string;
}

export interface FunnelStepStartProps extends FunnelStepProps {
  totalSubSteps?: number;
  subStepConfiguration?: SubStepConfiguration[];
}
export interface FunnelStepCompleteProps extends FunnelStepProps {
  totalSubSteps?: number;
}

export interface FunnelStepNavigationProps extends FunnelStepProps {
  destinationStepNumber: number;
  navigationType: string;
  totalSubSteps?: number;
}

export interface FunnelStepErrorProps extends FunnelStepProps {
  stepErrorSelector: string;
  errorContext?: AnalyticsMetadata['errorContext'];
}

export interface FunnelSubStepProps extends FunnelStepProps {
  instanceIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  subStepSelector: string;
  subStepName?: string | undefined;
  subStepNameSelector: string;
  subStepNumber?: number;
}

export interface FunnelSubStepErrorProps extends FunnelSubStepProps {
  fieldLabelSelector: string;
  fieldErrorSelector: string;
  errorContext?: AnalyticsMetadata['errorContext'];
}

export interface OptionalFunnelSubStepErrorProps extends FunnelSubStepProps {
  fieldLabelSelector?: string;
  fieldErrorSelector?: string;
  errorContext?: AnalyticsMetadata['errorContext'];
}

export interface FunnelLinkInteractionProps extends FunnelSubStepProps {
  elementSelector: string;
}

export interface FunnelChangeProps extends BaseFunnelProps {
  stepConfiguration: StepConfiguration[];
}

export interface FunnelStepChangeProps extends BaseFunnelProps {
  instanceIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  stepNumber: number;
  stepName: string;
  stepNameSelector: string;
  subStepAllSelector: string;
  totalSubSteps: number;
  subStepConfiguration: SubStepConfiguration[];
}

export interface StepConfiguration {
  number: number;
  name: string;
  isOptional: boolean;
}

export interface SubStepConfiguration {
  number: number;
  name: string;
}

export interface FunnelErrorProps extends BaseFunnelProps {
  errorContext?: AnalyticsMetadata['errorContext'];
}

// Define the interface using the method type
export interface IFunnelMetrics {
  funnelStart: FunnelStartMethod;
  funnelError: FunnelMethod<FunnelErrorProps>;
  funnelComplete: FunnelMethod<BaseFunnelProps>;
  funnelSuccessful: FunnelMethod<BaseFunnelProps>;
  funnelCancelled: FunnelMethod<BaseFunnelProps>;
  funnelChange: FunnelMethod<FunnelChangeProps>;

  funnelStepStart: FunnelMethod<FunnelStepStartProps>;
  funnelStepComplete: FunnelMethod<FunnelStepCompleteProps>;
  funnelStepNavigation: FunnelMethod<FunnelStepNavigationProps>;
  funnelStepError: FunnelMethod<FunnelStepErrorProps>;
  funnelStepChange: FunnelMethod<FunnelStepChangeProps>;

  funnelSubStepStart: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepComplete: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepError: FunnelMethod<OptionalFunnelSubStepErrorProps>;

  helpPanelInteracted: FunnelMethod<FunnelLinkInteractionProps>;
  externalLinkInteracted: FunnelMethod<FunnelLinkInteractionProps>;
}
