// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalBox from '../box/internal';
import InternalExpandableSection from '../expandable-section/internal';
import InternalLink from '../link/internal';
import { getNavigationActionDetail } from './analytics-metadata/utils';
import { WizardProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

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

type StepStatus = 'active' | 'visited' | 'unvisited' | 'next';

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

  const getStepStatus = (index: number): StepStatus => {
    if (activeStepIndex === index) {
      return 'active';
    }
    if (isLoadingNextStep) {
      return 'unvisited';
    }
    if (farthestStepIndex >= index) {
      return 'visited';
    }
    if (allowSkipTo && canSkip(activeStepIndex + 1, index)) {
      return 'next';
    }
    return 'unvisited';
  };

  const canSkip = (fromIndex: number, toIndex: number): boolean => {
    let index = fromIndex;
    while (index < toIndex) {
      if (!steps[index].isOptional) {
        return false;
      }
      index++;
    }
    return true;
  };

  const handleStepClick = (stepIndex: number, status: StepStatus) => {
    if (status === 'visited') {
      onStepClick(stepIndex);
    } else if (status === 'next') {
      onSkipToClick(stepIndex);
    }
  };

  return (
    <InternalExpandableSection
      variant="navigation"
      headerText={collapsedStepsLabel}
      expanded={expanded}
      onChange={({ detail }) => onExpandedChange(detail.expanded)}
    >
      <ul className={styles['expandable-step-list']} role="list">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = status === 'visited' || status === 'next';
          const stepLabel = i18nStrings.stepNumberLabel?.(index + 1) ?? `Step ${index + 1}`;
          const optionalLabel = step.isOptional ? ` - ${i18nStrings.optional}` : '';

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
                <InternalBox variant="small" color="text-body-secondary">
                  {stepLabel}
                  {step.isOptional && <i>{optionalLabel}</i>}
                </InternalBox>
                {status === 'active' ? (
                  <span
                    className={clsx(styles['expandable-step-title'], styles['expandable-step-title-active'])}
                    aria-current="step"
                  >
                    {step.title}
                  </span>
                ) : isClickable ? (
                  <span {...getNavigationActionDetail(index, 'step', true, `.${analyticsSelectors['step-title']}`)}>
                    <InternalLink
                      className={clsx(analyticsSelectors['step-title'])}
                      variant="primary"
                      onFollow={evt => {
                        evt.preventDefault();
                        handleStepClick(index, status);
                      }}
                    >
                      {step.title}
                    </InternalLink>
                  </span>
                ) : (
                  <span
                    className={clsx(styles['expandable-step-title'], styles['expandable-step-title-unvisited'])}
                    aria-disabled="true"
                  >
                    {step.title}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </InternalExpandableSection>
  );
}
