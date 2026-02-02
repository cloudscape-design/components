// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalExpandableSection from '../expandable-section/internal';
import { WizardProps } from './interfaces';
import WizardStepList from './wizard-step-list';

interface WizardStepNavigationExpandableProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

export default function WizardStepNavigationExpandable({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  expanded,
  onExpandedChange,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: WizardStepNavigationExpandableProps) {
  const collapsedStepsLabel = i18nStrings.collapsedStepsLabel?.(activeStepIndex + 1, steps.length);

  return (
    <InternalExpandableSection
      variant="footer"
      headerText={collapsedStepsLabel}
      expanded={expanded}
      onChange={({ detail }) => onExpandedChange(detail.expanded)}
    >
      <nav aria-label={i18nStrings.navigationAriaLabel}>
        <WizardStepList
          activeStepIndex={activeStepIndex}
          farthestStepIndex={farthestStepIndex}
          allowSkipTo={allowSkipTo}
          i18nStrings={i18nStrings}
          isLoadingNextStep={isLoadingNextStep}
          onStepClick={onStepClick}
          onSkipToClick={onSkipToClick}
          steps={steps}
        />
      </nav>
    </InternalExpandableSection>
  );
}
