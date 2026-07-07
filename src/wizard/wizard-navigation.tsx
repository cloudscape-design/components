// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../box/internal';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import InternalLink from '../link/internal';
import { getNavigationActionDetail } from './analytics-metadata/utils';
import { WizardProps } from './interfaces';
import WizardStepList, { getStepStatus, StepStatus, StepStatusValues } from './wizard-step-list';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

interface NavigationProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  hidden: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

interface NavigationStepProps {
  i18nStrings: WizardProps.I18nStrings;
  index: number;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  status: StepStatus;
  step: WizardProps.Step;
}

export default function Navigation({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  hidden,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: NavigationProps) {
  const isVisualRefresh = useVisualRefresh();

  return (
    <nav
      className={clsx(styles.navigation, hidden && styles.hidden, isVisualRefresh && styles.refresh)}
      aria-label={i18nStrings.navigationAriaLabel}
    >
      {isVisualRefresh ? (
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
      ) : (
        <ul>
          {steps.map((step, index: number) => {
            const status = getStepStatus(
              index,
              activeStepIndex,
              farthestStepIndex,
              isLoadingNextStep,
              allowSkipTo,
              steps
            );
            return (
              <NavigationStepClassic
                i18nStrings={i18nStrings}
                index={index}
                key={index}
                onStepClick={onStepClick}
                onSkipToClick={onSkipToClick}
                status={status}
                step={step}
              />
            );
          })}
        </ul>
      )}
    </nav>
  );
}

function NavigationStepClassic({ i18nStrings, index, onStepClick, onSkipToClick, status, step }: NavigationStepProps) {
  const spanClassName = clsx(
    styles['navigation-link'],
    status === StepStatusValues.Active ? styles['navigation-link-active'] : styles['navigation-link-disabled']
  );
  const optionalDescriptionId = useUniqueId('wizard-step-optional-');

  return (
    <li
      className={styles['navigation-link-item']}
      {...(status === StepStatusValues.Unvisited
        ? {}
        : getNavigationActionDetail(index, 'step', true, `.${analyticsSelectors['step-title']}`))}
    >
      <InternalBox
        variant="small"
        className={styles['navigation-link-label']}
        display="block"
        margin={{ bottom: 'xxs' }}
      >
        {i18nStrings.stepNumberLabel && i18nStrings.stepNumberLabel(index + 1)}
        {step.isOptional && <i id={optionalDescriptionId}>{` - ${i18nStrings.optional}`}</i>}
      </InternalBox>
      <div>
        {status === StepStatusValues.Visited || status === StepStatusValues.Next ? (
          <InternalLink
            className={clsx(styles['navigation-link'], analyticsSelectors['step-title'])}
            onFollow={evt => {
              evt.preventDefault();
              if (status === StepStatusValues.Visited) {
                onStepClick(index);
              } else {
                onSkipToClick(index);
              }
            }}
            variant="primary"
            nativeAttributes={step.isOptional ? { 'aria-describedby': optionalDescriptionId } : undefined}
          >
            {step.title}
          </InternalLink>
        ) : (
          <span
            className={clsx(spanClassName, analyticsSelectors['step-title'])}
            aria-current={status === StepStatusValues.Active ? 'step' : undefined}
            aria-disabled={status === StepStatusValues.Active ? undefined : 'true'}
            aria-describedby={step.isOptional ? optionalDescriptionId : undefined}
          >
            {step.title}
          </span>
        )}
      </div>
    </li>
  );
}
