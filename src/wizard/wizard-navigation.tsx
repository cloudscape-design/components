// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import InternalLink from '../link/internal';
import InternalBox from '../box/internal';
import { WizardProps } from './interfaces';
import styles from './styles.css.js';
import { shouldRemoveHighContrastHeader } from '../internal/utils/content-header-utils';

interface NavigationProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  hidden: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isVisualRefresh: boolean;
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
  status: string;
  step: WizardProps.Step;
}

enum Statuses {
  Active = 'active',
  Unvisited = 'unvisited',
  Visited = 'visited',
  Next = 'next',
}

export default function Navigation({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  hidden,
  i18nStrings,
  isVisualRefresh,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: NavigationProps) {
  return (
    <nav
      className={clsx(
        styles.navigation,
        hidden && styles.hidden,
        isVisualRefresh && styles.refresh,
        shouldRemoveHighContrastHeader() && styles['remove-high-contrast-header']
      )}
      aria-label={i18nStrings.navigationAriaLabel}
    >
      <ul
        className={clsx(
          isVisualRefresh && styles.refresh,
          shouldRemoveHighContrastHeader() && styles['remove-high-contrast-header']
        )}
      >
        {steps.map((step, index: number) =>
          isVisualRefresh ? (
            <NavigationStepVisualRefresh
              i18nStrings={i18nStrings}
              index={index}
              key={index}
              onStepClick={onStepClick}
              onSkipToClick={onSkipToClick}
              status={getStatus(index)}
              step={step}
            />
          ) : (
            <NavigationStepClassic
              i18nStrings={i18nStrings}
              index={index}
              key={index}
              onStepClick={onStepClick}
              onSkipToClick={onSkipToClick}
              status={getStatus(index)}
              step={step}
            />
          )
        )}
      </ul>
    </nav>
  );

  function getStatus(index: number) {
    if (activeStepIndex === index) {
      return Statuses.Active;
    }
    if (isLoadingNextStep) {
      return Statuses.Unvisited;
    }
    if (farthestStepIndex >= index) {
      return Statuses.Visited;
    }
    if (allowSkipTo && canSkip(activeStepIndex + 1, index)) {
      return Statuses.Next;
    }
    return Statuses.Unvisited;
  }

  function canSkip(fromIndex: number, toIndex: number) {
    let index = fromIndex;
    do {
      if (!steps[index].isOptional) {
        return false;
      }
      index++;
    } while (index < toIndex);
    return true;
  }
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
    if (status === Statuses.Visited) {
      onStepClick(index);
    }
    if (status === Statuses.Next) {
      onSkipToClick(index);
    }
  }

  const state = {
    active: 'active',
    unvisited: 'disabled',
    visited: 'enabled',
    next: 'enabled',
  }[status];

  const linkClassName = clsx(styles['navigation-link'], {
    [styles['navigation-link-active']]: status === Statuses.Active,
    [styles['navigation-link-disabled']]: status === Statuses.Unvisited,
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
        aria-current={status === Statuses.Active ? 'step' : undefined}
        aria-disabled={status === Statuses.Unvisited ? 'true' : undefined}
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
        tabIndex={status === Statuses.Visited || status === Statuses.Next ? 0 : undefined}
      >
        <div className={clsx(styles.circle)} />

        <span className={clsx(styles.title)}>{step.title}</span>
      </a>
    </li>
  );
}

function NavigationStepClassic({ i18nStrings, index, onStepClick, onSkipToClick, status, step }: NavigationStepProps) {
  const spanClassName = clsx(
    styles['navigation-link'],
    status === Statuses.Active ? styles['navigation-link-active'] : styles['navigation-link-disabled']
  );

  return (
    <li className={styles['navigation-link-item']}>
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
        {status === Statuses.Visited || status === Statuses.Next ? (
          <InternalLink
            className={clsx(styles['navigation-link'])}
            onFollow={evt => {
              evt.preventDefault();
              status === Statuses.Visited ? onStepClick(index) : onSkipToClick(index);
            }}
            variant="primary"
          >
            {step.title}
          </InternalLink>
        ) : (
          <span
            className={spanClassName}
            aria-current={status === Statuses.Active ? 'step' : undefined}
            aria-disabled={status === Statuses.Active ? undefined : 'true'}
          >
            {step.title}
          </span>
        )}
      </div>
    </li>
  );
}
