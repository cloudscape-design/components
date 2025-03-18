// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentConfiguration } from '@cloudscape-design/component-toolkit/internal';
import { PackageSettings } from '@cloudscape-design/component-toolkit/internal/base-component/metrics/interfaces';

export interface AwsUiMetadata {
  name: string;
  version: string;
  props?: ComponentConfiguration['props'];
}

export interface AwsUiNode extends HTMLElement {
  __awsuiMetadata__: AwsUiMetadata;
}

export interface AnalyticsElement extends HTMLElement {
  __analytics__: FunnelConfig | FunnelStepConfig | FunnelSubStepConfig;
}

export interface TrackEventDetail<T = { [key: string]: any }> {
  componentName: string;
  detail?: T;
}

export interface TrackEvent<T> {
  target: HTMLElement;
  eventName: string;
  componentName: string;
  detail: TrackEventDetail<T>['detail'];
}

export interface BufferEvent<T> {
  event: TrackEvent<T>;
  domSnapshot: HTMLElement;
}

export interface FunnelStepConfig {
  name: string;
  number: number;
  isOptional: boolean;
}

export interface FunnelSubStepConfig {
  name: string;
  number?: number;
}

export type FunnelType = 'single-page' | 'multi-page' | 'modal' | undefined;
export type FunnelState = 'initial' | 'started' | 'completed' | 'submitting' | 'error';
export interface FunnelConfig {
  name: string;
  type: FunnelType;
  stepConfiguration: FunnelStepConfig[];
}

export type Handler<T = { [key: string]: any }> = (event: TrackEvent<T>) => void;
export interface Handlers {
  [key: string]: Handler<any>;
}

export type CreateHandlersFactory = (handlers: Handlers) => Handler<any>;

// Funnel Interfaces
// export type FunnelType = 'single-page' | 'multi-page';

// Common properties for all funnels
export interface BaseFunnelProps {
  funnelInteractionId: string;
}

export interface FunnelProps extends BaseFunnelProps {
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
  funnelNameSelector?: string;
}

export interface FunnelStartProps {
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
}

export interface FunnelSubStepProps extends FunnelStepProps {
  subStepSelector: string;
  subStepName?: string | undefined;
  subStepNameSelector: string;
  subStepNumber?: number;
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

export interface FunnelChangeProps extends BaseFunnelProps {
  stepConfiguration: StepConfiguration[];
}

export interface FunnelStepChangeProps extends BaseFunnelProps {
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

// Define the interface using the method type
export interface IFunnelMetrics {
  funnelStart: FunnelStartMethod;
  funnelError: FunnelMethod<BaseFunnelProps>;
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

export interface FormFieldErrorDetail {
  fieldLabel: string;
  fieldError: string;
}

export interface LinkDetail {
  external: boolean;
  variant: string;
}

export interface ModalPropertyChangeDetail {
  visible: boolean;
}

export interface MountDetail {
  packageSettings: PackageSettings;
  configuration: ComponentConfiguration;
}

export interface WizardMountConfig {
  stepConfiguration: FunnelStepConfig[];
  activeStepIndex: number;
}

export interface PropertyChangeDetail {
  name: string;
  value: any;
}
