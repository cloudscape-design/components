// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getNavigationActionDetail } from './analytics-metadata/utils';
import { WizardProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export type StepStatus = 'active' | 'visited' | 'unvisited' | 'next';

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
    return 'active';
  }
  if (isLoadingNextStep) {
    return 'unvisited';
  }
  if (farthestStepIndex >= index) {
    return 'visited';
  }
  if (allowSkipTo && canSkip(activeStepIndex + 1, index, steps)) {
    return 'next';
  }
  return 'unvisited';
}

export function canSkip(fromIndex: number, toIndex: number, steps: ReadonlyArray<{ isOptional?: boolean }>): boolean {
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
  if (status === 'visited') {
    onStepClick(stepIndex);
  } else if (status === 'next') {
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
    <ul className={styles['expandable-step-list']} role="list">
      {steps.map((step, index) => {
        const status = getStepStatus(index, activeStepIndex, farthestStepIndex, isLoadingNextStep, allowSkipTo, steps);
        const isClickable = status === 'visited' || status === 'next';
        const stepLabel = i18nStrings.stepNumberLabel?.(index + 1);
        const optionalSuffix = step.isOptional ? ` - ${i18nStrings.optional}` : '';
        const fullStepLabel = `${stepLabel}${optionalSuffix}: ${step.title}`;

        return (
          <li key={index} className={clsx(styles['expandable-step-item'], styles[`expandable-step-item-${status}`])}>
            <div className={styles['expandable-step-indicator']}>
              <div
                className={clsx(styles['expandable-step-circle'], styles[`expandable-step-circle-${status}`])}
                aria-hidden="true"
              />
              {index < steps.length - 1 && <div className={styles['expandable-step-line']} aria-hidden="true" />}
            </div>
            <div className={styles['expandable-step-content']}>
              <span className={styles['expandable-step-label']}>
                {i18nStrings.stepNumberLabel?.(index + 1)}
                {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
              </span>
              {status === 'active' ? (
                <span
                  className={clsx(styles['expandable-step-title'], styles['expandable-step-title-active'])}
                  aria-current="step"
                >
                  {step.title}
                </span>
              ) : isClickable ? (
                <span {...getNavigationActionDetail(index, 'step', true, `.${analyticsSelectors['step-title']}`)}>
                  <button
                    type="button"
                    className={clsx(
                      analyticsSelectors['step-title'],
                      styles['expandable-step-title'],
                      styles['expandable-step-title-clickable']
                    )}
                    onClick={() => handleStepNavigation(index, status, onStepClick, onSkipToClick)}
                    aria-label={fullStepLabel}
                  >
                    {step.title}
                  </button>
                </span>
              ) : (
                <span className={clsx(styles['expandable-step-title'], styles['expandable-step-title-unvisited'])}>
                  {step.title}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
