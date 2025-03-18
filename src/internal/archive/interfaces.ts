// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type FunnelType = 'single-page' | 'multi-page' | 'modal';
export type FlowType = 'create' | 'edit' | 'delete' | 'home' | 'dashboard' | 'view-resource';
export interface AnalyticsMetadata {
  instanceIdentifier?: string;
  flowType?: FlowType;
  errorContext?: string;
  resourceType?: string;
}

// Common properties for all funnels
export interface BaseFunnelProps {
  funnelIdentifier?: string;
  funnelInteractionId: string;
  currentDocument?: Document;
}

export interface FunnelErrorProps extends BaseFunnelProps {
  funnelErrorContext?: string;
}

export interface FunnelStartProps extends Omit<BaseFunnelProps, 'funnelInteractionId'> {
  flowType?: FlowType;
  resourceType?: string;
  funnelName: string;
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

// Interface for table interaction method props
export interface TableInteractionProps {
  // Time to render table in either no data state or with data after user actions like filtering, pagination.
  // in milliseconds
  interactionTime: number;
  // User action like sorting, filtering, pagination which triggered new data load in table.
  userAction: string;
  // Unique instance identifier for the component.
  // Default: ''
  instanceIdentifier?: string;
  // Component identifier like table header which can be used to identify the table
  // Default: ''
  componentIdentifier?: string;
  // Number of resources in table after user action
  // Default: 0
  noOfResourcesInTable?: number;
  // Additional metadata related to user interaction
  interactionMetadata?: string;
}

export type TableInteractionMethod = (props: TableInteractionProps) => void;

// A function type specifically for funnelStart
export type FunnelStartMethod = (props: FunnelStartProps) => string;

// Define individual method props by extending the base
export interface FunnelStepProps extends BaseFunnelProps {
  stepIdentifier?: string;
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
  stepErrorContext?: string;
  stepErrorSelector: string;
}

export interface FunnelSubStepProps extends FunnelStepProps {
  subStepIdentifier?: string;
  subStepSelector: string;
  subStepName?: string | undefined;
  subStepNameSelector: string;
  subStepNumber?: number;
}

export interface FunnelSubStepErrorProps extends FunnelSubStepProps {
  subStepErrorContext?: string;
  fieldIdentifier?: string;
  fieldErrorContext?: string;
  fieldLabelSelector: string;
  fieldErrorSelector: string;
}

export interface OptionalFunnelSubStepErrorProps extends FunnelSubStepProps {
  subStepErrorContext?: string;
  fieldIdentifier?: string;
  fieldErrorContext?: string;
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
  stepIdentifier?: string;
}

export interface SubStepConfiguration {
  number: number;
  name: string;
  subStepIdentifier?: string;
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

// Interface for task completion method props
export interface TaskCompletionDataProps {
  // Time taken to respond to customers after customers submit the form
  // in milliseconds
  timeToRespondAfterFormSubmit: number;
  // Unique identifier for the task aka funnelInteractionId.
  // Default: ''
  taskInteractionId: string;
  // Task name identifier to identify the task aka funnelName
  // Default: ''
  taskIdentifier?: string;
  // To identify create or edit flow
  // Default: ''
  taskFlowType?: string;
  //"single-page" | "multi-page"
  // Default: ''
  taskType?: FunnelType;
  // Additional metadata related to completion such as success or error
  completionMetadata?: string;
}

export type TaskCompletionDataMethod = (props: TaskCompletionDataProps) => void;

export interface IPerformanceMetrics {
  tableInteraction: TableInteractionMethod;
  taskCompletionData: TaskCompletionDataMethod;
  modalPerformanceData: ModalPerformanceDataMethod;
}

type JSONValue = string | number | boolean | null | undefined;
export interface JSONObject {
  [key: string]: JSONObject | JSONValue;
}

export interface ComponentMountedProps {
  componentName: string;
  taskInteractionId?: string;
  componentConfiguration: JSONObject;
}

export interface ComponentUpdatedProps extends ComponentMountedProps {
  taskInteractionId: string;
  actionType: string;
}

export type ComponentMountedMethod = (props: ComponentMountedProps) => string;
export type ComponentUpdatedMethod = (props: ComponentUpdatedProps) => void;
export interface IComponentMetrics {
  componentMounted: ComponentMountedMethod;
  componentUpdated: ComponentUpdatedMethod;
}

// Interface for modal metrics
export interface ModalPerformanceDataProps {
  // Time span from when the modal begins loading to when the primary button or modal has finished loading.
  // in milliseconds
  timeToContentReadyInModal: number;
  // Unique instance identifier for the component.
  // Default: ''
  instanceIdentifier?: string;
  // Component identifier like modal header which can be used to identify the modal
  // Default: ''
  componentIdentifier?: string;
  // Additional metadata related to modal
  modalMetadata?: string;
}

export type ModalPerformanceDataMethod = (props: ModalPerformanceDataProps) => void;
