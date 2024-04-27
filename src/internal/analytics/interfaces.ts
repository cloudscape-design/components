// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type FunnelType = 'single-page' | 'multi-page';
export interface AnalyticsMetadata {
  instanceIdentifier?: string;
  flowType?: 'create' | 'edit';
  errorContext?: string;
}

// Common properties for all funnels
export interface BaseFunnelProps {
  funnelIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  funnelInteractionId: string;
  currentDocument?: Document;
}

export interface FunnelErrorProps extends BaseFunnelProps {
  funnelErrorContext?: AnalyticsMetadata['errorContext'];
}

export interface FunnelStartProps extends Omit<BaseFunnelProps, 'funnelInteractionId'> {
  flowType?: AnalyticsMetadata['flowType'];
  funnelNameSelector: string;
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  stepConfiguration?: StepConfiguration[];
  funnelType: FunnelType;
  funnelVersion: string;
  componentVersion: string;
  componentTheme: string;
  funnelInteractionId?: string;
}

// A function type for a generic funnel method
export type FunnelMethod<T extends BaseFunnelProps> = (props: T) => void;

// A function type specifically for funnelStart
export type FunnelStartMethod = (props: FunnelStartProps) => string;

// Define individual method props by extending the base
export interface FunnelStepProps extends BaseFunnelProps {
  stepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  stepNumber: number;
  stepName?: string | undefined;
  stepNameSelector?: string;
  subStepAllSelector: string;
  totalSubSteps?: number;
  subStepConfiguration?: SubStepConfiguration[];
}

export interface FunnelStepNavigationProps extends FunnelStepProps {
  destinationStepNumber: number;
  navigationType: string;
  totalSubSteps?: number;
}

export interface FunnelStepErrorProps extends FunnelStepProps {
  stepErrorContext?: AnalyticsMetadata['errorContext'];
  stepErrorSelector: string;
}

export interface FunnelSubStepProps extends FunnelStepProps {
  subStepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  subStepSelector: string;
  subStepName?: string | undefined;
  subStepNameSelector: string;
  subStepNumber?: number;
}

export interface FunnelSubStepErrorProps extends FunnelSubStepProps {
  subStepErrorContext?: AnalyticsMetadata['errorContext'];
  fieldIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  fieldErrorContext?: AnalyticsMetadata['errorContext'];
  fieldLabelSelector: string;
  fieldErrorSelector: string;
}

export interface OptionalFunnelSubStepErrorProps extends FunnelSubStepProps {
  subStepErrorContext?: AnalyticsMetadata['errorContext'];
  fieldIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  fieldErrorContext?: AnalyticsMetadata['errorContext'];
  fieldLabelSelector?: string;
  fieldErrorSelector?: string;
}

export interface FunnelLinkInteractionProps extends FunnelSubStepProps {
  elementSelector: string;
}

export interface FunnelChangeProps extends BaseFunnelProps {
  stepConfiguration: StepConfiguration[];
}

export interface StepConfiguration {
  number: number;
  name: string;
  isOptional: boolean;
  stepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
}

export interface SubStepConfiguration {
  number: number;
  name: string;
  subStepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
}

// Define the interface using the method type
export interface IFunnelMetrics {
  funnelStart: FunnelStartMethod;
  funnelError: FunnelMethod<FunnelErrorProps>;
  funnelComplete: FunnelMethod<BaseFunnelProps>;
  funnelSuccessful: FunnelMethod<BaseFunnelProps>;
  funnelCancelled: FunnelMethod<BaseFunnelProps>;
  funnelChange: FunnelMethod<FunnelChangeProps>;

  funnelStepStart: FunnelMethod<FunnelStepProps>;
  funnelStepComplete: FunnelMethod<FunnelStepProps>;
  funnelStepNavigation: FunnelMethod<FunnelStepNavigationProps>;
  funnelStepError: FunnelMethod<FunnelStepErrorProps>;
  funnelStepChange: FunnelMethod<FunnelStepProps>;

  funnelSubStepStart: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepComplete: FunnelMethod<FunnelSubStepProps>;
  funnelSubStepError: FunnelMethod<OptionalFunnelSubStepErrorProps>;

  helpPanelInteracted: FunnelMethod<FunnelLinkInteractionProps>;
  externalLinkInteracted: FunnelMethod<FunnelLinkInteractionProps>;
}
