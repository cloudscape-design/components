// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { WizardProps } from '../interfaces';

export interface GeneratedAnalyticsMetadataWizardCancel {
  action: 'cancel';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataWizardSubmit {
  action: 'submit';
  detail: {
    label: string;
  };
}

export interface GeneratedAnalyticsMetadataWizardNavigate {
  action: 'navigate';
  detail: {
    label: string;
    targetStepIndex: string;
    reason: WizardProps.NavigationReason;
  };
}

export interface GeneratedAnalyticsMetadataWizardComponent {
  name: 'awsui.Wizard';
  label: LabelIdentifier;
  properties: {
    stepsCount: string;
    activeStepIndex: string;
    activeStepLabel: string;
    instanceIdentifier?: string;
    flowType?: string;
    resourceType?: string;
  };
}
