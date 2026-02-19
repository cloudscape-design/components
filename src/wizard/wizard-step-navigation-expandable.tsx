// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalExpandableSection from '../expandable-section/internal';
import { WizardProps } from './interfaces';
import WizardStepList from './wizard-step-list';

import styles from './styles.css.js';

interface WizardStepNavigationExpandableProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export default function WizardStepNavigationExpandable({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
  expanded,
  onExpandChange,
}: WizardStepNavigationExpandableProps) {
  const collapsedStepsLabel = i18nStrings.collapsedStepsLabel?.(activeStepIndex + 1, steps.length);
  const headerAriaLabel = collapsedStepsLabel
    ? `${collapsedStepsLabel} - ${i18nStrings.navigationAriaLabel ?? 'Steps'}`
    : undefined;

  return (
    <InternalExpandableSection
      variant="footer"
      headerText={collapsedStepsLabel}
      headerAriaLabel={headerAriaLabel}
      expanded={expanded}
      onChange={({ detail }) => onExpandChange(detail.expanded)}
    >
      <nav
        className={clsx(styles.navigation, styles.refresh, styles['collapsed-steps-navigation'])}
        aria-label={i18nStrings.navigationAriaLabel}
      >
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
