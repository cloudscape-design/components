// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LabelIdentifier } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

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
