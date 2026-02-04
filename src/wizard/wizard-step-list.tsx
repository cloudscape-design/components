// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getNavigationActionDetail } from './analytics-metadata/utils';
import { WizardProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export const StepStatusValues = {
  Active: 'active',
  Visited: 'visited',
  Unvisited: 'unvisited',
  Next: 'next',
} as const;

export type StepStatus = (typeof StepStatusValues)[keyof typeof StepStatusValues];

export interface WizardStepListProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

export function getStepStatus(
  index: number,
  activeStepIndex: number,
  farthestStepIndex: number,
  isLoadingNextStep: boolean,
  allowSkipTo: boolean,
  steps: ReadonlyArray<{ isOptional?: boolean }>
): StepStatus {
  if (activeStepIndex === index) {
    return StepStatusValues.Active;
  }
  if (isLoadingNextStep) {
    return StepStatusValues.Unvisited;
  }
  if (farthestStepIndex >= index) {
    return StepStatusValues.Visited;
  }
  if (allowSkipTo && index > activeStepIndex) {
    // Can we skip to this step? (all steps between current and this one are optional)
    if (canSkip(activeStepIndex + 1, index, steps)) {
      return StepStatusValues.Next;
    }
    // Immediate next step is also navigable if it's optional
    if (index === activeStepIndex + 1 && steps[index]?.isOptional) {
      return StepStatusValues.Next;
    }
  }
  return StepStatusValues.Unvisited;
}

export function canSkip(fromIndex: number, toIndex: number, steps: ReadonlyArray<{ isOptional?: boolean }>): boolean {
  // Can't skip if there are no steps to skip over
  if (fromIndex >= toIndex) {
    return false;
  }
  for (let i = fromIndex; i < toIndex; i++) {
    if (!steps[i].isOptional) {
      return false;
    }
  }
  return true;
}

export function handleStepNavigation(
  stepIndex: number,
  status: StepStatus,
  onStepClick: (index: number) => void,
  onSkipToClick: (index: number) => void
): void {
  if (status === StepStatusValues.Visited) {
    onStepClick(stepIndex);
  } else if (status === StepStatusValues.Next) {
    onSkipToClick(stepIndex);
  }
}

export default function WizardStepList({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: WizardStepListProps) {
  return (
    <ul className={styles.refresh}>
      {steps.map((step, index) => (
        <WizardStepListItem
          key={index}
          index={index}
          step={step}
          activeStepIndex={activeStepIndex}
          farthestStepIndex={farthestStepIndex}
          allowSkipTo={allowSkipTo}
          i18nStrings={i18nStrings}
          isLoadingNextStep={isLoadingNextStep}
          onStepClick={onStepClick}
          onSkipToClick={onSkipToClick}
          steps={steps}
        />
      ))}
    </ul>
  );
}

interface WizardStepListItemProps {
  index: number;
  step: WizardProps.Step;
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

function WizardStepListItem({
  index,
  step,
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: WizardStepListItemProps) {
  const status = getStepStatus(index, activeStepIndex, farthestStepIndex, isLoadingNextStep, allowSkipTo, steps);
  const isClickable = status === StepStatusValues.Visited || status === StepStatusValues.Next;
  const stepLabel = i18nStrings.stepNumberLabel?.(index + 1);
  const optionalSuffix = step.isOptional ? ` - ${i18nStrings.optional}` : '';
  const fullStepLabel = `${stepLabel}${optionalSuffix}: ${step.title}`;
  const state = {
    active: 'active',
    unvisited: 'disabled',
    visited: 'enabled',
    next: 'enabled',
  }[status];

  const handleInteraction = () => handleStepNavigation(index, status, onStepClick, onSkipToClick);

  return (
    <li className={clsx(styles[`${state}`], styles['navigation-link-item'])}>
      <hr />

      <span className={clsx(styles.number, styles['navigation-link-label'])}>
        {i18nStrings.stepNumberLabel?.(index + 1)}
        {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
      </span>

      <a
        className={clsx(styles['navigation-link'], {
          [styles['navigation-link-active']]: status === StepStatusValues.Active,
          [styles['navigation-link-disabled']]: status === StepStatusValues.Unvisited,
        })}
        aria-current={status === StepStatusValues.Active ? 'step' : undefined}
        aria-disabled={status === StepStatusValues.Unvisited ? 'true' : undefined}
        onClick={event => {
          event.preventDefault();
          handleInteraction();
        }}
        onKeyDown={event => {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
          }
          // Enter activates the button on key down instead of key up.
          if (event.key === 'Enter') {
            handleInteraction();
          }
        }}
        onKeyUp={event => {
          // Emulate button behavior, which also fires on space.
          if (event.key === ' ') {
            handleInteraction();
          }
        }}
        role="button"
        tabIndex={isClickable ? 0 : undefined}
        aria-label={fullStepLabel}
        {...(status === StepStatusValues.Unvisited
          ? {}
          : getNavigationActionDetail(index, 'step', true, `.${analyticsSelectors['step-title']}`))}
      >
        <div className={styles.circle} />

        <span className={clsx(styles.title, analyticsSelectors['step-title'])}>{step.title}</span>
      </a>
    </li>
  );
}
