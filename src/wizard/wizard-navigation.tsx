// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalBox from '../box/internal';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import InternalLink from '../link/internal';
import { getNavigationActionDetail } from './analytics-metadata/utils';
import { WizardProps } from './interfaces';
import { getStepStatus, StepStatus, StepStatusValues } from './wizard-step-list';

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
      <ul className={clsx(isVisualRefresh && styles.refresh)}>
        {steps.map((step, index: number) => {
          const status = getStepStatus(
            index,
            activeStepIndex,
            farthestStepIndex,
            isLoadingNextStep,
            allowSkipTo,
            steps
          );
          return isVisualRefresh ? (
            <NavigationStepVisualRefresh
              i18nStrings={i18nStrings}
              index={index}
              key={index}
              onStepClick={onStepClick}
              onSkipToClick={onSkipToClick}
              status={status}
              step={step}
            />
          ) : (
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
    </nav>
  );
}

function NavigationStepVisualRefresh({
  i18nStrings,
  index,
  onStepClick,
  onSkipToClick,
  status,
  step,
}: NavigationStepProps) {
  function handleStepInteraction() {
    if (status === StepStatusValues.Visited) {
      onStepClick(index);
    }
    if (status === StepStatusValues.Next) {
      onSkipToClick(index);
    }
  }

  const stateMap: Record<StepStatus, string> = {
    [StepStatusValues.Active]: 'active',
    [StepStatusValues.Unvisited]: 'disabled',
    [StepStatusValues.Visited]: 'enabled',
    [StepStatusValues.Next]: 'enabled',
  };
  const state = stateMap[status];

  const linkClassName = clsx(styles['navigation-link'], {
    [styles['navigation-link-active']]: status === StepStatusValues.Active,
    [styles['navigation-link-disabled']]: status === StepStatusValues.Unvisited,
  });

  return (
    <li className={clsx(styles[`${state}`], styles['navigation-link-item'])}>
      <hr />

      <span className={clsx(styles.number, styles['navigation-link-label'])}>
        {i18nStrings.stepNumberLabel && i18nStrings.stepNumberLabel(index + 1)}
        {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
      </span>

      <a
        className={linkClassName}
        aria-current={status === StepStatusValues.Active ? 'step' : undefined}
        aria-disabled={status === StepStatusValues.Unvisited ? 'true' : undefined}
        onClick={event => {
          event.preventDefault();
          handleStepInteraction();
        }}
        onKeyDown={event => {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
          }
          // Enter activates the button on key down instead of key up.
          if (event.key === 'Enter') {
            handleStepInteraction();
          }
        }}
        onKeyUp={event => {
          // Emulate button behavior, which also fires on space.
          if (event.key === ' ') {
            handleStepInteraction();
          }
        }}
        role="button"
        tabIndex={status === StepStatusValues.Visited || status === StepStatusValues.Next ? 0 : undefined}
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

function NavigationStepClassic({ i18nStrings, index, onStepClick, onSkipToClick, status, step }: NavigationStepProps) {
  const spanClassName = clsx(
    styles['navigation-link'],
    status === StepStatusValues.Active ? styles['navigation-link-active'] : styles['navigation-link-disabled']
  );

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
        {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
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
          >
            {step.title}
          </InternalLink>
        ) : (
          <span
            className={clsx(spanClassName, analyticsSelectors['step-title'])}
            aria-current={status === StepStatusValues.Active ? 'step' : undefined}
            aria-disabled={status === StepStatusValues.Active ? undefined : 'true'}
          >
            {step.title}
          </span>
        )}
      </div>
    </li>
  );
}
